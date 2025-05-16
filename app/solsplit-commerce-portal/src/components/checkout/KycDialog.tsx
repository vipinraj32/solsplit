
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KycDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onComplete: () => void;
}

const KycDialog = ({ showDialog, setShowDialog, onComplete }: KycDialogProps) => {
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const { toast } = useToast();

  const handleKycSubmit = async () => {
    if (!governmentId || !selfiePhoto) {
      toast({
        title: "Missing Documents",
        description: "Please upload both your ID and selfie.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate KYC verification process
    // In a real application, you would upload these files to your server
    
    setTimeout(() => {
      onComplete();
      setShowDialog(false);
      
      toast({
        title: "KYC Completed",
        description: "Your identity has been verified successfully.",
      });
    }, 2000);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Identity Verification (KYC)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="government-id">Government ID</Label>
            <Input
              id="government-id"
              type="file"
              accept="image/*"
              onChange={(e) => setGovernmentId(e.target.files?.[0] || null)}
            />
          </div>
          
          <div>
            <Label htmlFor="selfie">Selfie Photo</Label>
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={(e) => setSelfiePhoto(e.target.files?.[0] || null)}
            />
          </div>
          
          <Button 
            className="w-full bg-solana hover:bg-solana-dark" 
            onClick={handleKycSubmit}
          >
            Submit Verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycDialog;
