
import { useState } from "react";
import { CartItem, Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UseCartStateProps {
  initialItems?: CartItem[];
}

export function useCartState({ initialItems = [] }: UseCartStateProps = {}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const { toast } = useToast();

  const updateCartItems = (newItems: CartItem[]) => {
    setCartItems(newItems);
  };

  const addItemToCart = (product: Product, quantity: number = 1) => {
    // Check if product is out of stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return false;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    let newQuantity = quantity;
    
    if (existingItem) {
      // Check if adding more would exceed available stock
      if (
        product.stockQuantity !== undefined && 
        existingItem.quantity + quantity > product.stockQuantity
      ) {
        toast({
          title: "Stock Limit Reached",
          description: `Sorry, only ${product.stockQuantity} units available.`,
          variant: "destructive",
        });
        // Set to maximum available instead
        newQuantity = product.stockQuantity - existingItem.quantity;
        if (newQuantity <= 0) return false;
      }
      newQuantity = existingItem.quantity + newQuantity;
    } else if (
      product.stockQuantity !== undefined && 
      quantity > product.stockQuantity
    ) {
      toast({
        title: "Stock Limit Reached",
        description: `Sorry, only ${product.stockQuantity} units available.`,
        variant: "destructive",
      });
      newQuantity = product.stockQuantity;
    }

    // Update local state
    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: newQuantity }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.productName} has been added to your cart.`,
    });
    return true;
  };

  const removeItemFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    return true;
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(productId);
      return true;
    }
    
    // Get the product to check stock limit
    const product = cartItems.find(item => item.id === productId);
    if (product && product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast({
        title: "Stock Limit Reached",
        description: `Sorry, only ${product.stockQuantity} units available.`,
        variant: "destructive",
      });
      // Set to maximum available instead
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId ? { ...item, quantity: product.stockQuantity! } : item
        )
      );
      return false;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
    return true;
  };

  const clearAllItems = () => {
    setCartItems([]);
    return true;
  };

  const cartTotal = cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    updateCartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearAllItems,
    cartTotal,
    cartCount
  };
}
