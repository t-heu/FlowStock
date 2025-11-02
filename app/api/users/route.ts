import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs"; // para hashear senha

// 🔹 GET — lista todos os usuários
// 🔹 GET — lista todos os usuários com a filial vinculada
export async function GET() {
  try {
    // Buscar usuários
    const usersSnap = await adminDb.collection("users").get();
    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data(), password: undefined }));

    // Buscar filiais
    const branchesSnap = await adminDb.collection("branches").get();
    const branches = branchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Vincular filial ao usuário
    const usersWithBranch = users.map((user: any) => {
      const branch: any = branches.find(b => b.id === user.branchId);
      return {
        ...user,
        branch: branch ? { id: branch.id, name: branch.name, code: branch.code } : null
      };
    });

    return NextResponse.json(usersWithBranch);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// 🔹 POST — cria novo usuário
export async function POST(request: Request) {
  try {
    const { name, email, role, username, password, branchId } = await request.json();

    // hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      role,
      username,
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
