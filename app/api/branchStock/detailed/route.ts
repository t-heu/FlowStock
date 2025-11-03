import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // Buscar coleções
    const [branchStockSnap, branchesSnap, productsSnap] = await Promise.all([
      adminDb.collection("branchStock").get(),
      adminDb.collection("branches").get(),
      adminDb.collection("products").get(),
    ]);

    const branchStock = branchStockSnap.docs.map((d) => d.data());
    const branches = branchesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Montar resposta enriquecida
    const detailedStock = branchStock.map((item: any) => {
      const branch: any = branches.find((b) => b.id === item.branchId);
      const product: any = products.find((p) => p.id === item.productId);

      return {
        branchId: item.branchId,
        branchName: branch?.name || "Desconhecida",
        productId: item.productId,
        productName: product?.name || "Sem nome",
        quantity: item.quantity || 0,
        createdAt: item.createdAt || null,
      };
    });

    return NextResponse.json(detailedStock);
  } catch (err) {
    console.error("Erro ao buscar branchStock detalhado:", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao buscar branchStock detalhado" },
      { status: 500 }
    );
  }
}
