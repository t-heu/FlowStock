import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const TOKEN_EXPIRES = "7d"; // expiração do token

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário no Firestore
    const usersSnap = await adminDb
      .collection("users")
      .where("username", "==", username)
      .get();

    if (usersSnap.empty) {
      return NextResponse.json(
        { ok: false, error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    const userDoc = usersSnap.docs[0];
    const userData = userDoc.data();

    // Comparar senha criptografada
    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    // Dados públicos do usuário
    const user = {
      id: userDoc.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      branchId: userData.branchId,
    };

    // Criar JWT com payload
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

    // Criar resposta e definir cookie HttpOnly
    const response = NextResponse.json({ ok: true, user });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
