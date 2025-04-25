
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCommerce, Bundle } from "@/context/CommerceContext";
import CmsLayout from "@/components/layouts/CmsLayout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingBasket, Pencil, Trash, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CmsBundles = () => {
  const navigate = useNavigate();
  const { bundles, products, addBundle, updateBundle, deleteBundle } = useCommerce();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [image, setImage] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("cms_authenticated");
    if (auth !== "true") {
      navigate("/cms/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const openAddDialog = () => {
    setDialogMode("add");
    setCurrentBundle(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (bundle: Bundle) => {
    setDialogMode("edit");
    setCurrentBundle(bundle);
    
    // Populate form with bundle data
    setName(bundle.name);
    setDescription(bundle.description);
    setDiscountPercentage(bundle.discountPercentage.toString());
    setImage(bundle.image);
    setProductIds(bundle.productIds);
    
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDiscountPercentage("");
    setImage("");
    setProductIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productIds.length < 2) {
      alert("A bundle must contain at least 2 products.");
      return;
    }
    
    const bundleData = {
      name,
      description,
      discountPercentage: parseFloat(discountPercentage),
      image,
      productIds
    };
    
    if (dialogMode === "add") {
      addBundle(bundleData);
    } else if (dialogMode === "edit" && currentBundle) {
      updateBundle({
        ...bundleData,
        id: currentBundle.id,
        createdAt: currentBundle.createdAt
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteBundle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bundle?")) {
      deleteBundle(id);
    }
  };

  const toggleProduct = (id: string) => {
    if (productIds.includes(id)) {
      setProductIds(productIds.filter(pid => pid !== id));
    } else {
      setProductIds([...productIds, id]);
    }
  };

  const calculateBundlePrice = (bundle: Bundle) => {
    const bundleProducts = products.filter(p => bundle.productIds.includes(p.id));
    const originalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0);
    const discountAmount = originalPrice * (bundle.discountPercentage / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <CmsLayout title="Bundles">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage product bundles with special pricing
        </p>
        <Button onClick={openAddDialog} disabled={products.length < 2}>
          <Plus className="mr-2 h-4 w-4" /> Add Bundle
        </Button>
      </div>

      {products.length < 2 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          You need at least 2 products to create a bundle. Please add more products first.
        </div>
      )}

      {bundles.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No bundles yet</h3>
          <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            Create bundles to offer special deals on multiple products
          </p>
          <Button 
            className="mt-4" 
            onClick={openAddDialog}
            disabled={products.length < 2}
          >
            Add Bundle
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell>
                    <img 
                      src={bundle.image} 
                      alt={bundle.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{bundle.name}</TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {bundle.productIds.length} products
                    </span>
                  </TableCell>
                  <TableCell>{bundle.discountPercentage}% off</TableCell>
                  <TableCell>${calculateBundlePrice(bundle)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(bundle)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteBundle(bundle.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add Bundle" : "Edit Bundle"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "Create a new product bundle with special pricing." 
                : "Edit the details of this bundle."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Bundle Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="discountPercentage" className="text-sm font-medium">
                  Discount Percentage (%)
                </label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="99"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Selected Products: {productIds.length}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Select at least 2 products
                  </span>
                </div>
              </div>

              <div className="col-span-2 border rounded-md p-2 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`product-${product.id}`}
                        checked={productIds.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {product.name} - ${product.price.toFixed(2)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={productIds.length < 2}>
                {dialogMode === "add" ? "Add Bundle" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CmsLayout>
  );
};

export default CmsBundles;
