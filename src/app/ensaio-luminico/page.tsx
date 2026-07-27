import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EnsaioCarousel } from "@/components/EnsaioCarousel";
import Link from "next/link";

export const metadata = {
    title: "Ensaio Lumínico e Fator de Luz Diurna | MMC LAB",
    description: "Certifique o desempenho e conforto lumínico natural e artificial de edificações in loco, conforme as exigências da norma de desempenho ABNT NBR 15575.",
};

export default function EnsaioLuminicoPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="relative py-12 px-6 sm:px-8 text-white overflow-hidden bg-slate-950">
                    {/* Imagem de Fundo Premium */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="/images/ensaios/luminico.jpeg" 
                            alt="Fundo Ensaio Lumínico in loco" 
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
                            Ensaio Lumínico in loco
                        </h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-300 mt-2">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-50">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-50">&gt;</span>
                            <span className="text-[#00bfa5] font-bold">Ensaio Lumínico</span>
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
                                        Conforto Visual, Sustentabilidade e Desempenho Lumínico Certificados
                                    </h2>
                                    <div className="w-20 h-1.5 bg-[#00bfa5] rounded-full"></div>
                                </div>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    O <strong>Ensaio Lumínico in loco</strong> avalia com precisão científica as condições de iluminamento de uma edificação residencial, corporativa ou comercial, aferindo os níveis de luz artificial instalados e quantificando o aproveitamento de iluminação natural através do cálculo do **Fator de Luz Diurna (FLD)** nos compartimentos habitáveis.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    Balizado pelos requisitos de conforto e desempenho hídrico e visual da norma <strong>ABNT NBR 15575</strong> (partes 1 e 4) e pela norma regulamentadora de iluminação de ambientes internos <strong>ISO/CIE 8995-1</strong>, o ensaio emprega luxímetros fotoelétricos digitais de altíssima precisão e com devida calibração RBC, eliminando quaisquer interferências externas na medição de iluminância em Lux.
                                </p>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-justify">
                                    A luz natural adequada impacta diretamente no bem-estar fisiológico, na produtividade laboral e na eficiência de consumo energético de um edifício. O ensaio lumínico in loco é pré-requisito para construtoras e incorporadoras que visam a entrega técnica de habitações, homologação perante agentes financeiros (como a Caixa Econômica Federal) e obtenção de selos internacionais de sustentabilidade e eficiência energética, como o **Selo Casa Azul**, **LEED** e **AQUA-HQE**.
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
                                            src="/images/ensaios/luminico.jpeg"
                                            alt="Ensaio Lumínico e Fator de Luz Diurna"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                            Aferição de Iluminância e FLD
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">
                                            Luxímetros fotoelétricos de precisão calibrados RBC para medições síncronas in loco.
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
                                            <span>Desempenho Predial: <strong>ABNT NBR 15575-1 / 15575-4</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">assignment</span>
                                            <span>Locais de Trabalho: <strong>ABNT NBR ISO/CIE 8995-1</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">shield</span>
                                            <span>Métricas Foco: <strong>FLD (%) e Níveis de Iluminância (Lux)</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#00bfa5] text-[20px]">place</span>
                                            <span>Método: <strong>Luxímetro Digital com Correção de Cosseno</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metodologias / Ensaios Conforme a Norma */}
                        <div className="mt-24 space-y-12">
                            <div className="text-center max-w-3xl mx-auto space-y-3">
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                                    Etapas do Procedimento Lumínico
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    Como realizamos o mapeamento fotométrico e aferimos o Fator de Luz Diurna (FLD) in loco.
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
                                            Malha de Aferição e Pontos
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Com base nas plantas de arquitetura, mapeamos os ambientes residenciais ou comerciais a serem testados. Determinamos uma malha geométrica de pontos de acordo com a área de cada cômodo, a distância das esquadrias de iluminação e a altura padrão do plano de trabalho (geralmente a 0,75 m do piso acabado).
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            PLANEJAMENTO GEOMÉTRICO
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
                                            Medição de Iluminância in loco
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Usando luxímetros calibrados na RBC com filtros corretores, efetuamos a medição estática nos pontos internos. Para o cálculo do Fator de Luz Diurna (FLD), as medições internas são sincronizadas eletronicamente com medições da iluminância externa horizontal sob céu desimpedido, coletando dados fidedignos em tempo real.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            MEDIÇÃO E REGISTRO Lux
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
                                            Cálculo de FLD e Emissão do Laudo
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                                            Consolidamos as leituras internas e externas para expressar o FLD em porcentagem (%). Os dados de iluminação artificial e natural são enquadrados nas faixas de desempenho mínimo, intermediário ou superior exigidos pela NBR 15575. Geramos um laudo técnico completo anexado à ART.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-[10px] font-bold text-[#00bfa5] dark:text-teal-400 uppercase tracking-widest bg-[#00bfa5]/10 px-2.5 py-1 rounded-md">
                                            ANÁLISE E LAUDO TÉCNICO
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                <EnsaioCarousel ensaioId="campo-luminico" />

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
                                            Engenheiros especialistas em controle de qualidade, conforto ambiental, física de edifícios e luminotécnica.
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
                                            Sua garantia de rigor analítico, metodologias consolidadas e credibilidade técnica chancelada sob o selo CRL 1460.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">bolt</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Luxímetros Homologados RBC</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Sensores fotoelétricos com altíssima repetibilidade e com calibração rastreável à Rede Brasileira de Calibração.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">devices</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Foco nas Certificações</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Essencial para a comprovação de créditos de qualidade ambiental em auditorias LEED, AQUA, Edge e Selo Azul Caixa.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">psychology</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Células de Medição Síncronas</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Metodologia avançada com aquisição simultânea interna e externa, minimizando erros gerados por passagens de nuvens rápidas.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[26px]">analytics</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Mapas Fotométricos e ART</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Laudos visualmente ricos, acompanhados de gráficos de isolinhas de iluminância, detalhamento matemático e emissão de ART.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Precisa realizar o Ensaio Lumínico ou de Fator de Luz Diurna?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Fale com os especialistas da MMC LAB. Desenvolvemos campanhas de medição fotométrica personalizadas para atestar a conformidade do seu empreendimento com rapidez e rigor.
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
