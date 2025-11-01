export interface Product {
  id: string
  code: string
  name: string
  description: string
  unit: string
  currentStock: number
  createdAt: string
}

export interface Branch {
  id: string
  name: string
  code: string
}

export interface StockMovement {
  id: string
  productId: string
  branchId: string
  type: "entrada" | "saida"
  quantity: number
  date: string
  notes?: string
  createdAt: string
}

export const saveBranch = async (branch: Omit<Branch, "id">): Promise<Branch> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...branch, id: crypto.randomUUID() }),
  });

  const newBranch: Branch = await res.json();
  return newBranch;
};

export const getMovements = async (): Promise<StockMovement[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movements`);
  const data = await res.json();
  return data;
};

export const saveMovement = async (movement: Omit<StockMovement, "id" | "createdAt">): Promise<StockMovement> => {
  const newMovement: StockMovement = {
    ...movement,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovement),
  })

  const savedMovement = await res.json()
  return savedMovement
}

// --------------------
// branch
export async function getBranches(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`);
  const data = await res.json();
  return data
}

// produtos
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
  const data = await res.json();
  return data
}

export async function saveProduct(product: Product) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

// Tipagem do usuário
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
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`)
  const data = await res.json()
  return data
}

// 🔹 POST — cria novo usuário
export const saveUser = async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
  const data = await res.json()
  return data
}

// 🔹 PUT — atualiza usuário
export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updates })
  })
  const data = await res.json()
  return data
}

// 🔹 DELETE — remove usuário
export const deleteUser = async (id: string): Promise<void> => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
}