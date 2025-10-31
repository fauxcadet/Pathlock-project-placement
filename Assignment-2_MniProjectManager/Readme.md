## 🧩 Mini Project Manager — Full-Stack Application
This is a full-stack mini project management system built using:
Backend: ASP.NET Core 8 (C#) + Entity Framework + SQLite
Frontend: React + TypeScript + TailwindCSS + Axios
Auth: JWT-based Authentication (Login/Register)

Features: Projects CRUD, Tasks CRUD, completion toggles, and live UI updates

🚀 Tech Stack
Layer	Technology

Frontend	React + TypeScript + TailwindCSS + Axios

Backend	ASP.NET Core 8 Web API

Database	SQLite (via Entity Framework Core)
Auth	JWT (JSON Web Token)

Package Manager	npm (frontend), dotnet CLI (backend)

🧠 Features
✅ User Authentication
Register and Login securely using JWT tokens
✅ Projects Management
Create, edit, delete, and view your projects
Each project belongs to a logged-in user
✅ Tasks Management
Add, edit, delete, and toggle completion of tasks within projects
Task deadlines supported
✅ Responsive & Animated UI
Beautiful Tailwind styling
Smooth transitions and modals for editing

🏗️ Project Structure
MniProjectManager/
│
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   └── TasksController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Project.cs
│   │   └── TaskItem.cs
│   ├── DTOs/
│   ├── Program.cs
│   └── backend.csproj
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── TasksPage.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   ├── tailwind.config.ts
│   ├── package.json
│   └── vite.config.ts
└── README.md





5️⃣ Environment Notes

JWT token is automatically sent in API headers
Database: Local SQLite file (app.db) created automatically in backend folder

🧩 API Endpoints Overview
Method	->    Endpoint	->  Description

POST    ->	/api/auth/register	 ->   Register new user

POST    ->  	/api/auth/login	 ->   Login existing user

GET ->	/api/projects	->Get all user projects

->	/api/projects	->  Create a new project

PUT	   ->     /api/projects/{id}	->  Update a project

DELETE  ->	/api/projects/{id}	    ->  Delete a project
GET	    ->  /api/projects/{projectId}/tasks ->  	Get all tasks for a project
POST    ->  	/api/projects/{projectId}/tasks ->	Create new task
PUT	 -> /api/tasks/{id}	->  Update task
PUT ->  	/api/tasks/{id}/toggle  ->	Toggle task completion
DELETE	    ->  /api/tasks/{id}	    ->  Delete task

💅 UI Highlights
Built with TailwindCSS
Responsive design for desktop & mobile
Smooth modals for adding/editing
Animated buttons and hover transitions
Dark-mode styled background with vibrant colors

🧭 How It Works (Flow Explanation)
User Registration/Login:
You register a new user using the frontend form.
Backend creates a new entry in the SQLite DB and returns a JWT token.
Authentication:
Every request from frontend (to /projects, /tasks, etc.) includes this JWT in the header.
Backend extracts user ID from token (ClaimTypes.NameIdentifier).
Projects CRUD:
Users can create multiple projects.
Each project is tied to the user’s ID.
Projects can be renamed or deleted.
Tasks CRUD:
Each project can have multiple tasks.
You can add, rename, toggle, or delete tasks.
Tasks are linked to their parent project via ProjectId.
Frontend Logic:
React uses axios to call APIs.
The app stores token in localStorage.
Pages are routed using react-router-dom.
Tailwind provides the styling, animations, and layout.

🧑‍💻 Developed By
Sourav 
Mini Project — Home Assignment 2 (Pathlock Pvt. Ltd.)

✅ Demo Flow Summary
Step	Page	Action
1	/register	Create account
2	/login	Login and get token
3	/projects	Add / Edit / Delete projects
4	/projects/:id	Add / Edit / Delete tasks
5	—	Logout (clear token manually for now)

🔚 Notes
To clear data, delete app.db in backend folder
Project uses CORS enabled for frontend to connect safely
Make sure backend is running before frontend
