export interface User {
  id: string
  username: string
  name: string
  role: string
}

export const login = async (username: string, password: string) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.ok && data.user) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      return data.user;
    }

    return null;
  } catch (err) {
    console.error("Erro no login frontend:", err);
    return null;
  }
};

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
