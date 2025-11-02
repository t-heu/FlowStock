import { fetchResilient } from "@/lib/fetchResilient";

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  password?: string
  branchId: string
  createdAt: string
}

// 🔹 GET — lista todos os usuários
export const getUsers = async () => {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`)
}

// 🔹 POST — cria novo usuário
export const saveUser = async (user: Omit<User, "id" | "createdAt" | "branch">): Promise<void> => {
  await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id: string) => {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
}
