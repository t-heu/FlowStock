'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ToastActionElement = React.ReactNode

export interface ToastProps {
  open?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  onOpenChange?: (open: boolean) => void
}

export function Toast({
  open = true,
  title,
  description,
  action,
  onOpenChange,
}: ToastProps) {
  const [visible, setVisible] = React.useState(open)

  React.useEffect(() => {
    setVisible(open)
  }, [open])

  const handleClose = () => {
    setVisible(false)
    onOpenChange?.(false)
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 min-w-[250px] max-w-sm rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          {title && (
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
          )}
          {description && (
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              {description}
            </p>
          )}
        </div>
        {action ? (
          <div className="flex-shrink-0">{action}</div>
        ) : (
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
