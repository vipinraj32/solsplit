
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  onPlaceOrder: () => Promise<void>;
  processingTransaction: boolean;
}

const OrderSummary = ({ 
  cartItems, 
  cartTotal, 
  onPlaceOrder, 
  processingTransaction 
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.productName} × {item.stockQuantity}</span>
            <span>${(item.price * item.stockQuantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>${(cartTotal * 0.10).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(cartTotal * 1.10).toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        onClick={onPlaceOrder} 
        className="w-full mt-6 bg-solana hover:bg-solana-dark"
        disabled={processingTransaction}
      >
        {processingTransaction ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
};

export default OrderSummary;
