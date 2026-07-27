import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 py-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">

                {/* Brand & Sobre */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="MMC Logo"
                            width={160}
                            height={50}
                            className="opacity-90 dark:brightness-200 transition-all duration-300"
                        />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">BETA</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium text-justify transition-colors duration-300">
                        Oferecemos testes confiáveis e precisos de alta tecnologia para Construção Civil no Brasil. Com a MMC Lab você garante conformidade e qualidade em seus projetos.
                    </p>
                </div>

                {/* Acesso Rápido */}
                <div>
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-base mb-6 tracking-tight transition-colors duration-300">Acesso Rápido</h3>
                    <ul className="space-y-3.5">
                        <li><Link href="/sobre" className="hover:text-primary transition-all duration-300 text-sm font-medium">Sobre</Link></li>
                        <li><Link href="/ensaios" className="hover:text-primary transition-all duration-300 text-sm font-medium">Ensaios</Link></li>
                        <li><Link href="/simulacoes" className="hover:text-primary transition-all duration-300 text-sm font-medium">Simulações de Desempenho</Link></li>
                        <li><Link href="/acustica" className="hover:text-primary transition-all duration-300 text-sm font-medium">Acústica</Link></li>
                        <li><Link href="/cases" className="hover:text-primary transition-all duration-300 text-sm font-medium">Cases</Link></li>
                        <li><Link href="/blog" className="hover:text-primary transition-all duration-300 text-sm font-medium">Blog</Link></li>
                        <li><Link href="/contato" className="hover:text-primary transition-all duration-300 text-sm font-medium">Contato</Link></li>
                    </ul>
                </div>

                {/* Serviços Mais Buscados */}
                <div>
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-base mb-6 tracking-tight transition-colors duration-300">Serviços Mais Buscados</h3>
                    <ul className="space-y-3.5">
                        <li><Link href="/ensaios" className="hover:text-secondary transition-all duration-300 text-sm font-medium">Ensaios Acústicos</Link></li>
                        <li><Link href="/acustica" className="hover:text-secondary transition-all duration-300 text-sm font-medium">Mapa de Ruído</Link></li>
                        <li><Link href="/acustica" className="hover:text-secondary transition-all duration-300 text-sm font-medium">Projetos Acústicos</Link></li>
                        <li><Link href="/ensaios" className="hover:text-secondary transition-all duration-300 text-sm font-medium">Ensaio de guarda-corpo</Link></li>
                        <li><Link href="/ensaios" className="hover:text-secondary transition-all duration-300 text-sm font-medium">Ensaio de Resistência</Link></li>
                    </ul>
                </div>

                {/* Contato */}
                <div>
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-base mb-6 tracking-tight transition-colors duration-300">Contato</h3>
                    <div className="space-y-5 text-sm font-medium">
                        <p className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">location_on</span>
                            <a 
                                href="https://www.google.com/maps/place/MMC+LAB+Controle+Tecnol%C3%B3gico+Ltda./@-29.9539486,-51.1727562,948m/data=!3m2!1e3!4b1!4m6!3m5!1s0x951977a750f45963:0xd3ae1b88081f216e!8m2!3d-29.9539486!4d-51.1727562!16s%2Fg%2F12mkvnkhn?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors duration-300"
                            >
                                Rua Bagé, 351<br />Niterói - Canoas/RS
                            </a>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0">call</span>
                            <a href="tel:05131032929" className="hover:text-primary transition-colors duration-300">(51) 3103-2929</a>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-400 text-xl shrink-0">chat</span>
                            <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Fale por WhatsApp</a>
                        </p>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-900 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
                <p>© Copyright {new Date().getFullYear()} MMC Lab. Todos os Direitos Reservados.</p>
                <div className="flex gap-4">
                    <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">Acesso Restrito</Link>
                </div>
            </div>
        </footer>
    );
}
