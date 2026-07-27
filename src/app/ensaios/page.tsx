import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Ensaios | MMC LAB",
    description: "Avaliações rigorosas estruturais e acústicas in loco e em laboratório, garantindo conformidade com a ABNT NBR 15575.",
};

const ensaios = [
    {
        id: "acustica",
        title: "Acústica em Campo",
        icon: "graphic_eq",
        category: "Desempenho (NBR 15575)",
        norma: "ISO 16283 & NBR 15575",
        image: "/images/ensaios/acustica.jpeg",
        description: "Medição in loco do isolamento acústico para certificar se as paredes, pisos, fachadas e coberturas atendem aos critérios de conforto e privacidade em edifícios.",
        items: [
            "Isolamento de Ruído Aéreo entre Ambientes (Paredes/Portas)",
            "Isolamento de Ruído de Impacto em Pisos (Lajes)",
            "Isolamento Acústico de Fachadas e Coberturas",
            "Nível de Ruído de Equipamentos Prediais e Hidráulicos"
        ],
        link: "/ensaios-acusticos-em-campo"
    },
    {
        id: "isolamento-acustico",
        title: "Isolamento Acústico em Laboratório (Rw)",
        icon: "graphic_eq",
        category: "Desempenho (NBR 15575)",
        norma: "ISO 10140 & ISO 717",
        image: "/images/ensaios/acustica-lab.jpg",
        description: "Ensaios em câmaras controladas para determinação do isolamento acústico (Rw) de componentes e sistemas construtivos sob rigorosas variáveis físicas.",
        items: [
            "Esquadrias Acústicas e Janelas",
            "Sistemas de Portas e Vedações",
            "Paredes de Drywall e Alvenarias",
            "Fachadas e Divisórias Leves"
        ],
        link: "/ensaios-acusticos-em-laboratorio"
    },
    {
        id: "guarda-corpo",
        title: "Guarda-corpos e Corrimãos",
        icon: "architecture",
        category: "Desempenho (NBR 15575)",
        norma: "ABNT NBR 14718",
        image: "/images/ensaios/guarda-corpo.jpeg",
        description: "Avaliação da segurança e resistência estrutural de guarda-corpos e parapeitos instalados in loco ou em laboratório por testes mecânicos de esforço e impacto.",
        items: [
            "Ensaio de Esforço Estático Horizontal (Carga Linear)",
            "Ensaio de Esforço Estático Vertical",
            "Ensaio de Impacto Dinâmico (Corpo Mole)",
            "Auditoria de Sistemas de Fixação e Conexões"
        ],
        link: "/ensaio-de-guarda-corpo-e-parapeito"
    },
    {
        id: "aderencia",
        title: "Aderência à Tração",
        icon: "handyman",
        category: "Fachadas & Revestimentos",
        norma: "NBR 13528 & NBR 13749",
        image: "/images/ensaios/aderencia.jpeg",
        description: "Medição da resistência de aderência à tração de revestimentos argamassados e cerâmicos in loco ou em laboratório, prevenindo quedas e falhas estruturais.",
        items: [
            "Resistência à Tração de Revestimento Argamassado",
            "Resistência à Tração de Placas Cerâmicas Aderidas",
            "Corte e Extração de Pastilhas e Corpos de Prova",
            "Mapeamento Sistemático e Laudo de Aderência"
        ],
        link: "/ensaio-de-resistencia-de-aderencia-a-tracao"
    },
    {
        id: "pit",
        title: "Integridade de Estacas (PIT)",
        icon: "foundation",
        category: "Fundações & Estruturas",
        norma: "ASTM D5882",
        image: "/images/ensaios/pit.jpeg",
        description: "O ensaio PIT (Pile Integrity Test) avalia a integridade física de estacas de fundação profunda de forma não destrutiva, mapeando falhas ocultas no fuste.",
        items: [
            "Ensaio Dinâmico de Baixa Deformação (Eco-teste)",
            "Detecção de Fissuras, Vazios e Constrições Ocultas",
            "Leitura de Sinais com Acelerômetro de Alta Sensibilidade",
            "Diagnóstico Rápido e Preciso da Qualidade do Fuste"
        ],
        link: "/ensaio-de-integridade-de-estacas-pit"
    },
    {
        id: "ancoragem",
        title: "Teste de Ancoragem",
        icon: "anchor",
        category: "Fundações & Estruturas",
        norma: "ABNT NBR 16259 & NBR 14827",
        image: "/images/ensaios/ancoragem.jpeg",
        description: "Verificação da capacidade de carga e resistência de arrancamento mecânico de parafusos, buchas, pinos e ancoragens químicas sob tensões especificadas in loco.",
        items: [
            "Ensaios de Arrancamento Estático In Loco",
            "Validação de Fixações de Linhas de Vida e Andaimes",
            "Homologação de Dispositivos de Ancoragem",
            "Aferição de Deslocamento e Carga de Ruptura"
        ],
        link: "/teste-de-ancoragem"
    },
    {
        id: "permeabilidade",
        title: "Permeabilidade e Estanqueidade",
        icon: "water_drop",
        category: "Desempenho (NBR 15575)",
        norma: "ABNT NBR 15575-4",
        image: "/images/ensaios/permeabilidade.jpeg",
        description: "Avaliação do comportamento das vedações verticais (paredes e fachadas) sob chuva direcionada induzida para identificar e prevenir falhas de estanqueidade.",
        items: [
            "Aspersão Hidráulica Contínua e Pressurizada in loco",
            "Detecção de Pontos de Infiltração e Falhas de Vedação",
            "Ensaio de Estanqueidade à Água de Chuva em Fachadas",
            "Validação de Esquadrias e Encontros de Alvenaria"
        ],
        link: "/ensaio-de-permeabilidade"
    },
    {
        id: "esclerometria",
        title: "Esclerometria no Concreto",
        icon: "precision_manufacturing",
        category: "Fundações & Estruturas",
        norma: "ABNT NBR 7584",
        image: "/images/ensaios/esclerometria.jpeg",
        description: "Ensaio não destrutivo com esclerômetro digital ou analógico de alta calibração, avaliando a dureza superficial do concreto para estimar a resistência à compressão.",
        items: [
            "Estimativa do fck da Estrutura In Loco",
            "Mapeamento da Homogeneidade e Dureza do Concreto",
            "Localização Rápida de Pontos com Concreto Fragilizado",
            "Avaliação sem Danos à Estrutura Armada"
        ],
        link: "/ensaio-de-esclerometria-no-concreto"
    },
    {
        id: "luminico",
        title: "Ensaio Lumínico",
        icon: "light_mode",
        category: "Desempenho (NBR 15575)",
        norma: "NBR 15575 & ISO/CIE 8995-1",
        image: "/images/ensaios/luminico.jpeg",
        description: "Medições em campo dos níveis de iluminância e da luz natural disponível nos compartimentos internos da edificação para verificação do conforto e eficiência lumínica.",
        items: [
            "Cálculo do Fator de Luz Diurna (FLD) In Loco",
            "Medição de Níveis de Iluminância Artificial e Natural",
            "Uso de Luxímetros de Precisão com Calibração RBC",
            "Conformidade com os Critérios de Desempenho Visual"
        ],
        link: "/ensaio-luminico"
    },
    {
        id: "impacto",
        title: "Impacto de Corpo Mole e Duro",
        icon: "bolt",
        category: "Desempenho (NBR 15575)",
        norma: "ABNT NBR 15575-4",
        image: "/images/ensaios/impacto.jpeg",
        description: "Testes para verificar a resistência a impactos mecânicos in loco em paredes, painéis de vedação e sistemas drywall, garantindo que resistam a choques comuns sem danos.",
        items: [
            "Ensaio de Impacto de Corpo Mole (Sacos de Argila/Couro)",
            "Ensaio de Impacto de Corpo Duro (Esferas de Aço Polido)",
            "Análise de Deformações Plásticas e Fissuras após Choques",
            "Garantia contra Intrusão e Acidentes Domésticos"
        ],
        link: "/impacto-de-corpo-mole-e-corpo-duro"
    },
    {
        id: "pecas-suspensas",
        title: "Ensaio de Peças Suspensas",
        icon: "shelves",
        category: "Desempenho (NBR 15575)",
        norma: "ABNT NBR 15575-4",
        image: "/images/ensaios/pecas-suspensas.jpeg",
        description: "Ensaio mecânico de carregamento para avaliar se as paredes internas e divisórias suportam o peso de mobiliários pesados e redes de dormir fixadas.",
        items: [
            "Aplicação de Carga Vertical Estática por Dispositivo Normatizado",
            "Aferição de Deslocamentos Instantâneos e Residuais",
            "Simulação de Prateleiras, Armários e Redes de Dormir",
            "Homologação da Segurança Estrutural do Drywall e Alvenaria"
        ],
        link: "/ensaio-de-pecas-suspensas"
    },
    {
        id: "inspecao-fachada",
        title: "Inspeção de Fachadas",
        icon: "visibility",
        category: "Fachadas & Revestimentos",
        norma: "ABNT NBR 13755 & NBR 16747",
        image: "/images/ensaios/inspecao-fachada.jpeg",
        description: "Mapeamento sistemático de manifestações patológicas em fachadas de prédios comerciais e residenciais, garantindo a integridade dos revestimentos cerâmicos e pinturas.",
        items: [
            "Mapeamento Visual e Físico de Destacamentos",
            "Identificação de Fissuras, Trincas, Eflorescência e Bolores",
            "Laudo de Engenharia com Registro Fotográfico e Diagnóstico",
            "Definição de Métodos Corretivos e Plano de Manutenção"
        ],
        link: "/inspecao-de-fachadas"
    },
    {
        id: "percussao",
        title: "Ensaio de Percussão",
        icon: "hearing",
        category: "Fachadas & Revestimentos",
        norma: "ABNT NBR 13755",
        image: "/images/ensaios/percussao.jpeg",
        description: "Técnica tátil e acústica minuciosa executada em fachadas para identificar som cavo, que indica o descolamento oculto do revestimento sob a argamassa ou cerâmica.",
        items: [
            "Identificação de Falhas de Aderência Ocultas ao Olho Nu",
            "Varredura por Percussão Manual em 100% da Fachada",
            "Mapeamento Crítico para Prevenção de Desprendimentos",
            "Fornecimento de Laudo com Análise de Risco de Queda"
        ],
        link: "/ensaio-de-percussao"
    },
    {
        id: "termografia",
        title: "Inspeção Termográfica",
        icon: "thermostat",
        category: "Fachadas & Revestimentos",
        norma: "ABNT NBR 16823 & ASTM E1213",
        image: "/images/ensaios/termografia.jpeg",
        description: "Inspeção não destrutiva por radiação infravermelha para capturar anomalias térmicas que indicam infiltrações, descolamentos de pastilhas ou problemas elétricos.",
        items: [
            "Detecção Precoce de Descolamento de Pastilhas e Revestimentos",
            "Mapeamento de Pontes Térmicas e Pontos de Infiltração Oculta",
            "Identificação de Anomalias sem Perfurações ou Quebras",
            "Captura de Imagens Térmicas com Câmeras Infravermelhas Flir"
        ],
        link: "/inspecao-termografica"
    }
];

export default function EnsaiosPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]" style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-slate-800/80 text-primary font-semibold text-sm mb-6 md:mb-8 border border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)] dark:shadow-[0_0_15px_rgba(77,182,172,0.3)] hover:shadow-[0_0_25px_rgba(77,182,172,0.3)] dark:hover:shadow-[0_0_25px_rgba(77,182,172,0.5)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">science</span>
                            Controle Tecnológico
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Ensaios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 dark:to-emerald-200">Desempenho</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-6 subpage-hero-p">
                            Realizamos ensaios laboratoriais e in loco (em campo) de desempenho acústico, estrutural e construtivo, garantindo total conformidade com a norma ABNT NBR 15575.
                        </p>
                    </div>
                </section>

                {/* Seção Principal de Conteúdo */}
                <section className="py-24 subpage-content bg-background-light dark:bg-slate-950 relative">
                    {/* Elementos Decorativos */}
                    <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-[20%] w-[450px] h-[450px] pointer-events-none opacity-10 dark:opacity-5 hidden lg:block">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bfa5] animate-pulse"></div>
                        <div className="absolute inset-14 rounded-full border border-[#00bfa5]/70 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute inset-28 rounded-full border border-[#00bfa5]/45 animate-pulse" style={{ animationDelay: '3s' }}></div>
                    </div>

                    <div className="absolute top-2/3 left-0 -translate-y-1/2 translate-x-[-20%] w-[350px] h-[350px] pointer-events-none opacity-10 dark:opacity-5 hidden lg:block">
                        <div className="absolute inset-0 rounded-full border border-[#00bfa5]/70 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-10 rounded-full border-2 border-[#00bfa5]/40 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                        {/* Grid de Ensaios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-20">
                            {ensaios.map((ensaio) => {
                                const CardContent = (
                                    <>
                                        <div className="flex-1 flex flex-col">
                                            {/* Imagem de Capa */}
                                            {ensaio.image && (
                                                <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 group-hover:shadow-md transition-shadow duration-300">
                                                    <img 
                                                        src={ensaio.image} 
                                                        alt={ensaio.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
                                                </div>
                                            )}

                                            {/* Categoria e Ícone */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-[#00bfa5]/10 text-[#00bfa5] flex items-center justify-center ring-1 ring-[#00bfa5]/20 group-hover:scale-110 transition-transform duration-300">
                                                    <span className="material-symbols-outlined text-[28px]">{ensaio.icon}</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg">
                                                    {ensaio.category}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#00bfa5] transition-colors">
                                                {ensaio.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed text-justify mb-6">
                                                {ensaio.description}
                                            </p>

                                            {/* Lista de Recursos Técnicos */}
                                            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-auto">
                                                {ensaio.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2.5">
                                                        <span className="material-symbols-outlined text-[#00bfa5] text-[18px] shrink-0 mt-0.5">check_circle</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Norma Técnica */}
                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-[#00bfa5] dark:text-teal-400 bg-[#00bfa5]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                {ensaio.norma}
                                            </span>
                                            {ensaio.link && (
                                                <span className="text-xs font-bold text-[#00bfa5] group-hover:text-[#00a68f] dark:text-teal-400 dark:group-hover:text-teal-300 transition-colors flex items-center gap-1">
                                                    Ver Detalhes
                                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                </span>
                                            )}
                                        </div>
                                    </>
                                );

                                if (ensaio.link) {
                                    return (
                                        <Link 
                                            key={ensaio.id} 
                                            href={ensaio.link}
                                            className="group premium-card p-8 flex flex-col justify-between cursor-pointer"
                                        >
                                            {CardContent}
                                        </Link>
                                    );
                                }

                                return (
                                    <div 
                                        key={ensaio.id} 
                                        className="group premium-card p-8 flex flex-col justify-between"
                                    >
                                        {CardContent}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Precisa de ensaios ou laudo técnico?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Nossos engenheiros e técnicos estão prontos para atender seu empreendimento com precisão técnica e agilidade, emitindo relatórios válidos de conformidade técnica.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/contato" 
                                    className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    FALE COM A ENGENHARIA
                                </Link>
                                <Link 
                                    href="/login" 
                                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
                                >
                                    ÁREA DO CLIENTE
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
