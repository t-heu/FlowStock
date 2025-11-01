"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout, getCurrentUser } from "@/lib/auth"
import { LayoutDashboard, Package, BarChart3, LogOut, TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Produtos", href: "/produtos", icon: Package },
  { title: "Entrada de Estoque", href: "/entrada", icon: TrendingUp },
  { title: "Saída de Estoque", href: "/saida", icon: TrendingDown },
  { title: "Relatórios", href: "/relatorios", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; username: string } | null>(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-black">Controle Estoque</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sistema de Materiais</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-100 dark:bg-slate-700">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      )}
    </aside>
  )
}
