import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import Image from "next/image";

export default function CasesPage() {
    const cases = [
        {
            title: "Complexo Maxplaza Medical Center",
            service: "Ensaios Acústicos, Resistência de Aderência à Tração e Peças Suspensas.",
            imageUrl: "https://www.mmclab.com.br/upload/service/800x600xfit-h4mRK0yCkqmrZZTVipuS2QsBUZRdAXPWCE28Y9La.jpeg",
            slug: "complexo-maxplaza-medical-center",
            badge: "Ensaios & Desempenho",
            themeColor: "from-blue-500/10 to-indigo-500/10 hover:border-indigo-500/40",
            iconColor: "text-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
        },
        {
            title: "Vitra Residence",
            service: "Projeto Acústico e Isolamento de Ruídos na Cobertura.",
            imageUrl: "https://www.mmclab.com.br/upload/service/800x600xfit-5qAvmHq13BO5bcrmfDIhz9v5SSyggEwfqrToBc4o.jpeg",
            slug: "vitra-residence",
            badge: "Projeto Acústico",
            themeColor: "from-amber-500/10 to-orange-500/10 hover:border-orange-500/40",
            iconColor: "text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        }
    ];

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]" style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 dark:bg-slate-800/80 text-secondary font-semibold text-sm mb-6 md:mb-8 border border-secondary/30 backdrop-blur-md shadow-[0_0_15px_rgba(193,181,152,0.15)] dark:shadow-[0_0_15px_rgba(193,181,152,0.3)] hover:shadow-[0_0_25px_rgba(193,181,152,0.3)] dark:hover:shadow-[0_0_25px_rgba(193,181,152,0.6)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">cases</span>
                            Casos de Sucesso
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Projetos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-600 dark:to-amber-200">Cases Reais</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-6 subpage-hero-p">
                            Veja na prática como a MMC Lab aplicou soluções de engenharia diagnóstica, acústica e testes estruturais de alta complexidade pelo Brasil.
                        </p>
                    </div>
                </section>

                <section className="py-20 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {cases.map((c) => (
                                <Link key={c.slug} href={`/cases/${c.slug}`} className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5`}>
                                    <div>
                                        {/* Image Section */}
                                        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-950/5 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                                            <img
                                                src={c.imageUrl}
                                                alt={c.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Tag */}
                                            <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10">
                                                {c.badge}
                                            </div>
                                        </div>

                                        {/* Card Title & Content */}
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 transition-colors group-hover:text-secondary">
                                            {c.title}
                                        </h3>
                                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 text-justify">
                                            {c.service}
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 flex items-center justify-between">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Estudo de Caso</span>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary group-hover:text-[#a3987f] transition-colors cursor-pointer">
                                            Ver Case Completo
                                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
