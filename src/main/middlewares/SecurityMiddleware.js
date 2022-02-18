@Middleware
function SecurityMiddleware(){
  
  this.publicRoutes = ["/login", "/health", "/api"]

  this.dispatch = (req, res, next) => {

    if(req.session['user_details']){
      if(req.url.startsWith("/login")){
        return res.redirect("/home");
      }
      next();
    }else{
      let isPublic = false;
      for(let partialRoute of this.publicRoutes){
        if(req.url.startsWith(partialRoute)){
          isPublic = true;
          break;
        }
      }

      if(isPublic===true) return next();
      else return res.redirect("/login");

    }
  }
}

module.exports = SecurityMiddleware;
