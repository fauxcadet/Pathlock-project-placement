import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1
        onClick={() => navigate("/projects")}
        className="text-xl font-semibold text-indigo-600 cursor-pointer"
      >
        Mini Project Manager
      </h1>

      <div className="space-x-2">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
