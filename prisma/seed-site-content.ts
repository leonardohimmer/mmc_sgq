import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. História do Laboratório
    await prisma.siteContent.upsert({
        where: { section: 'history' },
        update: {},
        create: {
            section: 'history',
            data: {
                title: 'Ensaios de Desempenho Estrutural, Acústico e Simulações para a Construção Civil',
                paragraphs: [
                    'A MMC LAB Controle Tecnológico foi fundada em 2013 com o intuito de atender a necessidade das empresas incorporadoras, construtoras e fabricantes de materiais, componentes e sistemas construtivos diante dos novos requisitos trazidos pela ABNT NBR 15575 – Edificações habitacionais – Desempenho. Ampliava-se assim o conhecimento que a MMC acumulou em realização de ensaios que envolviam requisitos de outras normas.',
                    'Nossos serviços são focados em ensaios relacionados ao desempenho estrutural de diferentes componentes e sistemas construtivos, desempenho acústico e simulações computacionais.',
                    'Nossa sede está localizada em Canoas/RS e foi especialmente construída para a realização de ensaios em ambiente laboratorial. Além disso, temos equipamentos apropriados para ensaios em campo.',
                    'Estamos constantemente investindo em educação para nos mantermos atualizados e expandindo nosso escopo de atuação, buscando oferecer soluções cada vez mais abrangentes e inovadoras.',
                ],
            },
        },
    })

    // 2. Indicadores / Estatísticas
    await prisma.siteContent.upsert({
        where: { section: 'stats' },
        update: {},
        create: {
            section: 'stats',
            data: {
                items: [
                    { value: '+10000', label: 'Ensaios', color: 'primary' },
                    { value: '+400', label: 'Clientes', color: 'primary' },
                    { value: '+100', label: 'Projetos Acústicos', color: 'primary' },
                    { value: '+10', label: 'Anos de Experiência', color: 'primary' },
                ],
            },
        },
    })

    // 3. Equipe
    await prisma.siteContent.upsert({
        where: { section: 'team' },
        update: {},
        create: {
            section: 'team',
            data: {
                members: [
                    { name: 'Marcus Daniel F.', role: 'Engenheiro Civil', photoUrl: '' },
                    { name: 'Cláudio Trindade Scherer', role: 'Arquiteto e Urbanista', photoUrl: '' },
                    { name: 'Mauro Joel F. dos Santos', role: 'Engenheiro Civil', photoUrl: '' },
                    { name: 'Márcio Muriel F.', role: 'Diretor', photoUrl: '' },
                    { name: 'Géssica Israel da Silva', role: 'Engenheira Civil', photoUrl: '' },
                    { name: 'Ane Alves de Souza', role: 'Colaboradora', photoUrl: '' },
                    { name: 'Paula Rodrigues de Mattos', role: 'Auxiliar Administrativa', photoUrl: '' },
                ],
            },
        },
    })

    // 4. Depoimentos (Google Reviews)
    await prisma.siteContent.upsert({
        where: { section: 'testimonials' },
        update: {},
        create: {
            section: 'testimonials',
            data: {
                reviews: [
                    { name: 'Pallyanne Morais', rating: 5, text: 'Qualidade e excelente atendimento 🥳', source: 'Google' },
                    { name: 'Bruna Breier', rating: 5, text: 'Empresa séria com excelentes profissionais', source: 'Google' },
                    { name: 'João Pedro Moraes', rating: 5, text: 'Qualidade, Infraestrutura e Responsabilidade!', source: 'Google' },
                    { name: 'Andre C.P', rating: 5, text: 'Tecnologia de ponta', source: 'Google' },
                    { name: 'Mauro Santos', rating: 5, text: 'Melhor lugar do mundo para se trabalhar!!!!', source: 'Google' },
                    { name: 'Raul Mondadori', rating: 5, text: 'Notável empresa, com um belo time de profissionais. Parabéns MMC LAB!', source: 'Google' },
                    { name: 'Rosani de Lourdes Campanari', rating: 5, text: 'Excelente atendimento!', source: 'Google' },
                ],
            },
        },
    })

    console.log('✅ Conteúdo do site populado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
