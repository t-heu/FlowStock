import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET — lista movimentos
export async function GET() {
  try {
    const snapshot = await adminDb.collection("movements").get();
    const movements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(movements);
  } catch (err) {
    console.error("Erro ao buscar movimentos:", err);
    return NextResponse.json({ ok: false, error: "Erro ao buscar movimentos" }, { status: 500 });
  }
}

// POST — cria movimento e atualiza estoque
export async function POST(request: Request) {
  try {
    const newMovement = await request.json();
    const movementToAdd = { ...newMovement, createdAt: new Date().toISOString() };

    // 1️⃣ Salva o movimento
    const docRef = await adminDb.collection("movements").add(movementToAdd);

    // 2️⃣ Atualiza o estoque do produto
    if (newMovement.productId) {
      const productsRef = adminDb.collection("products");
      const querySnapshot = await productsRef
        .where("id", "==", newMovement.productId)
        .get();

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0];
        const productData = productDoc.data();
        const currentStock = productData.currentStock || 0;

        const newStock =
          newMovement.type === "entrada"
            ? currentStock + Number(newMovement.quantity)
            : currentStock - Number(newMovement.quantity);

        await productDoc.ref.update({ currentStock: Math.max(0, newStock) });
      } else {
        console.log("Produto não encontrado com o ID:", newMovement.productId);
      }
    }

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
