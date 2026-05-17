import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Ensaios | MMC LAB",
    description: "Avaliações rigorosas estruturais e acústicas em campo e laboratório, garantindo conformidade com a ABNT NBR 15575.",
};

export default function EnsaiosPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="bg-[#00bfa5] dark:bg-teal-800 py-16 px-6 sm:px-8 text-white relative">
                    <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-3">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ensaios</h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white/90">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-70">&gt;</span>
                            <span className="opacity-90">Ensaios</span>
                        </div>
                    </div>
                </section>

                {/* Seção Principal de Cards */}
                <section className="py-24 bg-background-light dark:bg-slate-950 relative flex-1 flex items-center justify-center overflow-hidden">
                    {/* Elementos Decorativos de Círculos Concêntricos (Ondas) em Teal do background */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-[-15%] w-[450px] h-[450px] pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bfa5] animate-pulse"></div>
                        <div className="absolute inset-8 rounded-full border border-[#00bfa5]/80 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-16 rounded-full border border-[#00bfa5]/60 animate-pulse" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute inset-24 rounded-full border border-[#00bfa5]/40 animate-pulse" style={{ animationDelay: '3s' }}></div>
                    </div>

                    <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[15%] w-[450px] h-[450px] pointer-events-none opacity-20 dark:opacity-10 hidden md:block">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bfa5] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-8 rounded-full border border-[#00bfa5]/80 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute inset-16 rounded-full border border-[#00bfa5]/60 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                        <div className="absolute inset-24 rounded-full border border-[#00bfa5]/40 animate-pulse" style={{ animationDelay: '3.5s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto items-stretch">
                            
                            {/* Card 1: Ensaios em Campo */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,191,165,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.08)] hover:-translate-y-1.5 transition-all duration-300 group shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00bfa5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                            <img 
                                                src="/ensaios_campo.png" 
                                                alt="Ensaios em Campo" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00bfa5] dark:text-teal-400 text-center mb-6 tracking-tight">
                                            Ensaios em Campo
                                        </h2>
                                    </div>
                                    <div className="flex justify-center mt-2 pb-2">
                                        <Link 
                                            href="/ensaios/campo" 
                                            className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-3.5 px-12 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:shadow-[#00bfa5]/35 hover:scale-[1.02]"
                                        >
                                            VEJA MAIS
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Ensaios em Laboratório */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,191,165,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.08)] hover:-translate-y-1.5 transition-all duration-300 group shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00bfa5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                            <img 
                                                src="/ensaios_laboratorio.png" 
                                                alt="Ensaios em Laboratório" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00bfa5] dark:text-teal-400 text-center mb-6 tracking-tight">
                                            Ensaios em Laboratório
                                        </h2>
                                    </div>
                                    <div className="flex justify-center mt-2 pb-2">
                                        <Link 
                                            href="/ensaios/laboratorio" 
                                            className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-3.5 px-12 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:shadow-[#00bfa5]/35 hover:scale-[1.02]"
                                        >
                                            VEJA MAIS
                                        </Link>
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
