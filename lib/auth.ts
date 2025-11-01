export interface User {
  id: string
  username: string
  name: string
}

// Usuário padrão para demonstração
const DEFAULT_USER = {
  username: "admin",
  password: "admin123",
  name: "Administrador",
}

export const login = (username: string, password: string): User | null => {
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    const user: User = {
      id: "1",
      username: DEFAULT_USER.username,
      name: DEFAULT_USER.name,
    }
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }
  return null
}

export const logout = (): void => {
  localStorage.removeItem("currentUser")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("currentUser")
  return data ? JSON.parse(data) : null
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}
