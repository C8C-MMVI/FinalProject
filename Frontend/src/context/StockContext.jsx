import { createContext, useContext, useState } from "react";

// Create context
const StockContext = createContext();

// Provider component
export function StockProvider({ children }) {
  const [stockRecords, setStockRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const value = {
    stockRecords,
    setStockRecords,
    products,
    setProducts,
    suppliers,
    setSuppliers,
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

// Custom hook to use the stock context
export function useStock() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}
