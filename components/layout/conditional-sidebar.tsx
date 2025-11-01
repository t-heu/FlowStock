// components/layout/conditional-sidebar.tsx
'use client'

import { Sidebar } from "@/components/layout/sidebar"
import { usePathname } from "next/navigation"

export function ConditionalSidebar() {
  const pathname = usePathname()

  if (pathname === "/login") return null
  return <Sidebar />
}
