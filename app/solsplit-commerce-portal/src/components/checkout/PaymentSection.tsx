
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { WalletData } from "@/types";
import { verifyWallet } from "@/services/api";

interface PaymentSectionProps {
  paymentMethod: "later" | "now";
  setPaymentMethod: (method: "later" | "now") => void;
  onOpenKyc: () => void;
  kycCompleted: boolean;
}

const PaymentSection = ({ 
  paymentMethod, 
  setPaymentMethod, 
  onOpenKyc, 
  kycCompleted 
}: PaymentSectionProps) => {
  const { toast } = useToast();
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isWalletVerified, setIsWalletVerified] = useState(false);

  const handleConnectWallet = async () => {
    setConnectingWallet(true);
    
    try {
      // Check if Phantom wallet is installed
      const { solana } = window as any;
      
      if (!solana || !solana.isPhantom) {
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom wallet extension first.",
          variant: "destructive",
        });
        setConnectingWallet(false);
        return;
      }
      
      // Connect to wallet
      const response = await solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setWalletConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: "Your Phantom wallet has been connected successfully.",
      });
      
      // Verify wallet through Helius API
      const walletInfo = await verifyWallet(address);
      
      if (walletInfo) {
        setWalletData(walletInfo);
        
        // Simple verification logic (can be adjusted)
        const isVerified = walletInfo.ageDays >30 && walletInfo.txCount >5;
        setIsWalletVerified(isVerified);
        
        if (!isVerified) {
          toast({
            title: "Wallet Verification Failed",
            description: "Your wallet doesn't meet our requirements for BNPL. Please use another payment method.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Phantom wallet.",
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Payment Method</h2>
      
      <RadioGroup value={paymentMethod} onValueChange={(value: "later" | "now") => setPaymentMethod(value)}>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="later" id="option-later" />
          <Label htmlFor="option-later">Buy Now, Pay Later (Phantom Wallet)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="now" id="option-now" />
          <Label htmlFor="option-now">Pay Now</Label>
        </div>
      </RadioGroup>
      
      {paymentMethod === "later" && !walletConnected && (
        <div className="mt-4">
          <Button 
            onClick={handleConnectWallet} 
            className="bg-solana hover:bg-solana-dark"
            disabled={connectingWallet}
          >
            {connectingWallet ? "Connecting..." : "Connect Phantom Wallet"}
          </Button>
        </div>
      )}
      
      {paymentMethod === "later" && walletConnected && (
        <div className="mt-4">
          {isWalletVerified ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              Your wallet is verified and ready for BNPL.
              {!kycCompleted && (
                <Button 
                  className="ml-4 bg-solana hover:bg-solana-dark"
                  onClick={onOpenKyc}
                >
                  Complete KYC
                </Button>
              )}
              {kycCompleted && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  KYC Verified
                </span>
              )}
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              Your wallet doesn't meet our requirements for BNPL. Please use another payment method.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
