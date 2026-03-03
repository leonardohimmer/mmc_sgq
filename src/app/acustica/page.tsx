import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function AcusticaPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden bg-slate-900 border-b border-slate-800">
                    {/* Efeitos Modernos Neon / Movimento com ondas sonoras concept */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 md:w-[600px] h-80 md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-[400px] h-64 md:h-[400px] bg-teal-500/20 rounded-full blur-[60px] md:blur-[80px] mix-blend-screen animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 md:w-[200px] h-32 md:h-[200px] bg-emerald-400/30 rounded-full blur-[40px] md:blur-[60px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

                        {/* Linhas de grade sutis */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                            backgroundSize: '100px 100px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 text-emerald-400 font-semibold text-sm mb-6 md:mb-8 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                            Inteligência Acústica
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Consultoria e <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Projetos Acústicos</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-medium leading-[1.6] mb-10">
                            Entendemos o som para transformar ambientes. Da consultoria pontual ao mapa de ruído urbano, entregamos soluções precisas contra o desconforto sonoro.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                            {/* Consultoria Acústica */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 hover:border-emerald-500/50 transition-all duration-500 shadow-sm hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 relative overflow-hidden flex flex-col">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-colors duration-500"></div>

                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <span className="material-symbols-outlined text-[32px]">support_agent</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Consultoria Acústica</h3>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 mb-8 flex-1">
                                    Identificamos pontos críticos e entendemos a necessidade do seu projeto para garantir ambientes de trabalho, lazer ou moradia acusticamente saudáveis.
                                </p>
                                <div className="relative z-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Link href="/contato" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 transition-colors">
                                        Agendar Consultoria <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Projetos Acústicos */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 hover:border-teal-500/50 transition-all duration-500 shadow-sm hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] hover:-translate-y-2 relative overflow-hidden flex flex-col">
                                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[50px] group-hover:bg-teal-500/20 transition-colors duration-500"></div>

                                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ring-1 ring-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                    <span className="material-symbols-outlined text-[32px]">architecture</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Projetos Acústicos</h3>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 mb-8 flex-1">
                                    Desenvolvimento de soluções personalizadas desde a concepção (compatibilização) até a fase final da obra para mitigar ruídos aéreos e de impacto.
                                </p>
                                <div className="relative z-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Link href="/contato" className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:text-teal-500 transition-colors">
                                        Solicitar Projeto <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Mapa de Ruído (Ocupa 2 colunas no desktop) */}
                            <div className="md:col-span-2 group bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-10 md:p-14 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 mt-4">
                                {/* Efeito de grade/radar digital no backgorund */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                    backgroundImage: `radial-gradient(circle at center, rgba(6,182,212,0.8) 0, transparent 60%)`,
                                    backgroundSize: '100% 100%'
                                }}></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                                <div className="md:w-1/3 relative z-10 flex justify-center">
                                    <div className="w-32 h-32 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-[64px]">map</span>
                                    </div>
                                </div>

                                <div className="md:w-2/3 relative z-10 text-center md:text-left">
                                    <h3 className="text-3xl font-extrabold text-white mb-4">Mapeamento de Ruído</h3>
                                    <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
                                        Visualização precisa e espacial do impacto sonoro. Nossos mapas de ruído identificam as fontes primárias de poluição sonora em complexos industriais e faixas urbanas, subsidiando planos de ação efetivos.
                                    </p>
                                    <Link href="/contato" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] text-base sm:text-lg hover:-translate-y-1">
                                        Falar com Analista Acústico
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
