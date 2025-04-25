
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Tag, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CmsLayoutProps {
  children: React.ReactNode;
  title: string;
}

const CmsLayout: React.FC<CmsLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/cms/products", label: "Products", icon: <Package className="mr-2" /> },
    { path: "/cms/bundles", label: "Bundles", icon: <ShoppingBasket className="mr-2" /> },
    { path: "/cms/discounts", label: "Discounts", icon: <Tag className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Commerce CMS</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/store" target="_blank">
            <Button variant="secondary" size="sm">
              View Store
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-card border-r border-border">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default CmsLayout;
