
import { CartApiItem, CartItem } from "@/types";

const API_URL = "http://solsplit.eu-north-1.elasticbeanstalk.com";

export const fetchCartItems = async (email: string): Promise<CartItem[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/api/cart/?email=${encodeURIComponent(email)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching cart: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const addToCartApi = async (cartItem: CartApiItem) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/cart/addCart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cartItem)
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const removeFromCartApi = async (email: string, productId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email, productId })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const updateCartQuantityApi = async (cartItem: CartApiItem) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cartItem)
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const clearCartApi = async (email: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/cart/clear`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Clear cart error:", error);
    return { success: false, error: "Network error occurred" };
  }
};
