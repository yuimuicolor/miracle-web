import { ProductItem } from '../types/products';
import { getBaseUrl } from '../utils/common';

export const getAllProducts = async (): Promise<ProductItem[]> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });

  if (!res.ok) return [];
  return res.json();
};

export const getProductById = async (id: number): Promise<ProductItem | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });

  if (!res.ok) return null;

  const data = await res.json();

  return {
    ...data,
    image: data.image || null,
  };
};