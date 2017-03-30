'use strict';

const Promise = require('bluebird');

const iteratePageItems = function iteratePageItems(ctx, opts, page, iteratorFunc) {
  if (opts.iteratePageItemsInSeries) return Promise.mapSeries(page, iteratorFunc.call(this, ctx, opts));
  return Promise.map(page, iteratorFunc.bind(this, ctx, opts));
};

// camel case, because not class
const iteratePages = Promise.coroutine(
  function* iteratePages(ctx, opts, getPage, onPageComplete, iterateItemFunc) {
    let currPageNum = 1;
    let currPageLength = Infinity;
    let lastToken = opts.pagingToken;

    // Run until the last page or until page cap is hit
    while (currPageLength >= opts.pageSize && opts.pageCap >= currPageNum) {
      const page = yield getPage(ctx, opts, lastToken);
      currPageLength = page.length;
      $log.info({ opts }, `${currPageLength} items retrieved`);

      // run item iterator function on each page item
      yield iteratePageItems(ctx, opts, page, iterateItemFunc);
      lastToken = page[page.length - 1]._id.toString();

      // run page completed function
      onPageComplete(ctx, opts, currPageNum, lastToken);
      currPageNum += 1;
    }
  }
);

module.exports = iteratePages;