const User = require("../models/user");



module.exports.signupUserForm = (req, res) => {
    res.render('users/singup.ejs')
};

module.exports.signupUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeruser = await User.register(newUser, password);
        // res.send(registeruser); 
        console.log(registeruser);
        req.login(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to wanderLust');
            res.redirect('/listings');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');

    }

};


module.exports.loginUserForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.loginUser =  async (req, res) => {
    req.flash("success", 'welcomeBack to waderlust');
    let Url = res.locals.redirectUrl || "/listings";
    res.redirect(Url);
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "You are loggedOut");
        res.redirect('/listings');
    })

};