import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const branchStockSnap = await adminDb.collection("branchStock").get();
    const branchStock = branchStockSnap.docs.map((doc) => doc.data());

    return NextResponse.json(branchStock);
  } catch (err) {
    console.error("Erro ao buscar branchStock:", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao buscar branchStock" },
      { status: 500 }
    );
  }
}
