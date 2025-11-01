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

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "PUT", // precisa implementar PUT no backend
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updates }),
  });
};

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
  };

  // Salva a movimentação via API
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovement),
  });

  // Atualiza estoque do produto
  const product = await getProducts().then(products => products.find(p => p.id === movement.productId));
  if (product) {
    const newStock = movement.type === "entrada" 
      ? product.currentStock + movement.quantity
      : product.currentStock - movement.quantity;
    
    await updateProduct(product.id, { currentStock: newStock });
  }

  return newMovement;
};

export const getMovementsByBranch = async (branchId: string): Promise<StockMovement[]> => {
  const movements = await getMovements();
  return movements.filter(m => m.branchId === branchId);
};

export const getMovementsByProduct = async (productId: string): Promise<StockMovement[]> => {
  const movements = await getMovements();
  return movements.filter(m => m.productId === productId);
};

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
/*
export const updateProduct = (id: string, updates: Partial<Product>): void => {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    localStorage.setItem("products", JSON.stringify(products))
  }
}

export const saveBranch = (branch: Omit<Branch, "id">): Branch => {
  const branches = getBranches()
  const newBranch: Branch = {
    ...branch,
    id: crypto.randomUUID(),
  }
  branches.push(newBranch)
  localStorage.setItem("branches", JSON.stringify(branches))
  return newBranch
}

// Funções para gerenciar movimentações
export const getMovements = (): StockMovement[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("movements")
  return data ? JSON.parse(data) : []
}

export const saveMovement = (movement: Omit<StockMovement, "id">): StockMovement => {
  const movements = getMovements()
  const newMovement: StockMovement = {
    ...movement,
    id: crypto.randomUUID(),
  }
  movements.push(newMovement)
  localStorage.setItem("movements", JSON.stringify(movements))

  // Atualizar estoque do produto
  const products = getProducts()
  const product = products.find((p) => p.id === movement.productId)
  if (product) {
    if (movement.type === "entrada") {
      product.currentStock += movement.quantity
    } else {
      product.currentStock -= movement.quantity
    }
    updateProduct(product.id, { currentStock: product.currentStock })
  }

  return newMovement
}

export const getMovementsByBranch = (branchId: string): StockMovement[] => {
  return getMovements().filter((m) => m.branchId === branchId)
}

export const getMovementsByProduct = (productId: string): StockMovement[] => {
  return getMovements().filter((m) => m.productId === productId)
}*/