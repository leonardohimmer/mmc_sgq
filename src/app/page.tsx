"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Activity, 
  Cpu, 
  Ear, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  BarChart4,
  Layers,
  Microscope,
  Focus,
  ChevronRight
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[104px] overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20">
          {/* Animated Background Mesh & Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />
            {/* Grid Pattern overlay */}
            <div 
              className="absolute inset-0 opacity-20 dark:opacity-20 hidden dark:block"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
            <div 
              className="absolute inset-0 opacity-15 block dark:hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.07) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Hero Text */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center lg:items-start"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-primary-light font-semibold text-sm mb-6 border border-primary/20 dark:border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)] dark:shadow-[0_0_15px_rgba(77,182,172,0.2)]">
                <Microscope className="w-4 h-4" />
                Laboratório de Ensaios Acreditado
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-md dark:drop-shadow-lg mx-auto lg:mx-0 max-w-2xl text-slate-900 dark:text-white">
                Conformidade e Desempenho <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-secondary pb-2 block mt-2">
                  em Alta Precisão
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="max-w-xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-10 text-center lg:text-left mx-auto lg:mx-0">
                Soluções avançadas em acústica, testes estruturais e simulações para a Construção Civil. Garantimos a excelência técnica exigida pela ABNT NBR 15575.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto">
                <Link
                  href="/ensaios"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-slate-950 rounded-xl font-bold overflow-hidden transition-all shadow-[0_0_20px_rgba(77,182,172,0.3)] dark:shadow-[0_0_20px_rgba(77,182,172,0.4)] hover:shadow-[0_0_30px_rgba(77,182,172,0.5)] dark:hover:shadow-[0_0_30px_rgba(77,182,172,0.6)] hover:-translate-y-0.5 text-base sm:text-lg"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    Conheça os Ensaios
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/contato"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 hover:border-slate-800 dark:hover:border-white hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-xl font-bold transition-all backdrop-blur-sm text-base sm:text-lg hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-5 h-5" />
                  Fale com Especialista
                </Link>
              </motion.div>
            </motion.div>

            {/* Futuristic Tech Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Glassmorphic Dashboard Panel */}
                <div className="absolute inset-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl shadow-xl dark:shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                  
                  {/* Decorative Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <span className="text-xs font-mono text-primary dark:text-primary-light tracking-widest">MMC-LAB.SYS</span>
                    </div>
                    <Activity className="w-5 h-5 text-secondary animate-pulse" />
                  </div>

                  {/* Animated Waveform Data */}
                  <div className="flex-1 flex flex-col justify-center relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-xl" />
                    <svg className="w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <motion.path
                        d="M0 50 Q 50 10, 100 50 T 200 50 T 300 50 T 400 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary/30"
                        animate={{
                          d: [
                            "M0 50 Q 50 10, 100 50 T 200 50 T 300 50 T 400 50",
                            "M0 50 Q 50 90, 100 50 T 200 50 T 300 50 T 400 50",
                            "M0 50 Q 50 10, 100 50 T 200 50 T 300 50 T 400 50"
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M0 50 Q 50 80, 100 50 T 200 50 T 300 50 T 400 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-secondary/50"
                        animate={{
                          d: [
                            "M0 50 Q 50 80, 100 50 T 200 50 T 300 50 T 400 50",
                            "M0 50 Q 50 20, 100 50 T 200 50 T 300 50 T 400 50",
                            "M0 50 Q 50 80, 100 50 T 200 50 T 300 50 T 400 50"
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                      />
                    </svg>
                  </div>

                  {/* Tech Metric Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
                      <Focus className="w-6 h-6 text-primary mb-2" />
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Medição Precisa</div>
                      <div className="text-xs text-slate-500 mt-1">Alta Fidelidade</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full" />
                      <BarChart4 className="w-6 h-6 text-secondary mb-2" />
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Relatórios Técnicos</div>
                      <div className="text-xs text-slate-500 mt-1">Análise Detalhada</div>
                    </motion.div>
                  </div>

                </div>

                {/* Floating Elements overlay */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 top-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Status</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white">Acreditado CGCRE</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Serviços Principais com Efeitos Glassmorphic */}
        <section className="py-24 bg-background-light dark:bg-slate-950 transition-colors duration-300 relative z-20 -mt-8">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Potencialize Seus Projetos</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Oferecemos soluções completas para construtoras e indústrias, com tecnologia de ponta para projetos estruturais, acústicos e simulações.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Link href="/ensaios" className="group block h-full bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-primary transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(77,182,172,0.15)] hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[340px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-primary/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-8 relative z-10 shadow-inner border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-primary transition-colors">Ensaios de Desempenho</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Avaliações rigorosas para acústica e estruturas, assegurando a total conformidade com a NBR 15575.
                  </p>
                  
                  <div className="mt-8 flex items-center text-primary font-bold tracking-wide uppercase relative z-10">
                    Ver Ensaios
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/simulacoes" className="group block h-full bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-secondary transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(193,181,152,0.15)] hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[340px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-secondary/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary flex items-center justify-center mb-8 relative z-10 shadow-inner border border-secondary/20 group-hover:scale-110 transition-transform duration-300">
                    <Cpu className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-secondary transition-colors">Simulações Virtuais</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Análises computacionais avançadas para otimização térmica, lumínica e estrutural das edificações.
                  </p>
                  
                  <div className="mt-8 flex items-center text-secondary font-bold tracking-wide uppercase relative z-10">
                    Ver Simulações
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/acustica" className="group block h-full bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-10 rounded-3xl hover:border-emerald-500 transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 relative overflow-hidden flex flex-col items-start min-h-[340px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-emerald-500/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 relative z-10 shadow-inner border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Ear className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Projetos Acústicos</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Mapas de ruído e consultoria especializada para conforto sonoro perfeito em qualquer ambiente.
                  </p>
                  
                  <div className="mt-8 flex items-center text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase relative z-10">
                    Ver Projetos
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sobre & Stats Integrados */}
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden border-y border-slate-100 dark:border-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-y-3 transform origin-top-left" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-8"
              >
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Precisão Tecnológica e <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Confiabilidade</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  A MMC Lab é pioneira em soluções integradas de laboratório para a indústria da construção civil. Com equipamentos de última geração e profissionais altamente qualificados, traduzimos normas complexas em resultados claros, práticos e rastreáveis.
                </p>
                
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-4xl font-extrabold text-primary mb-1">+10</span>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Anos de Mercado</span>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex flex-col">
                    <span className="text-4xl font-extrabold text-secondary mb-1">NBR</span>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">15575 Especialistas</span>
                  </div>
                </div>

                <Link href="/sobre" className="inline-flex items-center text-primary font-bold hover:text-primary-hover group bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-colors">
                  Conheça nossa infraestrutura
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-5/12 grid gap-4 relative"
              >
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-4 shadow-xl relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Infraestrutura Completa</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Laboratórios equipados para testes in-loco e análises laboratoriais complexas com rastreabilidade total.</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-4 shadow-xl relative z-10 translate-x-0 lg:translate-x-8">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Monitoramento Dinâmico</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sistema moderno para acompanhamento de laudos técnicos e evolução de solicitações em tempo real.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Moderno */}
        <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-900">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-slate-50 dark:via-slate-950 to-secondary/10 dark:from-primary/30 dark:to-secondary/20 opacity-60 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white">
                Eleve o Padrão do Seu Empreendimento
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Nossa equipe comercial está preparada para mapear suas necessidades e entregar propostas técnicas sob medida.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/contato" 
                  className="px-10 py-5 bg-gradient-to-r from-primary to-primary-hover text-slate-950 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(77,182,172,0.3)] dark:hover:shadow-[0_0_30px_rgba(77,182,172,0.5)] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center"
                >
                  Solicitar Orçamento
                </Link>
                <a 
                  href="tel:05131032929" 
                  className="px-10 py-5 bg-slate-200/50 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto hover:-translate-y-1"
                >
                  <PhoneCall className="w-5 h-5 text-primary dark:text-primary-light" />
                  (51) 3103-2929
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
