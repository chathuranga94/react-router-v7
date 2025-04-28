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
    const text = formData.get("text") as string;
    if (!text || text.trim() === "") return { error: "Todo text cannot be empty" };

    const newTodo = { text: text, completed: false };
    const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
    });
    if (!response.ok) return { error: "Failed to add todo" };
    return { success: true, message: `Added todo: ${newTodo}` };
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
                <button type="submit">Add</button>
            </Form>
            {actionData?.message?.message && <p>{`created ${actionData.message.message}...`}</p>}
            {todos.map((todo) => (
                <div key={todo.id} className="flex items-center p-4 mb-2 border rounded-lg shadow-sm">
                    <input type="checkbox" className="mr-4 w-5 h-5" checked={todo.completed} onChange={() => { }} />
                    <span className={`"text-gray-800 ${todo.completed ? "line-through" : ""}`}>{todo.text}</span>
                </div>
            ))}
        </div>
    );
};

export default TodosPage
