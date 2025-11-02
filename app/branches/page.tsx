"use client"

import { useEffect, useState } from "react"
import { getBranches, saveBranch } from "@/lib/branches"
import { Building2, PlusCircle } from "lucide-react"

interface Branch {
  id: string
  name: string
  code: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [formData, setFormData] = useState({ name: "", code: "" })

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    const data = await getBranches()
    setBranches(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) return alert("Preencha todos os campos")

    await saveBranch({
      name: formData.name,
      code: formData.code,
    })

    setFormData({ name: "", code: "" })
    await loadBranches()
    alert("Filial criada com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Filiais</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerencie as filiais da sua empresa</p>
      </div>

      {/* Formulário */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Filial</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Código"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Nome da Filial"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
            required
          />
          <button
            type="submit"
            className="col-span-2 px-6 py-2.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Adicionar Filial
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filiais Cadastradas</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">Código</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">Nome</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma filial cadastrada.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.id} className="border-b border-gray-200 dark:border-slate-700">
                  <td className="p-4 text-sm text-gray-900 dark:text-white">{b.code}</td>
                  <td className="p-4 text-sm text-gray-900 dark:text-white">{b.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
