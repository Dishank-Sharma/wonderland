const express = require('express');
const router = express.Router();
const User = require("../models/user.js")
const { userSchema } = require('../schema.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsycn.js');

const userController = require('../controllers/users.js')

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


router.post("/check-existence", async (req, res) => {
    let { username, email } = await req.body;
    let checkUsername = await User.findOne({ username });
    let checkEmail = await User.findOne({ email });
    function checkPassword() {
        let { error } = userSchema.validate(req.body);
        if (error) {
            return error;
        };
    }
    if (checkUsername || checkEmail || checkPassword()) {
        let message = {
            usernameValidate: checkUsername ? "Username already exists" : null,
            emailValidate: checkEmail ? "Email already exists" : null,
            passwordValidate: checkPassword() ? checkPassword().message : null,
        }
        res.json({ exists: true, message });
    } else {
        res.json({ exists: false });
    }
}
);

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);


router.get("/logout", userController.logout);


module.exports = router;