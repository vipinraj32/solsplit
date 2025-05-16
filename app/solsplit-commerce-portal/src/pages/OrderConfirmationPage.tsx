
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Layout from "@/components/Layout";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-8">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">SOL-{Math.floor(Math.random() * 100000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Solana</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
            </div>
          </div>
        </div>
        
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>
          <Button
            className="bg-solana hover:bg-solana-dark"
            onClick={() => navigate("/profile")}
          >
            View My Orders
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
