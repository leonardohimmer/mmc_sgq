"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const WHATSAPP_URL =
    "https://api.whatsapp.com/send/?phone=5551996334819&text&type=phone_number&app_absent=0";

const MAPS_URL =
    "https://www.google.com/maps/place/MMC+LAB+Controle+Tecnol%C3%B3gico+Ltda./@-29.9539486,-51.1727562,948m/data=!3m2!1e3!4b1!4m6!3m5!1s0x951977a750f45963:0xd3ae1b88081f216e!8m2!3d-29.9539486!4d-51.1727562!16s%2Fg%2F12mkvnkhn?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D";

export default function ContatoPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 pb-16 sm:pt-14 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-slate-800/50 text-primary font-bold text-sm mb-6 border border-primary/20 dark:border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)] dark:shadow-[0_0_15px_rgba(77,182,172,0.3)]">
                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                            Canais de Atendimento
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-lg">
                            Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">MMC Lab</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 subpage-hero-p">
                            Entre em contato com nossa equipe técnica e comercial para solicitar orçamentos, agendar ensaios ou tirar dúvidas sobre o seu empreendimento.
                        </p>
                    </div>
                </section>

                {/* Seção Principal de Contato */}
                <section className="py-20 sm:py-24 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6 space-y-16">

                        {/* Caixa Principal de Escolha (Mesmo padrão da página de Ensaios) */}
                        <div className="text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Ficou com alguma dúvida ou precisa de um orçamento rápido?
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Entre em contato com um especialista da MMC LAB e solicite uma proposta técnica personalizada para sua obra.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/login-cliente"
                                    className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    SOLICITAR ORÇAMENTO PELO SISTEMA
                                </Link>
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    SOLICITAR ORÇAMENTO PELO WHATSAPP
                                </a>
                            </div>
                        </div>

                        {/* Cards de Canais de Atendimento Direto */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* WhatsApp */}
                            <div className="bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-500/20 p-8 rounded-3xl text-slate-800 dark:text-white shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-tl-full blur-[30px] transition-transform group-hover:scale-125 pointer-events-none"></div>
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 ring-1 ring-emerald-500/20">
                                        <span className="material-symbols-outlined text-3xl">chat</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        Agilidade no WhatsApp
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                        Precisa de resposta rápida para o seu caso construtivo? Nosso atendimento via WhatsApp flui com dinâmica comercial para agilizar sua proposta.
                                    </p>
                                </div>
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full"
                                >
                                    Abrir Conversa Agora
                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </a>
                            </div>

                            {/* Telefone PABX */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 ring-1 ring-primary/20">
                                        <span className="material-symbols-outlined text-3xl">call</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        Telefone PABX
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                        Atendimento telefônico direto com nossa equipe técnica, comercial e administrativa em horário comercial.
                                    </p>
                                </div>
                                <a
                                    href="tel:05131032929"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-primary/10 hover:border-primary/30 text-slate-800 dark:text-white rounded-xl font-bold text-sm transition-all w-full"
                                >
                                    <span className="material-symbols-outlined text-primary text-[18px]">phone_in_talk</span>
                                    (51) 3103-2929
                                </a>
                            </div>

                            {/* Endereço Sede */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 ring-1 ring-primary/20">
                                        <span className="material-symbols-outlined text-3xl">location_on</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        Endereço Sede
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                        Rua Bagé, 351 — Bairro Niterói<br />
                                        Canoas / RS
                                    </p>
                                </div>
                                <a
                                    href={MAPS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-primary/10 hover:border-primary/30 text-slate-800 dark:text-white rounded-xl font-bold text-sm transition-all w-full"
                                >
                                    <span className="material-symbols-outlined text-primary text-[18px]">map</span>
                                    Ver Localização no Mapa
                                </a>
                            </div>
                        </div>

                        {/* Bloco Complementar: Portal do Cliente, Redes Sociais e Mapa */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Informações Institucionais & Portal */}
                            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col justify-between space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                        Atendimento Integrado
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        Portal exclusivo para clientes
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                                        Através do nosso sistema, construtoras e contratantes podem solicitar novos ensaios, acompanhar o status das ordens de serviço em tempo real e acessar propostas e relatórios técnicos com total rastreabilidade.
                                    </p>
                                    <div className="pt-2">
                                        <Link
                                            href="/login-cliente"
                                            className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-sm"
                                        >
                                            Acessar Área do Cliente
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                                        Acompanhe nas Redes Sociais
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href="https://www.instagram.com/mmc.lab/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/company/mmc-lab-controle-tecnologico/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="LinkedIn"
                                            className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a
                                            href="https://www.youtube.com/@mmclab_canoas"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="YouTube"
                                            className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all"
                                        >
                                            <Youtube className="w-5 h-5" />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/mmclab.controle"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Mapa Interativo */}
                            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-3xl shadow-sm min-h-[340px] flex flex-col">
                                <iframe
                                    title="Localização MMC Lab - Rua Bagé, 351, Niterói, Canoas/RS"
                                    src="https://www.google.com/maps?q=Rua+Bag%C3%A9,+351,+Niter%C3%B3i,+Canoas+-+RS&output=embed"
                                    className="w-full h-full min-h-[320px] rounded-2xl border-0 flex-1"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
