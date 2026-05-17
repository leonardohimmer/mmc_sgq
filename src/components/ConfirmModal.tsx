"use client"

import { useEffect, useState } from "react"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string | React.ReactNode
    message?: string | React.ReactNode
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'primary' | 'warning'
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Você tem certeza?",
    message = "Esta ação não poderá ser desfeita.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = 'primary'
}: ConfirmModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !isOpen) return null

    const typeClasses = {
        primary: {
            icon: 'help',
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-500/20',
            button: 'bg-primary hover:bg-primary-hover shadow-primary/20 hover:shadow-primary/40'
        },
        danger: {
            icon: 'warning',
            iconColor: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-100 dark:bg-rose-500/20',
            button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20 hover:shadow-rose-500/40'
        },
        warning: {
            icon: 'report_problem',
            iconColor: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-100 dark:bg-amber-500/20',
            button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 hover:shadow-amber-500/40'
        }
    }

    const currentType = typeClasses[type]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-110"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-20 h-20 ${currentType.iconBg} rounded-full flex items-center justify-center mb-2`}>
                        <span className={`material-symbols-outlined text-4xl ${currentType.iconColor}`}>{currentType.icon}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                            {title}
                        </h3>
                        {message && (
                            <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-pre-wrap">
                                {message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button 
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg ${currentType.button} hover:-translate-y-0.5 active:translate-y-0`}
                        >
                            {confirmText}
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
