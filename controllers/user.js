/**
 * Created by asistent on 18.05.2016.
 */

var UserModel = require('../models/user.js').UserModel,
    localStratagy = require('passport-local');

var passport = function (passport) {
    passport.use(new localStratagy(
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

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        done(null, {username: username});
    });
};

var getLogin = function (req, res) {
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

var checkLogin = function (req, res, next) {
    if ((req.body.username === '') || (req.body.password === '')) {
        return res.render('login', {status: 'error', url: req.url, msg: 'Заполните пожалуйста поля логин и пароль'});
    }
    UserModel.findOne({username: req.body.username}, function (err, user) {
        if (err) {
            return res.render('login', {status: 'error', url: req.url, msg: 'Ошибка подключения к базе данных'});
        }
        if (!user) {
            return res.render('login', {status: 'error', url: req.url, msg: 'Нет такого пользователя в базе данных'});
        }
        user.verifyPassword(req.body.password, function (err, valid) {
            if (!valid) {
                return res.render('login', {status: 'error', url: req.url, msg: 'Введен неверный пароль'});
            }
            return next();
        });
    });
};

var checkRegister = function (req, res, next) {
    if ((req.body.username === '') || (req.body.password === '')) {
        return res.render('login', {status: 'error', url: req.url, msg: 'Заполните пожалуйста поля логин и пароль'});
    }
    var user = new UserModel({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function (err) {
        if (err) {
            return res.render('login', {status: 'error', url: req.url, msg: 'Ошибка подключения к базе данных'});
        }
        return next();
    });

};

module.exports = {
    passport: passport,
    checkLogin: checkLogin,
    checkRegister: checkRegister,
    getLogin: getLogin,
    user: user,
    logout: logout
};