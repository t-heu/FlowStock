import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 🔹 Buscar dados
    const [productsSnap, branchesSnap, movementsSnap] = await Promise.all([
      adminDb.collection("products").get(),
      adminDb.collection("branches").get(),
      adminDb.collection("movements").get(),
    ]);

    const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const branches = branchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    let movements = movementsSnap.docs.map(d => d.data());

    // 🔹 Filtrar apenas saídas
    movements = movements.filter((m: any) => m.type === "saida");

    // 🔹 Filtrar por filial
    if (branchId !== "all") {
      movements = movements.filter((m: any) => m.branchId === branchId);
    }

    // 🔹 Filtrar por datas
    if (startDate) {
      const start = new Date(startDate);
      movements = movements.filter((m: any) => new Date(m.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      movements = movements.filter((m: any) => new Date(m.date) <= end);
    }

    // 🔹 Agrupar por filial e produto
    const movementMap: Record<string, Record<string, number>> = {}; // branchId -> productId -> totalSaida
    for (const m of movements) {
      if (!movementMap[m.branchId]) movementMap[m.branchId] = {};
      if (!movementMap[m.branchId][m.productId]) movementMap[m.branchId][m.productId] = 0;
      movementMap[m.branchId][m.productId] += m.quantity || 0;
    }

    // 🔹 Construir relatório
    const report = branches
      .filter((b) => branchId === "all" || b.id === branchId)
      .map((branch) => {
        const productExits = products
          .map((product) => ({
            product,
            totalExits: movementMap[branch.id]?.[product.id] || 0,
          }))
          .filter((p) => p.totalExits > 0)
          .sort((a, b) => b.totalExits - a.totalExits);

        const totalExits = productExits.reduce((sum, p) => sum + p.totalExits, 0);

        return { branch, products: productExits, totalExits };
      })
      .filter((r) => r.totalExits > 0);

    return NextResponse.json(report);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    return NextResponse.json({ ok: false, error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
