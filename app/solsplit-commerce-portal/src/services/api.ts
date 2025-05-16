
import { LoginCredentials, Product, SignupData, transaction, TransactionData, WalletData } from "@/types";

const API_URL = "http://solsplit.eu-north-1.elasticbeanstalk.com";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


export const fetchTranscations = async (): Promise<transaction[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching admin products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
};

export const fetchAdminProducts = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/admin/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching admin products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });
    
    if (response.status === 200) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const signup = async (userData: SignupData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/singup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    
    if (response.status === 201) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const addProduct = async (productData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/admin/addProduct`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: productData
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Add product error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const updateProduct = async (productData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/admin/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.text();
      return { success: false, error: response.status === 404 ? "Product not found" : error };
    }
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const removeProduct = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const formData = new FormData();
    formData.append("productId", productId);
    
    const response = await fetch(`${API_URL}/api/admin/remove`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Remove product error:", error);
    return { success: false, error: "Network error occurred" };
  }
};

export const verifyWallet = async (walletAddress: string): Promise<WalletData | null> => {
  try {
    const HELIUS_API_KEY = "your-helius-api-key"; // This should be moved to environment variables
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Error verifying wallet: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Calculate wallet age and transaction count
    const transactions = data.transactions || [];
    const currentDate = new Date();
    let oldestTx = currentDate;
    
    if (transactions.length > 0) {
      oldestTx = new Date(transactions[transactions.length - 1].timestamp * 1000);
    }
    
    const ageDays = Math.floor((currentDate.getTime() - oldestTx.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ageDays,
      txCount: transactions.length,
      walletAddress
    };
  } catch (error) {
    console.error("Error verifying wallet:", error);
    return null;
  }
};

export const submitTransaction = async (transactionData: TransactionData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    console.error("Transaction submission error:", error);
    return { success: false, error: "Network error occurred" };
  }
};
