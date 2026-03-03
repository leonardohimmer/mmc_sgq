export const metadata = {
    title: "Escopo e Ensaios | MMC LAB",
    description: "Nossos ensaios e certificações por pessoal competente e equipamentos rastreados metrologicamente.",
};

import { SiteHeader } from "@/components/SiteHeader";
import { BackButton } from "@/components/BackButton";

export default function EscopoEnsaiosPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen font-sans pb-24 transition-colors duration-300">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 pt-16">
                <div className="mb-8">
                    <BackButton />
                </div>
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    <div className="md:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900 dark:text-slate-100">
                            Escopo Acreditado e <br />
                            <span className="text-primary">
                                Realização de Ensaios
                            </span>
                        </h1>

                        <div className="space-y-6 text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-l-2 border-primary/50 pl-6">
                            <p>
                                Este laboratório executa ensaios conforme métodos normalizados e procedimentos validados, dentro do escopo de acreditação vigente.
                            </p>
                            <p>
                                Todos os ensaios são realizados por pessoal competente, utilizando equipamentos calibrados e rastreados metrologicamente.
                            </p>
                        </div>
                    </div>

                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1 transition-all aspect-square group">
                            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">science</span>
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">Métodos Normalizados</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1 transition-all aspect-square group">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">Procedimentos Validados</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:border-secondary/50 dark:hover:border-secondary/50 hover:-translate-y-1 transition-all aspect-square col-span-2 group">
                            <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">precision_manufacturing</span>
                            </div>
                            <span className="font-extrabold text-xl mb-2 text-slate-900 dark:text-slate-100">Rastreabilidade Metrológica</span>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Garantia absoluta de pessoal competente e equipamentos rigorosamente calibrados para fins Inmetro.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
