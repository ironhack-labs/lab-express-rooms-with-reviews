const loginCheck = (req, res, next) => {
    console.log("some response")
    //return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
    if (req.session.user ){
        console.log("user logged in");
        next();
    }
    else {
        console.log("user not logged in")
        res.redirect("/");
    }
};

  module.exports = loginCheck;