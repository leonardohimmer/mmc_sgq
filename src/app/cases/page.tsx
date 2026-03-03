import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function CasesPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900 border-b border-slate-800">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 text-indigo-400 font-bold text-sm mb-6 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">cases</span>
                            Casos de Sucesso
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                            Projetos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Cases Reais</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-10">
                            Veja na prática como a MMC Lab aplicou soluções de engenharia diagnóstica, acústica e testes estruturais de alta complexidade pelo Brasil.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col items-center text-center gap-8 py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -left-20 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[40px]"></div>

                            <div className="w-24 h-24 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mb-4 relative z-10 ring-1 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-float">
                                <span className="material-symbols-outlined text-[48px]">construction</span>
                            </div>

                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">Casos Sendo Mapeados</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed relative z-10">
                                Estamos reunindo os melhores estudos de caso — desde compatibilizações acústicas até laudos de ensaios complexos na Construção Civil. Em breve você poderá visualizá-los aqui de forma interativa.
                            </p>

                            <Link href="/" className="mt-4 px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-colors inline-flex items-center gap-2 relative z-10">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
