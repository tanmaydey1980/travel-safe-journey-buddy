
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Define types for our commerce entities
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  createdAt: string;
  relatedProductIds: string[];
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  discountPercentage: number;
  image: string;
  createdAt: string;
};

export type Discount = {
  id: string;
  code: string;
  description: string;
  percentage: number;
  active: boolean;
  expiryDate: string;
  appliesTo: "all" | "specific";
  specificProductIds: string[];
  createdAt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  isBundle: boolean;
};

// Sample initial data
const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Basic Car Insurance",
    description: "Standard coverage for your vehicle",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2874&auto=format&fit=crop",
    category: "insurance",
    inStock: true,
    createdAt: "2023-01-15",
    relatedProductIds: ["p2"]
  },
  {
    id: "p2",
    name: "Premium Car Insurance",
    description: "Complete coverage with added benefits",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=2531&auto=format&fit=crop",
    category: "insurance",
    inStock: true,
    createdAt: "2023-02-10",
    relatedProductIds: ["p1"]
  }
];

const initialBundles: Bundle[] = [
  {
    id: "b1",
    name: "Complete Vehicle Protection",
    description: "Car insurance with roadside assistance",
    productIds: ["p1", "p2"],
    discountPercentage: 15,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop",
    createdAt: "2023-03-05"
  }
];

const initialDiscounts: Discount[] = [
  {
    id: "d1",
    code: "SUMMER2023",
    description: "Summer sale discount",
    percentage: 10,
    active: true,
    expiryDate: "2025-08-31",
    appliesTo: "all",
    specificProductIds: [],
    createdAt: "2023-06-01"
  }
];

// Define the context type
type CommerceContextType = {
  products: Product[];
  bundles: Bundle[];
  discounts: Discount[];
  cartItems: CartItem[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addBundle: (bundle: Omit<Bundle, "id" | "createdAt">) => void;
  updateBundle: (bundle: Bundle) => void;
  deleteBundle: (id: string) => void;
  addDiscount: (discount: Omit<Discount, "id" | "createdAt">) => void;
  updateDiscount: (discount: Discount) => void;
  deleteDiscount: (id: string) => void;
  addToCart: (productId: string, quantity: number, isBundle: boolean) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getProductById: (id: string) => Product | undefined;
  getBundleById: (id: string) => Bundle | undefined;
  getRelatedProducts: (productId: string) => Product[];
  applyDiscount: (code: string) => boolean;
  activeDiscount: Discount | null;
};

// Create the context
const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

// Create a provider component
export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for our entities
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("cms_products");
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  
  const [bundles, setBundles] = useState<Bundle[]>(() => {
    const savedBundles = localStorage.getItem("cms_bundles");
    return savedBundles ? JSON.parse(savedBundles) : initialBundles;
  });
  
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const savedDiscounts = localStorage.getItem("cms_discounts");
    return savedDiscounts ? JSON.parse(savedDiscounts) : initialDiscounts;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("store_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("cms_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("cms_bundles", JSON.stringify(bundles));
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem("cms_discounts", JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem("store_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Product CRUD operations
  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to your products.`
    });
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast({
      title: "Product updated",
      description: `${product.name} has been updated.`
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== id));
      // Also clean up any references in bundles or related products
      setBundles(bundles.map(bundle => ({
        ...bundle,
        productIds: bundle.productIds.filter(pid => pid !== id)
      })));
      setProducts(products.map(p => ({
        ...p,
        relatedProductIds: p.relatedProductIds.filter(rid => rid !== id)
      })));
      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed.`
      });
    }
  };

  // Bundle CRUD operations
  const addBundle = (bundle: Omit<Bundle, "id" | "createdAt">) => {
    const newBundle: Bundle = {
      ...bundle,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setBundles([...bundles, newBundle]);
    toast({
      title: "Bundle added",
      description: `${newBundle.name} has been created.`
    });
  };

  const updateBundle = (bundle: Bundle) => {
    setBundles(bundles.map(b => b.id === bundle.id ? bundle : b));
    toast({
      title: "Bundle updated",
      description: `${bundle.name} has been updated.`
    });
  };

  const deleteBundle = (id: string) => {
    const bundleToDelete = bundles.find(b => b.id === id);
    if (bundleToDelete) {
      setBundles(bundles.filter(b => b.id !== id));
      toast({
        title: "Bundle deleted",
        description: `${bundleToDelete.name} has been removed.`
      });
    }
  };

  // Discount CRUD operations
  const addDiscount = (discount: Omit<Discount, "id" | "createdAt">) => {
    const newDiscount: Discount = {
      ...discount,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setDiscounts([...discounts, newDiscount]);
    toast({
      title: "Discount added",
      description: `${newDiscount.code} has been created.`
    });
  };

  const updateDiscount = (discount: Discount) => {
    setDiscounts(discounts.map(d => d.id === discount.id ? discount : d));
    
    // If this is the active discount, update it
    if (activeDiscount && activeDiscount.id === discount.id) {
      setActiveDiscount(discount);
    }
    
    toast({
      title: "Discount updated",
      description: `${discount.code} has been updated.`
    });
  };

  const deleteDiscount = (id: string) => {
    const discountToDelete = discounts.find(d => d.id === id);
    if (discountToDelete) {
      setDiscounts(discounts.filter(d => d.id !== id));
      
      // If this was the active discount, remove it
      if (activeDiscount && activeDiscount.id === id) {
        setActiveDiscount(null);
      }
      
      toast({
        title: "Discount deleted",
        description: `${discountToDelete.code} has been removed.`
      });
    }
  };

  // Cart operations
  const addToCart = (productId: string, quantity: number, isBundle: boolean) => {
    const existingItem = cartItems.find(item => 
      item.productId === productId && item.isBundle === isBundle
    );
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `c${Date.now()}`,
        productId,
        quantity,
        isBundle
      };
      setCartItems([...cartItems, newItem]);
    }
    
    const itemName = isBundle 
      ? bundles.find(b => b.id === productId)?.name 
      : products.find(p => p.id === productId)?.name;
      
    toast({
      title: "Added to cart",
      description: `${quantity} × ${itemName} added to your cart.`
    });
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (itemToRemove) {
      const itemName = itemToRemove.isBundle 
        ? bundles.find(b => b.id === itemToRemove.productId)?.name 
        : products.find(p => p.id === itemToRemove.productId)?.name;
        
      setCartItems(cartItems.filter(item => item.id !== id));
      
      toast({
        title: "Removed from cart",
        description: `${itemName} has been removed from your cart.`
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart."
    });
  };

  // Utility functions
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getBundleById = (id: string) => {
    return bundles.find(b => b.id === id);
  };

  const getRelatedProducts = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    return products.filter(p => product.relatedProductIds.includes(p.id));
  };

  const applyDiscount = (code: string) => {
    const discount = discounts.find(
      d => d.code.toUpperCase() === code.toUpperCase() && d.active
    );
    
    if (!discount) {
      toast({
        title: "Invalid discount code",
        description: "The discount code you entered is invalid or expired.",
        variant: "destructive"
      });
      return false;
    }
    
    const today = new Date();
    const expiryDate = new Date(discount.expiryDate);
    
    if (expiryDate < today) {
      toast({
        title: "Expired discount code",
        description: "This discount code has expired.",
        variant: "destructive"
      });
      return false;
    }
    
    setActiveDiscount(discount);
    toast({
      title: "Discount applied",
      description: `${discount.percentage}% discount has been applied to your order.`
    });
    return true;
  };

  const value = {
    products,
    bundles,
    discounts,
    cartItems,
    addProduct,
    updateProduct,
    deleteProduct,
    addBundle,
    updateBundle,
    deleteBundle,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getProductById,
    getBundleById,
    getRelatedProducts,
    applyDiscount,
    activeDiscount
  };

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
};

// Create a hook to use the context
export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (context === undefined) {
    throw new Error("useCommerce must be used within a CommerceProvider");
  }
  return context;
};
