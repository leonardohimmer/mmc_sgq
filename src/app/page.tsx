import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="absolute inset-0 bg-[#f8f9fa] dark:bg-slate-950 transition-colors duration-300">
            {/* Background patterns and gradients */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text */}
            <div className="text-center lg:text-left w-full lg:w-3/5 lg:pr-8 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 animate-fade-in border border-primary/20 backdrop-blur-sm shadow-sm transition-all hover:bg-primary/15 hover:border-primary/30">
                <span className="material-symbols-outlined text-[18px]">engineering</span>
                Laboratório de Ensaios Acreditado
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-[1.1] mb-8 drop-shadow-sm font-sans mx-auto lg:mx-0 max-w-3xl">
                Conformidade e Qualidade <br className="hidden sm:block" />
                <span className="block mt-2 relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary pb-1 block">
                    em Seus Projetos
                  </span>
                </span>
              </h1>
              <p className="max-w-xl text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-[1.6] mb-10 text-center lg:text-left mx-auto lg:mx-0">
                Serviços focados em ensaios relacionados ao desempenho estrutural, acústico e simulações para a Constituição Civil de acordo com a ABNT NBR 15575.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto">
                <Link
                  href="/ensaios"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base sm:text-lg"
                >
                  Conheça os Ensaios
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
                <Link
                  href="/contato"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl font-bold transition-all shadow-sm hover:shadow-md text-base sm:text-lg hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                  Fale com Especialista
                </Link>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="w-full lg:w-2/5 relative animate-fade-in-up">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative blobs behind the main image concept */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>

                {/* Main Image Concept (Dashboard/Construction mockup) */}
                <div className="relative z-10 w-full h-full bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-md"></div>
                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-700 rounded-md"></div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary/40">bar_chart</span>
                      </div>
                      <div className="h-24 bg-secondary/5 rounded-xl border border-secondary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-secondary/40">graphic_eq</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-600 rounded-sm"></div>
                      <div className="h-2 w-1/4 bg-slate-100 dark:bg-slate-700 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-10 md:p-16 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6 text-center md:text-left flex flex-col md:items-start items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Conheça a MMC Lab</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Fundada em 2013, atendemos a necessidade das construtoras e fabricantes de materiais diante da ABNT NBR 15575 (Norma de Desempenho).
                  Somos um Laboratório de Ensaios com equipamentos ideais para laboratório e campo, oferecendo soluções inovadoras em acústica, estruturas e simulações.
                </p>
                <Link href="/sobre" className="inline-flex items-center text-primary font-bold hover:text-primary-hover group">
                  Ler mais sobre nós
                  <span className="material-symbols-outlined ml-2 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto shrink-0 mt-8 md:mt-0">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center h-full">
                  <div className="text-4xl font-extrabold text-primary mb-2">+10</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Anos de Experiência</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center h-full sm:mt-6">
                  <div className="text-4xl font-extrabold text-secondary mb-2">NBR</div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Desempenho</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Principais */}
        <section className="py-24 bg-background-light dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Conheça Nossos Serviços e Potencialize Seus Projetos</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Oferecemos soluções acústicas completas para construtoras e indústrias, incluindo projetos de isolamento acústico, ensaios estruturais e consultoria personalizada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Ensaios */}
              <Link href="/ensaios" className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[320px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm border border-primary/20">
                  <span className="material-symbols-outlined text-[32px]">science</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-primary transition-colors">Ensaios de Desempenho</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                  Ensaios rigorosos para avaliar o desempenho acústico e estrutural garantindo conformidade com a NBR 15575.
                </p>
                <div className="mt-6 flex items-center text-primary font-bold text-sm tracking-wide uppercase">
                  Ver Ensaios
                  <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>

              {/* Card 2: Simulações */}
              <Link href="/simulacoes" className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-secondary/50 dark:hover:border-secondary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[320px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-secondary/20">
                  <span className="material-symbols-outlined text-[32px]">analytics</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-secondary transition-colors">Simulações de Desempenho</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                  Avaliações computacionais prévias para prever e otimizar o desempenho térmico e lumínico das edificações.
                </p>
                <div className="mt-6 flex items-center text-secondary font-bold text-sm tracking-wide uppercase">
                  Ver Simulações
                  <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>

              {/* Card 3: Acústica */}
              <Link href="/acustica" className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[320px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-500/20">
                  <span className="material-symbols-outlined text-[32px]">graphic_eq</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Projetos Acústicos</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                  Desenvolvimento de Projetos e Mapas de Ruído customizados para atender às demandas específicas do ambiente.
                </p>
                <div className="mt-6 flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wide uppercase">
                  Ver Projetos
                  <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Lista de Ensaios Específicos */}
        <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Ensaios Mais Buscados</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                  Testes indispensáveis para validar a segurança estrutural e a vedação sonora na Construção Civil.
                </p>
              </div>
              <Link href="/ensaios" className="shrink-0 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-colors inline-flex items-center justify-center">
                Ver todos os ensaios
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Ensaio de guarda-corpo e parapeito", icon: "fence", link: "/ensaios" },
                { title: "Ensaio de Isolamento Acústico em Laboratório", icon: "headphones", link: "/ensaios" },
                { title: "Ensaio de resistência de aderência à tração", icon: "architecture", link: "/ensaios" },
                { title: "Mapa de Ruído", icon: "map", link: "/acustica" },
                { title: "Ensaios Acústicos", icon: "volume_up", link: "/ensaios" },
                { title: "Consultoria Acústica", icon: "support_agent", link: "/acustica" }
              ].map((item, i) => (
                <Link key={i} href={item.link} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:border-primary/50 dark:hover:border-primary/50 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-sm hover:shadow-md">
                  <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors mb-4">{item.icon}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA (Contato) */}
        <section className="py-24 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Pronto para iniciar seu projeto?</h2>
            <p className="text-xl text-primary-light mb-10 max-w-2xl mx-auto">
              Nossa equipe técnica comercial está pronta para entender as demandas da sua construtora e recomendar as melhores soluções.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg hover:-translate-y-1">
                Solicite Orçamento
              </Link>
              <a href="tel:05131032929" className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">call</span>
                Ligue Agora
              </a>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
