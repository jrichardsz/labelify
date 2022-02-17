@Middleware
function SecurityMiddleware(){

  this.dispatch = (req, res, next) => {

    if(req.session['user_details']){
      if(req.url.startsWith("/login")){
        return res.redirect("/home");
      }
      next();
    }else{
      if(req.url.startsWith("/login")){
        return next();
      }

      if(req.url.startsWith("/api")){
        return next();
      }

      res.redirect("/login");
    }
  }
}

module.exports = SecurityMiddleware;
