"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convertToBase } from "@/lib/units";

export async function getOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });
}

export async function placeOrder(data: {
  productId: string;
  orderUnit: "G" | "KG" | "ML" | "L" | "COUNT";
  orderQuantity: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findUnique({
    where: { id: data.productId }
  });

  if (!product) throw new Error("Product not found");

  // Calculate pricing
  const quantityInBase = convertToBase(data.orderQuantity, data.orderUnit);
  const calculatedPrice = quantityInBase * Number(product.pricePerBaseUnit);

  if (quantityInBase > Number(product.inventoryQuantity)) {
    throw new Error("Insufficient inventory");
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PLACED",
      totalAmount: calculatedPrice,
      items: {
        create: {
          productId: data.productId,
          quantityOrdered: data.orderQuantity, // original ordered amount
          unitUsed: data.orderUnit,
          calculatedPrice: calculatedPrice,
        }
      }
    }
  });

  // Deduct inventory
  await prisma.product.update({
    where: { id: data.productId },
    data: {
      inventoryQuantity: {
        decrement: quantityInBase
      }
    }
  });

  revalidatePath("/buyer");
  revalidatePath("/admin");
  return order.id;
}
