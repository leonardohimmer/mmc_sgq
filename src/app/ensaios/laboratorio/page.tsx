import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Ensaios em Laboratório | MMC LAB",
    description: "Realizamos ensaios laboratoriais de desempenho acústico (Rw), guarda-corpos e resistência de aderência à tração em ambiente controlado para conformidade com a ABNT NBR 15575.",
};

const ensaiosLaboratorio = [
    {
        id: "guarda-corpo",
        title: "Ensaio de guarda-corpo e parapeito",
        icon: "architecture",
        category: "Desempenho (NBR 15575)",
        norma: "ABNT NBR 14718",
        image: "/images/ensaios/guarda-corpo.jpeg",
        description: "Teste realizado para avaliar a resistência e a segurança de um guarda-corpo ou corrimão de peitoril de edificação, verificando se o sistema suporta esforços mecânicos estáticos e de impacto dinâmico sem apresentar falhas de ancoragem.",
        items: [
            "Ensaio de Esforço Estático Horizontal (Carga Linear)",
            "Ensaio de Esforço Estático Vertical",
            "Ensaio de Impacto Dinâmico (Corpo Mole)",
            "Auditoria de Sistemas de Fixação e Conexões"
        ],
        link: "/ensaio-de-guarda-corpo-e-parapeito"
    },
    {
        id: "isolamento-acustico",
        title: "Ensaio de Isolamento Acústico em Laboratório (Rw)",
        icon: "graphic_eq",
        category: "Desempenho (NBR 15575)",
        norma: "ISO 10140 & ISO 717",
        image: "/images/ensaios/acustica.jpeg",
        description: "Câmaras perda de transmissão sonora ao ruído aéreo, para realizar testes de isolamento acústico de componentes e sistemas construtivos sob controle de variáveis físicas.",
        items: [
            "Esquadrias Acústicas e Janelas",
            "Sistemas de Portas e Vedações",
            "Paredes de Drywall e Alvenarias",
            "Fachadas e Divisórias Leves"
        ]
    },
    {
        id: "aderencia",
        title: "Ensaio de resistência de aderência à tração",
        icon: "handyman",
        category: "Fachadas & Revestimentos",
        norma: "NBR 13528 & NBR 13749",
        image: "/images/ensaios/aderencia.jpeg",
        description: "Este ensaio é um procedimento utilizado para medir a força necessária para extrair corpos de prova de revestimento, avaliando a qualidade e a aderência das argamassas e cerâmicas aplicadas.",
        items: [
            "Resistência à Tração de Revestimento Argamassado",
            "Resistência à Tração de Placas Cerâmicas Aderidas",
            "Corte e Extração de Pastilhas e Corpos de Prova",
            "Mapeamento Sistemático e Laudo de Aderência"
        ],
        link: "/ensaio-de-resistencia-de-aderencia-a-tracao"
    }
];

export default function EnsaiosLaboratorioPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1 flex flex-col">
                {/* Banner de Cabeçalho estilo Imagem */}
                <section className="bg-[#00bfa5] dark:bg-teal-800 py-16 px-6 sm:px-8 text-white relative">
                    <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-3">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ensaios em Laboratório</h1>
                        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white/90">
                            <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
                            <span className="opacity-70">&gt;</span>
                            <Link href="/ensaios" className="hover:text-white hover:underline transition-all">Ensaios</Link>
                            <span className="opacity-70">&gt;</span>
                            <span className="opacity-90">Em Laboratório</span>
                        </div>
                    </div>
                </section>

                {/* Seção Principal de Conteúdo */}
                <section className="py-20 bg-background-light dark:bg-slate-950 relative flex-1">
                    {/* Elementos Decorativos de Círculos Concêntricos */}
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
                        {/* Introdução */}
                        <div className="max-w-4xl mx-auto text-center mb-20">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-6">
                                Tecnologia e Precisão em Ambiente Controlado
                            </h2>
                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed justify-center text-justify sm:text-center">
                                Nosso laboratório de última geração oferece a máxima precisão na simulação e controle de variáveis físicas para certificação de materiais construtivos e acústicos. Através de equipamentos calibrados e rastreados metrologicamente, garantimos conformidade com as normas internacionais <strong className="text-[#00bfa5] dark:text-teal-400">ISO</strong> e nacionais <strong className="text-[#00bfa5] dark:text-teal-400">ABNT</strong>.
                            </p>
                        </div>

                        {/* Grid de Ensaios em Laboratório */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-20">
                            {ensaiosLaboratorio.map((ensaio) => {
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
                                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,191,165,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.05)] hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
                                        >
                                            {CardContent}
                                        </Link>
                                    );
                                }

                                return (
                                    <div 
                                        key={ensaio.id} 
                                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#00bfa5]/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,191,165,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,191,165,0.05)] hover:-translate-y-1.5 flex flex-col justify-between"
                                    >
                                        {CardContent}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center max-w-3xl mx-auto relative z-10 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-sm">
                            <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                Deseja certificar seu produto ou componente?
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-2xl mx-auto">
                                Envie a documentação ou detalhes do seu material para nossa equipe técnica de laboratório. Agendamos e realizamos seus testes em prazos recordes e com rigor internacional.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/contato" 
                                    className="bg-[#00bfa5] hover:bg-[#00a68f] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-md shadow-[#00bfa5]/20 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    SOLICITAR ENSAIO DE LABORATÓRIO
                                </Link>
                                <Link 
                                    href="/contato" 
                                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center tracking-wider py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
                                >
                                    ENVIAR PROJETO PARA ANÁLISE
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

