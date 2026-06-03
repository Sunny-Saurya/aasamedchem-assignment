# AasaMedChem Inventory and Order Management System

This project is a small inventory and order management system built for the AasaMedChem recruitment hackathon.

## Features & Core Flows

1. **Authentication:** 
   - Role-based access using NextAuth (Credentials).
   - `Admin` accounts can manage products, view inventory levels, and see all incoming quotations/orders.
   - `Seller/User` accounts can browse products, see available units, and place quotations/orders.
   
2. **Inventory & Units:**
   - Supports products with multiple units: `g, kg, L, mL, count`.
   - Conversions are handled seamlessly between compatible dimensions (Weight: g <-> kg, Volume: mL <-> L).

3. **Pricing & Quotation:**
   - High decimal precision using PostgreSQL `DECIMAL(16, 4)`.
   - Prices calculated dynamically based on ordered quantity and unit multipliers before persisting exact calculated values to the database.

## Tech Stack & High-level System Design

- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI. Provides a modern, responsive, and type-safe UI.
- **Backend:** Next.js Server Actions & API Routes. Handles authentication, database CRUD operations, and calculation validations to ensure security.
- **Database:** Neon Serverless PostgreSQL. Connected via Prisma ORM for type safety and easy schema migrations.

**System Interaction:**
The frontend communicates directly with Next.js Server Actions which securely execute Prisma ORM queries against the Neon database. Unit conversions occur primarily on the backend during order placement to prevent client-side manipulation, while the frontend calculates tentative pricing for user feedback in real-time.

## Database Schema

- `User`: `id`, `email`, `password` (hashed), `role` (ADMIN or SELLER).
- `Product`: `id`, `name`, `sku`, `baseUnit` (Enum: G, KG, ML, L, COUNT), `pricePerBaseUnit` (Decimal), `inventoryQuantity` (Decimal).
- `Order`: `id`, `userId`, `status`, `totalAmount` (Decimal).
- `OrderItem`: `id`, `orderId`, `productId`, `quantityOrdered` (Decimal), `unitUsed` (Enum), `calculatedPrice` (Decimal).

## Unit Storage and Conversion Strategy

To avoid precision loss and complex normalizations during queries, the system uses a **Base Unit Strategy**:

1. **Internal Storage:** 
   - Weight is always stored internally as **Grams (G)**.
   - Volume is always stored internally as **Milliliters (ML)**.
   - Count is stored as **COUNT**.
2. **Pricing Storage:**
   - Rates are stored as the price per `1 base unit`. For example, if a product is 500 INR per Kg, it is stored as `0.5000` INR per Gram.
3. **Data Types:** 
   - `DECIMAL(16, 4)` is used in PostgreSQL for both quantity and pricing to prevent floating-point inaccuracies while supporting very large orders or fractional amounts.
4. **Conversion Application:**
   - Conversions are applied *before saving* and *before displaying*. For example, when an Admin inputs "5 Kg", the backend multiplies by 1000 and saves `5000 G`. When a Seller orders "500 L", the calculated price multiplies the base rate by `500,000 mL`.

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   NEXTAUTH_SECRET="your-secret-key"
   ```
3. Apply database migrations:
   ```bash
   npx prisma db push
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Push your code to a GitHub repository.
2. Go to Vercel and import your repository.
3. In the Vercel project settings, add the Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `NEXTAUTH_SECRET`: A random string for securing NextAuth sessions.
4. Click Deploy. Vercel will automatically detect Next.js and build the application.

## Test Credentials

- **Admin Account:** `admin@example.com` / Password: `admin123`
- **Seller Account:** `seller@example.com` / Password: `seller123`
