"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder to avoid CLS
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shadow-sm flex items-center justify-center"
            aria-label="Alternar tema"
        >
            {resolvedTheme === "dark" ? (
                <span className="material-symbols-outlined text-[20px]">light_mode</span>
            ) : (
                <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            )}
        </button>
    )
}
