import nodemailer from "nodemailer"

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    })
}

export async function sendWelcomeEmail(to: string, name: string, rawPassword: string) {
    const loginUrl = `${process.env.NEXTAUTH_URL}/login-cliente`

    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Bem-vindo ao Portal do Cliente - MMC Lab",
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Olá, ${name}!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.8;">Seu acesso ao Portal do Cliente está pronto.</p>
                </div>
                <div style="padding: 40px; line-height: 1.6;">
                    <p>Recebemos sua solicitação através do nosso site e já criamos uma conta para você acompanhar o andamento dos seus ensaios em tempo real.</p>
                    
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0;">
                        <h2 style="margin-top: 0; font-size: 18px; color: #0f172a;">Suas Credenciais de Acesso:</h2>
                        <p style="margin: 5px 0;"><strong>E-mail:</strong> ${to}</p>
                        <p style="margin: 5px 0;"><strong>Senha Inicial:</strong> ${rawPassword}</p>
                        <p style="font-size: 12px; color: #64748b; margin-top: 10px;">* Recomendamos alterar sua senha no primeiro acesso.</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${loginUrl}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Acessar o Portal</a>
                    </div>

                    <p style="margin-top: 40px;">Se tiver qualquer dúvida, basta responder a este e-mail ou entrar em contato pelo nosso WhatsApp.</p>
                </div>
                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Sistema de Gestão de Qualidade</p>
                </div>
            </div>
        `,
    }

    try {
        // Verificar conexão antes de enviar
        await transporter.verify();
        console.log("Conexão SMTP verificada com sucesso.");

        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO DETALHADO AO ENVIAR E-MAIL:", {
            error,
            host: process.env.EMAIL_HOST,
            user: process.env.EMAIL_USER,
            port: process.env.EMAIL_PORT
        })
        return { success: false, error }
    }
}

export async function sendFinalizedEmail(to: string, name: string, requestId: string, type: string) {
    const portalUrl = `${process.env.NEXTAUTH_URL}/login-cliente`
    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Processo Finalizado - ${type} - MMC Lab`,
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #10b981; color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Olá, ${name}!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Temos ótimas notícias: seu processo foi finalizado!</p>
                </div>
                <div style="padding: 40px; line-height: 1.6;">
                    <p>Informamos que o seu ensaio de <strong>${type}</strong> foi concluído com sucesso.</p>
                    
                    <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
                        <h2 style="margin-top: 0; font-size: 18px; color: #065f46;">O que isso significa?</h2>
                        <ul style="padding-left: 20px; margin: 10px 0;">
                            <li>O relatório técnico já está disponível para visualização.</li>
                            <li>Você pode baixar o documento PDF diretamente pelo portal.</li>
                            <li>Sua pesquisa de satisfação está aguardando seu feedback.</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${portalUrl}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Ver Resultado no Portal</a>
                    </div>

                    <p style="margin-top: 40px;">Sua opinião é muito importante para nós. Ao acessar o portal, não esqueça de avaliar nosso atendimento.</p>
                </div>
                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Sistema de Gestão de Qualidade</p>
                </div>
            </div>
        `,
    }

    try {
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de finalização enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE FINALIZAÇÃO:", error)
        return { success: false, error }
    }
}

export async function sendResetPasswordEmail(to: string, name: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Recuperação de Senha - MMC Lab",
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Olá, ${name}!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.8;">Você solicitou a recuperação de sua senha.</p>
                </div>
                <div style="padding: 40px; line-height: 1.6;">
                    <p>Recebemos uma solicitação para redefinir a senha da sua conta no Sistema de Gestão de Qualidade da MMC Lab.</p>
                    
                    <p>Para prosseguir com a redefinição, clique no botão abaixo:</p>

                    <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
                    </div>

                    <p style="font-size: 14px; color: #64748b;">Este link é válido por 1 hora. Se você não solicitou esta alteração, por favor ignore este e-mail.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <p style="font-size: 12px; color: #94a3b8;">Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
                    <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">${resetUrl}</p>
                </div>
                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Sistema de Gestão de Qualidade</p>
                </div>
            </div>
        `,
    }

    try {
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de recuperação enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE RECUPERAÇÃO:", error)
        return { success: false, error }
    }
}
