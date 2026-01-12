"use client"

import { useToast } from "../app/context/ToastContext"

export default function Toast() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-white text-sm font-medium animate-in fade-in slide-in-from-right-4 ${
            toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
