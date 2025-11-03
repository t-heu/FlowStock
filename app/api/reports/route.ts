// app/api/reports/detailed/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Buscar todos os movimentos
    const movementsSnap = await adminDb.collection("movements").get();
    let movements = movementsSnap.docs.map((d) => d.data() as any);

    // Filtrar apenas saídas
    movements = movements.filter((m) => m.type === "saida");

    // Filtrar por filial, data inicial e final
    if (branchId !== "all") {
      movements = movements.filter((m) => m.branchId === branchId);
    }

    if (startDate) {
      const start = new Date(startDate);
      movements = movements.filter((m) => new Date(m.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      movements = movements.filter((m) => new Date(m.date) <= end);
    }

    // Mapear para relatório detalhado
    const report = movements.map((m) => ({
      date: m.date,
      branchName: m.branchName || "Desconhecida",
      destinationBranchName: m.destinationBranchName || "-",
      productCode: m.productCode || "-",
      productName: m.productName || "-",
      quantity: m.quantity,
      notes: m.notes || "-",
    }));

    // Ordenar por data mais recente
    report.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(report);
  } catch (err) {
    console.error("Erro ao gerar relatório detalhado:", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao gerar relatório detalhado" },
      { status: 500 }
    );
  }
}
