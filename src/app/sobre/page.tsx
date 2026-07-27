
export const metadata = {
    title: "O Laboratório | MMC LAB",
    description: "Conheça a missão, visão e valores do nosso laboratório.",
};

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import prisma from "@/lib/prisma";

export default async function SobrePage() {
    const contents = await prisma.siteContent.findMany();
    const data: any = {};
    contents.forEach(c => {
        data[c.section] = c.data;
    });

    const history = data.history || { title: "Nossa História", paragraphs: [] };
    const stats = data.stats?.items || [];
    const team = data.team?.members || [];
    const clients = data.clients?.items || [];
    const testimonials = data.testimonials?.reviews || [];

    const totalReviews = testimonials.length;
    const averageRating = totalReviews > 0
        ? parseFloat((testimonials.reduce((acc: number, review: any) => acc + (review.rating || 5), 0) / totalReviews).toFixed(1))
        : 5.0;

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen font-sans pt-[80px] transition-colors duration-300 flex flex-col overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]" style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-slate-800/80 text-primary font-semibold text-sm mb-6 md:mb-8 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)] dark:shadow-[0_0_15px_rgba(77,182,172,0.3)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">business</span>
                            {history.title}
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl transition-colors duration-300">
                            O <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Laboratório</span>
                        </h1>
                        
                        <div className="max-w-4xl mx-auto space-y-6 text-center text-slate-600 dark:text-slate-300 text-lg sm:text-xl font-medium leading-relaxed mb-6 subpage-hero-p">
                            {history.paragraphs.map((p: string, i: number) => (
                                <p key={i} className="text-center">
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* Vídeo Institucional */}
                        <div className="w-full max-w-3xl mx-auto relative group mt-4">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-400/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src="https://www.youtube.com/embed/LbsxZ6FhyLw" 
                                    title="Vídeo Institucional MMC Lab" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                <span className="material-symbols-outlined text-primary">play_circle</span>
                                Assista ao nosso vídeo institucional
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Mission, Vision, Values */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-primary/30 dark:hover:border-primary/50 transition-all group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">track_changes</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Missão</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Realizar ensaios com excelência técnica, assegurando resultados confiáveis e atendimento às normas aplicáveis.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-secondary/50 dark:hover:border-secondary/50 transition-all group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">visibility</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Visão</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Ser referência em ensaios laboratoriais acreditados, reconhecido pela qualidade e credibilidade.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-all group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">security</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-slate-100">Valores</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Imparcialidade, competência, ética, confiabilidade e melhoria contínua.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                {stats.length > 0 && (
                    <div className="mb-24">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {stats.map((stat: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                                    <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Team Marquee Section */}
                {team.length > 0 && (
                    <div className="mb-24 overflow-hidden relative">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Nossa Equipe</h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="relative group">
                            <div className="animate-marquee gap-8 py-4">
                                {[...team, ...team].map((member: any, i: number) => (
                                    <div key={i} className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            {member.photoUrl ? (
                                                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-300 text-6xl">person</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 text-center flex flex-col items-center justify-center">
                                            <h3 className="font-extrabold text-slate-900 dark:text-white truncate w-full text-center">{member.name}</h3>
                                            <span className="block text-sm text-primary font-bold text-center w-full mt-1">{member.role}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Construtoras Marquee Section */}
                {clients.length > 0 && (
                    <div className="mb-24 overflow-hidden relative">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Clientes</h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="relative group">
                            <div className="animate-marquee gap-8 py-4" style={{ animationDuration: '144s' }}>
                                {[...clients, ...clients, ...clients].map((client: any, i: number) => {
                                    const cardContent = (
                                        <>
                                            <div className="w-36 h-24 flex items-center justify-center flex-shrink-0">
                                                {client.logoUrl ? (
                                                    <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">domain</span>
                                                )}
                                            </div>
                                            <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300 text-center leading-tight w-full line-clamp-2 mt-1">{client.name}</span>
                                        </>
                                    );
                                    const commonClass = "w-44 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center p-4 gap-2 group/card";
                                    return client.link ? (
                                        <a key={i} href={client.link} target="_blank" rel="noopener noreferrer" className={commonClass} style={{height: '11rem'}}>
                                            {cardContent}
                                        </a>
                                    ) : (
                                        <div key={i} className={commonClass} style={{height: '11rem'}}>
                                            {cardContent}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                    <div className="mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Comentários</h2>
                            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                                {[1, 2, 3, 4, 5].map((starIndex) => {
                                    let iconName = 'star';
                                    let fill = 1;
                                    
                                    if (averageRating >= starIndex) {
                                        iconName = 'star';
                                        fill = 1;
                                    } else if (averageRating >= starIndex - 0.5) {
                                        iconName = 'star_half';
                                        fill = 1;
                                    } else {
                                        iconName = 'star';
                                        fill = 0;
                                    }
                                    
                                    return (
                                        <span 
                                            key={starIndex} 
                                            className="material-symbols-outlined text-[18px]"
                                            style={{ fontVariationSettings: `'FILL' ${fill}` }}
                                        >
                                            {iconName}
                                        </span>
                                    );
                                })}
                                <span className="text-slate-900 dark:text-white font-bold ml-2">{averageRating.toFixed(1)} no Google</span>
                            </div>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((review: any, i: number) => {
                                const cardContent = (
                                    <>
                                        <span className="material-symbols-outlined absolute top-6 right-8 text-slate-100 dark:text-slate-800 text-6xl pointer-events-none">format_quote</span>
                                        <div className="flex gap-1 text-amber-400 mb-4">
                                            {[1, 2, 3, 4, 5].map((starIndex) => {
                                                const rating = review.rating || 5;
                                                let iconName = 'star';
                                                let fill = 1;
                                                
                                                if (rating >= starIndex) {
                                                    iconName = 'star';
                                                    fill = 1;
                                                } else if (rating >= starIndex - 0.5) {
                                                    iconName = 'star_half';
                                                    fill = 1;
                                                } else {
                                                    iconName = 'star';
                                                    fill = 0;
                                                }
                                                
                                                return (
                                                    <span 
                                                        key={starIndex} 
                                                        className="material-symbols-outlined text-[18px]"
                                                        style={{ fontVariationSettings: `'FILL' ${fill}` }}
                                                    >
                                                        {iconName}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 italic mb-6 relative z-10 leading-relaxed">
                                            "{review.text}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    {review.source}
                                                    {review.link && (
                                                        <span className="material-symbols-outlined text-[12px] text-primary">open_in_new</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                );

                                const commonClass = "bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-all hover:shadow-lg hover:border-primary/20 text-left block w-full";

                                return review.link ? (
                                    <a key={i} href={review.link} target="_blank" rel="noopener noreferrer" className={`${commonClass} hover:scale-[1.02] cursor-pointer`}>
                                        {cardContent}
                                    </a>
                                ) : (
                                    <div key={i} className={commonClass}>
                                        {cardContent}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    )
}

