/**
 * Created by asistent on 18.05.2016.
 */

var UserModel = require('../models/user.js').UserModel,
    localStratagy = require('passport-local');

var passport = function (passport) {
    passport.use('/user/login', new localStratagy(
        function (username, password, done) {
            UserModel.findOne({username: username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {msg: 'Invalid username'});
                }
                user.verifyPassword(password, function (err, valid) {
                    if (!valid) {
                        return done(null, false, {msg: 'Invalid Password'});
                    }
                    return done(null, user);
                });
            });
        }
    ));

    passport.use('/user/register', new localStratagy(
        function (username, password, done) {
            var user = new UserModel({
                username: username,
                password: password
            });

            user.save(function (err) {
                if (err) {
                    return done(err);
                } else {
                    return done(null, user);
                }
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        done(null, {username: username});
    });
};

var login = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login');
};

var user = function (req, res) {
    res.render('user', {'username': req.user.username});
};

var logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

var errorLogin = function (req, res, next) {
    console.log(req.url);
    if ((req.body.username === '') || (req.body.password === '')) {
        return res.render('login', {status: 'error', url: req.url , msg: 'Заполните пожалуйста поля логин и пароль'});
    } else {
        return next();
    }
};

module.exports = {
    passport: passport,
    errorLogin: errorLogin,
    login: login,
    user: user,
    logout: logout
};