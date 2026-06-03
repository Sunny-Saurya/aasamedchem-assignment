import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const sellerPassword = await bcrypt.hash('seller123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const seller = await prisma.user.upsert({
      where: { email: 'seller@example.com' },
      update: {},
      create: {
        email: 'seller@example.com',
        password: sellerPassword,
        role: 'SELLER',
      },
    });

    return NextResponse.json({ message: "Seeded successfully", admin, seller });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
