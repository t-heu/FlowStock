import { NextResponse } from "next/server"
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// GET — lista movimentos
export async function GET() {
  const snapshot = await getDocs(collection(db, "movements"))
  const movements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  return NextResponse.json(movements)
}

// POST — cria movimento e atualiza estoque
export async function POST(request: Request) {
  const newMovement = await request.json()
  const movementToAdd = { ...newMovement, createdAt: new Date().toISOString() }

  // 1️⃣ Salva o movimento
  const docRef = await addDoc(collection(db, "movements"), movementToAdd)

  // 2️⃣ Atualiza o estoque do produto
  if (newMovement.productId) {
    // 🔹 Faz uma query pelo campo 'id' interno do documento
    const q = query(
      collection(db, "products"),
      where("id", "==", newMovement.productId)
    )

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Pega o primeiro documento encontrado
      const productDoc = querySnapshot.docs[0]
      const currentStock = productDoc.data().currentStock || 0

      const newStock =
        newMovement.type === "entrada"
          ? currentStock + Number(newMovement.quantity)
          : currentStock - Number(newMovement.quantity)

      // Atualiza o estoque
      await updateDoc(productDoc.ref, { currentStock: Math.max(0, newStock) })
    } else {
      console.log("Produto não encontrado com o ID:", newMovement.productId)
    }
  }

  return NextResponse.json({ id: docRef.id, ...movementToAdd })
}

// DELETE — remove movimento
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteDoc(doc(db, "movements", id))
  return NextResponse.json({ ok: true })
}
