const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');

const displaySingup = (req, res) => res.render("auth/singup");
router.get("/singup", displaySingup);

router.post("/singup", async (req, res, next) => {
    const { email, password } = req.body;

    if(!password || !email) {
        const errorMessage = 'Your password or username are not valid';
        res.render("auth/singup", {errorMessage});
        return
    }
    try {
      const foundUser = await User.findOne({ email }); 
        if (foundUser) {
            const errorMessage = 'You are already registered!'
            res.render("auth/singup", { errorMessage });
            return
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        const createdUser = await User.create({
            email,
            password: hashedPassword
        })
        
        res.redirect("/singin");
    } catch(error){
        next(error);
    }
});
router.get("/signin", (req, res) => {
    res.render("auth/signin")
})
router.post("/signin", async (req, res, next)=>{
    const { email, password } = req.body

    if (!email || !password) {
		return res.render("auth/signin", {
			errorMessage: "Please provide an email and a a password",
		})
	}
    try {
		const foundUser = await User.findOne({ email })

		if (!foundUser) {
			return res.render("auth/signin", {
				errorMessage: "Wrong credentials",
			})
		}

		const checkPassword = bcrypt.compareSync(password, foundUser.password)
		if (!checkPassword) {
			res.render("auth/signin", {
				errorMessage: "Wrong credentials",
			})
		}
		const objectUser = foundUser.toObject()
		delete objectUser.password
		req.session.currentUser = objectUser

		return res.redirect("/")
	} catch (e) {
		next(e)
	}
})

module.exports = router;