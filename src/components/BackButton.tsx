"use client"

import { useRouter, usePathname } from "next/navigation"

export function BackButton() {
    const router = useRouter()
    const pathname = usePathname()

    // Ocultar o botão "Voltar" na página inicial do dashboard
    if (pathname === "/sgq" || pathname === "/login" || pathname === "/") {
        return null
    }

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 -ml-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-all text-sm group"
            aria-label="Voltar"
        >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            Voltar
        </button>
    )
}
