
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/context/CommerceContext";

interface StoreLayoutProps {
  children: React.ReactNode;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { cartItems } = useCommerce();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/store" className="text-xl font-bold">
            Commerce Store
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/store/cart">
              <Button variant="secondary" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cms/products" target="_blank">
              <Button variant="outline" size="sm" className="bg-white/10">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="bg-muted py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Commerce Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;
