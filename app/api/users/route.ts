import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs"; // para hashear senha

// 🔹 GET — lista todos os usuários
export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, password: undefined }; // não retorna senha
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// 🔹 POST — cria novo usuário
export async function POST(request: Request) {
  try {
    const { name, email, role, password, branchId } = await request.json();

    // hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      role,
      branchId,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("users").add(newUser);
    return NextResponse.json({ id: docRef.id, ...newUser, password: undefined });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return NextResponse.json({ ok: false, error: "Erro ao criar usuário" }, { status: 500 });
  }
}

// 🔹 PUT — atualiza usuário
export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    if (!id || !updates) return NextResponse.json({ ok: false, error: "id e updates obrigatórios" }, { status: 400 });

    const userRef = adminDb.collection("users").doc(id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return NextResponse.json({ ok: false, error: "Usuário não encontrado" }, { status: 404 });

    // Se for atualizar senha, hash antes
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await userRef.update(updates);
    const updatedUserSnap = await userRef.get();
    const updatedUser = updatedUserSnap.data();

    return NextResponse.json({ id: updatedUserSnap.id, ...updatedUser, password: undefined });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return NextResponse.json({ ok: false, error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// 🔹 DELETE — remove usuário
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID é obrigatório" }, { status: 400 });

    await adminDb.collection("users").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    return NextResponse.json({ ok: false, error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
