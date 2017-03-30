const RedisRateLimiter = require('./RedisRateLimiter');
const DynamoRateLimiter = require('./DynamoRateLimiter');

const Dynamo = DynamoRateLimiter;
const Redis = RedisRateLimiter;
const RateLimter = { Dynamo, Redis };

module.exports = RateLimiter;

// USAGE EX
const DynamoRateLimiter = require('./RateLimiter').Dynamo; // or require('rate-limiter') if this was npm package
const showUserLimiter = new DynamoRateLimiter('internal-user-rate-limiter', 'show-user', 120);

// route used for showing user pages
app.get('/_/user', cors(common.corsOptions), showUserLimiter, (req, res) => {
	return null;
}); 