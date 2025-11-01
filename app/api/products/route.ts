import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// 🔹 GET — lista produtos
export async function GET() {
  const snapshot = await getDocs(collection(db, "products"))
  const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  return NextResponse.json(products)
}

// 🔹 POST — adiciona novo produto
export async function POST(request: Request) {
  const newProduct = await request.json()
  await addDoc(collection(db, "products"), {
    ...newProduct,
    createdAt: new Date().toISOString(),
  })
  return NextResponse.json({ ok: true })
}

// 🔹 DELETE — deleta produto
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteDoc(doc(db, "products", id))
  return NextResponse.json({ ok: true })
}

// PUT — atualiza produto
export async function PUT(request: Request) {
  const { id, updates } = await request.json();
  console.log(updates)

  if (!id || !updates) {
    return NextResponse.json({ ok: false, error: "id e updates são obrigatórios" }, { status: 400 });
  }

  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }
}
