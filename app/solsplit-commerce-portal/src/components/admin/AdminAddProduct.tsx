
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { addProduct } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface AdminAddProductProps {
  onSuccess: () => void;
}

const AdminAddProduct = ({ onSuccess }: AdminAddProductProps) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    productType: "",
    stockQuantity:"",
    available: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.productName || !formData.description || !formData.price || !formData.productType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image for the product.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert price string to number
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData object
      const productFormData = new FormData();
      productFormData.append("productName", formData.productName);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("productType", formData.productType);
      productFormData.append("available", String(formData.available));
      productFormData.append("stockQuantity", formData.stockQuantity);
      productFormData.append("file", file);
      
      const response = await addProduct(productFormData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Product has been added successfully."
        });
        
        // Reset form
        setFormData({
          productName: "",
          description: "",
          price: "",
          productType: "",
          stockQuantity:"",
          available: true
        });
        setFile(null);
        
        // Refresh product list
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add product.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productType">Product Type</Label>
            <Input
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              placeholder="Enter product type"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="Enter a StockQuantity"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {file && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Selected: {file.name}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="available">Available</Label>
        </div>
        
        <Button
          type="submit"
          className="bg-solana hover:bg-solana-dark"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
