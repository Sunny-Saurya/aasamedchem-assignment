import { Decimal } from "@prisma/client/runtime/library";

export type Dimension = "WEIGHT" | "VOLUME" | "COUNT";

export const UnitDimensions: Record<string, Dimension> = {
  G: "WEIGHT",
  KG: "WEIGHT",
  ML: "VOLUME",
  L: "VOLUME",
  COUNT: "COUNT",
};

export const UnitLabels: Record<string, string> = {
  G: "Grams (g)",
  KG: "Kilograms (kg)",
  ML: "Milliliters (mL)",
  L: "Liters (L)",
  COUNT: "Items (count)",
};

// Base units for each dimension
// WEIGHT -> G
// VOLUME -> ML
// COUNT -> COUNT

// Multipliers to convert FROM the given unit TO the base unit.
// e.g., 1 KG = 1000 G. So multiplier for KG is 1000.
export const ConversionMultipliers: Record<string, number> = {
  G: 1,
  KG: 1000,
  ML: 1,
  L: 1000,
  COUNT: 1,
};

/**
 * Convert a quantity from any unit to its dimension's base unit.
 * @param quantity The amount in `fromUnit`
 * @param fromUnit The unit of the provided quantity
 * @returns The quantity in the base unit
 */
export function convertToBase(quantity: number, fromUnit: string): number {
  const multiplier = ConversionMultipliers[fromUnit];
  if (!multiplier) throw new Error(`Unknown unit: ${fromUnit}`);
  return quantity * multiplier;
}

/**
 * Convert a quantity from the base unit to a target unit.
 * @param quantityInBase The amount in the base unit
 * @param toUnit The target unit
 * @returns The quantity in the target unit
 */
export function convertFromBase(quantityInBase: number, toUnit: string): number {
  const multiplier = ConversionMultipliers[toUnit];
  if (!multiplier) throw new Error(`Unknown unit: ${toUnit}`);
  return quantityInBase / multiplier;
}

/**
 * Calculate the total price for an ordered quantity in a specific unit.
 * @param orderedQuantity The amount ordered
 * @param orderUnit The unit of the ordered amount
 * @param pricePerBaseUnit The price per 1 base unit
 * @returns Total calculated price
 */
export function calculateTotalPrice(
  orderedQuantity: number,
  orderUnit: string,
  pricePerBaseUnit: number
): number {
  const quantityInBase = convertToBase(orderedQuantity, orderUnit);
  return quantityInBase * pricePerBaseUnit;
}

/**
 * Returns compatible units for a given base unit (dimension).
 */
export function getCompatibleUnits(baseUnit: string): string[] {
  const dimension = UnitDimensions[baseUnit];
  return Object.keys(UnitDimensions).filter((unit) => UnitDimensions[unit] === dimension);
}
