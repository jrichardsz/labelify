const ApiHelper = require("../common/ApiHelper.js");

@Service
function UserService() {

  @Autowire(name = "userRepository")
  this.userRepository;

  this.createUser = async (rawUser) => {
    var safeBody = ApiHelper.encodeObject(rawUser)
    safeBody.role = "player";
    return new Promise(async (resolve, reject) => {
      try {
        await this.userRepository.createUser(safeBody)
        resolve();
      } catch (e) {
        console.log("Failed to create user");
        reject(e)
      }
    })
  }

}

module.exports = UserService;
