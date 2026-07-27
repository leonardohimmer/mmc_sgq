const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Import sendWelcomeEmail directly (since it is defined in src/lib/mail.ts)
// We will write a small wrapper that simulates the sendWelcomeEmail from the codebase
async function sendWelcomeEmailMock(to, name, password) {
  console.log(`[SIMULAÇÃO] Chamando sendWelcomeEmail para o destinatário: ${to}`);
  console.log(`[SIMULAÇÃO] Nome do cliente: ${name}`);
  console.log(`[SIMULAÇÃO] Senha gerada: ${password}`);
  
  // Test connection or verify env variables
  const host = process.env.EMAIL_HOST || "";
  const user = process.env.EMAIL_USER || "";
  console.log(`[SIMULAÇÃO] Variáveis carregadas - EMAIL_HOST: "${host}", EMAIL_USER: "${user}"`);
  
  if (!host || !user) {
    console.warn(`[AVISO] Configuração de e-mail ausente! O e-mail não seria enviado na produção.`);
    return { success: false, error: "SMTP credentials missing" };
  }
  
  return { success: true };
}

async function simulateFlow(emailTest = "test_envio_email@mmclab.com.br") {
  console.log(`Iniciando simulação do fluxo de finalização para o e-mail: ${emailTest}`);
  
  try {
    // 1. Limpar usuário de teste anterior se existir
    await prisma.user.deleteMany({
      where: { email: emailTest }
    });
    console.log("Limpeza de usuário de teste anterior realizada.");

    // 2. Simular criação/verificação de usuário
    let user = await prisma.user.findUnique({
      where: { email: emailTest }
    });

    let isNewUser = false;
    let generatedPassword = "";

    if (!user) {
      const rawPassword = "51988887777"; // mock phone
      generatedPassword = rawPassword || "123456";
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Usando transaction para simular a criação exatamente como na API
      user = await prisma.user.create({
        data: {
          name: "Cliente Teste Envio",
          email: emailTest,
          password: hashedPassword,
          role: "CLIENTE",
          company: "Empresa Teste Ltda",
          whatsapp: "(51) 98888-7777",
        }
      });
      isNewUser = true;
      console.log(`Usuário criado com sucesso no banco de dados! ID: ${user.id}`);
    }

    // 3. Enviar e-mail se for novo
    if (isNewUser) {
      const result = await sendWelcomeEmailMock(user.email, user.name, generatedPassword);
      console.log("Resultado da chamada de e-mail:", result);
    } else {
      console.log("Usuário já existia. E-mail de boas-vindas ignorado.");
    }
    
    // 4. Limpar o usuário criado para não sujar o banco de produção
    await prisma.user.delete({
      where: { email: emailTest }
    });
    console.log("Limpeza pós-teste realizada com sucesso.");
    
  } catch (error) {
    console.error("Erro na simulação do fluxo:", error);
  }
}

// Rodar com email de teste
simulateFlow()
  .finally(() => prisma.$disconnect());
