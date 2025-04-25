
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCommerce } from "@/context/CommerceContext";
import StoreLayout from "@/components/layouts/StoreLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    bundles, 
    getProductById, 
    getBundleById,
    getRelatedProducts,
    addToCart 
  } = useCommerce();
  
  const product = id ? getProductById(id) : undefined;
  const bundle = id ? getBundleById(id) : undefined;
  
  const isBundle = !!bundle;
  const item = product || bundle;
  
  const relatedProducts = product 
    ? getRelatedProducts(product.id)
    : [];
    
  const calculateBundlePrice = (bundleItem: typeof bundle) => {
    if (!bundleItem) return "0.00";
    
    const bundleProducts = products.filter(p => bundleItem.productIds.includes(p.id));
    const originalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0);
    const discountAmount = originalPrice * (bundleItem.discountPercentage / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  const calculateBundleOriginalPrice = (bundleItem: typeof bundle) => {
    if (!bundleItem) return "0.00";
    
    const bundleProducts = products.filter(p => bundleItem.productIds.includes(p.id));
    return bundleProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);
  };

  const getBundleProducts = (bundleItem: typeof bundle) => {
    if (!bundleItem) return [];
    return products.filter(p => bundleItem.productIds.includes(p.id));
  };
  
  if (!item) {
    return (
      <StoreLayout>
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Product not found</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/store")}>
            Return to Store
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-muted/20 rounded-lg overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-contain max-h-[600px]"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          <p className="text-muted-foreground mb-6">{item.description}</p>

          {isBundle ? (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold">
                  ${calculateBundlePrice(bundle)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${calculateBundleOriginalPrice(bundle)}
                </span>
                <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-bold">
                  {bundle.discountPercentage}% OFF
                </span>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-2">Bundle Includes:</h3>
                <ul className="space-y-2">
                  {getBundleProducts(bundle).map((bundleProduct) => (
                    <li key={bundleProduct.id} className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                        <img 
                          src={bundleProduct.image} 
                          alt={bundleProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{bundleProduct.name}</div>
                        <div className="text-sm text-muted-foreground">${bundleProduct.price.toFixed(2)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold mb-6">
              ${product?.price.toFixed(2)}
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full mb-6"
            onClick={() => {
              if (isBundle && bundle) {
                addToCart(bundle.id, 1, true);
              } else if (product) {
                addToCart(product.id, 1, false);
              }
            }}
            disabled={isBundle 
              ? getBundleProducts(bundle).some(p => !p.inStock) 
              : product && !product.inStock
            }
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isBundle 
              ? (getBundleProducts(bundle).some(p => !p.inStock) 
                ? "Some Items Out of Stock" 
                : "Add Bundle to Cart")
              : (product && !product.inStock 
                ? "Out of Stock" 
                : "Add to Cart")
            }
          </Button>

          {!isBundle && product && (
            <div className="border-t pt-6">
              <h3 className="font-medium text-lg mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Category: </span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {!isBundle && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden flex flex-col">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <Link to={`/store/product/${relatedProduct.id}`} className="block">
                    <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="font-bold mb-2">${relatedProduct.price.toFixed(2)}</div>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => addToCart(relatedProduct.id, 1, false)}
                    disabled={!relatedProduct.inStock}
                  >
                    {relatedProduct.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </StoreLayout>
  );
};

export default ProductDetail;
