
import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">SafeJourney</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Travel Insurance
            </Link>
            <Link to="/motor" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Motor Insurance
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Claims
            </a>
            <a href="#" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              FAQ
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Travel Quote
            </Link>
            <Link 
              to="/motor" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Motor Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
