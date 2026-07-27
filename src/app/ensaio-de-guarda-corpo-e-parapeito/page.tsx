import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";

export const metadata = {
    title: "Ensaio de Guarda-Corpo e Parapeito | MMC LAB",
    description: "Laboratório acreditado pela CGCRE/Inmetro (CRL 1460) para ensaio de guarda-corpo e parapeito em laboratório e in loco, conforme a ABNT NBR 14718 e NBR 15575.",
};

export default function EnsaioGuardaCorpoPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-12 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/guarda-corpo.jpeg" 
                            alt="Fundo Ensaio de Guarda-Corpo e Parapeito" 
                            className="w-full h-full object-cover opacity-35 dark:opacity-25"
                        />
                        {/* Overlay Degradê Escuro Sofisticado */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-slate-900/90 to-slate-950/95"></div>
                        {/* Fade Inferior para o fundo da página */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                    </div>
                    
                    <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-3 relative z-10">
                        <span className="text-xs font-bold bg-[#00bfa5]/20 text-[#00bfa5] border border-[#00bfa5]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            Ensaios e Controle Tecnológico
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                            Ensaio de Guarda-Corpo e Parapeito
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Guarda-Corpo e Parapeito</span>
                        </div>
                    </div>
                </section>

                {/* Seção Principal de Conteúdo */}
                <section className="py-20 bg-background-light dark:bg-slate-950 relative flex-1">
                    {/* Elementos Decorativos de Fundo */}
                    <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-[20%] w-[450px] h-[450px] pointer-events-none opacity-10 dark:opacity-5 hidden lg:block">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bfa5] animate-pulse"></div>
                        <div className="absolute inset-16 rounded-full border border-[#00bfa5]/60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                            {/* Coluna Esquerda: Texto Principal */}
                            <div className="lg:col-span-7 space-y-8">

                                <div className="space-y-4">
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                                        Segurança e Desempenho Construtivo sob Rigor Técnico
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O ensaio de guarda-corpo em laboratório é um procedimento de teste realizado para avaliar a resistência e a segurança de um guarda-corpo ou corrimão de uma estrutura, como escadas, varandas ou passarelas. Esse tipo de ensaio é de extrema importância para garantir que o guarda-corpo atenda perfeitamente aos requisitos da <strong className="text-[#00bfa5] dark:text-teal-400">ABNT NBR 15575</strong> (Norma de Desempenho de Edificações).
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Durante o ensaio de guarda-corpo, são aplicadas cargas e forças específicas para simular situações reais de uso e verificar a capacidade de suporte da estrutura instalada ou do protótipo em laboratório, prevenindo falhas mecânicas, deformações excessivas ou destacamentos dos apoios que possam colocar vidas em risco.
                                </p>

                                {/* Destaque de Acreditação Inmetro */}
                                <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-[#00bfa5] rounded-r-2xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#00bfa5]/10 flex items-center justify-center text-[#00bfa5]">
                                            <span className="material-symbols-outlined text-[24px]">verified</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Acreditação CGCRE / Inmetro
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                        A MMC LAB é um laboratório acreditado para o ensaio de guarda-corpo em laboratório e campo pela Coordenação Geral de Acreditação (CGCRE) do Inmetro, sob o registro nº <strong className="text-[#00bfa5] dark:text-teal-400">CRL 1460</strong>.
                                    </p>
                                    <div className="pt-2">
                                        <a 
                                            href="http://www.inmetro.gov.br/laboratorios/rble/docs/CRL1460.pdf" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-2 text-xs font-bold text-[#00bfa5] hover:text-[#00a68f] dark:text-teal-400 dark:hover:text-teal-300 transition-colors group"
                                        >
                                            VERIFICAR ESCOPO NO INMETRO
                                            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">open_in_new</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Coluna Direita: Vídeo e Resumo Rápido */}
                            <div className="lg:col-span-5 space-y-8">
                                {/* Container do Player do YouTube com visual premium */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-md group">
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
                                        <iframe
                                            src="https://www.youtube.com/embed/RWZfz7fKRKo"
                                            title="Ensaio de Guarda-Corpo - MMC Lab"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                        ></iframe>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Demonstração de Ensaio de Guarda-Corpo
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Veja no vídeo acima como nossos engenheiros realizam o ensaio in loco com alta precisão tecnológica.
                                        </p>
                                    </div>
                                </div>

                                {/* Selo Resumo Técnico */}
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Ficha Técnica do Ensaio
                                    </h4>
                                    <ul className="space-y-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">gavel</span>
                                            <span>Norma Principal: <strong>ABNT NBR 14718</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Norma Geral: <strong>ABNT NBR 15575</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Acreditação: <strong>CRL 1460 (Inmetro)</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Locais: <strong>In loco / Campo e Laboratório</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Selo de Aprovação CCB 2025-2027 (Versão Vertical/Ultra Compacta) */}
                                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/20 dark:via-amber-500/5 dark:to-transparent p-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 hover:border-amber-500/50 group flex flex-col gap-2">
                                    
                                    {/* Luzes de Fundo */}
                                    <div className="absolute -right-12 -top-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110"></div>
                                    
                                    {/* Topo do Card: Badges na Esquerda e CCB + Triângulo na Direita */}
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Badges Subidas */}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/20 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                                                Proficiência Aprovada
                                            </span>
                                            <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                                Ciclo 2025-2027
                                            </span>
                                        </div>

                                        {/* CCB + Triângulo Laranja 2º */}
                                        <div className="flex items-center gap-1.5">
                                            {/* CCB Mini Logo */}
                                            <div className="relative w-8 h-8 bg-[#0f4c81] rounded flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                <span className="text-white text-[10px] font-black tracking-tighter">CCB</span>
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
                                            </div>

                                            {/* Triângulo Laranja 2º */}
                                            <div className="relative w-10 h-10 flex-shrink-0 animate-float-slow">
                                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]">
                                                    <path 
                                                        d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                        fill="#f59e0b" 
                                                    />
                                                    <text 
                                                        x="38" 
                                                        y="58" 
                                                        fill="white" 
                                                        fontSize="30" 
                                                        fontWeight="900" 
                                                        fontFamily="sans-serif"
                                                    >
                                                        2º
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                                            Selo de Excelência Técnica Interlaboratorial
                                        </h4>
                                        
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-normal">
                                            Desempenho satisfatório comprovado no <strong>2º Programa de Ensaios de Proficiência de Guarda-Corpos (ABNT NBR 14718)</strong>, promovido pelo <strong>CCB</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Ensaios Realizados Conforme a ABNT NBR 14718
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Nosso escopo técnico engloba todos os testes normatizados para assegurar a perfeita ancoragem, estabilidade e capacidade de choque do sistema.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Ensaio 1 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            01
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Esforço Estático Horizontal
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Realizado conforme o <strong>Anexo A</strong> da norma, consiste na aplicação de uma carga horizontal linear estática pré-determinada no topo do guarda-corpo para avaliar a deformação residual e a estabilidade estrutural do sistema de fixação.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            NBR 14718 ANEXO A
                                        </span>
                                    </div>
                                </div>

                                {/* Ensaio 2 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            02
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Esforço Estático Vertical
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Realizado conforme o <strong>Anexo B</strong> da norma, aplica uma carga estática vertical no corrimão ou peitoril para verificar se o sistema suporta pesos exercidos de cima para baixo sem apresentar rupturas ou desencaixes.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            NBR 14718 ANEXO B
                                        </span>
                                    </div>
                                </div>

                                {/* Ensaio 3 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            03
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Resistência a Impactos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Realizado conforme o <strong>Anexo C</strong> da norma, simula choques dinâmicos acidentais através do impacto de um corpo mole (saco de couro/argila com peso específico) caindo em pêndulo sobre o guarda-corpo para avaliar a sua integridade contra quedas.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            NBR 14718 ANEXO C
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <EnsaioCarousel ensaioId="campo-guarda-corpo" />

                        {/* Diferenciais da MMC Lab */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Diferenciais da MMC Lab
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Por que construtoras e incorporadoras líderes escolhem nossa equipe técnica para ensaios em todo o Brasil.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">groups</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Equipe Altamente Qualificada</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Engenheiros e técnicos especializados, com ampla formação e vivência prática nas normas de controle tecnológico.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Acreditação ISO/IEC 17025</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Rigorosa conformidade com os requisitos internacionais de qualidade para laboratórios de ensaios físicos e calibrações.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">bolt</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Agilidade Extraordinária</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Processo de agendamento ágil e emissão de laudos rigorosamente rápidos para não atrasar a entrega da sua obra.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">devices</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Tecnologia de Ponta</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Uso de células de carga digitais, softwares de aquisição de dados em tempo real e sensores de precisão extrema.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">psychology</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Aprimoramento Contínuo</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Treinamentos constantes da nossa equipe técnica e participação ativa em comitês normativos de engenharia.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">analytics</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Ampla Gama de Serviços</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Solução completa em ensaios in loco de desempenho, acústica predial e laboratorial, e simulações digitais.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Ficou com alguma dúvida ou precisa de um orçamento rápido?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Entre em contato com um especialista em Ensaio de Guarda-Corpo e Parapeito da MMC LAB e solicite uma proposta técnica personalizada para sua obra.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/contato" 
                                    className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    FALE COM A ENGENHARIA
                                </Link>
                                <a 
                                    href="https://wa.me/555131032929" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    FALE POR WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
