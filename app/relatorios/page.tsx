"use client"

import { useEffect, useState } from "react"
import { getProducts, getBranches, getMovements, type Product, type Branch } from "@/lib/storage"
import { Download, Filter } from "lucide-react"

interface ReportData {
  branch: Branch
  products: {
    product: Product
    totalExits: number
  }[]
  totalExits: number
}

export default function RelatoriosPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    async function loadData() {
      setBranches(await getBranches())
      generateReport()
    }
    
    loadData()
  }, [])

  const generateReport = async () => {
    const products = await getProducts()
    const branchesData = await getBranches()
    let movements = await getMovements();
    movements.filter((m) => m.type === "saida")

    // Filtrar por data
    if (startDate) {
      movements = movements.filter((m) => new Date(m.date) >= new Date(startDate))
    }
    if (endDate) {
      movements = movements.filter((m) => new Date(m.date) <= new Date(endDate))
    }

    // Filtrar por filial
    if (selectedBranch !== "all") {
      movements = movements.filter((m) => m.branchId === selectedBranch)
    }

    const branchesToProcess =
      selectedBranch === "all" ? branchesData : branchesData.filter((b) => b.id === selectedBranch)

    const report: ReportData[] = branchesToProcess.map((branch) => {
      const branchMovements = movements.filter((m) => m.branchId === branch.id)

      const productExits = products
        .map((product) => {
          const productMovements = branchMovements.filter((m) => m.productId === product.id)
          const totalExits = productMovements.reduce((sum, m) => sum + m.quantity, 0)
          return { product, totalExits }
        })
        .filter((item) => item.totalExits > 0)
        .sort((a, b) => b.totalExits - a.totalExits)

      const totalExits = productExits.reduce((sum, item) => sum + item.totalExits, 0)

      return {
        branch,
        products: productExits,
        totalExits,
      }
    })

    setReportData(report.filter((r) => r.totalExits > 0))
  }

  const handleFilter = () => {
    generateReport()
  }

  const handleExport = () => {
    let csv = "Filial,Código Produto,Nome Produto,Quantidade Saída\n"

    reportData.forEach((branchData) => {
      branchData.products.forEach((item) => {
        csv += `${branchData.branch.name},${item.product.code},${item.product.name},${item.totalExits}\n`
      })
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-saidas-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize a quantidade de saídas por filial</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-black dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filial</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">Todas as Filiais</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">&nbsp;</label>
            <button
              onClick={handleFilter}
              className="w-full px-4 py-2 bg-black hover:bg-[#333] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {reportData.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>
      )}

      {reportData.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Nenhuma saída encontrada para os filtros selecionados
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reportData.map((branchData) => (
            <div
              key={branchData.branch.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{branchData.branch.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{branchData.branch.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Saídas</p>
                    <p className="text-2xl font-bold text-black dark:text-blue-400">{branchData.totalExits}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">Código</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">Produto</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">Unidade</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-900 dark:text-white">Qtd Saída</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchData.products.map((item) => (
                      <tr
                        key={item.product.id}
                        className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{item.product.code}</td>
                        <td className="p-4 text-sm text-gray-900 dark:text-white">{item.product.name}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.product.unit}</td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {item.totalExits}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
