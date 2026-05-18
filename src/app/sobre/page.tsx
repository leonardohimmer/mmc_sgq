export const dynamic = 'force-dynamic';

export const metadata = {
    title: "O Laboratório | MMC LAB",
    description: "Conheça a missão, visão e valores do nosso laboratório.",
};

import { SiteHeader } from "@/components/SiteHeader";
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

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen font-sans pt-[104px] pb-24 transition-colors duration-300">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16">
                {/* Hero Section */}
                <div className="text-center md:text-left mb-16 md:mb-24 relative flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 backdrop-blur-sm shadow-sm transition-all hover:bg-primary/15 hover:border-primary/30">
                            <span className="material-symbols-outlined text-[18px]">business</span>
                            {history.title}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                            <div className="flex flex-col items-center md:items-start">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-slate-100 leading-[1.1]">
                                    O <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Laboratório</span>
                                </h1>
                                <div className="space-y-4 max-w-2xl text-left">
                                    {history.paragraphs.map((p: string, i: number) => (
                                        <p key={i} className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="w-full relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-400/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src="https://www.youtube.com/embed/jZoqA349ttA" 
                                        title="Vídeo Institucional MMC Lab" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                                <div className="mt-4 flex items-center justify-center lg:justify-start gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <span className="material-symbols-outlined text-primary">play_circle</span>
                                    Assista ao nosso vídeo institucional
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission, Vision, Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 mb-24">
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
                                        <div className="p-6 text-center">
                                            <h3 className="font-extrabold text-slate-900 dark:text-white truncate">{member.name}</h3>
                                            <p className="text-sm text-primary font-bold">{member.role}</p>
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
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Nossas Construtoras</h2>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="relative group">
                            <div className="animate-marquee-reverse gap-8 py-4">
                                {[...clients, ...clients, ...clients].map((client: any, i: number) => (
                                    <div key={i} className="w-44 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center p-4 gap-2" style={{height: '11rem'}}>
                                        <div className="w-28 h-28 flex items-center justify-center flex-shrink-0">
                                            {client.logoUrl ? (
                                                <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">domain</span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center leading-tight w-full line-clamp-2">{client.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                    <div className="mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">O que dizem nossos clientes</h2>
                            <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
                                {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined fill-current">star</span>)}
                                <span className="text-slate-900 dark:text-white font-bold ml-2">5.0 no Google</span>
                            </div>
                            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((review: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-all hover:shadow-lg">
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
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                            <p className="text-xs text-slate-400">{review.source}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

