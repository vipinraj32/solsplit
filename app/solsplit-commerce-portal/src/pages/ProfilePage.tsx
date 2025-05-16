
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";

// Mock order data since we don't have a real API for this yet
const mockOrders = [
  {
    id: "SOL-12345",
    date: "2023-05-15",
    total: 129.99,
    status: "Delivered",
    items: [
      { name: "Product 1", quantity: 1, price: 79.99 },
      { name: "Product 2", quantity: 1, price: 50.00 }
    ]
  },
  {
    id: "SOL-12346",
    date: "2023-05-10",
    total: 89.99,
    status: "Processing",
    items: [
      { name: "Product 3", quantity: 1, price: 89.99 }
    ]
  }
];

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              
              <Button
                variant="outline"
                className="mt-4 md:mt-0"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6">My Orders</h2>
          
          {mockOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div 
                  key={order.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      <span 
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
