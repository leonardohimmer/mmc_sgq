import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Ensaio de Impacto de Corpo Mole e Corpo Duro | MMC LAB",
    description: "Certifique a resistência mecânica e segurança de vedações verticais (fachadas e paredes) a impactos in loco em conformidade com as exigências da norma de desempenho ABNT NBR 15575-4.",
};

export default function EnsaioImpactoPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-24 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/impacto.jpeg" 
                            alt="Fundo Impacto de Corpo Mole e Corpo Duro" 
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
                            Impacto de Corpo Mole e Corpo Duro
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios/campo" className="hover:text-white hover:underline transition-all">Em Campo</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Impacto de Corpo Mole e Duro</span>
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
                                        Segurança Mecânica e Resistência contra Choques Físicos sob Diretriz da NBR 15575
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O <strong>Ensaio de Impacto de Corpo Mole e Corpo Duro in loco</strong> é uma avaliação física essencial para atestar a estabilidade estrutural, a integridade superficial e a segurança de uso dos sistemas de vedações verticais (paredes de vedação externa, alvenarias internas, divisórias leves e fachadas).
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Normatizado pela <strong>ABNT NBR 15575-4</strong>, o ensaio submete o protótipo instalado a choques mecânicos para certificar que o sistema de vedação não sofra colapso, perfurações severas, perda de estabilidade ou projeção de estilhaços cortantes perigosos decorrentes de acidentes de usuários ou impactos rotineiros.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Dividido em duas categorias complementares, o ensaio de <strong>Corpo Mole</strong> simula o choque acidental de pessoas ou animais contra a vedação por meio de um saco de couro ou lona especial pesando 40 kg, preenchido com argila e suspenso como pêndulo a alturas calibradas. Já o ensaio de <strong>Corpo Duro</strong> simula o impacto localizado de objetos pontiagudos ou rígidos do dia a dia (como ferramentas, sapatos ou quinas de móveis) usando esferas de aço maciço e polido com massas calibradas de 500g e 1kg.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    A aplicação in loco é obrigatória para a homologação e aceitação técnica de sistemas construtivos inovadores de drywall, blocos de gesso, divisórias leves pré-fabricadas e sistemas modulares estruturados em wood ou light steel framing. O teste afere não apenas os painéis em si, mas a eficácia da montagem, a ancoragem dos perfis estruturais e a fixação nas lajes limítrofes.
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

                            {/* Coluna Direita: Detalhes Técnicos e Conceito */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-md group">
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
                                        <img
                                            src="/images/ensaios/impacto.jpeg"
                                            alt="Ensaio de Impacto de Corpo Mole e Corpo Duro"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Resistência a Impactos Dinâmicos
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Ensaio com pêndulo normativo de 40 kg e esferas de aço calibradas para certificar a estabilidade mecânica.
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
                                            <span>Fachadas e Paredes: <strong>ABNT NBR 15575-4</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Divisórias Leves Internas: <strong>ABNT NBR 11675</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Massa Corpo Mole: <strong>40 kg (Pêndulo Normativo)</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Energias de Impacto: <strong>Até 480J (Mole) & Até 10J (Duro)</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Etapas do Ensaio de Impacto Dinâmico
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Conheça o processo técnico rigoroso que garante a estabilidade de fachadas e divisórias.
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
                                            Mapeamento da Área e Pontos Críticos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Seleção do vão de ensaio e marcação de todos os pontos de impacto regulados normativamente. O teste exige impacto nos centros geométricos de painéis suspensos, nas junções horizontais e verticais de perfis, em cantos externos expostos e nas proximidades imediatas de fixadores estruturais, cobrindo as zonas de maior estresse físico.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            MARCAÇÃO E PREPARAÇÃO
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
                                            Aplicação de Choques Mecânicos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Liberação do pêndulo calibrado (Corpo Mole, 40 kg) de alturas pré-calculadas em metros para simular energias cinéticas de impacto crescentes de acordo com o nível exigido (Mínimo, Intermediário ou Superior). Em seguida, são liberadas as esferas de aço (Corpo Duro) com guias magnéticas para medir a resistência localizada.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            ENSAIOS DE IMPACTO
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
                                            Medição de Deflexões e Danos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Engenheiros da MMC LAB utilizam sensores digitais micrométricos e medidores ópticos para registrar o deslocamento instantâneo no ato do choque e o deslocamento residual permanente. Inspeciona-se visualmente e taticamente a ocorrência de fissuras, fraturas, descolamento de revestimentos ou esmagamento dos montantes estruturais.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            DIAGNÓSTICO E EMISSÃO DE ART
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-impacto" />

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
                                            Engenheiros especialistas em controle de qualidade, patologias de revestimento e desempenho da construção civil.
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
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Tecnologia de Ponta</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Pórticos e dispositivos de liberação magnética precisos, eliminando interferências manuais nas leituras de energia.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">devices</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Instrumentos Calibrados RBC</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Sensores de deslocamento micrométricos e balanças de massa padrão aferidas por laboratórios pertencentes à Rede Brasileira de Calibração.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">psychology</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Método Conclusivo Integrado</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Além da medição mecânica, realizamos análises fotográficas de microfissuras com microscópio de campo para identificar fraquezas na vedação.
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
                                            Fornecemos ensaios complementares de desempenho, estanqueidade hídrica, conforto lumínico e acústica predial em campo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Precisa realizar o Ensaio de Impacto de Corpo Mole e Corpo Duro?
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
