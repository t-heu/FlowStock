import { NextResponse } from "next/server"
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import bcrypt from "bcryptjs" // para hashear senha

// 🔹 GET — lista todos os usuários
export async function GET() {
  const snapshot = await getDocs(collection(db, "users"))
  const users = snapshot.docs.map(d => ({ id: d.id, ...d.data(), password: undefined }))
  return NextResponse.json(users)
}

// 🔹 POST — cria novo usuário
export async function POST(request: Request) {
  const { name, email, role, password, branchId } = await request.json()

  // hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    name,
    email,
    role,
    branchId,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  }

  const docRef = await addDoc(collection(db, "users"), newUser)
  return NextResponse.json({ id: docRef.id, ...newUser, password: undefined }) // não retorna senha
}

// 🔹 PUT — atualiza usuário
export async function PUT(request: Request) {
  const { id, updates } = await request.json()
  const userRef = doc(db, "users", id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

  // Se for atualizar senha, hash antes
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10)
  }

  await updateDoc(userRef, updates)
  const updatedUser = await getDoc(userRef)
  return NextResponse.json({ id: updatedUser.id, ...updatedUser.data(), password: undefined })
}

// 🔹 DELETE — remove usuário
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await deleteDoc(doc(db, "users", id))
  return NextResponse.json({ ok: true })
}
