import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function SimulacoesPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden bg-slate-900 border-b border-slate-800">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 text-secondary font-semibold text-sm mb-6 md:mb-8 border border-secondary/30 backdrop-blur-md shadow-[0_0_15px_rgba(193,181,152,0.3)] hover:shadow-[0_0_25px_rgba(193,181,152,0.6)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">analytics</span>
                            Simulações Computacionais
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Simulações de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-200">Desempenho</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-medium leading-[1.6] mb-10">
                            Antecipe comportamentos térmicos, lumínicos e energéticos da sua edificação através de poderosas modelagens numéricas.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                            {/* Modelagem Térmica */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:-translate-y-2 overflow-hidden">
                                <div className="absolute right-0 top-0 w-48 h-48 bg-orange-500/5 rounded-bl-[100px] -z-0"></div>
                                <div className="w-20 h-20 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    <span className="material-symbols-outlined text-[40px]">thermostat</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Simulação Térmica</h3>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 mb-6">
                                    Avaliamos o nível de desempenho térmico da edificação conforme ABNT NBR 15575, sugerindo melhorias na envoltória e nos materiais construtivos para otimização energética.
                                </p>
                                <ul className="space-y-3 relative z-10 text-slate-600 dark:text-slate-300 font-medium">
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-500">check_circle</span> Avaliação no verão e inverno</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-500">check_circle</span> Conforto adaptativo</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-500">check_circle</span> Especificações de materiais adequados</li>
                                </ul>
                            </div>

                            {/* Modelagem Lumínica */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 hover:border-yellow-400/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] dark:hover:shadow-[0_0_30px_rgba(250,204,21,0.1)] hover:-translate-y-2 overflow-hidden">
                                <div className="absolute right-0 top-0 w-48 h-48 bg-yellow-400/5 rounded-bl-[100px] -z-0"></div>
                                <div className="w-20 h-20 rounded-2xl bg-yellow-400/10 text-yellow-500 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                    <span className="material-symbols-outlined text-[40px]">light_mode</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Simulação Lumínica</h3>
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 mb-6">
                                    Geração de modelos 3D analisando o luxímetro virtualmente. Garantimos os níveis adequados de iluminância prescritos pelas normas de desempenho, focando também em economia de energia.
                                </p>
                                <ul className="space-y-3 relative z-10 text-slate-600 dark:text-slate-300 font-medium">
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-500">check_circle</span> Análise de Luz Natural</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-500">check_circle</span> Níveis de Iluminância NBR 15575</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-yellow-500">check_circle</span> Otimização de Esquadrias</li>
                                </ul>
                            </div>

                        </div>

                        <div className="mt-16 text-center max-w-2xl mx-auto">
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                                A simulação prévia evita altos custos de correções na fase final da obra e possibilita selos de sustentabilidade (como o LEED, AQUA entre outros).
                            </p>
                            <Link href="/contato" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary hover:bg-[#a3987f] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-[0_0_20px_rgba(193,181,152,0.4)] dark:hover:shadow-[0_0_20px_rgba(193,181,152,0.5)] text-base sm:text-lg hover:-translate-y-1">
                                <span className="material-symbols-outlined">send</span>
                                Enviar Projeto para Análise
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
