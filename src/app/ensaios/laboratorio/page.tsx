import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Ensaios em Laboratório | MMC LAB",
    description: "Conheça nossos ensaios acústicos laboratoriais de isolamento e absorção, além de ensaios de durabilidade mecânica de esquadrias.",
};

export default function EnsaiosLaboratorioPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="bg-[#00bfa5] dark:bg-teal-800 py-16 px-6 sm:px-8 text-white relative">
                    <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-3">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ensaios em Laboratório</h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white/90">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-70">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-70">&gt;</span>
                            <span className="opacity-90">Em Laboratório</span>
                        </div>
                    </div>
                </section>

                {/* Seção Principal de Conteúdo */}
                <section className="py-20 bg-background-light dark:bg-slate-950 relative flex-1">
                    {/* Elementos Decorativos de Círculos Concêntricos */}
                    <div className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-[20%] w-[350px] h-[350px] pointer-events-none opacity-10 dark:opacity-5 hidden lg:block">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bfa5] animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                        <div className="absolute inset-10 rounded-full border border-[#00bfa5]/70 animate-pulse" style={{ animationDelay: '2.2s' }}></div>
                        <div className="absolute inset-20 rounded-full border border-[#00bfa5]/45 animate-pulse" style={{ animationDelay: '3.7s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        {/* Introdução */}
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-6">
                                Tecnologia e Precisão em Ambiente Controlado
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed justify-center text-justify sm:text-center">
                                Nosso laboratório de última geração oferece a máxima precisão na simulação e controle de variáveis físicas para certificação de materiais construtivos e acústicos. Através de equipamentos calibrados e rastreados metrologicamente, garantimos conformidade com as normas internacionais <strong className="text-[#00bfa5] dark:text-teal-400">ISO</strong> e nacionais <strong className="text-[#00bfa5] dark:text-teal-400">ABNT</strong>.
                            </p>
                        </div>

                        {/* Cards de Ensaios */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                            {/* Card 1: Isolamento Acústico de Esquadrias, Portas e Paredes */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,191,165,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.05)] hover:-translate-y-1.5 flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center mb-6 ring-1 ring-[#00bfa5]/20 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Isolamento Acústico (Rw)
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-justify mb-6">
                                        Ensaios laboratoriais em câmara de transmissão bi-partida de alta tecnologia para quantificar o índice de redução sonora de componentes e vedações.
                                    </p>
                                    <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Esquadrias Acústicas e Janelas
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Sistemas de Portas e Vedações
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Paredes de Drywall e Alvenarias
                                            
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Fachadas e Divisórias Leves
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-[#00bfa5] dark:text-teal-400 bg-[#00bfa5]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                        ISO 10140 & ISO 717
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Absorção Sonora em Câmara Reverberante */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,191,165,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.05)] hover:-translate-y-1.5 flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center mb-6 ring-1 ring-[#00bfa5]/20 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-[28px]">hearing</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Absorção Sonora (NRC/αw)
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-justify mb-6">
                                        Determinação do coeficiente de absorção sonora de materiais em câmara reverberante totalmente acoplada, essencial para controle do tempo de reverberação.
                                    </p>
                                    <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Painéis Acústicos e Revestimentos
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Forros Suspensos e Nuvens
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Baffles e Carpetes Técnicos
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Materiais Fibrosos e Espumas
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-[#00bfa5] dark:text-teal-400 bg-[#00bfa5]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                        ISO 354 & NBR 15575
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: Durabilidade e Desempenho Mecânico de Esquadrias */}
                            <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,191,165,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.05)] hover:-translate-y-1.5 flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center mb-6 ring-1 ring-[#00bfa5]/20 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-[28px]">speed</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        Desempenho de Esquadrias
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-justify mb-6">
                                        Avaliamos o comportamento mecânico, estanqueidade à água e permeabilidade ao ar de janelas e portas externas sob ações do vento e intempéries climáticas.
                                    </p>
                                    <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Resistência às Cargas de Vento
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Estanqueidade à Água (Chuva Direta)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Permeabilidade ao Ar (Infiltração)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[18px]">check_circle</span>
                                            Ciclagem e Desgaste por Uso Repetitivo
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-[#00bfa5] dark:text-teal-400 bg-[#00bfa5]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                        ABNT NBR 10821
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-20 text-center max-w-2xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Deseja certificar seu produto ou componente?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                                Envie a documentação ou detalhes do seu material para nossa equipe técnica de laboratório. Agendamos e realizamos seus testes em prazos recordes e com rigor internacional.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/contato" 
                                    className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    SOLICITAR ENSAIO DE LABORATÓRIO
                                </Link>
                                <Link 
                                    href="/contato" 
                                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
                                >
                                    ENVIAR PROJETO PARA ANÁLISE
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
