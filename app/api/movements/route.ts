import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export async function GET() {
  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  // garante que exista o array de movimentos
  const movements = Array.isArray(data.movements) ? data.movements : [];
  return NextResponse.json(movements);
}

export async function POST(request: Request) {
  const newMovement = await request.json();

  const fileData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  // garante que exista o array de movimentos
  if (!Array.isArray(data.movements)) data.movements = [];

  const movementToAdd = {
    ...newMovement,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  data.movements.push(movementToAdd);

  // salva mantendo products e branches intactos
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json(movementToAdd);
}
