"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Thermometer, Sun, CheckCircle } from "lucide-react";

const IMAGES_TERMICA = [
    "https://www.mmclab.com.br/upload/service/fwkNBcD7qbmfHF66yUy3ZHU92RZRgxxaOx8KhzdM.jpeg",
    "https://www.mmclab.com.br/upload/service/GuCUOi8sJxX8oQO6XmisUhYvPS4B8fAYQe19HT7k.jpeg",
    "https://www.mmclab.com.br/upload/service/gp4penvYI4zu8l7GnxBYhwWUnOtlQYfkPRIO9r9i.jpeg"
];

const IMAGES_LUMINICA = [
    "https://www.mmclab.com.br/upload/service/rtVAgeNk679UdFXhnSuvYK9l6ePWH8TuY9RP7oeb.jpeg",
    "https://www.mmclab.com.br/upload/service/M3f6l05T1kO0kju6TBru5J2JHxYmy6pV6KD6S1SD.jpeg",
    "https://www.mmclab.com.br/upload/service/q10vAys5I2zL9cqMiKS0U1BRkZNcVcXk0sT3zBZP.jpeg"
];

export default function SimulacoesPage() {
    // Carousel states
    const [termicaIdx, setTermicaIdx] = useState(0);
    const [luminicaIdx, setLuminicaIdx] = useState(0);

    // Accordion/Expand states
    const [termicaExpanded, setTermicaExpanded] = useState(false);
    const [luminicaExpanded, setLuminicaExpanded] = useState(false);

    // Autoplay for carousels
    useEffect(() => {
        const timer = setInterval(() => {
            setTermicaIdx((prev) => (prev + 1) % IMAGES_TERMICA.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setLuminicaIdx((prev) => (prev + 1) % IMAGES_LUMINICA.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextTermica = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTermicaIdx((prev) => (prev + 1) % IMAGES_TERMICA.length);
    };

    const prevTermica = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTermicaIdx((prev) => (prev - 1 + IMAGES_TERMICA.length) % IMAGES_TERMICA.length);
    };

    const nextLuminica = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLuminicaIdx((prev) => (prev + 1) % IMAGES_LUMINICA.length);
    };

    const prevLuminica = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLuminicaIdx((prev) => (prev - 1 + IMAGES_LUMINICA.length) % IMAGES_LUMINICA.length);
    };

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]" style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 dark:bg-slate-800/80 text-secondary font-semibold text-sm mb-6 md:mb-8 border border-secondary/30 backdrop-blur-md shadow-[0_0_15px_rgba(193,181,152,0.15)] dark:shadow-[0_0_15px_rgba(193,181,152,0.3)] hover:shadow-[0_0_25px_rgba(193,181,152,0.3)] dark:hover:shadow-[0_0_25px_rgba(193,181,152,0.6)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">analytics</span>
                            Simulações Computacionais
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Simulações de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-600 dark:to-amber-200">Desempenho</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-6 subpage-hero-p">
                            Antecipe comportamentos térmicos, lumínicos e energéticos da sua edificação através de poderosas modelagens numéricas.
                        </p>
                    </div>
                </section>

                <section className="py-20 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                            {/* Modelagem Térmica */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] overflow-hidden flex flex-col">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px] -z-0 pointer-events-none"></div>
                                
                                {/* Photo Carousel */}
                                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-slate-100 dark:border-slate-800 group/carousel">
                                    <img
                                        src={IMAGES_TERMICA[termicaIdx]}
                                        alt={`Simulação Térmica ${termicaIdx + 1}`}
                                        className="w-full h-full object-cover transition-all duration-700"
                                    />
                                    
                                    {/* Navigation buttons */}
                                    <button
                                        onClick={prevTermica}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/55 hover:bg-slate-950/75 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextTermica}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/55 hover:bg-slate-950/75 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>

                                    {/* Carousel Dots */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-2 py-1 rounded-full bg-slate-950/30 backdrop-blur-sm">
                                        {IMAGES_TERMICA.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setTermicaIdx(idx); }}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    termicaIdx === idx ? "bg-orange-500 w-4" : "bg-white/60 hover:bg-white"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                        <Thermometer className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Simulação Térmica</h3>
                                </div>

                                {/* Text content block */}
                                <div className="relative z-10 text-justify">
                                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                        O desempenho térmico de habitações depende de seus componentes (paredes e coberturas), das áreas envidraçadas e de ventilação, das cargas térmicas internas (pessoas, iluminação e equipamentos), da maneira como se operam as aberturas e do clima da cidade.
                                    </p>

                                    {/* Expandable Text */}
                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                        termicaExpanded ? "max-h-[600px] opacity-100 mb-4" : "max-h-0 opacity-0"
                                    }`}>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                            A avaliação de desempenho térmico deve ser realizada para os ambientes de permanência prolongada da unidade habitacional.
                                        </p>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                            O procedimento de simulação computacional avalia o desempenho térmico da unidade habitacional por meio do desenvolvimento de modelos computacionais em um programa compatível com as características descritas na ABNT NBR 15575-1.
                                        </p>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                            O desempenho térmico é caracterizado por meio da delimitação de três níveis de desempenho: Mínimo (M), Intermediário (I) e Superior (S). É de caráter obrigatório o atendimento aos requisitos e critérios estabelecidos para o nível de desempenho mínimo. O atendimento aos níveis de desempenho Intermediário e Superior é facultativo.
                                        </p>
                                    </div>

                                    {/* Expand/Collapse Trigger */}
                                    <button
                                        onClick={() => setTermicaExpanded(!termicaExpanded)}
                                        className="flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors mb-6 cursor-pointer"
                                    >
                                        {termicaExpanded ? (
                                            <>Recolher Texto <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Expandir e Ler Mais <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>

                                <ul className="space-y-2.5 relative z-10 text-slate-600 dark:text-slate-300 font-semibold text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-orange-500 w-4 h-4 shrink-0" /> Avaliação no verão e inverno</li>
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-orange-500 w-4 h-4 shrink-0" /> Conforto adaptativo</li>
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-orange-500 w-4 h-4 shrink-0" /> Especificações de materiais adequados</li>
                                </ul>
                            </div>

                            {/* Modelagem Lumínica */}
                            <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] overflow-hidden flex flex-col">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-bl-[100px] -z-0 pointer-events-none"></div>

                                {/* Photo Carousel */}
                                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-slate-100 dark:border-slate-800 group/carousel">
                                    <img
                                        src={IMAGES_LUMINICA[luminicaIdx]}
                                        alt={`Simulação Lumínica ${luminicaIdx + 1}`}
                                        className="w-full h-full object-cover transition-all duration-700"
                                    />
                                    
                                    {/* Navigation buttons */}
                                    <button
                                        onClick={prevLuminica}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/55 hover:bg-slate-950/75 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextLuminica}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/55 hover:bg-slate-950/75 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>

                                    {/* Carousel Dots */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-2 py-1 rounded-full bg-slate-950/30 backdrop-blur-sm">
                                        {IMAGES_LUMINICA.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setLuminicaIdx(idx); }}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    luminicaIdx === idx ? "bg-yellow-500 w-4" : "bg-white/60 hover:bg-white"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                        <Sun className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Simulação Lumínica</h3>
                                </div>

                                {/* Text content block */}
                                <div className="relative z-10 text-justify">
                                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                        A simulação computacional de desempenho lumínico permite constatar se os ambientes atendem aos critérios de disponibilidade de luz natural exigidos pela ABNT NBR 15575-1.
                                    </p>

                                    {/* Expandable Text */}
                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                        luminicaExpanded ? "max-h-[600px] opacity-100 mb-4" : "max-h-0 opacity-0"
                                    }`}>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                            A edificação é modelada em software específico, conforme as especificações de acabamentos internos e externos, tipo e tamanho de fechamentos transparentes, presença de elementos de sombreamento e demais características dos espaços enviadas pela construtora.
                                        </p>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                            O software calcula a disponibilidade de luz natural de acordo com as condições geográficas da cidade do empreendimento e das características do entorno do local de implantação do empreendimento.
                                        </p>
                                        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                            A simulação computacional deve ser realizada na fase inicial do projeto arquitetônico para, se necessário, ser possível efetuar alterações para atendimento aos critérios de iluminância e disponibilidade de luz natural nos ambientes.
                                        </p>
                                    </div>

                                    {/* Expand/Collapse Trigger */}
                                    <button
                                        onClick={() => setLuminicaExpanded(!luminicaExpanded)}
                                        className="flex items-center gap-1.5 text-sm font-bold text-yellow-500 hover:text-yellow-600 transition-colors mb-6 cursor-pointer"
                                    >
                                        {luminicaExpanded ? (
                                            <>Recolher Texto <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Expandir e Ler Mais <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>

                                <ul className="space-y-2.5 relative z-10 text-slate-600 dark:text-slate-300 font-semibold text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-yellow-500 w-4 h-4 shrink-0" /> Análise de Luz Natural</li>
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-yellow-500 w-4 h-4 shrink-0" /> Níveis de Iluminância NBR 15575</li>
                                    <li className="flex items-center gap-2.5"><CheckCircle className="text-yellow-500 w-4 h-4 shrink-0" /> Otimização de Esquadrias</li>
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
