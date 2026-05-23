import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Ensaio de Esclerometria no Concreto | MMC LAB",
    description: "Avalie a dureza superficial e estime a resistência à compressão (fck) de estruturas de concreto endurecido de forma não destrutiva, conforme a ABNT NBR 7584.",
};

export default function EnsaioEsclerometriaPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-24 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/esclerometria.jpeg" 
                            alt="Fundo Esclerometria no Concreto" 
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
                            Esclerometria no Concreto
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios/campo" className="hover:text-white hover:underline transition-all">Em Campo</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Esclerometria no Concreto</span>
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
                                        Avaliação Não Destrutiva da Dureza Superficial e Resistência Estrutural
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O <strong>Ensaio de Esclerometria no Concreto in loco</strong> é um método de ensaio não destrutivo (END) altamente eficiente, utilizado para determinar o índice esclerométrico (dureza superficial) do concreto endurecido, permitindo estimar a sua resistência à compressão ($fck$) e mapear com precisão a homogeneidade e a qualidade do concreto ao longo de toda a estrutura armada.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Normatizado pela <strong>ABNT NBR 7584</strong>, este ensaio consiste na projeção de uma massa metálica calibrada acionada por mola (o pistão do esclerômetro de reflexão) contra a face do concreto preparado. A energia de rebote gerada pelo impacto mecânico é quantificada em um indicador analógico ou digital, fornecendo o índice de esclerometria direta da zona ensaiada, que se correlaciona com a resistência mecânica do concreto.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Por ser um ensaio totalmente não destrutivo, a esclerometria é a solução perfeita para a vistoria técnica de estruturas antigas, recebimento de obras paralisadas, mapeamento rápido de uniformidade em grandes elementos estruturais (lajes, vigas, pilares e fundações), e controle de qualidade adicional sempre que houver suspeitas ou discrepâncias nos resultados de rompimento de corpos de prova de concreto tradicionais.
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
                                            src="https://www.youtube.com/embed/8ohcUSw7wAg"
                                            title="Ensaio de Esclerometria no Concreto - MMC Lab"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                        ></iframe>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Demonstração de Ensaio de Esclerometria
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Veja no vídeo acima como nossos engenheiros realizam o ensaio in loco com alta precisão tecnológica.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0 mb-4">
                                        <span className="material-symbols-outlined text-[28px]">precision_manufacturing</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Preservação Estrutural Absoluta
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold leading-relaxed text-justify">
                                        Diferente de ensaios que demandam a extração destrutiva de testemunhos (furos no concreto que fragilizam pontualmente a armadura), a esclerometria preserva a total integridade mecânica das peças estruturais, viabilizando centenas de varreduras rápidas com excelente custo-benefício.
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
                                            <span>Norma Regulamentadora: <strong>ABNT NBR 7584</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Métricas de Aferição: <strong>Índice Esclerométrico (IE)</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Objetivo: <strong>Estimativa de fck e Homogeneidade</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Aplicação: <strong>Pilares, Vigas, Lajes e Fundações</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Fluxo Operacional de Esclerometria
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Nosso rigoroso método técnico de medição garante repetibilidade e estimativas confiáveis da resistência in loco.
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
                                            Delimitação e Polimento Superficial
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Nas regiões estruturais mapeadas, delimitamos quadrículas de ensaio de aproximadamente 100 mm x 100 mm. Para garantir leituras precisas, realizamos o lixamento mecânico ou polimento da nata de cimento superficial usando pedra abrasiva (carborundum) até que o concreto firme e agregado fino fiquem expostos e planos.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            PREPARAÇÃO TÉCNICA
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
                                            Aplicação de Impactos Ordenados
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Posicionamos o esclerômetro perpendicularmente (ortogonal) à superfície polida. Efetuamos uma grade contendo no mínimo 9 a 16 impactos uniformes na quadrícula, guardando distâncias mínimas recomendadas pela norma entre os pontos de impacto e as bordas. Anotam-se individualmente os índices de ricochete gerados.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            MEDIÇÃO E REBORES
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
                                            Tratamento Estatístico e Laudo
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Aplicamos o tratamento estatístico previsto na ABNT NBR 7584, descartando leituras discrepantes. A média aritmética do índice esclerométrico válido é correlacionada à curva de calibração própria do esclerômetro, traduzindo-se na estimativa da resistência à compressão ($fck$) com emissão do laudo técnico assinado.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            CÁLCULO E ANÁLISE fck
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-esclerometria" />

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
                                            Engenheiros especialistas em patologia de estruturas, controle tecnológico de concreto e ensaios não destrutivos.
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
                                            Rigor metodológico e precisão técnica garantidos pela acreditação CGCRE do Inmetro sob o selo CRL 1460.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">bolt</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Calibração Rigorosa RBC</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Esclerômetros calibrados periodicamente em bigornas de calibração padrão RBC, eliminando quaisquer desvios de leitura mecânica.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">devices</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Equipamentos Digitais Premium</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Uso de esclerômetros eletrônicos que registram os dados em tempo real, reduzindo erros humanos e gerando relatórios confiáveis.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">psychology</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Integração Metodológica</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Possibilidade de combinar a esclerometria com ensaios complementares de ultrassom de concreto ou pacometria in loco.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">analytics</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Laudo com Estatística e ART</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Emissão de laudo diagnóstico contendo a totalidade das análises estatísticas necessárias, gráficos de ricochete e anotação de responsabilidade técnica.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Precisa realizar o Ensaio de Esclerometria no Concreto?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Fale agora mesmo com nosso time de engenharia. Oferecemos diagnósticos precisos e propostas comerciais customizadas com a celeridade que seu projeto demanda.
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
