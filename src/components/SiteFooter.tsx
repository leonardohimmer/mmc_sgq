import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand & Sobre */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Image
                            src="/logo.png"
                            alt="MMC Logo"
                            width={180}
                            height={60}
                            className="opacity-90 brightness-200"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">BETA</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Oferecemos testes confiáveis e precisos de alta tecnologia para Construção Civil no Brasil. Com a MMC Lab você garante conformidade e qualidade em seus projetos.
                    </p>
                </div>

                {/* Acesso Rápido */}
                <div>
                    <h3 className="text-white font-bold mb-6">Acesso Rápido</h3>
                    <ul className="space-y-3">
                        <li><Link href="/sobre" className="hover:text-primary transition-colors text-sm">Sobre</Link></li>
                        <li><Link href="/ensaios" className="hover:text-primary transition-colors text-sm">Ensaios</Link></li>
                        <li><Link href="/simulacoes" className="hover:text-primary transition-colors text-sm">Simulações de Desempenho</Link></li>
                        <li><Link href="/acustica" className="hover:text-primary transition-colors text-sm">Acústica</Link></li>
                        <li><Link href="/cases" className="hover:text-primary transition-colors text-sm">Cases</Link></li>
                        <li><Link href="/blog" className="hover:text-primary transition-colors text-sm">Blog</Link></li>
                        <li><Link href="/contato" className="hover:text-primary transition-colors text-sm">Contato</Link></li>
                    </ul>
                </div>

                {/* Serviços Mais Buscados */}
                <div>
                    <h3 className="text-white font-bold mb-6">Serviços Mais Buscados</h3>
                    <ul className="space-y-3">
                        <li><Link href="/ensaios" className="hover:text-secondary transition-colors text-sm">Ensaios Acústicos</Link></li>
                        <li><Link href="/acustica" className="hover:text-secondary transition-colors text-sm">Mapa de Ruído</Link></li>
                        <li><Link href="/acustica" className="hover:text-secondary transition-colors text-sm">Projetos Acústicos</Link></li>
                        <li><Link href="/ensaios" className="hover:text-secondary transition-colors text-sm">Ensaio de guarda-corpo</Link></li>
                        <li><Link href="/ensaios" className="hover:text-secondary transition-colors text-sm">Ensaio de Resistência</Link></li>
                    </ul>
                </div>

                {/* Contato */}
                <div>
                    <h3 className="text-white font-bold mb-6">Contato</h3>
                    <div className="space-y-4 text-sm">
                        <p className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                            <span>Rua Bagé, 351<br />Niterói - Canoas/RS</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">call</span>
                            <a href="tel:05131032929" className="hover:text-primary transition-colors">(51) 3103-2929</a>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-500 text-xl">chat</span>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Fale por WhatsApp</a>
                        </p>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
                <p>© Copyright {new Date().getFullYear()} MMC Lab. Todos os Direitos Reservados.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link href="/login" className="hover:text-white transition-colors">Acesso Restrito</Link>
                </div>
            </div>
        </footer>
    );
}
