const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use((_req, _res, next) => { setTimeout(next, 500); });

const todos = [];

app.get('/todos', (_req, res) => { res.json(todos); });

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send();

  const newTodo = { id: todos.length + 1, text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.post('/todos/:todoId', (req, res) => {
  const { todoId } = req.params;
  const { completed } = req.body;
  if (completed === undefined) return res.status(404).send();

  const todoIndex = todos.findIndex(todo => todo.id === parseInt(todoId));
  if (todoIndex === -1) return res.status(404).send();

  todos[todoIndex] = { ...todos[todoIndex], completed };
  res.json(todos[todoIndex]);
});

app.listen(3000, () => { console.log('Server running'); });

/*
curl -X GET http://localhost:3000/todos
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"text": "Watch a book"}'
curl -X POST http://localhost:3000/todos/1 -H "Content-Type: application/json" -d '{"completed": true}'
*/