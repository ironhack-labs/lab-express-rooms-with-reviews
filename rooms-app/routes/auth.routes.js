const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require('bcrypt')
const saltRounds = 10;

//Get Request for Signin Page
router.get('/signin', (req, res, next) => {
    res.render('auth/signin')
});

//Get Request for Signup Page
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
});

//Post Request for Signup Page
router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);

    const { fullName, email, password } = req.body;

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                fullName,
                email,
                password: hashedPassword
            });
        })
        .then(user => {
            res.redirect('/signin')
        })
        .catch(error => next(error));
});


// POST login route ==> to process form data
router.post('/signin', (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/signin', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ email }) // <== check if there's user with the provided email
        .then(user => {
            
            if (!user) {
                res.render('auth/signin', {
                    errorMessage: 'Email is not registered. Try with other email.'
                });
                return;
            }

            // if there's a user, compare provided password
            else if (bcrypt.compareSync(password, user.password)) {
                // console.log(user)
                console.log('SESSION =====> ', req.session);
                req.session.currentUser = user;
                res.redirect('/userProfile')
            } else {
                res.render('auth/signin', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
});

router.get('/userProfile', (req, res, next) => {
    console.log(req.session.currentUser)
    // res.render('users/user-profile', { userInSession: req.session.currentUser })
})



module.exports = router;
