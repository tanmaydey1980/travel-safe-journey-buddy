
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCommerce, Product } from "@/context/CommerceContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Pencil, Trash, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CmsProducts = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useCommerce();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);

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
    setCurrentProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setDialogMode("edit");
    setCurrentProduct(product);
    
    // Populate form with product data
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setImage(product.image);
    setCategory(product.category);
    setInStock(product.inStock);
    setRelatedProductIds(product.relatedProductIds);
    
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setInStock(true);
    setRelatedProductIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name,
      description,
      price: parseFloat(price),
      image,
      category,
      inStock,
      relatedProductIds
    };
    
    if (dialogMode === "add") {
      addProduct(productData);
    } else if (dialogMode === "edit" && currentProduct) {
      updateProduct({
        ...productData,
        id: currentProduct.id,
        createdAt: currentProduct.createdAt
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const toggleRelatedProduct = (id: string) => {
    if (relatedProductIds.includes(id)) {
      setRelatedProductIds(relatedProductIds.filter(pid => pid !== id));
    } else {
      setRelatedProductIds([...relatedProductIds, id]);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <CmsLayout title="Products">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your products catalog
        </p>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No products yet</h3>
          <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            Add your first product to start building your catalog
          </p>
          <Button className="mt-4" onClick={openAddDialog}>
            Add Product
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
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
              {dialogMode === "add" ? "Add Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "Add a new product to your catalog." 
                : "Edit the details of this product."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inStock" 
                    checked={inStock} 
                    onCheckedChange={(checked) => setInStock(!!checked)} 
                  />
                  <label
                    htmlFor="inStock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock
                  </label>
                </div>
              </div>

              {dialogMode === "edit" && products.length > 1 && (
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Related Products</label>
                  <div className="grid grid-cols-2 gap-2 border rounded-md p-2">
                    {products
                      .filter(p => p.id !== currentProduct?.id)
                      .map(p => (
                        <div key={p.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`related-${p.id}`}
                            checked={relatedProductIds.includes(p.id)}
                            onCheckedChange={() => toggleRelatedProduct(p.id)}
                          />
                          <label
                            htmlFor={`related-${p.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                          >
                            {p.name}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {dialogMode === "add" ? "Add Product" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CmsLayout>
  );
};

export default CmsProducts;
