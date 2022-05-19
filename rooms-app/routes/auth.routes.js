const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');

router.get("/logout", (req, res) => {
	req.session.destroy((error) => {
		if (error) {
            const errorMessage = error.message;
            res.render("auth/logout", {errorMessage});
            return
		}
		res.redirect("/");
	})
});

const displaySignup = (req, res) => res.render("auth/signup");
router.get("/signup", displaySignup);

router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;

    if(!password || !email) {
        const errorMessage = 'Your password or username are not valid';
        res.render("auth/signup", {errorMessage});
        return
    }
    try {
      const foundUser = await User.findOne({ email }); 
        if (foundUser) {
            const errorMessage = 'You are already registered!'
            res.render("auth/signup", { errorMessage });
            return
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        const createdUser = await User.create({
            email,
            password: hashedPassword
        })
        
        res.redirect("/signin");
    } catch(error){
        next(error);
    }
});

module.exports = router;