import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const productsSnap = await adminDb.collection("products").get();
    const branchesSnap = await adminDb.collection("branches").get();
    const movementsSnap = await adminDb.collection("movements").get();
    const branchStockSnap = await adminDb.collection("branchStock").get();

    const products = productsSnap.docs.map((d) => d.data());
    const movements = movementsSnap.docs.map((d) => d.data());

    const branchStock = branchStockSnap.docs.map((d) => d.data());
    const totalEntries = movements.filter((m: any) => m.type === "entrada").length;
    const totalExits = movements.filter((m: any) => m.type === "saida").length;
    const totalStock = branchStock.reduce((sum: number, item: any) => sum + item.quantity, 0);
    
    return NextResponse.json({
      totalProducts: products.length,
      totalStock,
      totalEntries,
      totalExits,
      totalBranches: branchesSnap.size,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
