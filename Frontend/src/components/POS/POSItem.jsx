import { useState } from "react";

export default function POSItem({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">{product.productName}</h3>
      <p>₱{product.listPrice.toFixed(2)}</p>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border px-2 py-1 w-20"
      />
      <button
        onClick={() => addToCart(product, quantity)}
        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
      >
        Add
      </button>
    </div>
  );
}
