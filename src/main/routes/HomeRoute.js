const fs = require("fs")
const path = require("path")

@Route(name="Home")
function HomeRoute(){

  @Autowire(name="dbSession")
  this.dbSession;

  @Autowire(name="rootPath")
  this.rootPath;

  @Get(path="/annotate")
  this.showHome = (req, res) => {
    res.render('annotate.html');
  }
}

module.exports = HomeRoute;
