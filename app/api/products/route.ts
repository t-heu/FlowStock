import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// 🔹 GET — lista produtos
export async function GET() {
  try {
    const snapshot = await adminDb.collection("products").get();
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    
    return NextResponse.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// 🔹 POST — adiciona novo produto
export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    await adminDb.collection("products").add({
      ...newProduct,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    return NextResponse.json({ ok: false, error: "Erro ao adicionar produto" }, { status: 500 });
  }
}

// 🔹 DELETE — deleta produto
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID é obrigatório" }, { status: 400 });

    await adminDb.collection("products").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    return NextResponse.json({ ok: false, error: "Erro ao deletar produto" }, { status: 500 });
  }
}

// 🔹 PUT — atualiza produto
export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    if (!id || !updates)
      return NextResponse.json({ ok: false, error: "id e updates são obrigatórios" }, { status: 400 });

    await adminDb.collection("products").doc(id).update(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    return NextResponse.json({ ok: false, error: "Erro ao atualizar produto" }, { status: 500 });
  }
}
