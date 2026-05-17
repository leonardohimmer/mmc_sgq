import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function BlogPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-500/5 dark:from-pink-500/10 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 dark:bg-slate-800/50 text-pink-600 dark:text-pink-400 font-bold text-sm mb-6 border border-pink-500/20 dark:border-pink-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.15)] dark:shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] dark:hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">article</span>
                            Conteúdo Técnico e Tendências
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-lg">
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">MMC Lab</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10">
                            Fique por dentro das atualizações normativas, práticas de engenharia e dicas para projetos acústicos.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Card 1 */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:-translate-y-2 transition-all flex flex-col">
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                    <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-500">architecture</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="text-pink-500 font-bold text-xs uppercase tracking-wider mb-2">Engenharia e Normas</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">
                                        Acústica Na Construção Civil: 4 Práticas Para Atender a NBR 15575
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                        Descubra como arquitetos e engenheiros podem garantir conformidade acústica nas habitações aplicando práticas de projetos estruturais eficientes e com bons materiais isolantes.
                                    </p>
                                    <div className="flex items-center text-pink-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        Ler Artigo <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:-translate-y-2 transition-all flex flex-col">
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                    <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-500">support_agent</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="text-pink-500 font-bold text-xs uppercase tracking-wider mb-2">Acústica</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">
                                        O que é uma Consultoria Acústica e quando contratá-la?
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                        Aprenda os motivos pelos quais uma avaliação técnica de campo em laboratório pode te poupar dores de cabeça futuras e resolver passivos ambientais sonoros antes da judicialização.
                                    </p>
                                    <div className="flex items-center text-pink-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        Ler Artigo <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:-translate-y-2 transition-all flex flex-col">
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                    <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-500">window</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="text-pink-500 font-bold text-xs uppercase tracking-wider mb-2">Testes Laboratoriais</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">
                                        Por que testar janelas em laboratório de acordo com ISO 10140?
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                        Os cuidados com as esquadrias têm papel fundamental na vedação acústica e térmica na obra. Testar em ambientes controlados fornece parâmetros absolutos de perca de transmissão Rw.
                                    </p>
                                    <div className="flex items-center text-pink-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                        Ler Artigo <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                                    </div>
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
