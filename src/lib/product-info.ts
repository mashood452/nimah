/**
 * Shared product-info type and color labels. Product facts are stored in MySQL.
 */
export type ProductInfo = {
  tags: string[];
  description: string;
  features: string[];
};

const colorNames: Record<string, string> = {
  "#c9a96a": "Gold",
  "#2b2b2b": "Black",
  "#8a8f94": "Silver",
  "#6b3f26": "Tortoise",
  "#1f1a1b": "Black",
  "#d3a38d": "Rose gold",
  "#6e1f2f": "Burgundy",
  "#b5702f": "Amber",
  "#4a5d7a": "Navy",
};

export const colorName = (hex: string) => colorNames[hex.toLowerCase()] ?? "Classic";
