"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UnitLabels } from "@/lib/units";

export default function OrderList({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Incoming Orders & Quotations</h2>
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Ordered Quantity</TableHead>
              <TableHead className="text-right">Total Price (INR)</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No orders placed yet.</TableCell></TableRow>
            )}
            {orders.map((o) => (
              o.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{o.id.substring(0, 8)}...</TableCell>
                  <TableCell>{o.user.email}</TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{parseFloat(item.quantityOrdered).toLocaleString()} {UnitLabels[item.unitUsed]}</TableCell>
                  <TableCell className="text-right font-bold text-green-700">₹{parseFloat(item.calculatedPrice).toFixed(2)}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
