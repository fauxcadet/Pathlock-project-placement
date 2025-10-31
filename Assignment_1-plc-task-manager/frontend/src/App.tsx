import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  type TaskItem,
} from "./api/tasksApi";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch {
        setError("⚠️ Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (desc: string) => {
    if (!desc.trim()) return;
    const newTask = await createTask({ description: desc });
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggle = async (id: number) => {
    const updated = await toggleTask(id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.isCompleted));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <div className="card glass-card">
        <div className="top-bar">
          <h1 className="title">📝 Smart Task Manager</h1>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : (
          <>
            <TaskForm onAdd={handleAdd} />

            <div className="task-controls">
              <div className="filters">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "active" ? "active" : ""}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={filter === "completed" ? "active" : ""}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
              <div className="counter">
                ✅ {completedCount}/{tasks.length} done
              </div>
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />

            {completedCount > 0 && (
              <button className="clear-btn" onClick={handleClearCompleted}>
                🧹 Clear Completed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
