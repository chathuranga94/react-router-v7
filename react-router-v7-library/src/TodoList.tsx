import './App.css'
import { useLoaderData, Form, ActionFunctionArgs, useSubmit, useFetcher, LoaderFunctionArgs } from "react-router";

interface ITodo { id: number; text: string; completed: boolean; };

export async function todosLoader({ request }: LoaderFunctionArgs): Promise<ITodo[]> {
    const response = await fetch("http://localhost:3000/todos");
    if (!response.ok) throw new Error("Failed to fetch todos");
    const data = await response.json() as ITodo[];
    return data;
}

interface ActionResponse { success?: boolean; error?: string; };

export async function todosAction({ request }: ActionFunctionArgs): Promise<ActionResponse> {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    if (intent === "create") {
        const text = formData.get("text") as string;
        if (!text || text.trim() === "") return { error: "Todo text cannot be empty" };

        const newTodo = { text: text, completed: false };
        const response = await fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        });
        if (!response.ok) return { error: "Failed to add todo" };
        return { success: true };
    }

    return { error: "Unknown action" };
}

export async function updateTodoAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const completed = formData.get("completed") === "true";
  const id = params.id;
  if (!id) return { error: "Todo ID is required" };
  
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
  });
  
  if (!response.ok) return { error: "Failed to update todo" };
  return { success: true };
}

const TodoToggle = ({ todo }: { todo: ITodo }) => {
  const fetcher = useFetcher();
  return (
      <fetcher.Form method="post" action={`/todos/${todo.id}`} style={{ display: "inline" }}>
          <input type="checkbox" disabled checked={todo.completed} />{` ${todo.text} `}
          <input type="hidden" name="completed" value={todo.completed.toString()} />
          <button type="submit">{fetcher.state === "submitting" ? "..." : todo.completed ? "❌ Undo" : "✅ Complete"}</button>
      </fetcher.Form>
  );

  // const submit = useSubmit();
  // const handleToggle = () => {
  //   const formData = new FormData();
  //   formData.append("completed", todo.completed.toString());
  //   submit(formData, { method: "post", action: `/todos/${todo.id}`, navigate: false });
  // };
  // return (<button onClick={handleToggle}>{todo.completed ? "Undo" : "Complete"}</button>);
};

export const TodosPage = () => {
    const todos = useLoaderData() as ITodo[];

    return (
        <div className="max-w-md mx-auto mt-10">
            <h4 className="text-2xl font-bold mb-4">Todo List</h4>

            <Form method="post" className="mb-6">
                <input type="hidden" name="intent" value="create" />
                <div className="flex">
                    <input type="text" name="text" placeholder="Add new todo" />
                    <button type="submit">Add</button>
                </div>
            </Form>

            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center p-4 mb-2 border rounded-lg shadow-sm">
                <h4 className={`"text-gray-800 ${todo.completed ? "line-through" : ""}`}>
                  <TodoToggle todo={todo} />
                </h4>
              </div>
            ))}
        </div>
    );
};

export default TodosPage