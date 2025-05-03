
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Filter, Send, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketingLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/marketing/customers", label: "Customers", icon: <Users className="mr-2" /> },
    { path: "/marketing/segments", label: "Segments", icon: <Filter className="mr-2" /> },
    { path: "/marketing/campaigns", label: "Campaigns", icon: <Send className="mr-2" /> },
    { path: "/marketing/analytics", label: "Analytics", icon: <LineChart className="mr-2" /> },
    { path: "/marketing/settings", label: "Settings", icon: <Settings className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Marketing Platform</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm">
            Help
          </Button>
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

export default MarketingLayout;
