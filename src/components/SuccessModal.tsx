"use client"

import { useEffect, useState } from "react"

interface SuccessModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string | React.ReactNode
    message?: string | React.ReactNode
    buttonText?: string
    type?: 'success' | 'error' | 'info'
    autoClose?: boolean
    duration?: number
}

export default function SuccessModal({
    isOpen,
    onClose,
    title = "Solicitação enviada com sucesso!",
    message = "Entraremos em contato em breve.",
    buttonText = "Entendi",
    type = 'success',
    autoClose = false,
    duration = 3000
}: SuccessModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, autoClose, duration, onClose])

    if (!mounted || !isOpen) return null

    const typeConfig = {
        success: {
            icon: 'check_circle',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
            button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/40'
        },
        error: {
            icon: 'error',
            iconColor: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-100 dark:bg-rose-500/20',
            button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20 hover:shadow-rose-500/40'
        },
        info: {
            icon: 'info',
            iconColor: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-500/20',
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:shadow-blue-500/40'
        }
    }

    const currentType = typeConfig[type]

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
                    <div className={`w-20 h-20 ${currentType.iconBg} rounded-full flex items-center justify-center mb-2 animate-bounce-short`}>
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

                    {!autoClose && (
                        <button 
                            onClick={onClose}
                            className={`w-full mt-4 py-4 text-white rounded-2xl font-bold transition-all shadow-lg ${currentType.button} hover:-translate-y-0.5 active:translate-y-0`}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
