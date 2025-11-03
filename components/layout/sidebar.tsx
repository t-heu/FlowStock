// components/layout/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  BarChart3,
  LogOut,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  Warehouse
} from "lucide-react"
import { useState, useEffect } from "react"

import { logout, getCurrentUser } from "@/lib/auth"
import { can } from "@/lib/permissions"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Produtos", href: "/produtos", icon: Package },
  { title: "Entrada de Estoque", href: "/entrada", icon: TrendingUp },
  { title: "Saída de Estoque", href: "/saida", icon: TrendingDown },
  { title: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { title: "Estoque das Filias", href: "/filiais", icon: Warehouse },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; username: string; role: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      setUser(u)
    }
    load()
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      {/* Botão hambúrguer para mobile */}
      <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-black">FlowStock</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen flex flex-col`}
      >
        {/* Header Desktop */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 hidden md:block">
          <h1 className="text-xl font-bold text-black">FlowStock</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sistema de Estoque</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            )
          })}

          {user && can(user.role, "manageBranches") && (
            <Link
              href="/branches"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                pathname === "/branches"
                  ? "bg-black text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <MapPin className="w-5 h-5" />
              Filiais
            </Link>
          )}

          {user && can(user.role, "viewUsers") && (
            <Link
              href="/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                pathname === "/users"
                  ? "bg-black text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Users className="w-5 h-5" />
              Usuários
            </Link>
          )}
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-100 dark:bg-slate-700">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name} ({user.role})</p>
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
    </>
  )
}
