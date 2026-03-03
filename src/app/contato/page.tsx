import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function ContatoPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900 border-b border-slate-800">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 text-primary font-bold text-sm mb-6 border border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.3)]">
                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                            Atendimento ao Cliente
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                            Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">MMC Lab</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-10">
                            Preencha o formulário abaixo, ou se preferir, chame a nossa equipe via WhatsApp ou telefone para sanar as dúvidas sobre os ensaios.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* Formulário Mock */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-[0_0_40px_rgba(77,182,172,0.1)] transition-shadow">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">Solicitar Orçamento / Informações</h3>
                                <form className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome Completo</label>
                                            <input type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="João da Silva" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label>
                                            <input type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="(00) 00000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail Profissional</label>
                                        <input type="email" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="joao@construtora.com.br" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Como podemos ajudar?</label>
                                        <textarea rows={4} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" placeholder="Gostaria de orçar uma avaliação acústica em obra..."></textarea>
                                    </div>
                                    <button type="button" className="w-full p-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                        Enviar Mensagem
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </form>
                            </div>

                            {/* Info Box */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-emerald-500/10 rounded-tl-full blur-[30px] transition-transform group-hover:scale-125"></div>
                                    <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-400 text-3xl">chat</span>
                                        Agilidade no WhatsApp
                                    </h3>
                                    <p className="text-slate-300 font-medium mb-8 relative z-10">
                                        Precisa de resposta rápida urgente para o seu caso construtivo? Nosso atendimento via WhatsApp flui com dinâmica comercial para agilizar sua proposta.
                                    </p>
                                    <a href="#" className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full md:w-auto">
                                        Abrir Conversa Agora
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl mb-4">location_on</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Endereço Sede</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rua Bagé, 351<br />Niterói - Canoas/RS</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl mb-4">call</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Telefone PABX</h4>
                                        <a href="tel:05131032929" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">(51) 3103-2929</a>
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
