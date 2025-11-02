import { fetchResilient } from "@/lib/fetchResilient";

export interface StockMovement {
  id: string
  productId: string
  branchId: string
  type: "entrada" | "saida"
  quantity: number
  date: string
  notes?: string
  createdAt: string
  destinationBranchName?: string
  productName?: string
  productCode?: string
  branchName?: string
  invoiceNumber?: string
}

// 🔹 Buscar movimentos (opcionalmente filtrando por tipo)
export const getMovements = async (type?: "entrada" | "saida"): Promise<StockMovement[]> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/movements`;
    if (type) url += `?type=${type}`;

    const data: StockMovement[] = await fetchResilient(url);
    return data;
  } catch (err: any) {
    console.error("getMovements error:", err);
    return []; // fallback para array vazio em caso de erro
  }
};

// 🔹 Salvar movimento
export const saveMovement = async (
  movement: Omit<StockMovement, "id" | "createdAt">
): Promise<StockMovement> => {
  try {
    const newMovement: StockMovement = {
      ...movement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const savedMovement: StockMovement = await fetchResilient(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/movements`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovement),
      }
    );

    return savedMovement;
  } catch (error) {
    console.error("Falha ao salvar o movimento:", error);
    throw error; // re-lança para tratamento no nível superior
  }
};
