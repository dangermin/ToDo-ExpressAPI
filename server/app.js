const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express();

// Middleware
app.use(morgan('dev'));

app.use(bodyParser.json());

// Check file access
fs.access('server/todos.json',fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});
// add your code here
const todos = (require( "./todos.json"));


app.get('/', (req, res) => {
  res.status(200).send({
    status: 'OK'
  })
});
//GET TODOS
app.get('/todos', (req, res) => {
  res.json(todos);
});
//GET single TODO
app.get('/todos/:id', (req, res) => {
  // console.log(todos);
  var todoItemId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {todoItemId: todoItemId});
  // console.log(matchedTodo);
  if (matchedTodo){
    res.json(matchedTodo);
  }
})


module.exports = app;

