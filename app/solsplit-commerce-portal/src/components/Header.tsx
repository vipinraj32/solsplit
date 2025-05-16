
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-solana">SolSplit</Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-solana">Home</Link>
          <Link to="/products" className="hover:text-solana">Products</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-solana">Admin Dashboard</Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-solana text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <User className="h-6 w-6" />
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center text-sm hover:text-solana"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-solana hover:bg-solana-dark" onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
