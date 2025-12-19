import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import POSItem from "./POSItem";
import { TransactionService } from "../../services/TransactionService";

export default function POS() {
  const { user } = useAuth();
  const transactionService = TransactionService(user?.token);

  const [products, setProducts] = useState([]);
  const [stockRecords, setStockRecords] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products and stock records separately
  const fetchProducts = async () => {
    if (!user?.token) return;

    try {
      const [productsRes, stockRes] = await Promise.all([
        fetch("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch("http://localhost:8080/api/stock-records", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      const productsData = await productsRes.json();
      const stockData = await stockRes.json();

      setStockRecords(stockData);

      const productsWithStock = productsData
        .map((product) => {
          const productStocks = stockData.filter(
            (sr) => Number(sr.productId) === Number(product.productId)
          );
          const totalStock = productStocks.reduce(
            (sum, sr) => sum + (sr.quantity || 0),
            0
          );
          return {
            ...product,
            stockQuantity: totalStock,
          };
        })
        .filter((p) => p.stockQuantity > 0);

      setProducts(productsWithStock);
    } catch (err) {
      console.error("Error fetching products/stock:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  // Add product to cart
  const addToCart = (product, quantity) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: Math.min(newQty, i.stockQuantity) } // don't exceed stock
            : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((i) => i.productId !== productId));

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.productId === productId) {
          const clampedQty = Math.max(1, Math.min(newQuantity, i.stockQuantity));
          return { ...i, quantity: clampedQty };
        }
        return i;
      })
    );
  };

  const formatToLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCheckout = async () => {
    if (!user?.id) return alert("User not authenticated");
    if (cart.length === 0) return alert("Cart is empty.");

    try {
      const today = new Date();
      const transactionPayload = {
        userId: user.id,
        transactionDate: formatToLocalDate(today),
        totalAmount: cart.reduce((sum, i) => sum + i.listPrice * i.quantity, 0),
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          basePrice: item.basePrice,
          listPrice: item.listPrice,
        })),
      };

      await transactionService.create(transactionPayload);
      alert("Transaction completed!");
      setCart([]);
      await fetchProducts();
    } catch (err) {
      console.error("Transaction error:", err);
      alert("Error processing transaction.");
    }
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.listPrice * i.quantity, 0);

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-6 text-black font-nunito uppercase">
        Point of Sales
      </h1>

      <div className="flex gap-6" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Products Section */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="text-2xl font-bold mb-4 text-[#4C763B] sticky top-0 bg-gray-50 pb-2 z-10">
            Products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <POSItem key={p.productId} product={p} addToCart={addToCart} />
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-[#4C763B]">Cart</h2>

          {cart.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 py-8">
              <p>Cart is empty</p>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto mb-4" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove from cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>

                        <span className="w-12 text-center font-semibold">{item.quantity}</span>

                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className={`w-8 h-8 rounded transition ${
                            item.quantity >= item.stockQuantity
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">₱{item.listPrice.toFixed(2)} each</p>
                        <p className="font-bold text-[#4C763B]">
                          ₱{(item.listPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-[#4C763B]">₱{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#4C763B] text-white rounded-lg font-semibold hover:bg-[#3d5f2f] transition"
                >
                  Checkout
                </button>

                <button
                  onClick={() => setCart([])}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
