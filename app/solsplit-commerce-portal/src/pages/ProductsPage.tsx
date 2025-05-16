import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        // Filter out unavailable products
        const availableProducts = data.filter(product => product.available);
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);
  
  const handleAddToCart = (product: Product) => {
    // Check if product is out of stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    addToCart(product);
  };
  
  const handleBuyNow = (product: Product) => {
    // Check if product is out of stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with your purchase.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    addToCart(product);
    navigate("/checkout");
  };

  // Helper function to convert byte array to base64 image
  const getImageSrc = (imageData: string) => {
    try {
      return `data:image/jpeg;base64,${imageData}`;
    } catch (error) {
      console.error("Error parsing image data:", error);
      return "/placeholder.svg"; // Fallback image
    }
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        
        <div className="w-full max-w-md mx-auto mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 mb-4">No products found matching your search.</p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={getImageSrc(product.imageData)}
                    alt={product.productName}
                    className="w-full  object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{product.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                    {product.stockQuantity !== undefined && (
                      <p className="text-sm text-gray-600">
                        {product.stockQuantity > 0 ? (
                          `In stock: ${product.stockQuantity}`
                        ) : (
                          <span className="text-red-500 font-semibold flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Sold Out
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  {product.stockQuantity === undefined || product.stockQuantity > 0 ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        className="flex-1 bg-solana hover:bg-solana-dark"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-red-200 rounded-md p-2 bg-red-50 text-center text-red-500 font-medium">
                      Currently Out of Stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
