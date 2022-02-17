const fs = require("fs")
const path = require("path")
const escape = require('escape-html');
const jwt = require('jsonwebtoken')

@Route(name = "Login")

function Login() {

  @Autowire(name = "securityDataSource")
  this.securityDataSource;

  @Autowire(name = "userJobsDataSource")
  this.userJobsDataSource;

  @Autowire(name = "rootPath")
  this.rootPath;

  @Get(path = "/logout")
  this.processLogout = (req, res) => {
    req.session.destroy((err) => {
      return res.redirect("/login");
    });
  }

  @Get(path = "/login")
  this.showLogin = (req, res) => {
    var uiVariables = {};
    for (key in req.session) {
      if (key.startsWith("ui_")) {
        uiVariables[key] = escape(req.session[key])
      }
    }
    res.render('login.html', uiVariables);
  }

  //DEPRECATED
  @Post(path = "/login-action-ini")
  this.processLogin = async (req, res) => {

    if (!req.body.username || !req.body.password || !req.body.uuid) {
      console.log("username, password and uuid are required");
      req.session['ui_login_message'] = "username, password and uuid are required";
      return res.redirect("/login");
    }

    var safeReceivedUsername = escape(req.body.username)
    var safeReceivedPassword = escape(req.body.password)
    var safeReceivedUuid = escape(req.body.uuid)

    var user = await this.securityService.findUserByName(safeReceivedUsername);
    if (user[0].password === safeReceivedPassword) {
      var userJob = await this.userJobsService.findUserJob(user[0].id);

      if (userJob.length == 0) {
        console.log("username and password are required");
        req.session['ui_login_message'] = "You are not associated with any images";
        return res.redirect("/login");
      }

      if (userJob[0].annotation_group_identifier === safeReceivedUuid) {
        req.session['user_details'] = {
          role: user[0].role
        };
        var payload = {
          'subject_id': safeReceivedUsername
        }
        res.header("access_token", generateJwtToken(payload, process.env.TOKEN_SECRET, "3600s"))
        return res.redirect("/home");
      } else {
        console.log("username and password are required");
        req.session['ui_login_message'] = "You are not associated with this images uuid";
        return res.redirect("/login");
      }
    } else {
      console.log("password incorrect for user: " + safeReceivedUsername);
      req.session['ui_login_message'] = "User or password incorrect";
      return res.redirect("/login");
    }
  }

  @Post(path = "/login-action")
  this.processLogin = async (req, res) => {

    if (!req.body.username || !req.body.password || !req.body.uuid) {
      let response = {
        code: 401,
        message: "username, password and uuid are required"
      };
      console.log(response);
      return res.json(response);
    }

    var safeReceivedUsername = escape(req.body.username)
    var safeReceivedPassword = escape(req.body.password)
    var safeReceivedUuid = escape(req.body.uuid)

    var user = await this.securityDataSource.findUserByName(safeReceivedUsername);
    if (user[0].password === safeReceivedPassword) {
      var userJob = await this.userJobsDataSource.findUserJob(user[0].id);

      if (userJob.length == 0) {
        let response = {
          code: 500,
          message: "You are not associated with any images"
        };
        console.log(response);
        return res.json(response);
      }

      if (userJob[0].annotation_group_identifier === safeReceivedUuid) {
        req.session['user_details'] = {
          role: user[0].role
        };
        var payload = {
          'subject_id': safeReceivedUsername
        }
        let response = {
          code: 200,
          message: "success",
          content: {
            access_token: generateJwtToken(payload, process.env.TOKEN_SECRET, "3600s")
          }
        };
        return res.json(response);
      } else {
        let response = {
          code: 500,
          message: "You are not associated with this images uuid"
        };
        console.log(response);
        return res.json(response);
      }
    } else {
      let response = {
        code: 401,
        message: "User or password incorrect"
      };
      console.log(response);
      return res.json(response);
    }
  }


  generateJwtToken = function(payload, secret, tokenLife) {
    if (tokenLife) {
      return jwt.sign(payload, secret, {
        expiresIn: tokenLife
      });
    } else {
      return jwt.sign(subject, secret)
    }
  }
}

module.exports = Login;
