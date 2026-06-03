"use client";

import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UnitLabels, getCompatibleUnits, convertToBase, calculateTotalPrice } from "@/lib/units";

export default function StoreFront({ products }: { products: any[] }) {
  const [isPending, startTransition] = useTransition();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderUnit, setOrderUnit] = useState<string>("");
  const [orderQty, setOrderQty] = useState<string>("1");

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !orderUnit) return;

    startTransition(async () => {
      try {
        await placeOrder({
          productId: selectedProduct.id,
          orderUnit: orderUnit as any,
          orderQuantity: parseFloat(orderQty),
        });
        toast.success("Order placed successfully!");
        setSelectedProduct(null);
      } catch (err: any) {
        toast.error(err.message || "Failed to place order.");
      }
    });
  };

  const getPricePreview = () => {
    if (!selectedProduct || !orderUnit || !orderQty || isNaN(Number(orderQty))) return 0;
    return calculateTotalPrice(
      parseFloat(orderQty),
      orderUnit,
      parseFloat(selectedProduct.pricePerBaseUnit)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle>{p.name}</CardTitle>
            <CardDescription>SKU: {p.sku || "-"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Base Rate: ₹{parseFloat(p.pricePerBaseUnit).toFixed(2)} / {p.baseUnit}</p>
            <p className="text-sm">Available: {parseFloat(p.inventoryQuantity).toLocaleString()} {p.baseUnit}</p>
          </CardContent>
          <CardFooter>
            <Dialog 
              open={selectedProduct?.id === p.id} 
              onOpenChange={(open) => {
                if (open) {
                  setSelectedProduct(p);
                  setOrderUnit(p.baseUnit);
                  setOrderQty("1");
                } else {
                  setSelectedProduct(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="w-full">Order Now</Button>
              </DialogTrigger>
              {selectedProduct?.id === p.id && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order {p.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleOrder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input type="number" step="0.001" min="0.001" value={orderQty} onChange={e=>setOrderQty(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={orderUnit} onValueChange={setOrderUnit}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getCompatibleUnits(p.baseUnit).map((unit) => (
                              <SelectItem key={unit} value={unit}>{UnitLabels[unit]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-gray-600">Total Calculated Price:</p>
                      <p className="text-2xl font-bold text-green-700">₹{getPricePreview().toFixed(2)}</p>
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? "Processing..." : "Place Order"}
                    </Button>
                  </form>
                </DialogContent>
              )}
            </Dialog>
          </CardFooter>
        </Card>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500 bg-white border rounded-lg">
          No products available currently.
        </div>
      )}
    </div>
  );
}
