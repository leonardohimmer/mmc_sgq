const servicos = [
    "Projetos Acústicos",
    "Ensaios Acústicos",
    "Mapa de Ruído",
    "Consultoria Acústica",
    "Ensaio de Isolamento Acústico em Laboratório (Rw)",
    "Licença de Instalação Acústica",
    "Análise de Vibração",
    "Câmera Acústica",
    "Ensaios em Campo",
    "Ensaio de Guarda-corpo e Parapeito",
    "Ensaio de Resistência de Aderência à Tração (Arrancamento)",
    "Ensaio de Integridade de Estacas (PIT)",
    "Teste de Ancoragem",
    "Ensaio de Permeabilidade",
    "Ensaio de Esclerometria no Concreto",
    "Ensaio Lumínico",
    "Impacto de Corpo Mole e Corpo Duro",
    "Ensaio de Peças Suspensas",
    "Inspeção de Fachadas",
    "Ensaio de Percussão",
    "Inspeção Termográfica",
    "Ensaios em Laboratório",
    "Ensaio de Resistência de Aderência à Tração",
    "Simulações de Desempenho",
    "Simulação Lumínica",
    "Simulação Térmica",
];

const outros = "Outros";

servicos.sort((a, b) => a.localeCompare(b, 'pt-BR'));

console.log(JSON.stringify([...servicos, outros], null, 4));
