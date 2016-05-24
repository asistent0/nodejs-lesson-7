/**
 * Created by asistent on 13.05.2016.
 */

var bodyParser = require('body-parser'),
    path = require('path'),
    template = require('consolidate').jade,
    express = require('express'),
    config = require('./config/config'),
    todoController = require('./controllers/todo'),
    userController = require('./controllers/user'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    passport = require('passport');

var app = express();

app.set('views', path.join(__dirname, '/views'));
app.engine('jade', template);
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '/views/vendor')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(session({keys: ['123456']}));
app.use(passport.initialize());
app.use(passport.session());

userController.passport(passport);

app.get('/login', userController.login);
app.post('/user/login', userController.errorLogin, passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login'
}));
app.get('/user', mustBeAuthenticated, userController.user);
app.get('/user/logout', userController.logout);
app.post('/user/register', userController.register);

app.get('/', mustBeAuthenticated, todoController.index);
app.post('/todo/add', todoController.add);
app.put('/todo/edit/:id', todoController.edit);
app.patch('/todo/completed/:id', todoController.completed);
app.delete('/todo/dell/:id', todoController.dell);

function mustBeAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // go to login page
}

app.listen(config.get('port'), function () {
    console.log('Server is launched on: http://localhost:' + config.get('port'))
});