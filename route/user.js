const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { render } = require('ejs');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares');
const userController = require ('../controllers/user.js');
const { route } = require('./listing.js');


router.route('/signup')
.get( userController.signupUserForm)
.post(wrapAsync(userController.signupUser));



router.route('/login')
.get(userController.loginUserForm)
.post(saveRedirectUrl,passport.authenticate("local",
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
           userController.loginUser);


router.get('/logout', userController.logoutUser)

module.exports = router;


