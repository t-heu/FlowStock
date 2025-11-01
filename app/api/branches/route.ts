import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export async function GET() {
  const fileData  = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileData);

  return NextResponse.json(data.branches);
}

export async function POST(request: Request) {
  const newProduct = await request.json();
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data = data.filter((p: any) => p.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}