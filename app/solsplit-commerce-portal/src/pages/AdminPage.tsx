
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAdminProducts, fetchTranscations } from "@/services/api";
import { Product } from "@/types";
import { transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import AdminProductList from "@/components/admin/AdminProductList";
import AdminAddProduct from "@/components/admin/AdminAddProduct";
import AdminUpdateProduct from "@/components/admin/AdminUpdateProduct";
import AdminRemoveProduct from "@/components/admin/AdminRemoveProduct";
import AdminTranscations from "@/components/admin/AdminTranscations";

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transcations, setTranscations] = useState<transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/login");
    }
    
    const loadProducts = async () => {
      try {
        const data = await fetchAdminProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading admin products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

      const loadTranscations = async () => {
      try {
        const data = await fetchTranscations();
        setTranscations(data);
      } catch (error) {
        console.error("Error loading admin products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
const refreshTranscations = async () => {
    setLoading(true);
    try {
      const data = await fetchTranscations();
      setTranscations(data);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setLoading(false);
    }
  };
  

    if (isAuthenticated && isAdmin) {
      loadProducts();
      loadTranscations();
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);
  
  // Function to refresh products after changes
  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Product List</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            <TabsTrigger value="update">Update Product</TabsTrigger>
            <TabsTrigger value="remove">Remove Product</TabsTrigger>
             <TabsTrigger value="transcations">Transcation</TabsTrigger>
             <TabsTrigger value="remove">Order</TabsTrigger>
               <TabsTrigger value="remove">Order Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <AdminProductList products={products} loading={loading} />
          </TabsContent>
          
          <TabsContent value="add">
            <AdminAddProduct onSuccess={refreshProducts} />
          </TabsContent>
          
          <TabsContent value="update">
            <AdminUpdateProduct onSuccess={refreshProducts} />
          </TabsContent>
          
          <TabsContent value="remove">
            <AdminRemoveProduct onSuccess={refreshProducts} />
          </TabsContent>

          <TabsContent value="transcations">
            <AdminTranscations transcations={transcations}  loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
