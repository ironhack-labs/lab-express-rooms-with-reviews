const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next){
  if(req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
  else res.redirect("/auth/login")
}

function isAdmin(req, res, next){
  if(req.session.currentUser && req.session.currentUser.username.includes("ironhack")) // Any criteria to determin role is as good as any
  {
    req.session.currentUser.isAdmin = true;
    req.session.currentUser.isInternal = true;
  }else if(req.session.currentUser){
    req.session.currentUser.isAdmin = false;
    req.session.currentUser.isInternal = false;
  }else{
    res.redirect("/auth/login")
  }
  
  next() // next invocation tells Express that the middleware has done all it work
}

router.get("/profile", isAdmin, (req, res)=>{
  if(req.session.currentUser.isAdmin) res.render("profile", {user: req.session.currentUser})
  else res.redirect("/private")
})

router.get("/", isLoggedIn,  (req, res)=>{
  res.render("private")
})

module.exports = router;
