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

module.exports = router;