import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ ok: false, message: "Token ausente" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ ok: true, user: decoded });
  } catch {
    return NextResponse.json({ ok: false, message: "Token inválido" }, { status: 401 });
  }
}
