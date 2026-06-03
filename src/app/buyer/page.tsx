import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/app/actions/products";
import StoreFront from "./StoreFront";

export default async function BuyerPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== "SELLER" && session.user?.role !== "BUYER")) {
    redirect("/login");
  }

  const products = await getProducts();

  // Convert Prisma Decimal to string for passing to Client Component
  const serializableProducts = products.map((p) => ({
    ...p,
    pricePerBaseUnit: p.pricePerBaseUnit.toString(),
    inventoryQuantity: p.inventoryQuantity.toString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-muted-foreground">
          Browse products and place orders using your preferred units.
        </p>
      </div>
      
      <StoreFront products={serializableProducts} />
    </div>
  );
}
