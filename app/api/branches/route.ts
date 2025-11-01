import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// 🔹 GET — lista todas as filiais (branches)
export async function GET() {
  try {
    const snapshot = await adminDb.collection("branches").get();
    const branches = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(branches);
  } catch (err) {
    console.error("Erro ao buscar filiais:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar filiais" }, { status: 500 });
  }
}

// 🔹 POST — adiciona uma nova filial
export async function POST(request: Request) {
  try {
    const newBranch = await request.json();
    const branchToAdd = { ...newBranch, createdAt: new Date().toISOString() };

    const docRef = await adminDb.collection("branches").add(branchToAdd);
    return NextResponse.json({ id: docRef.id, ...branchToAdd });
  } catch (err) {
    console.error("Erro ao adicionar filial:", err);
    return NextResponse.json({ ok: false, error: "Erro ao adicionar filial" }, { status: 500 });
  }
}

// 🔹 DELETE — remove uma filial pelo id
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID é obrigatório" }, { status: 400 });

    await adminDb.collection("branches").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar filial:", err);
    return NextResponse.json({ ok: false, error: "Erro ao deletar filial" }, { status: 500 });
  }
}
