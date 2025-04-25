
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCommerce, Product, Bundle } from "@/context/CommerceContext";
import StoreLayout from "@/components/layouts/StoreLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Tag } from "lucide-react";

const StoreFront = () => {
  const { products, bundles, addToCart } = useCommerce();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = products.filter(
    (product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBundles = bundles.filter(
    (bundle) => 
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bundle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductsInCategory = (category: string) => {
    return products.filter((product) => product.category === category);
  };

  const calculateBundlePrice = (bundle: Bundle) => {
    const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
    const originalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0);
    const discountAmount = originalPrice * (bundle.discountPercentage / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  const calculateBundleOriginalPrice = (bundle: Bundle) => {
    const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
    return bundleProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <StoreLayout>
      {/* Hero section */}
      <div className="bg-muted rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-muted-foreground mb-6">
            Browse our selection of products and exclusive bundles with special discounts.
          </p>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {searchTerm && (
            <h2 className="text-xl font-medium mb-4">
              Search results for "{searchTerm}"
            </h2>
          )}

          {filteredProducts.length === 0 && filteredBundles.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div>
              {filteredProducts.length > 0 && (
                <>
                  <h2 className="text-xl font-medium mb-4">Products</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}

              {filteredBundles.length > 0 && (
                <>
                  <h2 className="text-xl font-medium mb-4">Bundles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredBundles.map((bundle) => (
                      <BundleCard 
                        key={bundle.id} 
                        bundle={bundle} 
                        originalPrice={calculateBundleOriginalPrice(bundle)}
                        discountedPrice={calculateBundlePrice(bundle)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <h2 className="text-xl font-medium mb-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getProductsInCategory(category).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="bundles" className="mt-0">
          <h2 className="text-xl font-medium mb-4">Special Bundles</h2>
          {bundles.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No bundles available</h3>
              <p className="text-muted-foreground">
                Check back later for special bundle deals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <BundleCard 
                  key={bundle.id} 
                  bundle={bundle} 
                  originalPrice={calculateBundleOriginalPrice(bundle)}
                  discountedPrice={calculateBundlePrice(bundle)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </StoreLayout>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCommerce();

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="py-4 flex-grow">
        <Link to={`/store/product/${product.id}`} className="block">
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="font-bold">${product.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full"
          onClick={() => addToCart(product.id, 1, false)}
          disabled={!product.inStock}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          ) : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const BundleCard: React.FC<{ 
  bundle: Bundle; 
  originalPrice: string;
  discountedPrice: string;
}> = ({ bundle, originalPrice, discountedPrice }) => {
  const { addToCart, products } = useCommerce();
  
  const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
  const allInStock = bundleProducts.every(p => p.inStock);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={bundle.image} 
          alt={bundle.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md font-bold">
          {bundle.discountPercentage}% OFF
        </div>
      </div>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-medium text-lg mb-1">
          {bundle.name}
        </h3>
        <p className="text-muted-foreground line-clamp-2 mb-2">
          {bundle.description}
        </p>
        <div className="flex items-center gap-2">
          <div className="font-bold">${discountedPrice}</div>
          <div className="text-muted-foreground line-through text-sm">${originalPrice}</div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Includes:
          <ul className="list-disc pl-5 mt-1">
            {bundleProducts.slice(0, 2).map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
            {bundleProducts.length > 2 && (
              <li>+{bundleProducts.length - 2} more items</li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full"
          onClick={() => addToCart(bundle.id, 1, true)}
          disabled={!allInStock}
        >
          {allInStock ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add Bundle to Cart
            </>
          ) : "Some Items Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreFront;
