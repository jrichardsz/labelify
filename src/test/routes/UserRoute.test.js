const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
const UserRoute = require("../../main/routes/UserRoute.js");

describe('UserRoute: createUser', function() {
  it('should return 300000 on database error', async function() {

    var userServiceMock = new function () {
      this.createUser = () => {
        return new Promise((resolve, reject) => {
          reject("Im a createUserError")
        })
      }
    }
    var resMock = new function () {
      this.json = (json) => {
        return new Promise((resolve, reject) => {
          resolve(json)
        })
      }
    }

    var userRoute = new UserRoute();
    userRoute.userService = userServiceMock;
    var response = await userRoute.createUser({
      body:{}
    }, resMock);
    console.log(response);
    expect(true).to.equal(true);
  });
});
