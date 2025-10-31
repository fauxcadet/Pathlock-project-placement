import axios from "axios";

// ✅ Use nullish coalescing (??) — safer than ||
// ✅ VITE_API_BASE_URL will be read from .env file during build
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5056";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TaskItem {
  id: number;
  description: string;
  isCompleted: boolean;
}

export interface TaskCreateDto {
  description: string;
}

export const getTasks = async (): Promise<TaskItem[]> => {
  const res = await api.get<TaskItem[]>("/api/tasks");
  return res.data;
};

export const createTask = async (payload: TaskCreateDto): Promise<TaskItem> => {
  const res = await api.post<TaskItem>("/api/tasks", payload);
  return res.data;
};

export const toggleTask = async (id: number): Promise<TaskItem> => {
  const res = await api.put<TaskItem>(`/api/tasks/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/api/tasks/${id}`);
};
