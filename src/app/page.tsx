import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background-light text-slate-700 min-h-screen">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-lg text-white">
              M
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">MMC <span className="text-secondary">Sistema</span></span>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">ISO/IEC 17025</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <Link href="/" className="text-primary transition-colors">Início</Link>
            <Link href="/sobre" className="hover:text-primary transition-colors">O Laboratório</Link>
            <Link href="/escopo" className="hover:text-primary transition-colors">Escopo e Ensaios</Link>
            <Link href="/sgq" className="hover:text-primary transition-colors">Sistema de Gestão</Link>
            <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-primary hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
            >
              Acesso SGQ
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-white to-background-light"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
              Compromisso com a <br />
              <span className="text-primary">
                Excelência e Confiabilidade
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 font-medium">
              Este laboratório atua na realização de ensaios técnicos, comprometido com a confiabilidade dos resultados, a imparcialidade, a confidencialidade e a melhoria contínua.
              <br /><br />
              O Sistema de Gestão da Qualidade é baseado nos requisitos da <strong className="text-slate-700">ABNT NBR ISO/IEC 17025:2017</strong>, atendendo às exigências da acreditação junto ao Inmetro, garantindo competência técnica e rastreabilidade metrológica.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white hover:bg-teal-500 font-bold rounded-xl transition-transform hover:-translate-y-1 shadow-lg shadow-primary/20"
              >
                Acessar Sistema <ArrowRight size={20} />
              </Link>
              <Link
                href="/contato"
                className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all shadow-sm"
              >
                Falar com Consultor
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background-light border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Por que escolher o nosso SGQ?</h2>
              <p className="text-slate-500 font-medium">Desenvolvido com foco em conformidade e usabilidade moderna.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<span className="material-symbols-outlined text-[32px]">description</span>}
                iconColor="text-indigo-500"
                iconBg="bg-indigo-50"
                title="Controle Documental"
                description="Organize POPs, formulários e normativas em um repositório centralizado, com histórico de versões completo."
              />
              <FeatureCard
                icon={<span className="material-symbols-outlined text-[32px]">fact_check</span>}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-100"
                title="Gestão de Auditorias"
                description="Prepare-se para o INMETRO com controle rigoroso. Acompanhe não conformidades, planos de ação e eficiência."
              />
              <FeatureCard
                icon={<span className="material-symbols-outlined text-[32px]">security</span>}
                iconColor="text-secondary"
                iconBg="bg-secondary/10"
                title="Trilha de Logs"
                description="Registro imutável de quem fez o quê e quando. Total transparência para os auditores e gestores."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} MMC Gestão de Qualidade. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, iconColor, iconBg, title, description }: { icon: React.ReactNode, iconColor: string, iconBg: string, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-primary/30 transition-all hover:-translate-y-1 group">
      <div className={`w-14 h-14 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-extrabold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  )
}
