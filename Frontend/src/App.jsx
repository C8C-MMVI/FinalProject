// App.jsx
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./components/MainLayout";

// ReactJS dependencies
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 route outside MainLayout
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default App;
