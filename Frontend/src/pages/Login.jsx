import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(username, password);
    if (success) {
      navigate("/dashboard"); // Dashboard 
    } else {
      setError("Invalid username or password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md w-full max-w-4xl flex overflow-hidden rounded-xl">
        {/* Left: Logo */}
        <div className="hidden md:flex w-1/2 h-96 bg-white justify-center items-center rounded-l-xl">
          <img src="/ARK2.png" alt="ARK Agriventory Logo" className="p-5" />
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-8 bg-[#4C763B] font-lexend rounded-r-xl">
          <h2 className="text-3xl font-black mb-4 text-white uppercase text-center">
            Login
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="uppercase text-white">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="uppercase text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
