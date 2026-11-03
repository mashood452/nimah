"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "../products/products-data";

const ProductCatalog = createContext<Product[] | null>(null);

export function ProductCatalogProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  return <ProductCatalog.Provider value={products}>{children}</ProductCatalog.Provider>;
}

export function useProducts() {
  const products = useContext(ProductCatalog);
  if (!products) throw new Error("ProductCatalogProvider is required.");
  return products;
}
