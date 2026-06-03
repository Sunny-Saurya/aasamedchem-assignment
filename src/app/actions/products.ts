"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createProduct(data: {
  name: string;
  sku?: string;
  baseUnit: "G" | "KG" | "ML" | "L" | "COUNT";
  pricePerBaseUnit: number;
  inventoryQuantity: number;
}) {
  await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      baseUnit: data.baseUnit,
      pricePerBaseUnit: data.pricePerBaseUnit,
      inventoryQuantity: data.inventoryQuantity,
    }
  });

  revalidatePath("/admin");
  revalidatePath("/buyer");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });

  revalidatePath("/admin");
  revalidatePath("/buyer");
}
