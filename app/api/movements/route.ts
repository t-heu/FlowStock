import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET — lista movimentos
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get("type"); // entrada | saida | null

    // 1️⃣ Buscar movimentos
    let snapshot = await adminDb.collection("movements").orderBy("createdAt", "desc").get();
    let movements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // 2️⃣ Filtrar por type, se informado
    if (typeFilter) {
      movements = movements.filter((m: any) => m.type === typeFilter);
    }

    // 3️⃣ IDs únicos de produtos e filiais
    const productIds = [...new Set(movements.map((m: any) => m.productId))];
    const branchIds = [...new Set(movements.map((m: any) => m.branchId))];

    // 4️⃣ Buscar produtos e filiais de uma vez
    const [productsSnap, branchesSnap] = await Promise.all([
      adminDb.collection("products").get(),
      adminDb.collection("branches").get(),
    ]);

    // 5️⃣ Criar lookup pelo campo `id` dentro do documento
    const products: any = {};
    productsSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (data && productIds.includes(data.id)) products[data.id] = data;
    });

    const branches: Record<string, any> = {};
    branchesSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (data && branchIds.includes(data.id)) branches[data.id] = data;
    });

    // 6️⃣ Enriquecer movimentos
    const enriched = movements.map((m: any) => ({
      ...m,
      product: products[m.productId] || null,
      branch: branches[m.branchId] || null,
    }));
    //console.log(enriched)

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Erro ao buscar movimentos:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar movimentos" }, { status: 500 });
  }
}

// POST — cria movimento e atualiza estoque
export async function POST(request: Request) {
  try {
    const newMovement = await request.json();

    // 🔹 Preparar movimento
    const movementToAdd = {
      ...newMovement,
      createdAt: new Date().toISOString(),
    };

    // 🔹 Atualiza estoque da filial (branchStock)
    if (newMovement.productId && newMovement.branchId) {
      const stockRef = adminDb.collection("branchStock");
      const stockSnap = await stockRef
        .where("productId", "==", newMovement.productId)
        .where("branchId", "==", newMovement.branchId)
        .get();

      let updatedQty = 0;
      
      if (!stockSnap.empty) {
        const stockDoc = stockSnap.docs[0];
        const data = stockDoc.data();
        const currentQty = data.quantity || 0;

        // 🚫 Bloquear saída se não tiver saldo suficiente
        if (newMovement.type === "saida" && currentQty < Number(newMovement.quantity)) {
          return NextResponse.json(
            { ok: false, error: `Estoque insuficiente na filial (disponível: ${currentQty})` },
            { status: 400 }
          );
        }

        // 🔄 Atualiza quantidade
        if (newMovement.type === "entrada") updatedQty = currentQty + Number(newMovement.quantity);
        else if (newMovement.type === "saida") updatedQty = currentQty - Number(newMovement.quantity);

        await stockDoc.ref.update({ quantity: Math.max(0, updatedQty) });
      } else {
        // 🚫 Impedir saída se filial não tem registro ainda
        if (newMovement.type === "saida") {
          return NextResponse.json(
            { ok: false, error: "Filial sem estoque desse produto" },
            { status: 400 }
          );
        }

        // Se for entrada, cria o registro
        await stockRef.add({
          productId: newMovement.productId,
          branchId: newMovement.branchId,
          quantity: Number(newMovement.quantity),
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 🔹 Salva o movimento
    const docRef = await adminDb.collection("movements").add(movementToAdd);

    return NextResponse.json({ id: docRef.id, ...movementToAdd });
  } catch (err) {
    console.error("Erro ao criar movimento:", err);
    return NextResponse.json({ ok: false, error: "Erro ao criar movimento" }, { status: 500 });
  }
}

// DELETE — remove movimento
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID é obrigatório" }, { status: 400 });

    await adminDb.collection("movements").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar movimento:", err);
    return NextResponse.json({ ok: false, error: "Erro ao deletar movimento" }, { status: 500 });
  }
}
