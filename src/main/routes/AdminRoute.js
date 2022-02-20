const escape = require('escape-html');
const jwt = require('jsonwebtoken')
const fs = require("fs");
const path = require('path');

@Route(name="AdminRoute")
function AdminRoute(){

  @Autowire(name = "securityDataSource")
  this.securityDataSource;

  @Autowire(name="imageService")
  this.imageService;

  @Autowire(name="rootPath")
  this.rootPath;

  this.allowedPages = []

  @Get(path="/admin")
  this.showHome = async (req, res) => {
    if(typeof req.query.page === 'undefined' || req.query.page == ""){
      return res.render('admin.html', {page : "home"});
    }

    if(req.query.page.length > 25){
      return res.render('admin.html', {page : "not_found"});
    }

    var pageName = escape(req.query.page);
    var pageFile = pageName+".html";

    if(this.allowedPages.includes(pageName)){
      return res.render('admin.html', {page : pageName});
    }

    fs.access(path.join(this.rootPath,"src","main","pages", pageFile), (error) => {
      if (error) {
        console.log(error);
        return res.render('admin.html', {page : "not_found"});
      }
      this.allowedPages.push(pageName)
      res.render('admin.html', {page : pageName});
    });
  }

  @Protected(permission = "image-google:bulk-create")
  @Post(path="/admin/image/bulk/from/google")
  this.imageGoogleBulkCreate = async (req, res) => {

    var googleImageApiUrl = escape(req.body.googleImageApiUrl)
    var tag = escape(req.body.tag)
    var expectedClasses = escape(req.body.expectedClasses)
    var annotationGroupIdentifier = escape(req.body.annotationGroupIdentifier)

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var payload = await jwt.verify(token, process.env.TOKEN_SECRET);

    var validator = await this.securityDataSource.hasPermissions(req.session['user_details'].role, "image-google", "bulk-create");
    if(validator.has_permission === "false"){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var user;
    try{
      user = await this.securityDataSource.findUserByName(payload.subject_id);
    }catch(err){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }
    var userId = user[0].id;

    try {
      var ids = await this.imageService.bulkImageInsertFromGoogle(googleImageApiUrl, tag, expectedClasses, userId, annotationGroupIdentifier);
      return res.json({code:200, message:"success", content:ids});
    } catch (e) {
      return res.json({code:500, message:e.message});
    }
  }
}

module.exports = AdminRoute;
