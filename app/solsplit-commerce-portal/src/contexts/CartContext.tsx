
import { createContext, useContext, useEffect, ReactNode } from "react";
import { CartApiItem, CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";
import { 
  fetchCartItems as fetchCartItemsApi, 
  addToCartApi, 
  removeFromCartApi,
  updateCartQuantityApi
} from "@/services/cartService";
import { useCartState } from "@/hooks/useCartState";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  fetchUserCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { 
    cartItems, 
    updateCartItems,
    addItemToCart, 
    removeItemFromCart, 
    updateItemQuantity, 
    clearAllItems, 
    cartTotal,
    cartCount 
  } = useCartState();
  
  // Fetch cart from API when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    }
  }, [isAuthenticated]);

  const fetchUserCart = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const items = await fetchCartItemsApi(user.email);
        updateCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  const addToCart = async (product: Product) => {
    if (!isAuthenticated || !user) return;
    
    // Use the local state management to validate and update UI
    const success = addItemToCart(product);
    if (!success) return;
    
    // Send request to API
    const cartItem: CartApiItem = {
      productId: product.id,
      quantity: 1, // Default to adding 1
      email: user.email
    };

    const result = await addToCartApi(cartItem);
    if (!result.success) {
      // Revert the local state change if API call failed
      // This is simplified and could be improved with optimistic updates
      fetchUserCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) return;
    
    // Update local state first
    removeItemFromCart(productId);
    
    // Then update server state
    await removeFromCartApi(user.email, productId);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) return;

    // Update local state and validate
    const success = updateItemQuantity(productId, quantity);
    if (!success) return;
    
    // Update server state
    const cartItem: CartApiItem = {
      productId,
      quantity,
      email: user.email
    };
    
    await updateCartQuantityApi(cartItem);
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;
    
    // Clear local state
    clearAllItems();
    
    // Clear server state
    // Note: This API endpoint might not exist yet
    // await clearCartApi(user.email);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal,
        cartCount,
        fetchUserCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
