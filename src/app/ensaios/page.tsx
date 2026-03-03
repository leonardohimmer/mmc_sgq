import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function EnsaiosPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900 border-b border-slate-800">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>

                        {/* Grade de fundo estilo cyber */}
                        <div className="absolute inset-0 opacity-[0.05]" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 text-primary font-bold text-sm mb-6 border border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.3)] hover:shadow-[0_0_25px_rgba(77,182,172,0.6)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">science</span>
                            Serviços Laboratoriais
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                            Ensaios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Desempenho</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-10">
                            Avaliações rigorosas estruturais e acústicas, garantindo conformidade com as normas ABNT NBR 15575.
                        </p>
                    </div>
                </section>

                {/* Conteúdo: Lista de Ensaios */}
                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Card 1 */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(77,182,172,0.15)] dark:hover:shadow-[0_0_30px_rgba(77,182,172,0.1)] hover:-translate-y-2 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 ring-1 ring-primary/20 group-hover:ring-primary/50 shadow-[0_0_15px_rgba(77,182,172,0.2)]">
                                    <span className="material-symbols-outlined text-[32px]">fence</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Ensaio de Guarda-corpo</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                                    Teste realizado para avaliar a resistência e a segurança de um guarda-corpo ou corrimão de uma estrutura, simulando impactos e cargas.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-secondary/50 dark:hover:border-secondary/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(193,181,152,0.2)] dark:hover:shadow-[0_0_30px_rgba(193,181,152,0.1)] hover:-translate-y-2 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 ring-1 ring-secondary/20 group-hover:ring-secondary/50 shadow-[0_0_15px_rgba(193,181,152,0.2)]">
                                    <span className="material-symbols-outlined text-[32px]">architecture</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Resistência à Tração</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                                    Procedimento que afere a força necessária para extrair corpos de prova de superfícies coladas (aderência), validando revestimentos cerâmicos e rebocos.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-2 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <span className="material-symbols-outlined text-[32px]">headphones</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Isolamento Acústico (Rw)</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                                    Testes laboratoriais utilizando câmaras reverberantes para determinar a perda de transmissão sonora e audição da ISO 10140.
                                </p>
                            </div>

                        </div>

                        <div className="mt-16 text-center">
                            <Link href="/contato" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all shadow-md hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] text-lg hover:-translate-y-1">
                                <span className="material-symbols-outlined">description</span>
                                Solicitar Orçamento para Ensaios
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
