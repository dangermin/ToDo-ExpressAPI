const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express();
var path = require('path');

// viewed at http://localhost:8484
app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});

// Middleware
// app.use(morgan('dev'));

app.use(bodyParser.json());

// Check file access
fs.access('./todos.json',fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});
// add your code here
const todos = fs.readFileSync("./todos.json");

let todoItems = JSON.parse(todos.toString());


app.get('/', (req, res) => {
  res.status(200).send({
    status: 'OK'
  })
});
//GET TODOS
app.get('/api/todoItems', (req, res) => {
  res.json(todoItems);
});
//GET single TODO
app.get('/api/todoItems/:number', (req, res) => {
  // console.log(todos);
  var todoItemId = parseInt(req.params.number);
  var matchedTodo = _.findWhere(todoItems, {todoItemId: todoItemId});
  // console.log(matchedTodo);
  if (matchedTodo){
    res.json(matchedTodo);
  }
});
// Post TODO
app.post('/api/todoItems', (req, res) =>  {
  let newId = todoItems[todoItems.length - 1].todoItemId;
  newId +=1;

  let todo = req.body

  var newTodo = {
    todoItemId: newId,
    name: todo.name,
    priority: todo.priority,
    completed: todo.completed
  }

  todoItems.push(newTodo);

  fs.writeFileSync("./todos.json", JSON.stringify(todoItems, null, 2))

  res.json(todoItems);
})
//Delete TODO
app.delete('/api/todoItems/:id', function (req, res) {
var deleteIndex = todoItems.findIndex(function(todo){
  return todo.todoItemId === parseInt(req.params.id)
})
if(deleteIndex >= 0){
  var deleted = todoItems.splice(deleteIndex, 1)
  fs.writeFileSync("./todos.json", JSON.stringify(todoItems, null, 2))
  return res.json(deleted);
}
res.status(400).send("error: No Id matches param")
})



module.exports = app;

