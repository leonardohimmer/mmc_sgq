export default function ClientesPage() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4 transition-colors duration-300">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px]">construction</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
                Página em Desenvolvimento
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors">
                Esta seção do sistema ainda está sendo construída e estará disponível em atualizações futuras.
            </p>
        </div>
    )
}
