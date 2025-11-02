"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth" // getUser retorna info do usuário logado

interface AuthContextType {
  user: any | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authUser = isAuthenticated() ? getCurrentUser() : null
    setUser(authUser)
    setLoading(false)

    // redirecionamento
    if (!authUser && pathname !== "/login") {
      router.push("/login")
    } else if (authUser && pathname === "/login") {
      router.push("/")
    }
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext)
}
