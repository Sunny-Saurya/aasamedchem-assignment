import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/app/actions/products";
import { getOrders } from "@/app/actions/orders";
import ProductList from "./ProductList";
import OrderList from "./OrderList";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const products = await getProducts();

  // Convert Prisma Decimal to string for passing to Client Component
  const serializableProducts = products.map((p) => ({
    ...p,
    pricePerBaseUnit: p.pricePerBaseUnit.toString(),
    inventoryQuantity: p.inventoryQuantity.toString(),
  }));

  const orders = await getOrders();
  const serializableOrders = orders.map((o) => ({
    ...o,
    totalAmount: o.totalAmount.toString(),
    items: o.items.map((i) => ({
      ...i,
      quantityOrdered: i.quantityOrdered.toString(),
      calculatedPrice: i.calculatedPrice.toString(),
    }))
  }));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage products and view incoming orders.
        </p>
      </div>
      
      <ProductList products={serializableProducts} />
      
      <OrderList orders={serializableOrders} />
    </div>
  );
}
