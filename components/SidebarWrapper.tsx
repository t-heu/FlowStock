"use client"
import { useAuth } from "@/components/auth/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"

export function SidebarWrapper() {
  const { user, loading } = useAuth()
  if (loading || !user) return null
  return <Sidebar />
}
