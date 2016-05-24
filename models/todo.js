/**
 * Created by asistent on 13.05.2016.
 */

var mongoose = require('../mongooseDB'),
    TodoSchema = mongoose.Schema;

var Todo = new TodoSchema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: Boolean
});

Todo.path('title').validate(function (v) {
    return v.length > 3 && v.length < 30;
});

var TodoModel = mongoose.model('Todo', Todo);

module.exports.TodoModel = TodoModel;