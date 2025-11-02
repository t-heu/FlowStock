import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { SidebarWrapper } from "@/components/SidebarWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowStock",
  description: "Sistema de controle de materiais e estoque",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50`}
      >
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarWrapper />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
