import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

const BLOG_POSTS = [
    {
        title: "Acústica Na Construção Civil: 4 Práticas Para Engenheiros e Arquitetos Atenderem à NBR 15575",
        category: "Engenharia e Normas",
        imageUrl: "https://www.mmclab.com.br/upload/blog/vu2z2MNjwYvCLUE6i9W9tsgXjC7YHd5xxmKS8q0O.jpeg",
        slug: "acustica-na-construcao-civil-4-praticas-para-engenheiros-e-arquitetos-atenderem-a-nbr-15575",
        excerpt: "A norma ABNT NBR 15575 – Edificações Habitacionais: Desempenho é hoje um dos principais pilares da qualidade construtiva no Brasil. Mais do que um documento técnico, ela representa a evolução da construção civil brasileira em direção a edificações mais eficientes..."
    },
    {
        title: "O que é uma Consultoria Acústica?",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/WTSZNxFuB9NqkOZYZKhLxyXIJ6EJakM9ldQSVdCT.jpeg",
        slug: "o-que-e-uma-consultoria-acustica",
        excerpt: "A consultoria acústica é um serviço técnico especializado que tem como objetivo identificar, avaliar e propor soluções para questões relacionadas ao som em ambientes, como excesso de ruído, falta de privacidade sonora ou baixa qualidade acústica interna..."
    },
    {
        title: "Por que testar o isolamento acústico de janelas em laboratório de acordo com a ISO 10140?",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/d056rhPkTBPhUt4OhfAgrlJow2nGXp2hwhvQJtfu.jpeg",
        slug: "por-que-testar-o-isolamento-acustico-de-janelas-em-laboratorio-de-acordo-com-a-iso-10140",
        excerpt: "Testar o isolamento acústico de janelas em laboratório é crucial para assegurar que as edificações cumpram os requisitos de desempenho estabelecidos pela Norma de Desempenho para Edificações Habitacionais, a ABNT NBR 15575. Esta norma define critérios..."
    },
    {
        title: "Os guarda-corpos devem seguir as prescrições da ABNT NBR 14718",
        category: "Segurança na Construção",
        imageUrl: "https://www.mmclab.com.br/upload/blog/9u1L921E037JBgA1QKF95LqbzHABEMbVQaVzGWke.jpeg",
        slug: "os-guarda-corpos-devem-seguir-as-prescricoes-da-abnt-nbr-14718",
        excerpt: "Os guarda-corpos são componentes essenciais de segurança em edificações, projetados para evitar quedas de pessoas, animais e objetos. Para garantir que eles atendam aos requisitos de segurança e desempenho, é necessário que estejam em conformidade com..."
    },
    {
        title: "ISO 10140: Acústica — Medição Laboratorial do Isolamento Acústico de Elementos de Construção",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/qYW1VNB7lJ4XarVR0xNSpIA7wpP4CCrr4KylqKrN.jpeg",
        slug: "iso-10140-acustica-medicao-laboratorial-do-isolamento-acustico-de-elementos-de-construcao",
        excerpt: "O ensaio de isolamento acústico é um processo utilizado para medir a capacidade de materiais e estruturas em reduzir a transmissão sonora. Realizado em condições controladas de laboratório, este ensaio ajuda a determinar a eficácia de diferentes soluções..."
    },
    {
        title: "Mapa de ruído: utilização do Software CadnaA para Determinação da Classe de Ruído de Empreendimentos conforme ABNT NBR 15575",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/GcE3RLfeIAsRPStjNLKxdWFvYj53CumQGpSdvKRA.jpeg",
        slug: "mapa-de-ruido-utilizacao-do-software-cadnaa-para-determinacao-da-classe-de-ruido-de-empreendimentos-conforme-abnt-nbr-15575",
        excerpt: "O controle do ruído em ambientes urbanos é uma preocupação crescente devido aos seus impactos na qualidade de vida das pessoas. Nesse contexto, a ABNT NBR 15575 estabelece requisitos de isolamento acústico de fachadas de edificações habitacionais..."
    },
    {
        title: "Saiba o que Mudou nos Requisitos de Desempenho Acústico da ABNT NBR 15575 Edificações Habitacionais",
        category: "Engenharia e Normas",
        imageUrl: "https://www.mmclab.com.br/upload/blog/8JMDvxkbE4UAj1idVFi2hPM51WfnsCkDlQgCs8sp.jpeg",
        slug: "saiba-o-que-mudou-nos-requisitos-de-desempenho-acustico-da-abnt-nbr-15575-edificacoes-habitacionais",
        excerpt: "Foi publicada no dia 14 de setembro de 2021 uma nova emenda de acústica para a NBR 15575. A emenda é obrigatória para empreendimentos residenciais em todo o Brasil e entra em vigor para novos projetos residenciais a partir de 13 de março de 2022..."
    },
    {
        title: "Saiba a Importância dos Edifícios Terem um Projeto de Isolamento Acústico na Piscina da Cobertura",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/ndgvCWcBj1Jk73ggeMK82nTEeomy0c30IiAuHJ4R.jpeg",
        slug: "saiba-a-importancia-dos-edificios-terem-um-projeto-de-isolamento-acustico-na-piscina-da-cobertura",
        excerpt: "Uma prática cada vez mais comum em projetos de edificações habitacionais e hotéis é a incorporação de áreas de lazer de uso coletivo nas coberturas dos edifícios. Essas áreas frequentemente incluem espaços como salões de festas, academias e piscinas..."
    },
    {
        title: "E se pudéssemos ver o som? Conheça a câmera acústica SoundCam 2.0",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/ZfqK2c602UNUSEeYI473UQpl4NX29ZM2DWrZ73kI.jpeg",
        slug: "e-se-pudessemos-ver-o-som-conheca-a-camera-acustica-soundcam-20",
        excerpt: "Em um mundo onde a tecnologia nos surpreende a cada dia, há inovações que nos fazem questionar os limites da percepção humana. A câmera acústica SoundCam 2.0 é um desses avanços notáveis, permitindo que experimentemos o som de uma maneira totalmente..."
    },
    {
        title: "Qual a importância de um laboratório ser acreditado pela ABNT NBR ISO/IEC 17025 ?",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/IDRa9I9OS2CBZfXl7UDOuTtgIKrsv1uHy3RvqQeo.jpeg",
        slug: "qual-a-importancia-de-um-laboratorio-ser-acreditado-pela-abnt-nbr-isoiec-17025",
        excerpt: "A acreditação ABNT NBR ISO/IEC 17025 concedida pela CGCRE (Coordenação Geral de Acreditação do Inmetro) possui uma grande importância para os laboratórios de ensaio e calibração. Ela estabelece os requisitos gerais para a competência de laboratórios..."
    }
];

export default function BlogPage() {
    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 sm:pt-14 subpage-hero overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300">
                    {/* Efeitos Modernos Neon / Movimento */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-32 -left-32 w-72 md:w-[500px] h-72 md:h-[500px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>

                        {/* Padrões pontilhados digitais */}
                        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]" style={{
                            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 dark:bg-slate-800/80 text-secondary font-semibold text-sm mb-6 md:mb-8 border border-secondary/30 backdrop-blur-md shadow-[0_0_15px_rgba(193,181,152,0.15)] dark:shadow-[0_0_15px_rgba(193,181,152,0.3)] hover:shadow-[0_0_25px_rgba(193,181,152,0.3)] dark:hover:shadow-[0_0_25px_rgba(193,181,152,0.6)] transition-all">
                            <span className="material-symbols-outlined text-[18px]">article</span>
                            Conteúdo Técnico e Tendências
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-8 drop-shadow-md mx-auto max-w-4xl">
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-600 dark:to-amber-200">MMC Lab</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-[1.6] mb-6 subpage-hero-p">
                            Fique por dentro das atualizações normativas, práticas de engenharia e dicas para projetos acústicos.
                        </p>
                    </div>
                </section>

                <section className="py-20 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                            {BLOG_POSTS.map((post) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5">
                                    <div>
                                        {/* Image Section */}
                                        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-950/5 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Category Tag */}
                                            <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10">
                                                {post.category}
                                            </div>
                                        </div>

                                        {/* Title & Excerpt */}
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 transition-colors group-hover:text-secondary line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 text-justify line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    {/* Footer area inside card */}
                                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 flex items-center justify-between">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Artigo Técnico</span>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary group-hover:text-[#a3987f] transition-colors cursor-pointer">
                                            Ler Artigo Completo
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
