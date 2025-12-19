import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onSidebarToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login"); // Redirect to login after logout
  }

  return (
    <header className="bg-white shadow-sm border-b-8 border-[#4C763B]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Sidebar Toggle */}
        <button onClick={onSidebarToggle}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Center Area — Search
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Right Section */}
        <div className="flex items-center space-x-4 relative">
          {/* Notification Bell */}
          <button className="relative">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14V9a6 6 0 10-12 0v5a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* Dummy Profile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-[#4C763B] font-bold rounded-full w-10 h-10 text-white flex justify-center items-center"
          >
            RN
          </button>

          {/* Dropdown Modal */}
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 font-lexend">
              <div className="bg-white rounded-lg shadow-lg w-60 p-2 ">
                <h3 className="text-lg font-semibold mb-4">Profile Options</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1 bg-[#4C763B] text-white rounded hover:bg-[#B8C4A9] transition-colors"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-1 border rounded hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
