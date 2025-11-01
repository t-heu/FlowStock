"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/login" && !isAuthenticated()) {
      router.push("/login")
    } else if (pathname === "/login" && isAuthenticated()) {
      router.push("/")
    }
  }, [pathname, router])

  return <>{children}</>
}
