const fs = require("fs")
const path = require("path")

@Route(name="Home")
function Route1(){

  @Autowire(name="dbSession")
  this.dbSession;

  @Autowire(name="rootPath")
  this.rootPath;

  @Get(path="/")
  this.showRoot = (req, res) => {
    res.redirect('/home');
  }

  @Get(path="/home")
  this.showHome = (req, res) => {
    res.render('home.html');
  }
}

module.exports = Route1;
