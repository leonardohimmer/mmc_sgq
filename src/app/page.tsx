"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Binary,
  Workflow,
  CheckSquare,
  FileText,
  Brain,
  Play,
  Pause
} from "lucide-react";
import packageJson from "../../package.json";

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

const CAROUSEL_ENSAIOS = [
  {
    title: "Acústica em Campo",
    norm: "ISO 16283 & NBR 15575",
    description: "Medição in loco do isolamento acústico para certificar se as paredes, pisos, fachadas e coberturas atendem aos critérios de conforto e privacidade em edifícios.",
    image: "/images/ensaios/acustica.jpeg",
    color: "from-teal-500/20 to-cyan-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(77,182,172,0.25)] border-teal-500/30",
    link: "/ensaios-acusticos-em-campo"
  },
  {
    title: "Isolamento Acústico em Laboratório (Rw)",
    norm: "ISO 10140 & ISO 717",
    description: "Ensaios em câmaras controladas para determinação do isolamento acústico (Rw) de componentes e sistemas construtivos sob rigorosas variáveis físicas.",
    image: "/images/ensaios/acustica-lab.jpg",
    color: "from-cyan-500/20 to-teal-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.25)] border-cyan-500/30",
    link: "/ensaios-acusticos-em-laboratorio"
  },
  {
    title: "Guarda-corpos e Corrimãos",
    norm: "ABNT NBR 14718",
    description: "Avaliação da segurança e resistência estrutural de guarda-corpos e parapeitos instalados in loco ou em laboratório por testes mecânicos de esforço e impacto.",
    image: "/images/ensaios/guarda-corpo.jpeg",
    color: "from-rose-500/20 to-red-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)] border-rose-500/30",
    link: "/ensaio-de-guarda-corpo-e-parapeito"
  },
  {
    title: "Aderência à Tração",
    norm: "NBR 13528 & NBR 13749",
    description: "Medição da resistência de aderência à tração de revestimentos argamassados e cerâmicos in loco ou em laboratório, prevenindo quedas e falhas estruturais.",
    image: "/images/ensaios/aderencia.jpeg",
    color: "from-amber-500/20 to-orange-500/20",
    tag: "Fachadas & Revestimentos",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)] border-amber-500/30",
    link: "/ensaio-de-resistencia-de-aderencia-a-tracao"
  },
  {
    title: "Integridade de Estacas (PIT)",
    norm: "ASTM D5882",
    description: "O ensaio PIT (Pile Integrity Test) avalia a integridade física de estacas de fundação profunda de forma não destrutiva, mapeando falhas ocultas no fuste.",
    image: "/images/ensaios/pit.jpeg",
    color: "from-blue-500/20 to-indigo-500/20",
    tag: "Fundações & Estruturas",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.25)] border-blue-500/30",
    link: "/ensaio-de-integridade-de-estacas-pit"
  },
  {
    title: "Teste de Ancoragem (Arrancamento)",
    norm: "ABNT NBR 16259 & NBR 14827",
    description: "Verificação da capacidade de carga e resistência de arrancamento mecânico de parafusos, buchas, pinos e ancoragens químicas sob tensões especificadas in loco.",
    image: "/images/ensaios/ancoragem.jpeg",
    color: "from-cyan-500/20 to-blue-500/20",
    tag: "Fundações & Estruturas",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.25)] border-cyan-500/30",
    link: "/teste-de-ancoragem"
  },
  {
    title: "Permeabilidade e Estanqueidade",
    norm: "ABNT NBR 15575-4",
    description: "Avaliação do comportamento das vedações verticais (paredes e fachadas) sob chuva direcionada induzida para identificar e prevenir falhas de estanqueidade.",
    image: "/images/ensaios/permeabilidade.jpeg",
    color: "from-indigo-500/20 to-purple-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(99,102,241,0.25)] border-indigo-500/30",
    link: "/ensaio-de-permeabilidade"
  },
  {
    title: "Esclerometria no Concreto",
    norm: "ABNT NBR 7584",
    description: "Ensaio não destrutivo com esclerômetro digital ou analógico de alta calibração, avaliando a dureza superficial do concreto para estimar a resistência à compressão.",
    image: "/images/ensaios/esclerometria.jpeg",
    color: "from-emerald-500/20 to-teal-500/20",
    tag: "Fundações & Estruturas",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)] border-emerald-500/30",
    link: "/ensaio-de-esclerometria-no-concreto"
  },
  {
    title: "Ensaio Lumínico",
    norm: "NBR 15575 & ISO/CIE 8995-1",
    description: "Medições em campo dos níveis de iluminância e da luz natural disponível nos compartimentos internos da edificação para verificação do conforto e eficiência lumínica.",
    image: "/images/ensaios/luminico.jpeg",
    color: "from-yellow-500/20 to-amber-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(234,179,8,0.25)] border-yellow-500/30",
    link: "/ensaio-luminico"
  },
  {
    title: "Impacto de Corpo Mole e Duro",
    norm: "ABNT NBR 15575-4",
    description: "Testes para verificar a resistência a impactos mecânicos in loco em paredes, painéis de vedação e sistemas drywall, garantindo que resistam a choques comuns sem danos.",
    image: "/images/ensaios/impacto.jpeg",
    color: "from-purple-500/20 to-pink-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.25)] border-purple-500/30",
    link: "/impacto-de-corpo-mole-e-corpo-duro"
  },
  {
    title: "Ensaio de Peças Suspensas",
    norm: "ABNT NBR 15575-4",
    description: "Ensaio mecânico de carregamento para avaliar se as paredes internas e divisórias suportam o peso de mobiliários pesados e redes de dormir fixadas.",
    image: "/images/ensaios/pecas-suspensas.jpeg",
    color: "from-fuchsia-500/20 to-pink-500/20",
    tag: "Desempenho (NBR 15575)",
    glow: "shadow-[0_0_25px_rgba(217,70,239,0.25)] border-fuchsia-500/30",
    link: "/ensaio-de-pecas-suspensas"
  },
  {
    title: "Inspeção de Fachadas",
    norm: "ABNT NBR 13755 & NBR 16747",
    description: "Mapeamento sistemático de manifestações patológicas em fachadas de prédios comerciais e residenciais, garantindo a integridade dos revestimentos cerâmicos e pinturas.",
    image: "/images/ensaios/inspecao-fachada.jpeg",
    color: "from-sky-500/20 to-blue-500/20",
    tag: "Fachadas & Revestimentos",
    glow: "shadow-[0_0_25px_rgba(14,165,233,0.25)] border-sky-500/30",
    link: "/inspecao-de-fachadas"
  },
  {
    title: "Ensaio de Percussão",
    norm: "ABNT NBR 13755",
    description: "Técnica tátil e acústica minuciosa executada em fachadas para identificar som cavo, que indica o descolamento oculto do revestimento sob a argamassa ou cerâmica.",
    image: "/images/ensaios/percussao.jpeg",
    color: "from-orange-500/20 to-red-500/20",
    tag: "Fachadas & Revestimentos",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.25)] border-orange-500/30",
    link: "/ensaio-de-percussao"
  },
  {
    title: "Inspeção Termográfica",
    norm: "ABNT NBR 16823 & ASTM E1213",
    description: "Inspeção não destrutiva por radiação infravermelha para capturar anomalias térmicas que indicam infiltrações, descolamentos de pastilhas ou problemas elétricos.",
    image: "/images/ensaios/termografia.jpeg",
    color: "from-red-500/20 to-amber-500/20",
    tag: "Fachadas & Revestimentos",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.25)] border-red-500/30",
    link: "/inspecao-termografica"
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"auditoria" | "ai" | "materiais">("auditoria");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ENSAIOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ENSAIOS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_ENSAIOS.length) % CAROUSEL_ENSAIOS.length);
  };

  return (
    <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
      <SiteHeader />

      <main className="flex-1">
        {/* Premium Hero Section - ESTILO LABORATÓRIO ESCURO/CLARO PREMIUM */}
        <section className="relative pt-10 pb-36 sm:pt-16 sm:pb-44 overflow-hidden bg-slate-50 dark:bg-[#080d16] text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
          
          {/* Fundo Industrial: Malha de Coordenadas, luzes neon e profundidade metalizada */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Grid denso de coordenadas */}
            <div className="absolute inset-0 opacity-[0.15] bg-tech-grid-dense-light dark:bg-tech-grid-dense" />
            <div className="absolute inset-0 opacity-[0.08] bg-tech-grid-light dark:bg-tech-grid" />
            
            {/* Gradientes de Neon Ciano & Cobre/Ouro sobrepostos */}
            <div className="absolute top-1/4 -right-10 w-[700px] h-[700px] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[130px] animate-pulse-fast" />
            <div className="absolute -bottom-1/3 -left-10 w-[600px] h-[600px] rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[110px] animate-blink-slow" />
            
            {/* Detalhes Técnicos de Fórmulas no Fundo */}
            <div className="absolute right-[5%] bottom-[18%] opacity-15 text-[10px] font-mono select-none hidden lg:block text-slate-400 dark:text-slate-500 leading-relaxed">
              <p>{"dB(A) = 10 \\cdot \\log_{10}(P/P_{ref})"}</p>
              <p>STATUS_SYS: OK [V.{packageJson.version}]</p>
              <p>NBR 15575 COMPLIANT</p>
            </div>
          </div>

          {/* Seção dedicada do Carrossel de Ensaios em largura total - No topo */}
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full relative animate-float-slow"
            >
              {/* Neon Glow Rings */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl pointer-events-none" />

              {/* Glassmorphic Carousel Panel */}
              <div className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col justify-between overflow-hidden relative z-10 w-full min-h-[500px] lg:min-h-[480px]">
                
                {/* Header do Carrossel */}
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`} />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-primary dark:text-primary-light tracking-widest uppercase font-black">DEMONSTRAÇÃO DE ENSAIOS EM TEMPO REAL</span>
                  </div>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
                    title={isPlaying ? "Pausar Auto-play" : "Iniciar Auto-play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                {/* Body Content - Carousel Slide com transição horizontal em lg */}
                <div className="flex-1 relative flex flex-col justify-center overflow-hidden py-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      <Link 
                        href={CAROUSEL_ENSAIOS[currentSlide].link}
                        className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full items-center justify-between cursor-pointer group"
                      >
                        {/* Imagem do Ensaio - Aumentada e ocupando 50% de largura no lg */}
                        <div className={`relative w-full lg:w-1/2 h-[200px] sm:h-[280px] lg:h-[360px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group-hover:border-teal-500/50 shrink-0 transition-all duration-500 ${CAROUSEL_ENSAIOS[currentSlide].glow}`}>
                          <img 
                            src={CAROUSEL_ENSAIOS[currentSlide].image} 
                            alt={CAROUSEL_ENSAIOS[currentSlide].title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <span className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-slate-950/70 text-primary-light border border-primary/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider font-mono">
                            {CAROUSEL_ENSAIOS[currentSlide].tag}
                          </span>
                        </div>

                        {/* Textos do Ensaio - Layout elegante com fontes aumentadas */}
                        <div className="flex-1 flex flex-col justify-center text-left w-full">
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans tracking-tight text-glow-teal mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                            {CAROUSEL_ENSAIOS[currentSlide].title}
                            <ArrowRight className="w-5 h-5 sm:w-6 h-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                          </h3>
                          <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-4">
                            {CAROUSEL_ENSAIOS[currentSlide].norm}
                          </span>
                          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                            {CAROUSEL_ENSAIOS[currentSlide].description}
                          </p>
                          <div className="inline-flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:underline">
                            Ver mais detalhes do ensaio
                            <span className="material-symbols-outlined ml-1.5 text-base">arrow_forward</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-5 mt-4 shrink-0">
                  {/* Botão Anterior */}
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-md"
                    aria-label="Ensaio anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Indicador de Bolinhas */}
                  <div className="flex gap-2">
                    {CAROUSEL_ENSAIOS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentSlide(index);
                          setIsPlaying(false); // Pausa autoplay ao interagir
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? "bg-primary w-6 shadow-[0_0_12px_rgba(77,182,172,0.7)]" 
                            : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                        }`}
                        aria-label={`Ir para ensaio ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Botão Próximo */}
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-md"
                    aria-label="Próximo ensaio"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* Floating Element: Acreditado CGCRE - Reposicionado no topo direito do carrossel largo */}
              <motion.a 
                href="http://www.inmetro.gov.br/laboratorios/rble/docs/CRL1460.pdf"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ y: [-8, 8, -8] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-4 md:-right-4 top-4 md:-top-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3.5 rounded-xl shadow-lg dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center gap-3 z-20 cursor-pointer hover:border-emerald-500/50 transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">Acreditação</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white font-sans">CRL 1460 CGCRE</div>
                </div>
              </motion.a>
            </motion.div>
          </div>

          {/* Contêiner de texto do Hero centralizado - Abaixo do Carrossel */}
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 mt-20 relative z-10 flex flex-col items-center justify-center text-center">
            {/* Hero Text */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center w-full max-w-4xl flex flex-col items-center justify-center animate-float-slow"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:text-primary-light font-semibold text-sm mb-6 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)]">
                <Microscope className="w-4 h-4 text-primary dark:text-primary-light animate-pulse" />
                Laboratório de Ensaios Acreditado ISO/IEC 17025
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-lg mx-auto max-w-3xl text-slate-900 dark:text-white">
                Conformidade e Desempenho <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-hover via-primary to-secondary pb-2 block mt-2 text-glow-teal">
                  em Alta Precisão
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-10 text-center mx-auto">
                Soluções avançadas em acústica, testes estruturais e simulações para a Construção Civil. Garantimos a excelência técnica exigida pela ABNT NBR 15575.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
                <Link
                  href="/ensaios"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-slate-950 rounded-xl font-bold overflow-hidden transition-all shadow-[0_0_20px_rgba(77,182,172,0.4)] hover:shadow-[0_0_30px_rgba(77,182,172,0.6)] hover:-translate-y-0.5 text-base sm:text-lg"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    Conheça os Ensaios
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/contato"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-200/50 dark:bg-white/5 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold transition-all backdrop-blur-sm text-base sm:text-lg hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-5 h-5 text-primary dark:text-primary-light" />
                  Fale com Especialista
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Serviços Principais com Efeitos Glassmorphic Modernos */}
        <section className="py-28 bg-slate-50 dark:bg-[#080d16] transition-colors duration-300 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 font-sans">Potencialize Seus Projetos</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
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
                <Link href="/ensaios" className="group block h-full premium-card p-10 relative overflow-hidden flex flex-col items-start min-h-[360px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-primary/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary dark:text-primary-light flex items-center justify-center mb-8 relative z-10 shadow-inner border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-8 h-8 animate-pulse-fast" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-primary transition-colors">Ensaios de Desempenho</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Avaliações rigorosas in-loco e laboratoriais para acústica e estruturas, assegurando a conformidade total com a norma NBR 15575.
                  </p>
                  
                  <div className="mt-8 flex items-center text-primary dark:text-primary-light font-bold tracking-wide uppercase relative z-10">
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
                <Link href="/simulacoes" className="group block h-full premium-card p-10 relative overflow-hidden flex flex-col items-start min-h-[360px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-secondary/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary flex items-center justify-center mb-8 relative z-10 shadow-inner border border-secondary/20 group-hover:scale-110 transition-transform duration-300">
                    <Cpu className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-secondary transition-colors">Simulações Virtuais</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Análises computacionais avançadas para otimização térmica, lumínica e estrutural das edificações ainda em fase de projeto.
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
                <Link href="/acustica" className="group block h-full premium-card p-10 relative overflow-hidden flex flex-col items-start min-h-[360px]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-emerald-500/10" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 relative z-10 shadow-inner border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Ear className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Projetos Acústicos</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10 flex-1">
                    Mapas de ruído detalhados e consultoria especializada para conforto sonoro perfeito e isolamento acústico nos ambientes.
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
        <section className="py-28 bg-white dark:bg-[#080d16] relative overflow-hidden border-y border-slate-100 dark:border-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-y-3 transform origin-top-left" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-8"
              >
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans">
                  Precisão Tecnológica e <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Confiabilidade</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  A MMC Lab é pioneira em soluções integradas de laboratório para a indústria da construção civil. Com equipamentos de última geração e profissionais altamente qualificados, traduzimos normas complexas em resultados claros, práticos e rastreáveis.
                </p>
                
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-4xl font-extrabold text-primary mb-1">+10</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Anos de Mercado</span>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex flex-col">
                    <span className="text-4xl font-extrabold text-secondary mb-1">NBR</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">15575 Especialistas</span>
                  </div>
                </div>

                <Link href="/sobre" className="inline-flex items-center text-primary font-bold hover:text-primary-hover group bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-all">
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
                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="premium-card backdrop-blur-md p-8 flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-sans">Infraestrutura Completa</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Laboratórios equipados para testes in-loco e análises laboratoriais complexas com rastreabilidade total.</p>
                  </div>
                </div>
                
                <div className="premium-card backdrop-blur-md p-8 flex items-start gap-4 relative z-10 translate-x-0 lg:translate-x-8">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                    <Activity className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-sans">Monitoramento Dinâmico</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sistema moderno para acompanhamento de laudos técnicos e evolução de solicitações em tempo real.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Moderno */}
        <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-[#080d16] text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-900">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-secondary/10 opacity-60 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white font-sans">
                Eleve o Padrão do Seu Empreendimento
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Nossa equipe comercial está preparada para mapear suas necessidades e entregar propostas técnicas sob medida.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/contato" 
                  className="px-10 py-5 bg-gradient-to-r from-primary to-primary-hover text-slate-950 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(77,182,172,0.3)] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center"
                >
                  Solicitar Orçamento
                </Link>
                <a 
                  href="tel:05131032929" 
                  className="px-10 py-5 bg-slate-200/50 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/10 hover:bg-slate-200/80 dark:hover:bg-white/25 text-slate-800 dark:text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto hover:-translate-y-1"
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
