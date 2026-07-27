"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, Building, Shield, Award } from "lucide-react";

const IMAGES = [
    "https://www.mmclab.com.br/upload/service/h4mRK0yCkqmrZZTVipuS2QsBUZRdAXPWCE28Y9La.jpeg",
    "https://www.mmclab.com.br/upload/service/b6oetfDYXF2I0eKGcpvwEg0kjB05OSwa2uPU1wf6.jpeg",
    "https://www.mmclab.com.br/upload/service/zkdqxUs9Ar3FX9yiktDy0RidIK3nUPBoVghzk7LB.jpeg"
];

export default function MaxplazaCasePage() {
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
                        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                        <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-secondary transition-colors mb-6 cursor-pointer">
                            <ArrowLeft className="w-4 h-4" /> Voltar para Cases
                        </Link>
                        
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-slate-800/80 text-indigo-500 dark:text-indigo-400 font-bold text-xs mb-4 border border-indigo-500/20 backdrop-blur-md">
                                <Building className="w-3.5 h-3.5" /> Ensaios & Desempenho
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                                Complexo Maxplaza Medical Center
                            </h1>
                            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
                                Serviço: Ensaios Acústicos, Resistência de Aderência à Tração e Peças Suspensas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Case Details Content */}
                <section className="py-16 bg-background-light dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-6">
                        
                        {/* Thin centered introduction box */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-12 text-center max-w-3xl mx-auto relative overflow-hidden">
                            <div className="absolute -right-10 top-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-[20px] pointer-events-none"></div>
                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                                &ldquo;O empreendimento Maxplaza Medical Center é composto por torres de uso residencial, comercial e hotel. Em cada um destes tipos de uso o desempenho deve ser tratado segundo as condições de uso específicas, de modo que os sistemas construtivos utilizados sejam de fato adequados às necessidades de uso.&rdquo;
                            </p>
                        </div>

                        {/* Image Carousel */}
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 bg-slate-900 border border-slate-200 dark:border-slate-800 group/carousel shadow-xl">
                            <img
                                src={IMAGES[imgIdx]}
                                alt={`Foto do case Maxplaza - ${imgIdx + 1}`}
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent pointer-events-none" />

                            {/* Arrow Controls */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 animate-fade-in"
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/50 hover:bg-slate-950/70 text-white flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 animate-fade-in"
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
                                            imgIdx === idx ? "bg-indigo-500 w-4" : "bg-white/60 hover:bg-white"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="prose dark:prose-invert max-w-none space-y-8 text-justify text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-indigo-500 shrink-0" />
                                    Ensaios Estruturais e de Cargas
                                </h3>
                                <p>
                                    A MMC Lab foi contratada para a realização de ensaios de desempenho estrutural dos sistemas de vedações verticais com o ensaio de cargas suspensas, cujos resultados permitem orientar os usuários sobre as cargas possíveis nas paredes e seus componentes de fixação adequados.
                                </p>
                                <p className="mt-4">
                                    Além disso, os ensaios de resistência de aderência à tração em revestimentos permitiram verificar se o sistema utilizado assegura a aderência que confere a integridade necessária para minimizar os riscos de dessolidarização ou desprendimento.
                                </p>
                            </div>

                            <hr className="border-slate-200 dark:border-slate-800" />

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-indigo-500 shrink-0" />
                                    Classificação Acústica e Redução Sonora
                                </h3>
                                <p>
                                    Em relação ao desempenho acústico, foi feita a classificação de ruído de entorno do empreendimento para as torres residenciais segundo as classes estabelecidas na ABNT NBR 15575 Parte 4. 
                                </p>
                                <p className="mt-4">
                                    Esta classificação é feita pela medição in loco dos níveis de ruído que incidem sobre as fachadas. Esta medição permite estabelecer o índice de redução sonora (Rw) em decibel que as esquadrias precisam apresentar para o isolamento acústico que a fachada deve proporcionar.
                                </p>
                                <p className="mt-4">
                                    Adicionalmente, foram realizados ensaios entre ambientes (tanto pelas vedações verticais quanto pelo piso) para garantir o isolamento acústico necessário em relação ao ruído aéreo e ao ruído de impacto.
                                </p>
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="mt-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Deseja um diagnóstico completo para sua obra?
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                Nossos especialistas realizam ensaios acústicos, térmicos e mecânicos acreditados pela NBR 15575.
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
