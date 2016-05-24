/**
 * Created by asistent on 14.05.2016.
 */

var TodoModel = require('../models/todo').TodoModel;

var index = function (req, res) {
    var string;
    TodoModel.find({}, function (err, todos) {
        if (err) {
            string = {status: 'error', msg: 'Ошибка получения данных от сервера'};
        } else {
            string = {status: 'success', todo: todos};
        }
        res.render('index', {data: string});
    });
};

// Add task to collection
var add = function (req, res) {
    if ((req.body.title === '') || (req.body.description === '') || (req.body.date === '')) {
        return res.send({status: 'error', msg: 'Ошибка, нельзя добавить пустую задачу, заполните все поля'});
    }

    var todo = new TodoModel({
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        completed: 0
    });

    todo.save(function (err) {
        if (err) {
            return res.send({status: 'error', msg: 'Ошибка добавления задачи в базу данных'});
        } else {
            return res.send({status: 'success', todo: todo});
        }
    });
};

// Change task description
var edit = function (req, res) {
    return TodoModel.findById(req.params.id, function (err, todo) {
        if (err) {
            return res.send({status: 'error', msg: 'Ошибка получения данных по этой задаче'});
        }

        if ((req.body.title === '') || (req.body.description === '') || (req.body.date === '')) {
            return res.send({status: 'error', msg: 'Ошибка, все поля должны быть заполнены'});
        }

        todo.title = req.body.title;
        todo.date = req.body.date;
        todo.description = req.body.description;
        todo.completed = 0;
        return todo.save(function (err) {
            if (err) {
                return res.send({status: 'error', msg: 'Ошибка, не удалось внести изменения в базу данных'});
            }
            res.send({status: 'success', todo: todo});
        });
    });
};

// Mark task as resolved
var completed = function (req, res) {
    return TodoModel.findById(req.params.id, function (err, todo) {
        if (!todo) {
            return res.send({status: 'error', msg: 'Ошибка получения данных по этой задаче'});
        }
        var completed;
        if (todo.completed === true) {
            completed = 0;
        } else {
            completed = 1;
        }

        todo.completed = completed;
        return todo.save(function (err) {
            if (err) {
                return res.send({status: 'error'});
            }
            res.send({status: 'success', todo: todo});
        });
    });
};

// Delete task
var dell = function (req, res) {
    return TodoModel.findById(req.params.id, function (err, todo) {
        if (!todo) {
            return res.send({status: 'error', msg: 'Ошибка получения данных по этой задаче'});
        }
        return TodoModel.remove({_id: req.params.id}, function (err) {
            if (err) {
                return res.send(err);
            }
            res.send({status: 'success'});
        });
    });
};

module.exports = {
    index: index,
    add: add,
    edit: edit,
    completed: completed,
    dell: dell
};