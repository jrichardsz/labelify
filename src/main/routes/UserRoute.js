@Route
function UserRoute() {

  @Autowire(name = "userService")
  this.userService;

  @Post(path = "/user")
  this.createUser = async (req, res) => {
    try {
      await this.userService.createUser(req.body);
      return res.json({
        code: 200,
        message: "success"        
      })
    } catch (e) {
      console.log(e);
      return res.json({
        code: 300000,
        message: e.message
      })
    }
  }

}

module.exports = UserRoute;
