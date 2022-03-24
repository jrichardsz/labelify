@Service
function UserRepository() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.createUser = async (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.dbSession('iam_subject').insert(user)
        resolve();
      } catch (e) {
        console.log("Failed to create user");
        reject(e)
      }
    })
  }

}

module.exports = UserRepository;
