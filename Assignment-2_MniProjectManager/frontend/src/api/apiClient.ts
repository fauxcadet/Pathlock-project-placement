import axios from "axios";

/**
 * ✅ Base URL logic
 * - In production (Vercel), `/api` will be proxied to Render.
 * - In local development, it falls back to localhost:5056.
 */
const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5056/api"
    : "/api";

// ✅ Create a preconfigured axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  // Prevents accidental caching in some browsers/CDNs
  withCredentials: false,
});

// ==================== AUTH ====================

/** 🔐 User Registration */
export const apiRegister = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Register API error:", err.response || err);
    throw err;
  }
};

/** 🔐 User Login */
export const apiLogin = async (usernameOrEmail: string, password: string) => {
  try {
    const res = await api.post("/auth/login", {
      usernameOrEmail,
      password,
    });
    return res.data; // { token, username, email }
  } catch (err: any) {
    console.error("❌ Login API error:", err.response || err);
    throw err;
  }
};

// ==================== PROJECTS ====================

/** 📦 Get all projects */
export const getProjects = async (token: string) => {
  const res = await api.get("/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/** 📦 Create a new project */
export const createProject = async (
  token: string,
  title: string,
  description: string = ""
) => {
  const res = await api.post(
    "/projects",
    { title, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** 📦 Delete a project */
export const deleteProject = async (token: string, projectId: number) => {
  await api.delete(`/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ==================== TASKS ====================

/** ✅ Get all tasks for a project */
export const getTasks = async (token: string, projectId: number) => {
  const res = await api.get(`/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/** ✅ Add a new task */
export const addTask = async (
  token: string,
  projectId: number,
  title: string,
  dueDate: string | null = null
) => {
  const res = await api.post(
    `/projects/${projectId}/tasks`,
    { title, dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** ✅ Toggle task completion */
export const toggleTask = async (token: string, taskId: number) => {
  const res = await api.put(
    `/tasks/${taskId}/toggle`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** ✅ Delete a task */
export const deleteTask = async (token: string, taskId: number) => {
  await api.delete(`/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/** ✅ Update Project */
export const updateProject = async (
  token: string,
  projectId: number,
  title: string,
  description: string = ""
) => {
  const res = await api.put(
    `/projects/${projectId}`,
    { title, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/** ✅ Update Task */
export const updateTask = async (
  token: string,
  taskId: number,
  title: string,
  dueDate: string | null = null
) => {
  const res = await api.put(
    `/tasks/${taskId}`,
    { title, dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
