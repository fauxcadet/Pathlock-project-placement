import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "../api/apiClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiLogin(usernameOrEmail, password);
      localStorage.setItem("token", res.token);
      navigate("/projects");
    } catch {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h1>
        <p className="text-center text-gray-300 mb-6">Login to continue managing your projects</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg font-semibold transition-all"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-300">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
