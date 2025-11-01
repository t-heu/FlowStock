import { NextResponse } from "next/server"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// 🔹 GET — lista todas as filiais (branches)
export async function GET() {
  const snapshot = await getDocs(collection(db, "branches"))
  const branches = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  return NextResponse.json(branches)
}

// 🔹 POST — adiciona uma nova filial
export async function POST(request: Request) {
  const newBranch = await request.json()

  const branchToAdd = {
    ...newBranch,
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, "branches"), branchToAdd)

  return NextResponse.json({ id: docRef.id, ...branchToAdd })
}

// 🔹 DELETE — remove uma filial pelo id
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteDoc(doc(db, "branches", id))
  return NextResponse.json({ ok: true })
}
