import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

type Todo = {
  id: string;
  task: string;
  status: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const base_url = "http://kubernetes.anythingforall.com/backend";

  useEffect(() => {
    async function fetchTodos() {
      const res = await axios.get(`${base_url}/todos`);
      setTodos(res.data.todos);
    }
    fetchTodos();
    return () => {};
  }, []);

  const addTodo = async () => {
    if (!task.trim()) return;
    const res = await axios.post(`${base_url}/todo`, { task });
    const newTodo: Todo = res.data.todo;

    setTodos([newTodo, ...todos]);
    setTask("");
  };

  const deleteTodo = async (id: string) => {
    const res = await axios.delete(`${base_url}/todos/${id}`);
    if (res.data.message) {
      console.log(res.data.message);
      setTodos(todos.filter((t) => t.id !== id));
    } else {
      alert("couldnt delete the todo");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.task);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    const todo = todos.find((t) => t.id == editingId);
    await axios.put(`${base_url}/todos/${editingId}`, {
      task: editText,
      status: todo?.status,
    });

    setTodos(
      todos.map((t) => (t.id === editingId ? { ...t, task: editText } : t))
    );

    setEditingId(null);
    setEditText("");
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    await axios.put(`${base_url}/todos/${id}`, {
      task: todo?.task,
      status: !todo?.status,
    });
    setTodos(todos.map((t) => (t.id === id ? { ...t, status: !t.status } : t)));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo App</h1>

      {/* Add Todo */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task..."
          style={{ padding: 8, width: 250, marginRight: 10 }}
        />
        <button onClick={addTodo} style={{ padding: "8px 20px" }}>
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              background: "#222",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* If editing */}
            {editingId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ padding: 6, width: 200 }}
                />
                <button onClick={saveEdit} style={{ marginLeft: 10 }}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.status ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleComplete(todo.id)}
                >
                  {todo.task}
                </span>

                <div>
                  <button
                    onClick={() => startEditing(todo)}
                    style={{ marginRight: 10 }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
