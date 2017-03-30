'use strict';

const AWS = require('aws-sdk');

const errorCodes = require('../error_codes/internal_user');
const convert = require('../lib/dynamoConversion');

const DynamoDB = new AWS.DynamoDB({ region: 'us-east-1' });

const dropTimesBeforeHour = function dropTimesBeforeHour(accessTimes, now) {
  if (accessTimes.length === 0) return accessTimes;

  now = Number(now);
  accessTimes = accessTimes.sort((a, b) => Number(a) - Number(b));

  // find where times are older than an hour and remove them
  const hour = 1000 * 60 * 60;
  let dropIndex = -1;
  for (let i = accessTimes.length - 1; i >= 0; i--) {
	const accessTime = accessTimes[i];
	const howOld = now - accessTime;
	if (howOld >= hour) {
	  dropIndex = i;
	  break;
	}
  }

  if (dropIndex > -1) accessTimes = accessTimes.splice(dropIndex + 1);
  return accessTimes;
};

const getAccessTimes = function getAccessTimes(dynamoInfo, email, cb) {
  const getItemParams = {
	Key: {
	  email: convert.toS(email)
	},
	TableName: dynamoInfo.tableName
  };

  return DynamoDB.getItem(getItemParams, (err, data) => {
	if (err) return cb(err);

	let accessTimes = [];

	if (data.Item[dynamoInfo.timesAttr]) accessTimes = convert.fromL(data.Item[dynamoInfo.timesAttr], convert.fromN);

	return cb(null, accessTimes);
  });
};


const updateTimes = function updateTimes(dynamoInfo, email, accessTimes, cb) {
  const updateItemParams = {
	Key: {
	  email: convert.toS(email)
	},
	TableName: dynamoInfo.tableName,
	UpdateExpression: `SET ${dynamoInfo.timesAttr} = :${dynamoInfo.timesAttr}`,
	ExpressionAttributeValues: {
	  [`:${dynamoInfo.timesAttr}`]: convert.toL(accessTimes, convert.toN)
	}
  };

  return DynamoDB.updateItem(updateItemParams, cb);
};

// Pascal case because this is a constructor for a class
const RateLimiter = function RateLimiter(tableName, timesAttr, limitPerHour) {
  const dynamoInfo = { tableName, timesAttr };

  // returns a middleware function
  return (req, res, next) => {
	const email = req.get('X-Forwarded-Email');

	// get a sorted array of accessTimes
	return getAccessTimes(dynamoInfo, email, (err, accessTimes) => {
	  if (err) {
		const errorCode = errorCodes.getErrorCode(errorCodes.WHOOPS);
		$log.warn({ email, err, code: errorCode.code }, errorCode.description);
		return res.status(errorCode.statusCode).send({ msg: errorCode.message });
	  }

	  const now = new Date().getTime();

	  // remove times from before an hour ago
	  accessTimes = dropTimesBeforeHour(accessTimes, now);

	  // send rate limit exceeded response if there are more accessTimes listed than the limit
	  if (accessTimes.length >= limitPerHour) {
		const errorCode = errorCodes.getErrorCode(errorCodes.RATE_LIMIT_EXCEEDED);
		$log.error({ email }, errorCode.description);
		return res.status(errorCode.statusCode).send({ msg: errorCode.message });
	  }

	  // otherwise update the accessTimes list and call next
	  accessTimes.push(now);
	  updateTimes(dynamoInfo, email, accessTimes, (updateTimesErr) => {
		if (updateTimesErr) {
		  const errorCode = errorCodes.getErrorCode(errorCodes.RATE_LIMIT_EXCEEDED);
		  $log.warn({ email, err: updateTimesErr, code: errorCode.code }, errorCode.description);
		  return res.status(errorCode.statusCode).send({ msg: errorCode.message });
		}

		return next();
	  });
	});
  };
};

module.exports = RateLimiter;


// USAGE EX
const DynamoRateLimiter = require('./DynanoRateLimiter');
const showUserLimiter = new DynamoRateLimiter('internal-user-rate-limiter', 'show-user', 120);

// route used for showing user pages
app.get('/_/user', cors(common.corsOptions), showUserLimiter, (req, res) => {
	return null;
});