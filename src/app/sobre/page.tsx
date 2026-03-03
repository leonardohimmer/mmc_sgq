export const metadata = {
    title: "O Laboratório | MMC LAB",
    description: "Conheça a missão, visão e valores do nosso laboratório.",
};

import { SiteHeader } from "@/components/SiteHeader";
import { BackButton } from "@/components/BackButton";

export default function SobrePage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen font-sans pb-24 transition-colors duration-300">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16">
                <div className="text-center md:text-left mb-16 md:mb-24 relative flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="absolute left-0 top-0 hidden md:block">
                        <BackButton />
                    </div>
                    <div className="md:ml-16 max-w-4xl mx-auto md:mx-0 w-full flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="md:hidden w-full flex justify-start mb-6">
                            <BackButton />
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 backdrop-blur-sm shadow-sm transition-all hover:bg-primary/15 hover:border-primary/30">
                            <span className="material-symbols-outlined text-[18px]">business</span>
                            Nossa História
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-slate-100 leading-[1.1]">
                            O <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Laboratório</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl font-medium leading-[1.6]">
                            Nossa base é a excelência técnica. Conheça os pilares que guiam nossos ensaios e certificações, estabelecendo a confiança de nossos clientes e parceiros.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
                    {/* Missão */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-2xl hover:border-primary/30 dark:hover:border-primary/50 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">track_changes</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Missão</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Realizar ensaios com excelência técnica, assegurando resultados confiáveis e atendimento às normas aplicáveis.
                        </p>
                    </div>

                    {/* Visão */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-2xl hover:border-secondary/50 dark:hover:border-secondary/50 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">visibility</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Visão</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Ser referência em ensaios laboratoriais acreditados, reconhecido pela qualidade e credibilidade.
                        </p>
                    </div>

                    {/* Valores */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-2xl hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">security</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Valores</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Imparcialidade, competência, ética, confiabilidade e melhoria contínua.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
