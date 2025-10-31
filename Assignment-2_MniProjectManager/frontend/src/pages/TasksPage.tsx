import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTasks,
  addTask,
  deleteTask,
  toggleTask,
  updateTask,
} from "../api/apiClient";
import toast, { Toaster } from "react-hot-toast";

export default function TasksPage() {
  const token = localStorage.getItem("token");
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load tasks from backend
  const loadTasks = async () => {
    if (!token || !projectId) return;
    try {
      const data = await getTasks(token, Number(projectId));
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // ✅ Add new task
  const handleAddTask = async () => {
    if (!token || !title.trim() || !projectId) return;
    try {
      await addTask(token, Number(projectId), title, dueDate || null);
      toast.success("Task added!");
      setTitle("");
      setDueDate("");
      loadTasks();
    } catch (err) {
      console.error("Error adding task", err);
      toast.error("Failed to add task.");
    }
  };

  // ✅ Delete task
  const handleDeleteTask = async (id: number) => {
    if (!token) return;
    try {
      await deleteTask(token, id);
      toast.success("Task deleted!");
      loadTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  // ✅ Toggle task completion
  const handleToggleTask = async (id: number) => {
    if (!token) return;
    try {
      await toggleTask(token, id);
      loadTasks();
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  // ✅ Edit and update task
  const startEditingTask = (id: number, currentTitle: string) => {
    setEditingTaskId(id);
    setEditTaskTitle(currentTitle);
  };

  const handleUpdateTask = async (id: number) => {
    if (!token) return;
    try {
      await updateTask(token, id, editTaskTitle);
      setEditingTaskId(null);
      toast.success("Task updated!");
      loadTasks();
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  // ✅ Smart Sort — sorts tasks locally by due date
  const handleAutoSchedule = async () => {
    try {
      setLoading(true);
      const sorted = [...tasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setTasks(sorted);
      toast.success("✅ Tasks sorted by due date!");
    } catch (err) {
      console.error("Error sorting tasks:", err);
      toast.error("❌ Failed to sort tasks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400 animate-pulse">
            📋 Tasks
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/projects")}
              className="text-sm bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              ← Back to Projects
            </button>

            <button
              onClick={handleAutoSchedule}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? "Sorting..." : "Smart Sort 🧠"}
            </button>
          </div>
        </div>

        {/* Add Task */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleAddTask}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center">No tasks yet. Add one!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl shadow-md border border-gray-700 bg-gray-800 flex justify-between items-center transition-all duration-300 hover:scale-[1.02] ${
                  task.isCompleted ? "opacity-70" : ""
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      value={editTaskTitle}
                      onChange={(e) => setEditTaskTitle(e.target.value)}
                      className="flex-1 p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                    />
                    <button
                      onClick={() => handleUpdateTask(task.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => handleToggleTask(task.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <span
                        className={`text-lg ${
                          task.isCompleted
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <p className="text-sm text-gray-400 mt-1">
                          📅 Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditingTask(task.id, task.title)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
