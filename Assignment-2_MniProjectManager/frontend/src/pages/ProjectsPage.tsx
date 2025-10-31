import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../api/apiClient";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ProjectsPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadProjects = async () => {
    if (!token) return;
    const data = await getProjects(token);
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = async () => {
    if (!token || !title.trim()) return;
    await createProject(token, title, description);
    setTitle("");
    setDescription("");
    toast.success("Project created!");
    loadProjects();
  };

  const handleDeleteProject = async (id: number) => {
    if (!token) return;
    await deleteProject(token, id);
    toast.success("Project deleted!");
    loadProjects();
  };

  const startEditing = (id: number, currentTitle: string) => {
    setEditingProjectId(id);
    setEditTitle(currentTitle);
  };

  const handleUpdateProject = async (id: number) => {
    if (!token) return;
    await updateProject(token, id, editTitle);
    setEditingProjectId(null);
    toast.success("Project updated!");
    loadProjects();
  };

  const handleViewTasks = (id: number) => navigate(`/projects/${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400 animate-pulse">
          🚀 My Projects
        </h1>

        <div className="mb-8 p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-lg mb-3 font-semibold text-gray-200">
            Add New Project
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            />
            <button
              onClick={handleAddProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Add
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-5 bg-gray-800 rounded-2xl shadow-md border border-gray-700 transition-all duration-300 hover:scale-[1.02]"
            >
              {editingProjectId === project.id ? (
                <div className="flex gap-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                  />
                  <button
                    onClick={() => handleUpdateProject(project.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h3
                    onClick={() => handleViewTasks(project.id)}
                    className="text-xl font-semibold cursor-pointer hover:text-blue-400"
                  >
                    {project.title}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(project.id, project.title)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
