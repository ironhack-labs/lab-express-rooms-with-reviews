const app = require("../app.js");
module.exports = function sessionTrack(req,res,next) {
      if(req.isAuthenticated){
          req.app.locals.userSession = req.session.passport;
      }else{
          req.app.locals.userSession = undefined;
      }
      next();
  };      


