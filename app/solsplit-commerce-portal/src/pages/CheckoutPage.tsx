
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { ShippingAddress, TransactionData, WalletData } from "@/types";
import { submitTransaction } from "@/services/api";

// Import our new components
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import KycDialog from "@/components/checkout/KycDialog";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"later" | "now">("later");
  const [walletAddress, setWalletAddress] = useState("");
  
  // KYC states
  const [showKycDialog, setShowKycDialog] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  
  // Transaction states
  const [processingTransaction, setProcessingTransaction] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  
  const handlePayment = async () => {
    setProcessingTransaction(true);
    
    try {
      // If using Phantom wallet for payment
      const { solana } = window as any;
      
      if (!solana || !solana.isPhantom) {
        throw new Error("Phantom wallet is not installed");
      }
      
      // Create a sample transaction
      // In a real app, this would be your actual transaction to the merchant
      const connection = new (window as any).solanaWeb3.Connection(
        "https://api.mainnet-beta.solana.com",
        "confirmed"
      );
      
      // Simulate transaction for demo purposes
      // In a real app, you would create an actual transaction
      setTimeout(() => {
        const fakeTransactionHash = "SimulatedTx" + Math.random().toString(36).substring(2, 15);
        setTransactionHash(fakeTransactionHash);
        
        // Submit transaction details to your backend
        const txData: TransactionData = {
          transactionHash: fakeTransactionHash,
          walletAddress: walletAddress,
          email: user?.email || "",
          productId: cartItems[0]?.id || "",
          amount: cartTotal * 1.10, // Including tax
          date: new Date().toISOString()
        };
        
        submitTransaction(txData).then(result => {
          if (result.success) {
            clearCart();
            navigate("/order-confirmation", { 
              state: { 
                transactionHash: fakeTransactionHash,
                paymentMethod
              } 
            });
          } else {
            throw new Error(result.error || "Failed to process transaction");
          }
        });
      }, 2000);
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setProcessingTransaction(false);
    }
  };
  
  const handlePlaceOrder = async () => {
    // Validate form
    const requiredFields = ["name", "addressLine1", "city", "state", "postalCode", "country", "phoneNumber"];
    const missingFields = requiredFields.filter(field => !address[field as keyof ShippingAddress]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === "later" && !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Phantom wallet to continue with this payment method.",
        variant: "destructive",
      });
      return;
    }
    
    // Handle payment
    await handlePayment();
  };
  
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <CheckoutForm 
              address={address} 
              setAddress={setAddress} 
            />
            
            <PaymentSection 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onOpenKyc={() => setShowKycDialog(true)}
              kycCompleted={kycCompleted}
            />
          </div>
          
          <div>
            <OrderSummary 
              cartItems={cartItems} 
              cartTotal={cartTotal} 
              onPlaceOrder={handlePlaceOrder}
              processingTransaction={processingTransaction}
            />
          </div>
        </div>
      </div>
      
      <KycDialog 
        showDialog={showKycDialog} 
        setShowDialog={setShowKycDialog}
        onComplete={() => setKycCompleted(true)}
      />
    </Layout>
  );
};

export default CheckoutPage;
