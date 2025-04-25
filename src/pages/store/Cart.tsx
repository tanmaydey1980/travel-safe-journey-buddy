
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCommerce } from "@/context/CommerceContext";
import StoreLayout from "@/components/layouts/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, ShoppingCart, ArrowRight, Tag, AlertCircle } from "lucide-react";

const Cart = () => {
  const { 
    cartItems, 
    products, 
    bundles, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    applyDiscount,
    activeDiscount
  } = useCommerce();
  
  const [discountCode, setDiscountCode] = useState("");
  
  if (cartItems.length === 0) {
    return (
      <StoreLayout>
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            Add some products to your cart to continue shopping.
          </p>
          <Button asChild>
            <Link to="/store">Continue Shopping</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const getItemDetails = (item: typeof cartItems[0]) => {
    if (item.isBundle) {
      return bundles.find(b => b.id === item.productId);
    }
    return products.find(p => p.id === item.productId);
  };

  const calculateItemPrice = (item: typeof cartItems[0]) => {
    const itemDetails = getItemDetails(item);
    if (!itemDetails) return 0;

    if (item.isBundle) {
      const bundle = itemDetails;
      const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
      const originalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0);
      const discountAmount = originalPrice * (bundle.discountPercentage / 100);
      return originalPrice - discountAmount;
    }

    const product = itemDetails;
    return product.price;
  };

  const calculateItemTotal = (item: typeof cartItems[0]) => {
    return calculateItemPrice(item) * item.quantity;
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };
  
  const calculateDiscount = () => {
    if (!activeDiscount) return 0;
    
    let discountableAmount = 0;
    
    if (activeDiscount.appliesTo === "all") {
      discountableAmount = calculateSubtotal();
    } else {
      // For specific products
      discountableAmount = cartItems.reduce((sum, item) => {
        if (!item.isBundle && activeDiscount.specificProductIds.includes(item.productId)) {
          return sum + calculateItemTotal(item);
        }
        return sum;
      }, 0);
    }
    
    return discountableAmount * (activeDiscount.percentage / 100);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };
  
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    applyDiscount(discountCode);
  };
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity); // Ensure minimum of 1
    updateCartItem(id, quantity);
  };

  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground">Review and manage your items</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const itemDetails = getItemDetails(item);
                  if (!itemDetails) return null;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={itemDetails.image} 
                            alt={itemDetails.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/store/product/${item.productId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {itemDetails.name}
                        </Link>
                        {item.isBundle && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Bundle
                          </div>
                        )}
                      </TableCell>
                      <TableCell>${calculateItemPrice(item).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center w-24">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            className="h-8 rounded-none text-center w-10 p-0"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>${calculateItemTotal(item).toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button asChild variant="outline">
              <Link to="/store">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              {activeDiscount && (
                <div className="flex justify-between text-accent">
                  <span>Discount ({activeDiscount.code})</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 font-medium text-lg flex justify-between">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {!activeDiscount && (
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Discount Code</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <Button onClick={handleApplyDiscount}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
            
            <Button className="w-full" size="lg">
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="mt-6 bg-muted/30 p-3 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  This is a demo store. No real purchases will be made.
                </p>
              </div>
            </div>
          </div>
          
          {/* Promo section */}
          <div className="mt-6 border rounded-lg p-6 bg-muted/10">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Available Offers</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Use code <strong>SUMMER2023</strong> for 10% off your entire order</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Cart;
