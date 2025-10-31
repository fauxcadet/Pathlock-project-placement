# 📝 PLC Task Manager (Assignment 1)

A full-stack Task Manager web application built as part of the **PLC Home Coding Assignment – October 2025**.  
This project demonstrates the use of **.NET 8 Minimal APIs** for the backend and **React + TypeScript (Vite)** for the frontend.

---

## 🚀 Project Overview

The **Task Manager** allows users to:
- ➕ Add new tasks  
- ✅ Mark tasks as completed / toggle status  
- ❌ Delete tasks  
- 🌗 Switch between Dark / Light themes  
- 🧹 Clear completed tasks  
- 🔍 Filter between All, Active, and Completed  

---

## 🧩 Architecture Overview

| Layer | Technology | Description |
|--------|-------------|-------------|
| **Frontend** | React + TypeScript (Vite) | Interactive UI built using hooks, axios, and modern CSS |
| **Backend** | ASP.NET Core 8 (Minimal API) | Provides REST endpoints for CRUD operations |
| **Styling** | CSS3 | Glassmorphism + responsive design |
| **Data Storage** | In-memory (List\<TaskItem\>) | Lightweight, no database dependency |

---

## ⚙️ Tech Stack

- **Frontend:** React 18, TypeScript, Axios, Vite  
- **Backend:** .NET 8 Minimal APIs  
- **Language:** C#  
- **Environment:** Node.js + npm, .NET SDK 8.0.400  
- **Ports:**
  - Backend → `http://localhost:5056`
  - Frontend → `http://localhost:5173`

---

## 🧠 Features Implemented

### ✅ Backend (C# .NET 8)
- RESTful API using Minimal API pattern
- Endpoints:
  - `GET /api/tasks` → Fetch all tasks  
  - `POST /api/tasks` → Add new task  
  - `PUT /api/tasks/{id}/toggle` → Toggle task completion  
  - `DELETE /api/tasks/{id}` → Delete task
- CORS enabled for frontend on port 5173
- In-memory list (no database required)

### ⚛️ Frontend (React + TypeScript)
- Integrated with backend using **Axios**
- Displays all tasks dynamically
- Allows add/delete/toggle
- Filters: All | Active | Completed
- Task counter and clear completed button
- Dark/Light theme toggle
- Styled using **modern glassmorphism CSS**

---

## 🧪 How to Run Locally

### 1️⃣ Clone and open the project
```bash
git clone <your-repo-link>
cd plc-task-manager


2️⃣ Run the backend
cd backend
dotnet run

##Backend will start on:
👉 http://localhost:5056

3️⃣ Run the frontend
cd ../frontend
npm install
npm run dev
Frontend will start on:
👉 http://localhost:5173


Folder Structure

plc-task-manager/
├── backend/
│   ├── Program.cs
│   └── backend.csproj
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasksApi.ts
│   │   ├── components/
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
└── README.md
