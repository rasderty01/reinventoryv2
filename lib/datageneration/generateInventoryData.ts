import { v4 as uuidv4 } from "uuid";

// Define the itemStatus type
export type ItemStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string; // Using string for ID to match Convex's ID type
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  quantity: number;
  status: ItemStatus;
  categoryId: string; // Using string for ID to match Convex's ID type
  orgId: string;
  createdBy: string; // Using string for ID to match Convex's ID type
  updatedBy: string; // Using string for ID to match Convex's ID type
  deletedAt?: string;
  imageUrl?: string;
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Toys & Games",
  "Books",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Automotive",
  "Grocery",
  "Pet Supplies",
];

const adjectives = [
  "Premium",
  "Deluxe",
  "Essential",
  "Eco-friendly",
  "Innovative",
  "Compact",
  "Durable",
  "Versatile",
  "Portable",
  "Smart",
];

const nouns = [
  "Gadget",
  "Tool",
  "Device",
  "Accessory",
  "Kit",
  "System",
  "Solution",
  "Pack",
  "Set",
  "Bundle",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSKU(): string {
  return `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateBarcode(): string {
  return Math.random() < 0.8
    ? Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, "0")
    : "";
}

function generateInventoryItem(orgId: string): InventoryItem {
  const category = getRandomElement(categories);
  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);
  const name = `${adjective} ${category} ${noun}`;

  const price = parseFloat((Math.random() * 200 + 10).toFixed(2));
  const cost = parseFloat((price * (0.4 + Math.random() * 0.3)).toFixed(2));
  const quantity = Math.floor(Math.random() * 1000);

  let status: ItemStatus;
  if (quantity === 0) {
    status = "out_of_stock";
  } else if (quantity < 10) {
    status = "low_stock";
  } else {
    status = "in_stock";
  }

  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
  );
  const updatedAt = new Date(
    createdAt.getTime() +
      Math.floor(Math.random() * (Date.now() - createdAt.getTime()))
  );

  return {
    id: uuidv4(),
    name,
    description:
      Math.random() < 0.8
        ? `A ${adjective.toLowerCase()} ${noun.toLowerCase()} for ${category.toLowerCase()}.`
        : undefined,
    sku: generateSKU(),
    barcode: generateBarcode(),
    price,
    cost,
    quantity,
    status,
    categoryId: uuidv4(), // Generating a random ID for category
    orgId,
    createdBy: uuidv4(), // Generating a random user ID
    updatedBy: uuidv4(), // Generating a random user ID
    deletedAt: Math.random() < 0.05 ? new Date().toISOString() : undefined, // 5% chance of being deleted
    imageUrl:
      Math.random() < 0.7
        ? `/placeholder.svg?text=${encodeURIComponent(name)}`
        : undefined,
  };
}

export function generateInventoryData(
  count: number = 200,
  orgId: string = uuidv4()
): InventoryItem[] {
  return Array.from({ length: count }, () => generateInventoryItem(orgId));
}

// Example usage:
// const inventoryData = generateInventoryData();
// console.log(inventoryData);
