import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TransactionDetailsService } from "../../services/TransactionDetailsService";

export default function TransactionDetails({ transactionId }) {
  const { user } = useAuth();
  const detailsService = TransactionDetailsService(user?.token);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await detailsService.getByTransactionId(transactionId);
        setDetails(data);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && transactionId) fetchDetails();
  }, [user, transactionId]);

  const total = details.reduce(
    (sum, item) => sum + item.listPrice * item.quantity,
    0
  );

  if (loading) return <p>Loading transaction details...</p>;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Transaction Items</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Product</th>
            <th className="border-b p-2">Qty</th>
            <th className="border-b p-2">Price</th>
            <th className="border-b p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item) => (
            <tr key={item.transactionDetailsId}>
              <td className="p-2">{item.productName}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">${item.listPrice.toFixed(2)}</td>
              <td className="p-2">
                ${(item.listPrice * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="font-semibold p-2 text-right">
              Total
            </td>
            <td className="font-semibold p-2">${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
