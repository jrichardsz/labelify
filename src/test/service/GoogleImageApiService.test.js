const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var resolveOrigin = require.resolve
var requireOrigin = require

const GoogleImageApiService = require("../../../src/main/service/GoogleImageApiService.js");

describe('GoogleImageApiService: getImages', function() {
  it('should return exception if url is null or empty', function() {

    var googleImageApiService = new GoogleImageApiService();
    var err;
    try {
      googleImageApiService.bulkImageInsertFromGoogle();
    } catch (e) {
      err = e;
    }
    assert(err, "should return exception if url is undefined");
    var err2;
    try {
      googleImageApiService.bulkImageInsertFromGoogle("");
    } catch (e2) {
      err2 = e2;
    }
    assert(err2, "should return exception if url is empty");
    // expect(undefined).to.equal(databaseCriteria);
  });
});
