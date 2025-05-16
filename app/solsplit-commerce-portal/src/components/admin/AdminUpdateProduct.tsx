
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateProduct } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface AdminUpdateProductProps {
  onSuccess: () => void;
}

const AdminUpdateProduct = ({ onSuccess }: AdminUpdateProductProps) => {
  const [productId, setProductId] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    productType: "",
    available: true
  });
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!productId) {
      toast({
        title: "Error",
        description: "Please enter a product ID.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if at least one field is filled for update
    const isAnyFieldFilled = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== '' : true
    );
    
    if (!isAnyFieldFilled) {
      toast({
        title: "Error",
        description: "Please fill at least one field to update.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert price string to number if provided
    let updateData: any = { id: productId };
    
    if (formData.productName) updateData.productName = formData.productName;
    if (formData.description) updateData.description = formData.description;
    if (formData.productType) updateData.productType = formData.productType;
    
    // Only include price if it's provided and valid
    if (formData.price) {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid price.",
          variant: "destructive"
        });
        return;
      }
      updateData.price = price;
    }
    
    // Always include available status
    updateData.available = formData.available;
    
    setLoading(true);
    
    try {
      const response = await updateProduct(updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Product has been updated successfully."
        });
        
        // Reset form
        setProductId("");
        setFormData({
          productName: "",
          description: "",
          price: "",
          productType: "",
          available: true
        });
        
        // Refresh product list
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update product.",
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
      <h2 className="text-xl font-semibold mb-6">Update Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID to update"
            required
          />
        </div>
        
        <div className="border-t pt-6 mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Fill in only the fields you want to update:
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Update product name"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Update product description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                placeholder="Update price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                placeholder="Update product type"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="available">Available</Label>
          </div>
        </div>
        
        <Button
          type="submit"
          className="bg-solana hover:bg-solana-dark"
          disabled={loading}
        >
          {loading ? "Updating Product..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
};

export default AdminUpdateProduct;
