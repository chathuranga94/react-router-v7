import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import { todosAction, todosLoader, updateTodoAction } from './TodoList.tsx'
const TodosPage = lazy(() => import("./TodoList.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "todos",
    element: (
      <Suspense fallback={<h4>{'Loading...'}</h4>}>
        <TodosPage />
      </Suspense>
    ),
    loader: todosLoader,
    errorElement: <h4>{'Error...'}</h4>,
    action: todosAction,
  },
  {
    path: "/todos/:id",
    action: updateTodoAction,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)