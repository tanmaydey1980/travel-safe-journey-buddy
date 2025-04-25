
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCommerce, Discount } from "@/context/CommerceContext";
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
import { Tag, Pencil, Trash, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const CmsDiscounts = () => {
  const navigate = useNavigate();
  const { discounts, products, addDiscount, updateDiscount, deleteDiscount } = useCommerce();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState("");
  const [active, setActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState("");
  const [appliesTo, setAppliesTo] = useState<"all" | "specific">("all");
  const [specificProductIds, setSpecificProductIds] = useState<string[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("cms_authenticated");
    if (auth !== "true") {
      navigate("/cms/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    // Set default expiry date to 30 days from now when adding a new discount
    if (dialogMode === "add") {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setExpiryDate(date.toISOString().split("T")[0]);
    }
  }, [dialogMode, isDialogOpen]);

  const openAddDialog = () => {
    setDialogMode("add");
    setCurrentDiscount(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (discount: Discount) => {
    setDialogMode("edit");
    setCurrentDiscount(discount);
    
    // Populate form with discount data
    setCode(discount.code);
    setDescription(discount.description);
    setPercentage(discount.percentage.toString());
    setActive(discount.active);
    setExpiryDate(discount.expiryDate);
    setAppliesTo(discount.appliesTo);
    setSpecificProductIds(discount.specificProductIds);
    
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setCode("");
    setDescription("");
    setPercentage("");
    setActive(true);
    // Default expiry date is set in useEffect
    setAppliesTo("all");
    setSpecificProductIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that if appliesTo is "specific", at least one product is selected
    if (appliesTo === "specific" && specificProductIds.length === 0) {
      alert("Please select at least one product for this discount.");
      return;
    }
    
    const discountData = {
      code: code.toUpperCase(),
      description,
      percentage: parseFloat(percentage),
      active,
      expiryDate,
      appliesTo,
      specificProductIds: appliesTo === "all" ? [] : specificProductIds
    };
    
    if (dialogMode === "add") {
      // Check for duplicate code
      if (discounts.some(d => d.code.toUpperCase() === code.toUpperCase())) {
        alert("A discount with this code already exists. Please use a different code.");
        return;
      }
      
      addDiscount(discountData);
    } else if (dialogMode === "edit" && currentDiscount) {
      // Check for duplicate code, excluding current discount
      if (discounts.some(d => d.id !== currentDiscount.id && d.code.toUpperCase() === code.toUpperCase())) {
        alert("A discount with this code already exists. Please use a different code.");
        return;
      }
      
      updateDiscount({
        ...discountData,
        id: currentDiscount.id,
        createdAt: currentDiscount.createdAt
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteDiscount = (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      deleteDiscount(id);
    }
  };

  const toggleDiscountStatus = (discount: Discount) => {
    updateDiscount({
      ...discount,
      active: !discount.active
    });
  };

  const toggleProduct = (id: string) => {
    if (specificProductIds.includes(id)) {
      setSpecificProductIds(specificProductIds.filter(pid => pid !== id));
    } else {
      setSpecificProductIds([...specificProductIds, id]);
    }
  };

  const isDiscountExpired = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <CmsLayout title="Discounts">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage discount codes for your store
        </p>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Discount
        </Button>
      </div>

      {discounts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No discounts yet</h3>
          <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            Create discount codes to offer special deals to your customers
          </p>
          <Button className="mt-4" onClick={openAddDialog}>
            Add Discount
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-medium uppercase">
                    {discount.code}
                  </TableCell>
                  <TableCell>{discount.description}</TableCell>
                  <TableCell>{discount.percentage}% off</TableCell>
                  <TableCell className={isDiscountExpired(discount.expiryDate) ? "text-red-500" : ""}>
                    {new Date(discount.expiryDate).toLocaleDateString()}
                    {isDiscountExpired(discount.expiryDate) && " (Expired)"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={discount.active}
                      onCheckedChange={() => toggleDiscountStatus(discount)}
                    />
                  </TableCell>
                  <TableCell>
                    {discount.appliesTo === "all" ? (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        All Products
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                        {discount.specificProductIds.length} Products
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(discount)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteDiscount(discount.id)}
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
              {dialogMode === "add" ? "Add Discount" : "Edit Discount"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "Create a new discount code for your store." 
                : "Edit the details of this discount code."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Discount Code
                </label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SUMMER2023"
                  className="uppercase"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="percentage" className="text-sm font-medium">
                  Discount Percentage (%)
                </label>
                <Input
                  id="percentage"
                  type="number"
                  min="1"
                  max="99"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
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
                <label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="appliesTo" className="text-sm font-medium">
                  Applies To
                </label>
                <Select
                  value={appliesTo}
                  onValueChange={(value: "all" | "specific") => setAppliesTo(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="specific">Specific Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active" 
                    checked={active} 
                    onCheckedChange={setActive} 
                  />
                  <label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active
                  </label>
                </div>
              </div>

              {appliesTo === "specific" && (
                <div className="col-span-2 border rounded-md p-2 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`product-${product.id}`}
                          checked={specificProductIds.includes(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                        <label
                          htmlFor={`product-${product.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {product.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={appliesTo === "specific" && specificProductIds.length === 0}
              >
                {dialogMode === "add" ? "Add Discount" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CmsLayout>
  );
};

export default CmsDiscounts;
