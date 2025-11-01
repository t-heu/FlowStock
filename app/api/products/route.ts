import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export async function GET() {
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);
  const products = Array.isArray(data.products) ? data.products : [];
  return NextResponse.json(products);
}

// POST - adicionar produto
export async function POST(request: Request) {
  const newProduct = await request.json();

  // lê todo o JSON
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  // garante que exista o array de produtos
  if (!Array.isArray(data.products)) data.products = [];

  const productToAdd = {
    ...newProduct,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // adiciona o novo produto
  data.products.push(productToAdd);

  // salva TODO o JSON de volta, mantendo branches e outras coisas
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json(productToAdd);
}

export async function PUT(request: Request) {
  const { id, updates } = await request.json();

  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  // garante que o array de produtos existe
  if (!Array.isArray(data.products)) data.products = [];
  const products = data.products;

  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ ok: false, message: "Produto não encontrado" }, { status: 404 });
  }

  // atualiza apenas o produto específico
  products[index] = { ...products[index], ...updates };

  // salva TODO o JSON de volta, mantendo branches e outros arrays intactos
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ ok: true, product: products[index] });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);
  const products = Array.isArray(data.products) ? data.products : [];

  const filtered = products.filter((p: any) => p.id !== id);

  fs.writeFileSync(filePath, JSON.stringify({ products: filtered }, null, 2));
  return NextResponse.json({ ok: true });
}
