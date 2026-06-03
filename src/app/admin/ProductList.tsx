"use client";

import { useState, useTransition } from "react";
import { createProduct, deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UnitLabels } from "@/lib/units";

export default function ProductList({ products }: { products: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [baseUnit, setBaseUnit] = useState<"G"|"KG"|"ML"|"L"|"COUNT">("KG");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createProduct({
          name,
          sku,
          baseUnit,
          pricePerBaseUnit: parseFloat(price),
          inventoryQuantity: parseFloat(qty),
        });
        toast.success("Product created!");
        setIsOpen(false);
        setName(""); setSku(""); setPrice(""); setQty("");
      } catch (err) {
        toast.error("Failed to create product.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Product deleted.");
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white max-w-sm"
          />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={sku} onChange={e=>setSku(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Base Unit Storage</Label>
                <Select value={baseUnit} onValueChange={(v: any) => v && setBaseUnit(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(UnitLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price per Unit (INR)</Label>
                  <Input type="number" step="0.0001" value={price} onChange={e=>setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Initial Quantity</Label>
                  <Input type="number" step="0.0001" value={qty} onChange={e=>setQty(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Saving..." : "Save Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Base Unit</TableHead>
              <TableHead className="text-right">Price (INR)</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No products found.</TableCell></TableRow>
            )}
            {filteredProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.sku || "-"}</TableCell>
                <TableCell>{UnitLabels[p.baseUnit]}</TableCell>
                <TableCell className="text-right">₹{parseFloat(p.pricePerBaseUnit).toFixed(2)}</TableCell>
                <TableCell className="text-right">{parseFloat(p.inventoryQuantity).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)} disabled={isPending}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
