export interface User {
  id: string
  username: string
  name: string
  role: string
}

export const login = async (username: string, password: string): Promise<User | null> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  return data.ok ? data.user : null
}

export const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST" }) // opcional criar rota pra limpar cookie
  location.href = "/login"
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await fetch("/api/auth/profile", { method: "GET" })
    const data = await res.json()
    return data.ok ? data.user : null
  } catch {
    return null
  }
}
