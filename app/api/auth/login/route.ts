import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Buscar usuário pelo email
    const usersSnap = await adminDb.collection("users").where("username", "==", username).get();
    if (usersSnap.empty) {
      return NextResponse.json({ ok: false, error: "Usuário ou senha inválidos" }, { status: 401 });
    }

    const userDoc = usersSnap.docs[0];
    const userData = userDoc.data();

    // Comparar senha
    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Usuário ou senha inválidos" }, { status: 401 });
    }

    // Retornar dados do usuário (sem senha)
    const user = {
      id: userDoc.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      branchId: userData.branchId,
    };

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ ok: false, error: "Erro ao fazer login" }, { status: 500 });
  }
}
