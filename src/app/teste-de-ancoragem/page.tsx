import { EnsaioHeroBanner } from "@/components/EnsaioHeroBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Teste de Ancoragem (Arrancamento) | MMC LAB",
    description: "Garanta a segurança e resistência mecânica de olhais, chumbadores, inserts e grampos de ancoragem através de ensaios in loco em conformidade com as normas ABNT NBR 16259 e NBR 14827.",
};

export default function TesteAncoragemPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                <EnsaioHeroBanner 
                    badge="Ensaios e Controle Tecnológico"
                    title="Teste de Ancoragem (Arrancamento)"
                    breadcrumbCurrent="Teste de Ancoragem"
                    imageSrc="/images/ensaios/ancoragem.jpeg"
                    imageAlt="Fundo Teste de Ancoragem (Arrancamento)"
                />

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
                                        Validação de Segurança para Fixações e Olhais de Ancoragem
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O <strong>Teste de Ancoragem (Ensaio de Resistência à Tração de Chumbadores / Olhais)</strong> tem o objetivo de verificar, de forma prática e in loco, se os dispositivos de ancoragem física instalados em edificações apresentam a capacidade de carga mínima requerida pelas especificações do projeto de engenharia ou segurança.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Esse teste é altamente empregado para homologar e garantir a segurança estrutural de dispositivos cruciais, como: <strong>olhais de fixação para linhas de vida</strong>, <strong>inserts metálicos</strong>, <strong>barras rosqueadas</strong>, <strong>chumbadores químicos ou mecânicos</strong> e <strong>grampos</strong> instalados na edificação. Com a utilização de equipamentos extratores calibrados e de células de carga digitais, aplicamos forças estáticas controladas diretamente nos dispositivos para analisar seu comportamento sob esforços severos.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    A segurança em altura e a proteção contra quedas exigem soluções de fixação absolutamente seguras. O teste de arrancamento in loco é a única forma de certificar que a ancoragem suportará as tensões extremas previstas em normas regulamentadoras sem sofrer falhas estruturais, arrancamento ou colapso do material de base.
                                </p>

                                {/* Acreditação Geral da MMC LAB */}
                                <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-[#00bfa5] rounded-r-2xl p-6 sm:p-8 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#00bfa5]/10 flex items-center justify-center text-[#00bfa5]">
                                            <span className="material-symbols-outlined text-[24px]">verified</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Acreditação e Rigor Técnico
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                                        A MMC LAB conta com acreditação da Coordenação Geral de Acreditação (CGCRE) do Inmetro sob o registro <strong className="text-[#00bfa5] dark:text-teal-400">CRL 1460</strong>, operando rigorosamente em conformidade com as diretrizes internacionais da norma ABNT NBR ISO/IEC 17025. Toda a nossa infraestrutura metodológica e calibração de instrumentos de ensaio seguem padrões excepcionais de excelência técnica.
                                    </p>
                                </div>
                            </div>

                            {/* Coluna Direita: Vídeo e Resumo Rápido */}
                            <div className="lg:col-span-5 space-y-8">
                                {/* Container do Player do YouTube com visual premium */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-md group">
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
                                        <iframe
                                            src="https://www.youtube.com/embed/e39D7fhBm_o"
                                            title="Teste de Ancoragem (Arrancamento) - MMC Lab"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                        ></iframe>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Demonstração de Teste de Ancoragem
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Veja no vídeo acima como nossos engenheiros realizam o ensaio in loco com alta precisão tecnológica.
                                        </p>
                                    </div>
                                </div>

                                {/* Detalhes Técnicos e Conceito */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0 mb-4">
                                        <span className="material-symbols-outlined text-[28px]">anchor</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Aplicações Indispensáveis
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold leading-relaxed text-justify">
                                        Essencial para a liberação de linhas de vida para trabalho em altura (NR 35), montagem e fixação de andaimes de fachadas, ar condicionados industriais e validação de inserts estruturais em estruturas de concreto ou alvenaria estrutural.
                                    </p>
                                </div>

                                {/* Selo Resumo Técnico */}
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Ficha Técnica do Ensaio
                                    </h4>
                                    <ul className="space-y-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">gavel</span>
                                            <span>Fachadas (Ancoragem): <strong>ABNT NBR 16259</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Arrancamento de Tirantes: <strong>ABNT NBR 14827</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Segurança em Altura: <strong>NR 35 & NBR 16325</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Método: <strong>Tração Estática Direta in loco</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Etapas do Teste de Ancoragem
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Entenda nosso procedimento operacional de alta precisão para atestar as fixações da sua edificação.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Passo 1 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            01
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Mapeamento e Inspeção Visual
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Nossa equipe realiza a conferência das posições físicas dos chumbadores, olhais e inserts de acordo com o projeto executivo de segurança ou arquitetônico. É realizada uma vistoria preliminar para garantir que não haja corrosão, fissuras visíveis ou instalação inadequada do material de base.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            VISTORIA INICIAL
                                        </span>
                                    </div>
                                </div>

                                {/* Passo 2 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            02
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Ensaios Mecânicos Estáticos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            O extrator dinâmico calibrado é fixado de forma concêntrica ao dispositivo sob análise. Uma força de tração estática progressiva e contínua é imposta sobre a ancoragem por meio de acionamento hidráulico suave, monitorado de perto por células de carga de alta resolução, até atingir o patamar regulamentar ou de projeto.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            SOLICITAÇÃO DE CARGA
                                        </span>
                                    </div>
                                </div>

                                {/* Passo 3 */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/40 transition-all duration-300 shadow-sm flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(0,191,165,0.06)] hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 font-extrabold text-lg">
                                            03
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Análise e Emissão do Laudo
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Aferimos os deslocamentos microscópicos do chumbador e a carga máxima de pico atingida. Após a coleta dos dados in loco, nossos engenheiros emitem o Laudo Técnico detalhando os ensaios realizados com as respectivas Anotações de Responsabilidade Técnica (ART), validando a segurança do sistema.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            LAUDO E ART
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-ancoragem" />

                        {/* Diferenciais da MMC Lab */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Diferenciais da MMC Lab
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    A escolha confiável para construtoras, indústrias e engenharias de segurança em todo o território nacional.
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
                                            Engenheiros especialistas em controle de qualidade, mecânica de materiais e segurança do trabalho in loco.
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
                                            Credibilidade técnica e conformidade garantidas pela acreditação da CGCRE do Inmetro sob número CRL 1460.
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
                                            Resposta rápida nos agendamentos em canteiros de obras e emissão célere de laudos para não paralisar o cronograma.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">devices</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Equipamentos Calibrados</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Células de carga e dinamômetros hidráulicos modernos com rastreabilidade de calibração RBC (Rede Brasileira de Calibração).
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
                                            Treinamento intensivo da nossa equipe de ensaios em campo sobre novos métodos regulamentares e tecnologias.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">analytics</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Ampla Gama de Soluções</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Fornecemos ensaios complementares de desempenho, acústica predial e laboratorial, além de ensaios mecânicos de vedações.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Precisa realizar Teste de Ancoragem ou Arrancamento?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Fale agora mesmo com nosso time de especialistas. Oferecemos propostas técnicas customizadas de acordo com as particularidades da sua obra ou instalação.
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
