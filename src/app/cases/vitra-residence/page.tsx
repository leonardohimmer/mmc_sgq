"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, Building2, CheckCircle, ListTodo } from "lucide-react";

const IMAGES = [
    "https://www.mmclab.com.br/upload/service/5qAvmHq13BO5bcrmfDIhz9v5SSyggEwfqrToBc4o.jpeg",
    "https://www.mmclab.com.br/upload/service/PQGyMRQ7fwRVtvpr5ltL33Xd9c228rrIL29V9iRj.jpeg",
    "https://www.mmclab.com.br/upload/service/aD2tjnAnPiKZM1Y3dmAr62ZL6XSFKcDGhf6ISrEO.jpeg"
];

export default function VitraCasePage() {
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextImage = () => {
        setImgIdx((prev) => (prev + 1) % IMAGES.length);
    };

    const prevImage = () => {
        setImgIdx((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    };

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero / Header Section */}
                <section className="relative pt-16 pb-12 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300 sm:pt-20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                        <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-secondary transition-colors mb-6 cursor-pointer">
                            <ArrowLeft className="w-4 h-4" /> Voltar para Cases
                        </Link>
                        
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 font-bold text-xs mb-4 border border-amber-500/20 backdrop-blur-md">
                                <Building2 className="w-3.5 h-3.5" /> Projeto Acústico
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                                Vitra Residence
                            </h1>
                            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
                                Serviço: Projeto Acústico e Isolamento de Ruídos na Cobertura.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Case Details Content */}
                <section className="py-16 bg-background-light dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-6">
                        
                        {/* Thin centered introduction box */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                            <div className="absolute -right-10 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[20px] pointer-events-none"></div>
                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                                &ldquo;O empreendimento Vitra Residence, localizado em Capão da Canoa/RS, é um projeto de destaque. Com áreas comuns e piscina na cobertura, era essencial garantir isolamento acústico adequado para assegurar a privacidade e tranquilidade dos moradores.&rdquo;
                            </p>
                        </div>

                        {/* Image Carousel */}
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 bg-slate-900 border border-slate-200 dark:border-slate-800 group/carousel shadow-xl">
                            <img
                                src={IMAGES[imgIdx]}
                                alt={`Foto do case Vitra - ${imgIdx + 1}`}
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent pointer-events-none" />

                            {/* Arrow Controls */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100"
                                aria-label="Próxima imagem"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-2.5 py-1.5 rounded-full bg-slate-950/30 backdrop-blur-md">
                                {IMAGES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setImgIdx(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            imgIdx === idx ? "bg-amber-500 w-4" : "bg-white/60 hover:bg-white"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="prose dark:prose-invert max-w-none space-y-8 text-justify text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    O Desafio Acústico
                                </h3>
                                <p>
                                    O principal desafio era garantir que o ruído das áreas de lazer no topo do edifício não afetasse negativamente a experiência residencial dos moradores dos andares inferiores. Era necessário minimizar a transmissão de ruído aéreo e de impacto proveniente da piscina e das áreas comuns.
                                </p>
                            </div>

                            <hr className="border-slate-200 dark:border-slate-800" />

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ListTodo className="w-6 h-6 text-amber-500 shrink-0" />
                                    Soluções Técnicas Implementadas
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-slate-900 dark:text-white block">1. Isolamento Acústico das Áreas Comuns</strong>
                                            <p className="text-sm sm:text-base mt-0.5">Utilização de contrapiso flutuante assentado sobre mantas acústicas dimensionadas especificamente para atender o desempenho exigido.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-slate-900 dark:text-white block">2. Desacoplamento Acústico da Piscina</strong>
                                            <p className="text-sm sm:text-base mt-0.5">Implementação de um sistema antivibratório que minimiza a transmissão estrutural de ruídos para os andares inferiores.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-slate-900 dark:text-white block">3. Atenuação Hidrossanitária e Mecânica</strong>
                                            <p className="text-sm sm:text-base mt-0.5">Incorporação de isolamento acústico em tubulações e uso de bases de inércia para suporte das bombas e equipamentos de recirculação da piscina.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-slate-800" />

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    Resultado Conquistado
                                </h3>
                                <p>
                                    As soluções adotadas no Vitra Residence proporcionaram níveis excelentes de isolamento acústico conforme os requisitos da ABNT NBR 15575, tanto para o ruído aéreo quanto para o ruído de impacto, agregando alto valor de conforto e privacidade ao empreendimento.
                                </p>
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="mt-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Precisa de um projeto de isolamento acústico?
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                Desenvolvemos projetos acústicos para áreas residenciais, comerciais, industriais e de entretenimento.
                            </p>
                            <Link href="/contato" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary hover:bg-[#a3987f] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer">
                                Solicitar Orçamento Técnico
                            </Link>
                        </div>

                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
