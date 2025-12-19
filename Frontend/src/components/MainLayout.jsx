import Sidebar from "./Sidebar";
import Header from "./Header";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Pages
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import StockRecords from "../pages/StockRecords";
import POS from "./POS/POS";
import Transactions from "./Transactions/Transactions";
import Suppliers from "../pages/Suppliers";

const MainLayout = ({ sidebarToggle, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if current route is valid
  const validRoutes = [
    "/dashboard",
    "/categories",
    "/products",
    "/stock",
    "/pos",
    "/transactions",
    "/suppliers",
  ];
  const isInvalidRoute = !validRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar isOpen={sidebarToggle} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<StockRecords />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/suppliers" element={<Suppliers />} />
            {/* Catch-all removed; we handle it via overlay */}
          </Routes>

          {/* Full-screen 404 overlay */}
          {isInvalidRoute && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-xl mb-6">Page Not Found</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-[#4C763B] text-white rounded-lg hover:bg-green-700"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
