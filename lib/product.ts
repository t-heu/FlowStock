import { fetchResilient } from "@/lib/fetchResilient";

export interface Product {
  id: string
  code: string
  name: string
  description: string
  unit: string
  createdAt: string
}

export async function getProducts(): Promise<Product[]> {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
}

export async function saveProduct(product: Product) {
  await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
