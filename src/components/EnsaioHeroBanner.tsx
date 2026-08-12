import Link from "next/link";

interface EnsaioHeroBannerProps {
    badge: string;
    title: string;
    breadcrumbCurrent: string;
    imageSrc: string;
    imageAlt: string;
}

export function EnsaioHeroBanner({
    badge,
    title,
    breadcrumbCurrent,
    imageSrc,
    imageAlt,
}: EnsaioHeroBannerProps) {
    return (
        <section className="relative py-12 px-6 sm:px-8 text-slate-800 dark:text-white overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
            {/* Imagem de Fundo Premium */}
            <div className="absolute inset-0 w-full h-full">
                <img 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className="w-full h-full object-cover opacity-15 dark:opacity-25 transition-opacity duration-300"
                />
                {/* Overlay Degradê Sofisticado (Tema Claro e Escuro) */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-teal-50/80 to-slate-50/90 dark:from-teal-950/95 dark:via-slate-900/90 dark:to-slate-950/95 transition-colors duration-300"></div>
                {/* Fade Inferior para o fundo da página */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-light dark:from-slate-950/40 to-transparent"></div>
            </div>
            
            <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-3 relative z-10">
                <span className="text-xs font-bold bg-[#00bfa5]/10 dark:bg-[#00bfa5]/20 text-[#008f7a] dark:text-[#00bfa5] border border-[#00bfa5]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                    {badge}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                    {title}
                </h1>
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 mt-2 transition-colors duration-300">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-all">Home</Link>
                    <span className="opacity-50">&gt;</span>
                    <Link href="/ensaios" className="hover:text-slate-900 dark:hover:text-white hover:underline transition-all">Ensaios</Link>
                    <span className="opacity-50">&gt;</span>
                    <span className="text-[#008f7a] dark:text-[#00bfa5] font-bold">{breadcrumbCurrent}</span>
                </div>
            </div>
        </section>
    );
}
