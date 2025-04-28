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
}

export const TodosPage = () => {
    const todos = useLoaderData() as ITodo[];

    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    if (isLoading) return <h4>{'Loading...'}</h4>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h4 className="text-2xl font-bold mb-4">Todo List</h4>
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
