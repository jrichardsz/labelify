const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var resolveOrigin = require.resolve
var requireOrigin = require

const ImageService = require("../../../src/main/service/ImageService.js");

describe('ImageService: bulkImageInsertFromGoogle', function() {
  it('should return exception on missing required values', async function() {
    var imageService = new ImageService();
    var message;
    try {
      await imageService.bulkImageInsertFromGoogle();
    } catch (e) {
      message = e.message;
    }
    expect("REQUIRED_VALUE", "googleImageApiUrl is required").to.equal(message.code);

    message = undefined;
    try {
      await imageService.bulkImageInsertFromGoogle("url");
    } catch (e) {
      message = e.message;
    }
    expect("REQUIRED_VALUE", "tag is required").to.equal(message.code);


    message = undefined;
    try {
      await imageService.bulkImageInsertFromGoogle("url", "tag");
    } catch (e) {
      message = e.message;
    }
    expect("REQUIRED_VALUE", "expectedClasses is required").to.equal(message.code);

    message = undefined;
    try {
      await imageService.bulkImageInsertFromGoogle("url", "tag", "expectedClasses");
    } catch (e) {
      message = e.message;
    }
    expect("REQUIRED_VALUE", "userId is required").to.equal(message.code);

    message = undefined;
    try {
      await imageService.bulkImageInsertFromGoogle("url", "tag", "expectedClasses", 5);
    } catch (e) {
      message = e.message;
    }
    expect("REQUIRED_VALUE", "annotationGroupIdentifier is required").to.equal(message.code);

  });
  it('should return exception on google api unknown error', async function() {

    function googleImageApiService() {
      this.getImages = (googleImageApiUrl) => {
        return new Promise((resolve, reject) => {
          reject("Im a jerk")
        })
      }
    }

    var imageService = new ImageService();
    imageService.googleImageApiService = new googleImageApiService;
    var err;
    try {
      await imageService.bulkImageInsertFromGoogle("foo");
    } catch (e) {
      err = e;
    }
    assert(err, "an exception should have been thrown");

  });
  it('should return exception on google api response error', async function() {

    function googleImageApiService() {
      this.getImages = (googleImageApiUrl) => {
        return new Promise((resolve, reject) => {
          resolve({
            "code": 500,
            "message": "im a jerk"
          })
        })
      }
    }

    var imageService = new ImageService();
    imageService.googleImageApiService = new googleImageApiService;
    var err;
    try {
      await imageService.bulkImageInsertFromGoogle("foo");
    } catch (e) {
      err = e;
    }
    assert(err, "an exception should have been thrown");
  });
  it('should return exception on zero images from google image api', async function() {

    function googleImageApiServiceMock() {
      this.getImages = (googleImageApiUrl) => {
        return new Promise((resolve, reject) => {
          resolve({
            "code": 200,
            "message": "",
            "content": []
          })
        })
      }
    }

    var imageService = new ImageService();
    imageService.googleImageApiService = new googleImageApiServiceMock;
    var err;
    try {
      await imageService.bulkImageInsertFromGoogle("foo");
    } catch (e) {
      err = e;
    }
    assert(err, "an exception should have been thrown");
  });
  it('should return exception on database error', async function() {

    function googleImageApiServiceMock() {
      this.getImages = (googleImageApiUrl) => {
        return new Promise((resolve, reject) => {
          resolve({
            "code": 200,
            "message": "",
            "content": [{
              "name": "00002.jpg",
              "id": "12AI9mlyZb"
            }, {
              "name": "00001.jpg",
              "id": "1SSoREotiltv"
            }, {
              "name": "00067.jpg",
              "id": "1-54dzcT0J"
            }]
          })
        })
      }
    }

    function imageDataSourceMock() {
      this.create = (image) => {
        return new Promise((resolve, reject) => {
          reject("Im a database jerk")
        })
      }
    }

    var imageService = new ImageService();
    imageService.googleImageApiService = new googleImageApiServiceMock;
    imageService.imageDataSource = new imageDataSourceMock;
    var err;
    try {
      await imageService.bulkImageInsertFromGoogle("foo");
    } catch (e) {
      err = e;
    }
    assert(err, "an exception should have been thrown");
  });
  it('should return an array of ids if there was no error', async function() {

    function googleImageApiServiceMock() {
      this.getImages = (googleImageApiUrl) => {
        return new Promise((resolve, reject) => {
          resolve({
            "code": 200,
            "message": "",
            "content": [{
              "name": "00002.jpg",
              "id": "12AI9mlyZb"
            }, {
              "name": "00001.jpg",
              "id": "1SSoREotiltv"
            }, {
              "name": "00067.jpg",
              "id": "1-54dzcT0J"
            }]
          })
        })
      }
    }

    function imageDataSourceMock() {
      var count = 1;
      this.create = (image) => {
        return new Promise((resolve, reject) => {
          let _id = count;
          count++;
          resolve({
            id: _id
          })
        })
      }
    }

    var imageService = new ImageService();
    imageService.googleImageApiService = new googleImageApiServiceMock;
    imageService.imageDataSource = new imageDataSourceMock;
    var ids = await imageService.bulkImageInsertFromGoogle("foo");
    expect(3).to.equal(ids.length);
    expect(1).to.equal(ids[0]);
    expect(2).to.equal(ids[1]);
    expect(3).to.equal(ids[2]);
  });
});
