import express, { Request, Response } from 'express';

interface ITodo { id: number; text: string; completed: boolean; }

const app = express();
app.use(express.json()); 

let todos: ITodo[] = [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Finish project", completed: true },
];

app.get('/todos', (_req: Request, res: Response) => { res.json(todos); });
app.post('/todos', (req: Request<{}, {}, { text: string; }>, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const newTodo: ITodo = { id: todos.length + 1, text, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
app.post('/todos/:todoId', (req: Request<{ todoId: string }, {}, { completed: boolean; }>, res: Response) => {
  const todoId: number = parseInt(req.params.todoId);
  const { completed } = req.body;
  if (completed === undefined) return res.status(400).json({ error: 'Completed status is required' });
  const todoIndex: number = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' });

  todos[todoIndex] = { ...todos[todoIndex], completed };  
  res.json(todos[todoIndex]);
});

app.listen(3000, () => { console.log(`Server running`); });