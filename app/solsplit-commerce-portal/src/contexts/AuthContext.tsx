
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, token: string, role?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already logged in
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (email && token) {
      setUser({ email, token, role: role || undefined });
    }
  }, []);

  const login = (email: string, token: string, role?: string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
    
    setUser({ email, token, role });
    toast({
      title: "Success",
      description: "You have been logged in successfully!",
    });
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
