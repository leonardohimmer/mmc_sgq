import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function IndustriaPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-sky-500/10 dark:bg-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.3)] dark:shadow-[0_0_20px_rgba(14,165,233,0.8)]"></div>
                        <div className="absolute top-0 right-1/4 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-sky-500/5 dark:bg-sky-500/15 rounded-full blur-[80px] md:blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-slate-800/80 text-sky-600 dark:text-sky-400 font-semibold text-sm mb-6 md:mb-8 border border-sky-500/20 dark:border-sky-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.15)] dark:shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.3)] dark:hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">factory</span>
                            Soluções Industriais
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl transition-colors duration-300">
                            Engenharia para <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Indústrias</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-10 transition-colors duration-300">
                            Equipamentos aferidos e metodologias exclusivas para atender às altas exigências do setor industrial, de chão de fábrica a avaliações ocupacionais sonoras.
                        </p>
                    </div>
                </section>

                <section className="py-24 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* Bloco de Imagem Mockup */}
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-blue-600/5 group-hover:opacity-80 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="material-symbols-outlined text-[64px] text-white mb-4 animate-bounce">precision_manufacturing</span>
                                    <h3 className="text-2xl font-bold text-white mb-2">Monitoramento Ativo</h3>
                                    <p className="text-slate-200 font-medium max-w-sm">Estruturas preparadas para adequação NR-15 e controle de vibrações ocupacionais.</p>
                                </div>
                                {/* Placeholder background to represent industrial complex */}
                                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                                    backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
                                    backgroundSize: `24px 24px`
                                }}></div>
                                <div className="w-full h-full flex flex-col justify-end p-8 pb-12">
                                    <div className="w-1/2 h-4 mb-3 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
                                    <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
                                </div>
                            </div>

                            {/* Texto descritivo e tópicos */}
                            <div className="flex flex-col justify-center gap-8">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Conformidade Regulatória<br /> e Processos Limpos</h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Atendemos parques e complexos industriais que demandam por ensaios especializados, laudos técnicos precisos e projetos de intervenção corretiva em máquinas ou ambientes com insalubridade de ruído.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-colors">
                                        <span className="material-symbols-outlined text-sky-500">volume_down</span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Mitigação de Ruído</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Enclausuramento de máquinas e tratamento acústico perimetral.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-colors">
                                        <span className="material-symbols-outlined text-sky-500">vibration</span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Verificação de Desempenho</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Controle de qualidade físico e resistência mecânica estrutural.</p>
                                        </div>
                                    </li>
                                </ul>

                                <Link href="/contato" className="w-full sm:w-auto mt-4 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all inline-flex justify-center items-center gap-2 shadow-lg hover:shadow-sky-500/30 text-base sm:text-lg">
                                    Falar com o Departamento Técnico
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
