
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useCommerce } from '@/context/CommerceContext';
import { Product, Bundle } from '@/context/CommerceContext';
import StoreLayout from '@/components/layouts/StoreLayout';

const Cart = () => {
  const { cartItems, removeFromCart, getProductById, getBundleById } = useCommerce();

  // Helper function to determine if an item is a Bundle
  const isBundle = (item: Product | Bundle): item is Bundle => {
    return 'productIds' in item;
  };
  
  // Get actual product or bundle based on cart item
  const getItemDetails = (cartItem: any) => {
    if (cartItem.isBundle) {
      return getBundleById(cartItem.productId);
    } else {
      return getProductById(cartItem.productId);
    }
  };

  // Calculate the total price for all items in cart
  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      const item = getItemDetails(cartItem);
      if (!item) return total;
      
      // If it's a bundle
      if (isBundle(item)) {
        const bundlePrice = item.discountPercentage || 0;
        return total + bundlePrice;
      }
      // If it's a product
      const productPrice = item.price || 0;
      // Products don't have discountPercentage, so we use 0
      return total + productPrice;
    }, 0);
  };

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {cartItems.map((cartItem, index) => {
              const item = getItemDetails(cartItem);
              if (!item) return null;
              
              return (
                <Card key={index} className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => removeFromCart(cartItem.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    
                    {isBundle(item) ? (
                      <div className="bg-muted p-2 rounded-md mt-2">
                        <p className="text-sm font-medium">Bundle contains multiple products</p>
                      </div>
                    ) : null}
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        {isBundle(item) ? (
                          <>
                            {item.discountPercentage ? (
                              <div className="flex items-center gap-2">
                                <span className="line-through text-muted-foreground">Bundle</span>
                                <span className="text-lg font-bold">${item.discountPercentage.toFixed(2)}</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                  Bundle Discount
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold">Bundle</span>
                            )}
                          </>
                        ) : (
                          // Product display - no discountPercentage for Products
                          <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </StoreLayout>
  );
};

export default Cart;
