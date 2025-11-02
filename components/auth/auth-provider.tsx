"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export interface User {
  id: string
  username: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const current = await getCurrentUser()
      setUser(current)
      setLoading(false)

      if (!current && pathname !== "/login") router.push("/login")
      else if (current && pathname === "/login") router.push("/")
    }

    fetchUser()
  }, [pathname])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
