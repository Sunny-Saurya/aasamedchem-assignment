"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function registerUser(data: { email: string; password: string }) {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already in use.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: "BUYER", // Default new users to BUYER role
    },
  });

  return { success: true, email: user.email };
}
