// import { useLoaderData, useNavigation, useRouteError, useNavigate, Form, useActionData, type ActionFunctionArgs, type LoaderFunction } from "react-router";
import { useLoaderData, useNavigation, useRouteError, type LoaderFunction } from "react-router";

interface ITodo { id: number; text: string; completed: boolean; };

export const loader: LoaderFunction = async () => {
    const response = await fetch("http://localhost:3000/todos");
    if (!response.ok) throw new Error("Failed to fetch todos");
    const data = await response.json() as ITodo[];
    return data;
};

export function ErrorBoundary() {
    const error = useRouteError();
    if (error instanceof Error) return <h4>{'Error...' + error.message}</h4>;
    return <h4>{'Unknown Error...'}</h4>;
};
import { Form, useActionData, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const _action = formData.get("_action");

    if (_action === "add") {
        const text = formData.get("text") as string;
        if (!text || text.trim() === "") return { error: "Todo text cannot be empty" };

        const newTodo = { text: text, completed: false };
        const response = await fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        });
        if (!response.ok) return { error: "Failed to add todo" };
        const createdTodo = await response.json();
        return { success: true, todo: createdTodo };
    }

    if (_action === "update") {
        const id = formData.get("id");
        const completed = formData.get("completed") === "true";
        if (!id) return { error: "Todo ID is required" };
        const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        });
        if (!response.ok) return { error: "Failed to update todo" };
        const updatedTodo = await response.json();
        return { success: true, todo: updatedTodo };
    }

    return { error: "Unknown action" };
};

export const TodosPage = () => {
    const todos = useLoaderData() as ITodo[];

    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    if (isLoading) return <h4>{'Loading...'}</h4>;

    const actionData = useActionData();

    return (
        <div className="max-w-md mx-auto mt-10">
            <h4 className="text-2xl font-bold mb-4">Todo List</h4>
            <Form method="post">
                <input name="text" placeholder="Add a todo" required />
                <button type="submit" name="_action" value="add">Add</button>
            </Form>
            {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
            {actionData?.success && <p style={{ color: "green" }}>{`Success! for todo id = ${actionData.todo.id}`}</p>}
            {todos.map((todo) => (
                <div key={todo.id} className="flex items-center p-4 mb-2 border rounded-lg shadow-sm">
                    <Form method="post" style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={todo.id} />
                        <input type="hidden" name="completed" value={String(todo.completed)} />
                        <input type="hidden" name="_action" value="update" />
                        <input type="checkbox" name="completed"
                            value="true"
                            defaultChecked={todo.completed}
                            onChange={e => { const form = e.target.form; if (form) form.submit(); }}
                        />
                    </Form>
                    <span className={`"text-gray-800 ${todo.completed ? "line-through" : ""}`}>{todo.text}</span>
                </div>
            ))}
        </div>
    );
};

export default TodosPage
