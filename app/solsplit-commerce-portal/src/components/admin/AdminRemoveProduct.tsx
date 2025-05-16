
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeProduct } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AdminRemoveProductProps {
  onSuccess: () => void;
}

const AdminRemoveProduct = ({ onSuccess }: AdminRemoveProductProps) => {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      toast({
        title: "Error",
        description: "Please enter a product ID.",
        variant: "destructive"
      });
      return;
    }
    
    setShowConfirm(true);
  };
  
  const confirmRemove = async () => {
    setLoading(true);
    setShowConfirm(false);
    
    try {
      const response = await removeProduct(productId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Product has been removed successfully."
        });
        
        // Reset form
        setProductId("");
        
        // Refresh product list
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to remove product.",
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
      <h2 className="text-xl font-semibold mb-6">Remove Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID to remove"
            required
          />
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded p-4">
          <p className="text-amber-800 text-sm">
            Warning: This action cannot be undone. The product will be permanently removed from the system.
          </p>
        </div>
        
        <Button
          type="submit"
          variant="destructive"
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove Product"}
        </Button>
      </form>
      
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              product with ID: {productId} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRemoveProduct;
