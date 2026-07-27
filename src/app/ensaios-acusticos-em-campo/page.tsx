import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Ensaios Acústicos em Campo | MMC LAB",
    description: "Laboratório acreditado CGCRE/Inmetro (CRL 1460) para ensaios acústicos em campo in loco conforme ABNT NBR 15575, ABNT NBR 10151 e ABNT NBR 10152.",
};

export default function EnsaiosAcusticosPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-12 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/acustica.jpeg" 
                            alt="Fundo Ensaios Acústicos em Campo" 
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
                            Ensaios Acústicos em Campo
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Acústica em Campo</span>
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
                                        Precisão Acústica e Conformidade Técnica na sua Edificação
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Nossos especialistas conduzem medições acústicas minuciosas seguindo rigorosamente os procedimentos de ensaios padronizados e normatizados. Utilizamos equipamentos de alta precisão e tecnologia avançada para garantir a qualidade e fidelidade absoluta dos resultados obtidos nos ensaios in loco.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Realizamos ensaios de desempenho acústico em campo para atender perfeitamente aos rigorosos critérios exigidos pela ABNT NBR 15575, abrangendo o isolamento de fachadas, paredes de geminação entre unidades, sistemas de piso (ruído aéreo e impacto) e sistemas de tubulações hidrossanitárias. Essas avaliações são essenciais para certificar o conforto de habitação e atestar a qualidade construtiva do empreendimento.
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
                                        A MMC LAB é um laboratório credenciado e acreditado junto à Coordenação Geral de Acreditação do Inmetro (Cgcre), sob o registro nº <strong className="text-[#00bfa5] dark:text-teal-400">CRL 1460</strong>, atestando a competência técnica em conformidade com os requisitos da Norma ABNT NBR ISO/IEC 17025.
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
                                {/* Container da Imagem de Capa com visual premium */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-md group">
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
                                        <img
                                            src="/images/ensaios/acustica.jpeg"
                                            alt="Acústica em Campo"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Instrumentação Avançada in loco
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Ensaios de isolamento acústico realizados com dodecaedro e sonômetro classe 1 de alta precisão.
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
                                            <span>Desempenho: <strong>ABNT NBR 15575 / ISO 16283</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Ruído Ambiental: <strong>ABNT NBR 10151 e NBR 10152</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Acreditação: <strong>CRL 1460 (Inmetro)</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Locais: <strong>In loco (Em todo o Brasil)</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Grupo de Selos de Proficiência ProAcústica */}
                                <div className="space-y-3">
                                    {/* Selo de Aprovação ProAcústica 2025-2027 (Ativo) */}
                                    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/20 dark:via-amber-500/5 dark:to-transparent p-3.5 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300 hover:border-amber-500/50 group flex flex-col gap-2.5">
                                        
                                        {/* Luzes de Fundo */}
                                        <div className="absolute -right-12 -top-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110"></div>
                                        
                                        {/* Topo do Card: Badges na Esquerda e ProAcústica + Triângulo na Direita */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                                            {/* Badges Subidas */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/20 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                                                    Proficiência Aprovada
                                                </span>
                                                <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    Ciclo 2025-2027
                                                </span>
                                            </div>

                                            {/* ProAcústica + Triângulo Laranja 6º */}
                                            <div className="flex items-center gap-1.5">
                                                {/* ProAcústica Logo */}
                                                <svg viewBox="0 0 100 100" className="w-8 h-8 rounded shrink-0 bg-[#1e5aa3]" aria-label="ProAcústica">
                                                    <path d="M 0 100 A 100 100 0 0 1 100 0" fill="none" stroke="white" strokeWidth="10" />
                                                    <path d="M 0 80 A 80 80 0 0 1 80 0" fill="none" stroke="white" strokeWidth="10" />
                                                    <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Pro</text>
                                                    <text x="12" y="85" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Acústica</text>
                                                </svg>

                                                {/* Triângulo Laranja 6º */}
                                                <div className="relative w-10 h-10 flex-shrink-0 animate-float-slow">
                                                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]">
                                                        <path 
                                                            d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                            fill="#f59e0b" 
                                                        />
                                                        <text 
                                                            x="42" 
                                                            y="58" 
                                                            textAnchor="middle"
                                                            fill="white" 
                                                            fontSize="30" 
                                                            fontWeight="900" 
                                                            fontFamily="sans-serif"
                                                        >
                                                            6º
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
                                                Desempenho satisfatório comprovado no <strong>6º Programa de Ensaios de Proficiência (QualiLab/InterLab)</strong> para as normas ISO 16283, ISO 3382-2, ISO 16032 e NBR 10151, promovido pela <strong>ProAcústica</strong>.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Selo de Aprovação Histórico ProAcústica 2023-2025 (Antigo 5º) */}
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 p-2.5 shadow-sm opacity-55 hover:opacity-85 transition-all duration-300 flex items-center justify-between gap-3 group/hist5">
                                        {/* Luz de fundo bronze sutil */}
                                        <div className="absolute -right-12 -top-12 w-20 h-20 bg-amber-900/5 rounded-full blur-xl"></div>
                                        
                                        {/* Badges Históricas */}
                                        <div className="flex flex-wrap items-center gap-1.5 z-10">
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded border border-slate-300/30">
                                                Histórico Aprovado
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded border border-slate-300/30">
                                                Ciclo 2023-2025
                                            </span>
                                        </div>

                                        {/* Logos + Triângulo Histórico (Grayscale/Mudo) */}
                                        <div className="flex items-center gap-1.5 shrink-0 z-10 grayscale group-hover/hist5:grayscale-0 opacity-70 group-hover/hist5:opacity-100 transition-all duration-300">
                                            {/* ProAcústica Logo Histórico */}
                                            <svg viewBox="0 0 100 100" className="w-8 h-8 rounded shrink-0 bg-[#4a6b8c] dark:bg-[#344d66]" aria-label="ProAcústica">
                                                <path d="M 0 100 A 100 100 0 0 1 100 0" fill="none" stroke="white" strokeWidth="10" />
                                                <path d="M 0 80 A 80 80 0 0 1 80 0" fill="none" stroke="white" strokeWidth="10" />
                                                <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Pro</text>
                                                <text x="12" y="85" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Acústica</text>
                                            </svg>

                                            {/* Triângulo Laranja Histórico 5º */}
                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                                                    <path 
                                                        d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                        fill="#b0956b" 
                                                    />
                                                    <text 
                                                        x="42" 
                                                        y="58" 
                                                        textAnchor="middle"
                                                        fill="white" 
                                                        fontSize="30" 
                                                        fontWeight="900" 
                                                        fontFamily="sans-serif"
                                                    >
                                                        5º
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selo de Aprovação Histórico ProAcústica 2021-2023 (Antigo 4º) */}
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 p-2.5 shadow-sm opacity-55 hover:opacity-85 transition-all duration-300 flex items-center justify-between gap-3 group/hist4">
                                        {/* Luz de fundo bronze sutil */}
                                        <div className="absolute -right-12 -top-12 w-20 h-20 bg-amber-900/5 rounded-full blur-xl"></div>
                                        
                                        {/* Badges Históricas */}
                                        <div className="flex flex-wrap items-center gap-1.5 z-10">
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Histórico Aprovado
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Ciclo 2021-2023
                                            </span>
                                        </div>

                                        {/* Logos + Triângulo Histórico (Grayscale/Mudo) */}
                                        <div className="flex items-center gap-1.5 shrink-0 z-10 grayscale group-hover/hist4:grayscale-0 opacity-70 group-hover/hist4:opacity-100 transition-all duration-300">
                                            {/* ProAcústica Logo Histórico */}
                                            <svg viewBox="0 0 100 100" className="w-8 h-8 rounded shrink-0 bg-[#4a6b8c] dark:bg-[#344d66]" aria-label="ProAcústica">
                                                <path d="M 0 100 A 100 100 0 0 1 100 0" fill="none" stroke="white" strokeWidth="10" />
                                                <path d="M 0 80 A 80 80 0 0 1 80 0" fill="none" stroke="white" strokeWidth="10" />
                                                <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Pro</text>
                                                <text x="12" y="85" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Acústica</text>
                                            </svg>

                                            {/* Triângulo Laranja Histórico 4º */}
                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                                                    <path 
                                                        d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                        fill="#b0956b" 
                                                    />
                                                    <text 
                                                        x="42" 
                                                        y="58" 
                                                        textAnchor="middle"
                                                        fill="white" 
                                                        fontSize="30" 
                                                        fontWeight="900" 
                                                        fontFamily="sans-serif"
                                                    >
                                                        4º
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selo de Aprovação Histórico ProAcústica 2019-2021 (Antigo 3º) */}
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 p-2.5 shadow-sm opacity-55 hover:opacity-85 transition-all duration-300 flex items-center justify-between gap-3 group/hist3">
                                        {/* Luz de fundo bronze sutil */}
                                        <div className="absolute -right-12 -top-12 w-20 h-20 bg-amber-900/5 rounded-full blur-xl"></div>
                                        
                                        {/* Badges Históricas */}
                                        <div className="flex flex-wrap items-center gap-1.5 z-10">
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Histórico Aprovado
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Ciclo 2019-2021
                                            </span>
                                        </div>

                                        {/* Logos + Triângulo Histórico (Grayscale/Mudo) */}
                                        <div className="flex items-center gap-1.5 shrink-0 z-10 grayscale group-hover/hist3:grayscale-0 opacity-70 group-hover/hist3:opacity-100 transition-all duration-300">
                                            {/* ProAcústica Logo Histórico */}
                                            <svg viewBox="0 0 100 100" className="w-8 h-8 rounded shrink-0 bg-[#4a6b8c] dark:bg-[#344d66]" aria-label="ProAcústica">
                                                <path d="M 0 100 A 100 100 0 0 1 100 0" fill="none" stroke="white" strokeWidth="10" />
                                                <path d="M 0 80 A 80 80 0 0 1 80 0" fill="none" stroke="white" strokeWidth="10" />
                                                <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Pro</text>
                                                <text x="12" y="85" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Acústica</text>
                                            </svg>

                                            {/* Triângulo Laranja Histórico 3º */}
                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                                                    <path 
                                                        d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                        fill="#b0956b" 
                                                    />
                                                    <text 
                                                        x="42" 
                                                        y="58" 
                                                        textAnchor="middle"
                                                        fill="white" 
                                                        fontSize="30" 
                                                        fontWeight="900" 
                                                        fontFamily="sans-serif"
                                                    >
                                                        3º
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selo de Aprovação Histórico ProAcústica 2017-2019 (Antigo 2º) */}
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10 p-2.5 shadow-sm opacity-55 hover:opacity-85 transition-all duration-300 flex items-center justify-between gap-3 group/hist2">
                                        {/* Luz de fundo bronze sutil */}
                                        <div className="absolute -right-12 -top-12 w-20 h-20 bg-amber-900/5 rounded-full blur-xl"></div>
                                        
                                        {/* Badges Históricas */}
                                        <div className="flex flex-wrap items-center gap-1.5 z-10">
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Histórico Aprovado
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-455 px-2 py-0.5 rounded border border-slate-300/30">
                                                Ciclo 2017-2019
                                            </span>
                                        </div>

                                        {/* Logos + Triângulo Histórico (Grayscale/Mudo) */}
                                        <div className="flex items-center gap-1.5 shrink-0 z-10 grayscale group-hover/hist2:grayscale-0 opacity-70 group-hover/hist2:opacity-100 transition-all duration-300">
                                            {/* ProAcústica Logo Histórico */}
                                            <svg viewBox="0 0 100 100" className="w-8 h-8 rounded shrink-0 bg-[#4a6b8c] dark:bg-[#344d66]" aria-label="ProAcústica">
                                                <path d="M 0 100 A 100 100 0 0 1 100 0" fill="none" stroke="white" strokeWidth="10" />
                                                <path d="M 0 80 A 80 80 0 0 1 80 0" fill="none" stroke="white" strokeWidth="10" />
                                                <text x="50" y="55" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Pro</text>
                                                <text x="12" y="85" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Acústica</text>
                                            </svg>

                                            {/* Triângulo Laranja Histórico 2º */}
                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                                                    <path 
                                                        d="M20,15 L80,45 A10,10 0 0 1 80,55 L20,85 A10,10 0 0 1 10,75 L10,25 A10,10 0 0 1 20,15 Z" 
                                                        fill="#b0956b" 
                                                    />
                                                    <text 
                                                        x="42" 
                                                        y="58" 
                                                        textAnchor="middle"
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
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Ensaios e Soluções Acústicas em Campo
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Conheça os principais serviços de controle tecnológico acústico realizados pela MMC LAB.
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
                                            Desempenho Acústico
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Realização de medições de isolamento aéreo em fachadas, paredes de geminação entre unidades, bem como ruído aéreo e ruído de impacto em lajes/pisos e isolamento de tubulações hidrossanitárias.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            ABNT NBR 15575
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
                                            Avaliação de Ruído Ambiental
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Medição e avaliação técnica dos níveis de pressão sonora incidentes em áreas externas e vizinhanças habitadas, fornecendo subsídios técnicos claros de controle e cumprimento legal.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            ABNT NBR 10151
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
                                            Classe de Ruído da Fachada
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Caracterização e simulação das fontes sonoras no entorno da edificação para classificar as fachadas expostas e definir os índices exatos de isolamento acústico que esquadrias e vidros precisam atender.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            NBR 15575-4
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-acustica" />

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
                                Entre em contato com um especialista em Ensaios Acústicos da MMC LAB e solicite uma proposta técnica personalizada para sua obra.
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
