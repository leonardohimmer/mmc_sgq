import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Ensaio de Integridade de Estacas (PIT) | MMC LAB",
    description: "Verifique a integridade e continuidade do fuste de estacas de fundação de forma não destrutiva pelo método PIT, em conformidade com as normas técnicas ABNT NBR 6122 e ASTM D5882.",
};

export default function EnsaioPITPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-24 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/pit.jpeg" 
                            alt="Fundo Ensaio de Integridade de Estacas (PIT)" 
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
                            Ensaio de Integridade de Estacas (PIT)
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios/campo" className="hover:text-white hover:underline transition-all">Em Campo</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Integridade de Estacas (PIT)</span>
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
                                        Segurança e Controle de Fundações Profundas
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O ensaio de integridade de estacas em fundações de edificações – PIT (Pile Integrity Test) tem como objetivo verificar a integridade física e detectar eventuais alterações expressivas no fuste da estaca (como reduções de seção, trincas, vazios no concreto ou contaminações com solo).
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Trata-se de um ensaio não destrutivo dinâmico de baixa deformação que pode ser realizado de forma rápida e eficiente tanto em estacas pré-moldadas quanto em estacas moldadas in loco (estacas escavadas, hélice contínua, barretas, entre outras). O processo consiste na colagem de um acelerômetro de alta sensibilidade no topo da estaca e na subsequente aplicação de golpes leves com um martelo de mão apropriado.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    A onda gerada pelo impacto do martelo propaga-se ao longo do fuste da estaca e reflete-se na sua ponta ou em qualquer descontinuidade existente ao longo do caminho. Os sinais refletidos são captados pelo sensor e enviados a um sistema de processamento de dados para análise de integridade da fundação.
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
                                        A MMC LAB possui acreditação da Coordenação Geral de Acreditação (CGCRE) do Inmetro para diversos escopos, sob o número <strong className="text-[#00bfa5] dark:text-teal-400">CRL 1460</strong> (atendendo à ABNT NBR ISO/IEC 17025). Embora o ensaio PIT em campo siga procedimentos específicos, toda a nossa metodologia e controle de qualidade são balizados pelas melhores práticas internacionais e de laboratórios acreditados.
                                    </p>
                                </div>
                            </div>

                            {/* Coluna Direita: Vídeo e Resumo Rápido */}
                            <div className="lg:col-span-5 space-y-8">
                                {/* Container da Imagem de Capa com visual premium */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-md group">
                                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
                                        <img
                                            src="/images/ensaios/pit.jpeg"
                                            alt="Integridade de Estacas (PIT)"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Tecnologia Não Destrutiva in loco
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Eco-teste de baixa deformação realizado com martelo instrumentado e acelerômetro de alta sensibilidade.
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
                                            <span>Fundações: <strong>ABNT NBR 6122</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Baixa Deformação: <strong>ASTM D5882</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Método: <strong>Dinâmico Não Destrutivo</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Aplicação: <strong>Fundação Profunda (In loco)</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Etapas do Ensaio PIT
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Conheça o processo técnico cuidadoso que realizamos para atestar a qualidade das fundações profundas da sua obra.
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
                                            Preparação do Topo da Estaca
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Para a perfeita aderência do acelerômetro e propagação correta da onda acústica, o topo da estaca deve ser regularizado com lixadeira ou ponteiro, removendo qualquer concreto de qualidade inferior (nata de cimento) até expor o concreto são.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            PREPARAÇÃO E LIMPEZA
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
                                            Aplicação de Impacto e Leitura
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            O sensor é acoplado temporariamente ao topo por meio de uma cera adesiva de alta densidade. São aplicados diversos golpes leves com um martelo instrumentalizado que induz ondas de tensão de baixa intensidade pelo fuste da estaca.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            MENSURAÇÃO ACÚSTICA
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
                                            Análise de Refletograma
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            As curvas de velocidade x tempo são plotadas e analisadas por engenheiros geotécnicos especializados, identificando se há reflexões intermediárias causadas por defeitos ou variações de rigidez do fuste até o reflexo final da ponta.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            LAUDO TÉCNICO GEOTÉCNICO
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-pit" />

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
                                Entre em contato com um especialista em Ensaio de Integridade de Estacas (PIT) da MMC LAB e solicite uma proposta técnica personalizada para sua obra.
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
