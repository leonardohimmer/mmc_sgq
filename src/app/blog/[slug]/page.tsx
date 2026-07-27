"use client";

import { use } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

const BLOG_POSTS: Record<string, {
    title: string;
    category: string;
    imageUrl: string;
    content: string;
}> = {
    "acustica-na-construcao-civil-4-praticas-para-engenheiros-e-arquitetos-atenderem-a-nbr-15575": {
        title: "Acústica Na Construção Civil: 4 Práticas Para Engenheiros e Arquitetos Atenderem à NBR 15575",
        category: "Engenharia e Normas",
        imageUrl: "https://www.mmclab.com.br/upload/blog/vu2z2MNjwYvCLUE6i9W9tsgXjC7YHd5xxmKS8q0O.jpeg",
        content: `
            <p class="mb-6">A norma ABNT NBR 15575 – Edificações Habitacionais: Desempenho é hoje um dos principais pilares da qualidade construtiva no Brasil. Mais do que um documento técnico, ela representa a evolução da construção civil brasileira em direção a edificações mais confortáveis, seguras e sustentáveis.</p>
            <p class="mb-6">Entre seus requisitos, o acústico talvez seja um dos mais desafiadores — e um dos mais valorizados pelos usuários. Afinal, quem nunca se incomodou com o barulho do vizinho, passos vindos do andar de cima ou o ruído constante do trânsito?</p>
            <p class="mb-6">Este guia foi desenvolvido para engenheiros e arquitetos que desejam entender como aplicar, na prática, as exigências acústicas da NBR 15575, evitando erros, retrabalhos e aumentando a performance acústica das construções.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">🎧 O que é a NBR 15575 e qual seu objetivo?</h3>
            <p class="mb-6">Publicada pela Associação Brasileira de Normas Técnicas (ABNT), a NBR 15575 define os requisitos mínimos de desempenho para edificações habitacionais. Ela foi implementada oficialmente em 2013 e tornou-se obrigatória para todas as novas construções residenciais.</p>
            <p class="mb-6">A norma é organizada em seis partes principais, abordando: requisitos gerais, estrutura, sistemas de pisos, vedação vertical interna e externa (paredes), coberturas e sistemas hidrossanitários. Cada uma dessas partes estabelece parâmetros de segurança, habitabilidade e sustentabilidade, entre eles o desempenho acústico — que trata especificamente da capacidade da edificação em proteger os usuários contra ruídos indesejados.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">🔍 O que a NBR 15575 exige em termos de acústica?</h3>
            <p class="mb-6">A norma define níveis de desempenho acústico mínimo, intermediário e superior, considerando três tipos principais de ruído:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Ruído aéreo (Voz, TV, música):</strong> Avalia o desempenho das vedações verticais internas e dos sistemas de piso entre unidades habitacionais distintas.</li>
                <li><strong>Ruído de impacto (Passos, quedas de objetos):</strong> Analisa o comportamento do sistema de piso entre unidades distintas.</li>
                <li><strong>Ruído externo (Trânsito, obras, motores):</strong> Verificado em fachadas e coberturas, analisando o desempenho das vedações verticais externas.</li>
            </ul>
            <p class="mb-6">O objetivo é garantir a redução eficaz da transmissão sonora entre unidades e a conformidade das soluções construtivas com os níveis mínimos exigidos. A título de referência, o desempenho acústico mínimo requerido de paredes separando unidades autônomas, no caso de um dos ambientes ser dormitório, deve ser de no mínimo 45 dB de isolamento sonoro (DnT,w).</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">⚙️ Como começar a incluir o desempenho acústico em projetos?</h3>
            <p class="mb-6">Ao desenvolver e executar o seu projeto arquitetônico, estrutural e de interiores, deve-se estar atento a alguns erros comuns:</p>
            <ul class="list-decimal pl-6 mb-6 space-y-2">
                <li>Ignorar a análise acústica no início do projeto (corrigir depois é extremamente caro e difícil).</li>
                <li>Subdimensionar o impacto de esquadrias simples contra ruído externo.</li>
                <li>Não supervisionar corretamente o assentamento de blocos e vedação de juntas.</li>
                <li>Não realizar ensaios de campo — que são exigência de comprovação de desempenho.</li>
                <li>Copiar soluções de outros projetos sem considerar o contexto acústico específico.</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">🧩 Passo a passo: como aplicar a NBR 15575 na prática</h3>
            <p class="mb-4"><strong>1️⃣ Análise de viabilidade acústica no anteprojeto:</strong> Antes do projeto executivo, realize um estudo considerando localização, tipologia, materiais e uso dos ambientes. Avalie se o terreno está em zona de alto ruído, a tipologia construtiva e as fontes internas (como elevadores e bombas).</p>
            <p class="mb-4"><strong>2️⃣ Escolha correta dos sistemas construtivos:</strong> Elementos como lajes (impactam ruído de impacto), paredes (ruído aéreo) e esquadrias (ruído externo) devem ser especificados com cuidado. Use lãs minerais no drywall, mantas acústicas sob contrapisos e esquadrias de vidro duplo quando necessário.</p>
            <p class="mb-4"><strong>3️⃣ Gestão da qualidade:</strong> A compatibilização entre projetos evita falhas como dutos e shafts mal vedados que criam pontes acústicas e comprometem o isolamento global.</p>
            <p class="mb-6"><strong>4️⃣ Ensaios acústicos:</strong> A comprovação final deve ser realizada por laboratórios especializados, gerando laudos oficiais de isolamento de paredes (DnTw), impacto de pisos (LnTw) e atenuação de fachadas (D2m,Tw).</p>
        `
    },
    "o-que-e-uma-consultoria-acustica": {
        title: "O que é uma Consultoria Acústica?",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/WTSZNxFuB9NqkOZYZKhLxyXIJ6EJakM9ldQSVdCT.jpeg",
        content: `
            <p class="mb-6">A consultoria acústica é um serviço técnico especializado que tem como objetivo identificar, avaliar e propor soluções para questões relacionadas ao som em ambientes, como excesso de ruído, falta de privacidade sonora ou baixa qualidade acústica interna.</p>
            <p class="mb-6">Esse trabalho pode abranger tanto o <strong>isolamento acústico</strong> (impedir que sons indesejados entrem ou saiam de um ambiente) quanto o <strong>conforto acústico interno</strong> (melhorar como o som se comporta dentro do espaço).</p>
            <p class="mb-6">A consultoria é sempre personalizada e pode incluir visitas técnicas, medições acústicas, simulações computacionais, análise de materiais, avaliações de projeto e emissão de laudos ou pareceres. Tudo isso com base em critérios técnicos e nas normas aplicáveis, como a ABNT NBR 15575 (Desempenho de Edificações Habitacionais), ABNT NBR 10151 (Avaliação de ruído em áreas habitadas), entre outras.</p>
            <p class="mb-6">É um serviço essencial em projetos residenciais, comerciais, industriais, educacionais e hospitalares — ou sempre que for necessário controlar ruídos, melhorar a comunicação, garantir privacidade ou atender exigências locais e normativas.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Quando contratar uma consultoria acústica?</h3>
            <p class="mb-6">O ideal é que o consultor acústico seja envolvido logo nas etapas iniciais do projeto de arquitetura. Corrigir problemas acústicos em uma edificação pronta costuma ser muito mais complexo e caro do que prever as soluções adequadas em projeto.</p>
            <p class="mb-6">Além do projeto preventivo, a consultoria é contratada em situações corretivas, como reclamações de vizinhos, problemas de eco em escritórios ou auditórios, ruído excessivo de equipamentos (como ar-condicionado e geradores) e adequação às leis de zoneamento de ruído urbano.</p>
        `
    },
    "por-que-testar-o-isolamento-acustico-de-janelas-em-laboratorio-de-acordo-com-a-iso-10140": {
        title: "Por que testar o isolamento acústico de janelas em laboratório de acordo com a ISO 10140?",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/d056rhPkTBPhUt4OhfAgrlJow2nGXp2hwhvQJtfu.jpeg",
        content: `
            <p class="mb-6">Testar o isolamento acústico de janelas em laboratório é crucial para assegurar que as edificações cumpram os requisitos de desempenho estabelecidos pela Norma de Desempenho para Edificações Habitacionais, a ABNT NBR 15575. Esta norma define critérios e parâmetros para diversos aspectos do desempenho de edificações, incluindo o isolamento acústico das fachadas.</p>
            <p class="mb-6">Os sistemas de vedações verticais externas que separam dormitórios do ambiente externo devem proporcionar um desempenho adequado contra o ruído aéreo (como tráfego de veículos, aviões, trens etc.). O nível mínimo de desempenho é determinado com base no ruído ambiente no entorno do empreendimento, chamada Classe de Ruído.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">A importância da ISO 10140</h3>
            <p class="mb-6">A ISO 10140 estabelece métodos de laboratório para medição do isolamento acústico de elementos de construção, como janelas, portas, paredes e lajes. Ao realizar o ensaio em câmaras acústicas de laboratório devidamente calibradas, eliminam-se interferências externas e caminhos alternativos de transmissão estrutural do som. Dessa forma, é possível obter com precisão o Índice de Redução Sonora (Rw) do elemento testado, garantindo repetibilidade e comparabilidade técnica entre produtos.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Componentes das Esquadrias que influenciam no resultado:</h3>
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Vidros:</strong> Diferentes tipos de vidro (simples, duplo, laminado) possuem diferentes capacidades de isolamento.</li>
                <li><strong>Persianas:</strong> Podem influenciar tanto na transmissão direta quanto na indireta do som.</li>
                <li><strong>Ferragens:</strong> Elementos como dobradiças e fechaduras precisam ser considerados, pois podem criar vias para a transmissão sonora.</li>
                <li><strong>Sistemas de Fechamento e Vedações:</strong> A qualidade das vedações e a eficácia dos sistemas de fechamento são cruciais para minimizar as fugas sonoras.</li>
            </ul>

            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Procedimento do ensaio em laboratório:</h3>
            <p class="mb-6">A esquadria a ser testada é montada entre duas câmaras reverberantes, uma atuando como a sala de emissão e a outra como a sala de recepção. Um ruído rosa ou branco é gerado na câmara de emissão, utilizando uma fonte sonora calibrada. Microfones medem os níveis de pressão sonora em ambas as câmaras entre 100 Hz e 5000 Hz, permitindo calcular o índice de redução sonora ponderado (Rw).</p>
        `
    },
    "os-guarda-corpos-devem-seguir-as-prescricoes-da-abnt-nbr-14718": {
        title: "Os guarda-corpos devem seguir as prescrições da ABNT NBR 14718",
        category: "Segurança na Construção",
        imageUrl: "https://www.mmclab.com.br/upload/blog/9u1L921E037JBgA1QKF95LqbzHABEMbVQaVzGWke.jpeg",
        content: `
            <p class="mb-6">Os guarda-corpos são componentes essenciais de segurança em edificações, projetados para evitar quedas de pessoas, animais e objetos. Para garantir que eles atendam aos requisitos de segurança e desempenho, é necessário que estejam em conformidade com as prescrições da ABNT NBR 14718 (Esquadrias — Guarda-corpos para edificação — Requisitos, procedimentos e métodos de ensaio).</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Objetivos da Norma NBR 14718</h3>
            <p class="mb-6">A norma estabelece os critérios para o dimensionamento, construção e desempenho dos guarda-corpos aplicáveis tanto a situações de uso privativo (residências) quanto uso coletivo (comércios, shoppings, hospitais, varandas coletivas), considerando também a altura e localização da edificação (velocidade do vento).</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Principais ensaios exigidos pela ABNT NBR 14718:</h3>
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Resistência às cargas horizontais (Anexo A):</strong> Verifica se a estrutura suporta cargas horizontais aplicadas diretamente sobre o elemento de fechamento, garantindo estabilidade no uso diário.</li>
                <li><strong>Resistência às cargas verticais (Anexo B):</strong> Avalia a capacidade de suportar cargas verticais, garantindo que o sistema aguente o peso de usuários apoiados sobre o corrimão.</li>
                <li><strong>Resistência ao impacto (Anexo C):</strong> Submete o guarda-corpo a um impacto dinâmico de 600 Joules (corpo mole) para simular quedas acidentais e testar a integridade estrutural do conjunto.</li>
            </ul>

            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Ensaios in loco e em laboratório</h3>
            <p class="mb-6">Os ensaios podem ser realizados tanto em laboratório quanto no próprio local de instalação (in loco), o que é ideal para verificar o desempenho real das fixações estruturais e ancoragens após a montagem na obra.</p>
        `
    },
    "iso-10140-acustica-medicao-laboratorial-do-isolamento-acustico-de-elementos-de-construcao": {
        title: "ISO 10140: Acústica — Medição Laboratorial do Isolamento Acústico de Elementos de Construção",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/qYW1VNB7lJ4XarVR0xNSpIA7wpP4CCrr4KylqKrN.jpeg",
        content: `
            <p class="mb-6">O ensaio de isolamento acústico é um processo utilizado para medir a capacidade de materiais e estruturas em reduzir a transmissão sonora. Realizado em condições controladas de laboratório, este ensaio ajuda a determinar a eficácia de diferentes soluções acústicas antes de serem aplicadas em ambientes reais. A norma ISO 10140 fornece diretrizes e métodos padronizados para a realização desses ensaios, garantindo resultados precisos e comparáveis.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Visão geral da ISO 10140</h3>
            <p class="mb-6">Ela é dividida em 5 partes, cada uma abordando aspectos específicos do ensaio acústico:</p>
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>ISO 10140-1:</strong> Especifica as regras básicas para o preparo, instalação, condicionamento e medição de amostras.</li>
                <li><strong>ISO 10140-2:</strong> Descreve os métodos de medição para a determinação do isolamento acústico em relação ao som aéreo.</li>
                <li><strong>ISO 10140-3:</strong> Descreve os métodos de medição para a determinação do isolamento acústico em relação ao som de impacto.</li>
                <li><strong>ISO 10140-4:</strong> Contém diretrizes sobre a aplicação dos métodos de medição e a apresentação dos resultados.</li>
                <li><strong>ISO 10140-5:</strong> Especifica os requisitos para equipamentos e instalações de ensaio.</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Procedimento do ensaio conforme a ISO 10140</h3>
            <p class="mb-6">A amostra do material ou estrutura a ser testada é montada entre duas câmaras reverberantes, uma atuando como a sala de emissão e a outra como a sala de recepção. Um ruído rosa ou branco é gerado na câmara de emissão, utilizando uma fonte sonora calibrada. Microfones calibrados medem os níveis de pressão sonora em ambas as câmaras entre 100 Hz e 5000 Hz. A diferença nos níveis de pressão sonora ajustada para a área da amostra fornece o índice de redução sonora (Rw).</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Tipos de Amostras Testadas</h3>
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Paredes e Divisórias:</strong> Tijolos, blocos de concreto, painéis de gesso e sistemas de parede dupla.</li>
                <li><strong>Janelas e Portas:</strong> Vidros simples, duplos e triplos, portas de madeira maciça, metálicas ou acústicas.</li>
                <li><strong>Divisórias piso teto:</strong> Divisórias em vidro, cegas, com portas ou mistas.</li>
                <li><strong>Pisos e Tetos:</strong> Sistemas de piso flutuante, carpetes, pisos vinílicos, tetos suspensos e lajes de concreto.</li>
                <li><strong>Elementos de Fachada:</strong> Painéis de fachada, revestimentos externos e sistemas de parede cortina.</li>
            </ul>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Importância dos ensaios</h3>
            <p class="mb-6">Os ensaios são fundamentais para o desenvolvimento e seleção de materiais que atendam às exigências de conforto acústico e regulamentações, como a ABNT NBR 15575. A MMC LAB é um laboratório acreditado pelo INMETRO (CGCRE), sob o número CRL 1460, no ensaio para determinar a perda de transmissão sonora em câmara reverberante padronizado pela ISO 10140.</p>
        `
    },
    "mapa-de-ruido-utilizacao-do-software-cadnaa-para-determinacao-da-classe-de-ruido-de-empreendimentos-conforme-abnt-nbr-15575": {
        title: "Mapa de ruído: utilização do Software CadnaA para Determinação da Classe de Ruído de Empreendimentos conforme ABNT NBR 15575",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/GcE3RLfeIAsRPStjNLKxdWFvYj53CumQGpSdvKRA.jpeg",
        content: `
            <p class="mb-6"><strong>Introdução:</strong> O controle do ruído em ambientes urbanos é uma preocupação crescente devido aos seus impactos na qualidade de vida das pessoas. Nesse contexto, a ABNT NBR 15575 estabelece requisitos de isolamento acústico de fachadas de edificações habitacionais de acordo com a Classe de Ruído que o empreendimento está localizado. Uma ferramenta valiosa para essa determinação é o uso de simulações computacionais de mapa de ruído, que podem ser realizadas através de softwares especializados como o CadnaA.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">O Que é um Mapa de Ruído?</h3>
            <p class="mb-6">Um mapa de ruído é uma representação gráfica dos níveis de pressão sonora em uma determinada área geográfica. Ele é gerado a partir de simulações computacionais que consideram fontes de ruído, como tráfego veicular, atividades industriais e construções, bem como características do ambiente, como topografia, uso do solo e condições meteorológicas. Esses mapas auxiliam no planejamento urbano e na avaliação do impacto sonoro de novos empreendimentos.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Utilização do Software CadnaA</h3>
            <p class="mb-6">O CadnaA é um software amplamente utilizado para modelagem acústica e simulação de ruído. Ele permite a criação de modelos virtuais de ambientes urbanos e a análise dos níveis de ruído em diferentes cenários, incorporando algoritmos avançados para calcular a propagação do som no ambiente, levando em consideração reflexões, difrações e absorções sonoras.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Implementação da ABNT NBR 15575</h3>
            <p class="mb-6">A ABNT NBR 15.575-4 determina os níveis de desempenho acústico mínimos das fachadas de dormitórios. De acordo com a norma, a Classe de Ruído é determinada a partir dos níveis de pressão sonora incidentes (Linc) a 2 metros das fachadas. O Linc representa o nível incidente na fachada do ambiente, simulado ou calculado a partir do Ld (período diurno) ou Ln (período noturno), utilizando o mais elevado. O software CadnaA é perfeito para realizar essa simulação atendendo aos critérios da ISO 17.534-1.</p>
        `
    },
    "saiba-o-que-mudou-nos-requisitos-de-desempenho-acustico-da-abnt-nbr-15575-edificacoes-habitacionais": {
        title: "Saiba o que Mudou nos Requisitos de Desempenho Acústico da ABNT NBR 15575 Edificações Habitacionais",
        category: "Engenharia e Normas",
        imageUrl: "https://www.mmclab.com.br/upload/blog/8JMDvxkbE4UAj1idVFi2hPM51WfnsCkDlQgCs8sp.jpeg",
        content: `
            <p class="mb-6">Foi publicada no dia 14 de setembro de 2021 uma nova emenda de acústica para a NBR 15575. A emenda é obrigatória para empreendimentos residenciais em todo o Brasil e entra em vigor para novos projetos residenciais a partir de 13 de março de 2022.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Dentre as principais mudanças, estão:</h3>
            <p class="mb-4"><strong>1. Classe de ruído:</strong> A Classe de ruído é definida em função do cálculo do nível de pressão sonora incidente nas futuras fachadas de dormitórios. As medições in loco e uso de simulações em software passam a ser formalizadas para essa classificação. Acrescentou-se um método alternativo onde medições e simulações não são necessárias sob condições específicas.</p>
            <p class="mb-4"><strong>2. Novos requisitos de desempenho:</strong> Alterou-se o requisito de isolamento de ruído de impacto entre salas de unidades autônomas, bem como sistemas de piso de áreas de uso coletivo acima de dormitórios e salas. Estúdios, lofts e quitinetes devem atender ao nível de desempenho mais restritivo.</p>
            <p class="mb-4"><strong>3. Atualização da redação:</strong> Houve uma revisão geral de terminologias adotadas e normas referenciadas foram atualizadas.</p>
            <p class="mb-6"><strong>4. Valores de referência:</strong> Agora há uma distinção de performance entre sistemas leves e pesados nos valores de referência de isolamento de sistemas construtivos, ressaltando-se que a utilização de valores estimativos deve ser cautelosa.</p>
        `
    },
    "saiba-a-importancia-dos-edificios-terem-um-projeto-de-isolamento-acustico-na-piscina-da-cobertura": {
        title: "Saiba a Importância dos Edifícios Terem um Projeto de Isolamento Acústico na Piscina da Cobertura",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/ndgvCWcBj1Jk73ggeMK82nTEeomy0c30IiAuHJ4R.jpeg",
        content: `
            <p class="mb-6">Uma prática cada vez mais comum em projetos de edificações habitacionais e hotéis é a incorporação de áreas de lazer de uso coletivo nas coberturas dos edifícios. Essas áreas frequentemente incluem espaços como salões de festas, academias e piscinas.</p>
            <p class="mb-6">O ruído gerado por uma piscina em uma edificação sem o isolamento acústico adequado pode ser motivo de muito incômodo para os moradores. A transmissão de energia sonora por via estrutural quando alguém utiliza a piscina é tão grande que os níveis medidos no apartamento abaixo podem superar os limites exigidos pelas normas.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">A Transmissão Sonora Estrutural</h3>
            <p class="mb-6">A transmissão do som pela água é muito mais rápida que pelo ar, com perda de energia consideravelmente menor. Quando alguém utiliza a piscina, as paredes e o fundo recebem perturbações que causam um "efeito de amplificação" transmitindo o som diretamente pela estrutura do edifício.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Como mitigar esse problema?</h3>
            <p class="mb-6">Recomenda-se a desconexão estrutural da piscina em relação ao prédio. A piscina deve ser projetada para "flutuar" sem contato rígido com a edificação, utilizando elastômeros (pads) ou molas dimensionados com base nas cargas atuantes para absorver as vibrações. Máquinas e tubulações da piscina também devem ser desconectadas para mitigar a transmissão indireta.</p>
        `
    },
    "e-se-pudessemos-ver-o-som-conheca-a-camera-acustica-soundcam-20": {
        title: "E se pudéssemos ver o som? Conheça a câmera acústica SoundCam 2.0",
        category: "Acústica",
        imageUrl: "https://www.mmclab.com.br/upload/blog/ZfqK2c602UNUSEeYI473UQpl4NX29ZM2DWrZ73kI.jpeg",
        content: `
            <p class="mb-6">Em um mundo onde a tecnologia nos surpreende a cada dia, há inovações que nos fazem questionar os limites da percepção humana. A câmera acústica SoundCam 2.0 é um desses avanços notáveis, permitindo que experimentemos o som de uma maneira totalmente inédita: visualmente. Neste artigo, descobriremos como ela transforma ondas sonoras em imagens.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Como Funciona?</h3>
            <p class="mb-6">A SoundCam 2.0 utiliza a técnica de <strong>Beamforming</strong>. Ela conta com uma matriz de microfones, hardware e software de aquisição de dados e algoritmos de processamento de sinal. Ao calcular a diferença de tempo que o som leva para atingir os diferentes microfones da matriz, o sistema determina a direção exata e a intensidade sonora, exibindo no mapa colorido em tempo real.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Aplicações Práticas</h3>
            <p class="mb-4"><strong>Na Construção Civil:</strong> Usada para mapear e corrigir com extrema precisão vazamentos sonoros em esquadrias, juntas de dilatação, portas e tubulações, evitando retrabalhos caros de isolamento acústico.</p>
            <p class="mb-4"><strong>Na Indústria:</strong> Ferramenta crucial para manutenção preditiva, localizando ruídos estranhos e desgastes mecânicos em máquinas antes que causem paradas de produção.</p>
            <p class="mb-6"><strong>Segurança Ocupacional:</strong> Identifica pontos com níveis elevados de ruído prejudicial à saúde auditiva dos trabalhadores, permitindo o direcionamento correto de barreiras ou abafadores.</p>
        `
    },
    "qual-a-importancia-de-um-laboratorio-ser-acreditado-pela-abnt-nbr-isoiec-17025": {
        title: "Qual a importância de um laboratório ser acreditado pela ABNT NBR ISO/IEC 17025 ?",
        category: "Testes Laboratoriais",
        imageUrl: "https://www.mmclab.com.br/upload/blog/IDRa9I9OS2CBZfXl7UDOuTtgIKrsv1uHy3RvqQeo.jpeg",
        content: `
            <p class="mb-6">A acreditação ABNT NBR ISO/IEC 17025 concedida pela CGCRE (Coordenação Geral de Acreditação do Inmetro) possui uma grande importância para os laboratórios de ensaio e calibração. Ela estabelece os requisitos gerais para a competência de laboratórios, seguindo as diretrizes internacionais da ISO e do IEC.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">O que significa a Acreditação?</h3>
            <p class="mb-6">Essa acreditação demonstra que o laboratório passou por uma avaliação extremamente rigorosa que atesta a competência técnica dos profissionais envolvidos, calibração e rastreabilidade metrológica de equipamentos, validação robusta de métodos de ensaio e gestão transparente de registros.</p>
            
            <h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Os benefícios para o cliente</h3>
            <p class="mb-6">Ter um ensaio feito por um laboratório acreditado garante que o laudo emitido possui validade legal, rastreabilidade metrológica oficial e reconhecimento internacional, prevenindo contra litígios técnicos e atendendo perfeitamente às exigências de prefeituras e órgãos reguladores. A MMC LAB é acreditada desde 2019 sob o número CRL 1460.</p>
        `
    }
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const post = BLOG_POSTS[slug];

    if (!post) {
        return (
            <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px]">
                <SiteHeader />
                <main className="flex-1 flex flex-col items-center justify-center py-20 px-6">
                    <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">error</span>
                    <h1 className="text-3xl font-bold text-slate-950 dark:text-white mb-2">Artigo Não Encontrado</h1>
                    <p className="text-slate-500 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
                    <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white font-bold hover:bg-[#a3987f] transition-all">
                        Voltar ao Blog
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    // Recentes: outros posts
    const recentPosts = Object.entries(BLOG_POSTS)
        .filter(([key]) => key !== slug)
        .map(([key, data]) => ({ slug: key, ...data }))
        .slice(0, 3);

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero / Header Section */}
                <section className="relative pt-16 pb-12 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20 transition-colors duration-300 sm:pt-20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-secondary transition-colors mb-6 cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Voltar para o Blog
                        </Link>

                        <div className="max-w-4xl">
                            <div className="inline-block bg-secondary/10 dark:bg-slate-800/80 text-secondary text-xs font-bold px-3.5 py-1.5 rounded-full border border-secondary/20 mb-4">
                                {post.category}
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Article Content Section */}
                <section className="py-16 bg-white dark:bg-slate-950">
                    <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-10 border border-slate-100 dark:border-slate-800 shadow-md">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <article 
                                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-justify space-y-6"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-10">
                            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 sticky top-[100px]">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-secondary">feed</span>
                                    Artigos Recentes
                                </h3>

                                <div className="space-y-6">
                                    {recentPosts.map((rPost) => (
                                        <Link key={rPost.slug} href={`/blog/${rPost.slug}`} className="group block border-b border-slate-200/60 dark:border-slate-800/80 last:border-0 pb-6 last:pb-0">
                                            <span className="block text-xs font-bold text-secondary uppercase mb-1.5">{rPost.category}</span>
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                                                {rPost.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
