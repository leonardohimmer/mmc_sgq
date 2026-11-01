import nodemailer from "nodemailer"

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
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

function getSender() {
    const user = process.env.EMAIL_USER || "contato@mmclab.com.br"
    return `"MMC Lab - Controle Tecnológico" <${user}>`
}

export function getBaseUrl(customBaseUrl?: string) {
    const defaultHost = "https://mmclab.vercel.app"
    let host = (customBaseUrl || process.env.NEXTAUTH_URL || defaultHost).trim()
    if (host.includes("site-sgq-six.vercel.app")) {
        host = host.replace("site-sgq-six.vercel.app", "mmclab.vercel.app")
    }
    return host.replace(/\/+$/, "")
}

function getPortalLoginUrl(customBaseUrl?: string) {
    return `${getBaseUrl(customBaseUrl)}/login-cliente`
}

/**
 * Cabeçalho visual oficial com a logo estática da MMC LAB (mesmo card do sistema, maior e sem efeitos)
 */
export function renderEmailLogo(baseUrl?: string) {
    const host = getBaseUrl(baseUrl)
    const logoUrl = `${host}/logo-trimmed.png`
    return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 22px auto; border-collapse: collapse;">
            <tr>
                <td align="center" valign="middle" style="background-color: #ffffff; padding: 18px 28px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);">
                    <img 
                        src="${logoUrl}" 
                        alt="MMC Lab - Controle Tecnológico" 
                        width="168" 
                        height="98" 
                        style="display: block; width: 168px; height: 98px; max-width: 168px; border: 0; outline: none; text-decoration: none; margin: 0 auto; -ms-interpolation-mode: bicubic;" 
                    />
                </td>
            </tr>
        </table>
    `
}

export function normalizeRecipients(to: string | (string | null | undefined)[] | null | undefined): string[] {
    if (!to) return []
    const list = Array.isArray(to) ? to : [to]
    const clean = list
        .flatMap(item => (typeof item === 'string' ? item.split(',') : []))
        .map(e => e.trim().toLowerCase())
        .filter(e => e && e.includes('@'))
    return Array.from(new Set(clean))
}

/**
 * Bloco corporativo de acompanhamento no sistema com link de acesso ao Portal do Cliente
 */
export function renderProcessTrackingBanner(loginUrl?: string) {
    const targetUrl = loginUrl || getPortalLoginUrl()
    return `
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 8px 0; border-collapse: separate; border-spacing: 0; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden;">
            <tr>
                <td style="padding: 24px 22px; text-align: center;">
                    <div style="display: inline-block; background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 50px; padding: 5px 14px; margin-bottom: 10px;">
                        <span style="font-size: 11px; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.6px;">🌐 Portal do Cliente MMC Lab</span>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 800; color: #0f172a;">
                        Acompanhe todo o seu processo em tempo real
                    </h3>
                    <p style="margin: 0 auto 18px auto; font-size: 13px; color: #475569; line-height: 1.6; max-width: 470px;">
                        No Portal do Cliente você consulta o status de cada ensaio, aprova propostas, baixa relatórios técnicos assinados e acessa suas notas fiscais a qualquer momento.
                    </p>
                    <div style="margin: 4px 0 12px 0;">
                        <a href="${targetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 26px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 13px; letter-spacing: 0.2px;">
                            Acessar Portal do Cliente &rarr;
                        </a>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                        Link direto: <a href="${targetUrl}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">${targetUrl}</a>
                    </p>
                </td>
            </tr>
        </table>
    `
}

/**
 * Template base unificado para todos os e-mails enviados aos clientes
 */
function renderEmailLayout(params: {
    baseUrl?: string
    badgeText: string
    badgeColor?: string
    badgeBg?: string
    title: string
    subtitle: string
    bodyHtml: string
}) {
    const {
        baseUrl,
        badgeText,
        badgeColor = "#0d9488",
        badgeBg = "#ccfbf1",
        title,
        subtitle,
        bodyHtml
    } = params

    const portalUrl = getPortalLoginUrl(baseUrl)
    const year = new Date().getFullYear()

    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 28px 12px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
                            <!-- Barra Superior Institucional -->
                            <tr>
                                <td style="height: 6px; background: linear-gradient(90deg, #0d9488 0%, #0284c7 50%, #2563eb 100%); background-color: #0d9488; font-size: 0; line-height: 0;">&nbsp;</td>
                            </tr>

                            <!-- Cabeçalho com Logo Estática -->
                            <tr>
                                <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 32px 28px 26px 28px; text-align: center;">
                                    ${renderEmailLogo(baseUrl)}
                                    <div style="display: inline-block; background-color: ${badgeBg}; border-radius: 50px; padding: 4px 14px; margin-bottom: 10px;">
                                        <span style="font-size: 11px; font-weight: 800; color: ${badgeColor}; text-transform: uppercase; letter-spacing: 0.6px;">${badgeText}</span>
                                    </div>
                                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; line-height: 1.3;">
                                        ${title}
                                    </h1>
                                    <p style="margin: 8px auto 0 auto; font-size: 14px; color: #475569; max-width: 480px; line-height: 1.5;">
                                        ${subtitle}
                                    </p>
                                </td>
                            </tr>

                            <!-- Corpo Principal -->
                            <tr>
                                <td style="padding: 32px 30px; line-height: 1.65; color: #1e293b; font-size: 15px;">
                                    ${bodyHtml}
                                </td>
                            </tr>

                            <!-- Rodapé Corporativo -->
                            <tr>
                                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 28px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
                                    <p style="margin: 0 0 4px 0; font-weight: 800; color: #0f172a; font-size: 13px;">
                                        MMC Lab &bull; Controle Tecnológico e Engenharia
                                    </p>
                                    <p style="margin: 0 0 8px 0; color: #64748b;">
                                        Em caso de dúvidas, basta responder diretamente a este e-mail ou acessar o <a href="${portalUrl}" style="color: #0284c7; text-decoration: none; font-weight: 600;">Portal do Cliente</a>.
                                    </p>
                                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                                        &copy; ${year} MMC Lab &mdash; Sistema de Gestão da Qualidade. Todos os direitos reservados.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
}

export function getPdfAttachment(dataUrlOrBase64: string | null | undefined, defaultFilename: string) {
    if (!dataUrlOrBase64) return null
    try {
        if (dataUrlOrBase64.startsWith("data:")) {
            const commaIndex = dataUrlOrBase64.indexOf(",")
            if (commaIndex !== -1) {
                const header = dataUrlOrBase64.substring(0, commaIndex)
                const contentTypeMatch = header.match(/data:(.*?);base64/)
                const contentType = contentTypeMatch ? contentTypeMatch[1] : "application/pdf"
                const base64Data = dataUrlOrBase64.substring(commaIndex + 1).trim()
                return {
                    filename: defaultFilename,
                    content: Buffer.from(base64Data, "base64"),
                    contentType
                }
            }
        }
        if (dataUrlOrBase64.length > 200 && !dataUrlOrBase64.startsWith("http") && !dataUrlOrBase64.startsWith("/")) {
            return {
                filename: defaultFilename,
                content: Buffer.from(dataUrlOrBase64.trim(), "base64"),
                contentType: "application/pdf"
            }
        }
    } catch (e) {
        console.error("Erro ao processar anexo PDF para e-mail:", e)
    }
    return null
}

/**
 * 1) E-mail de Verificação de Conta & Boas-Vindas ao Cliente
 */
export async function sendVerificationEmail(to: string, name: string, token: string) {
    const baseUrl = getBaseUrl()
    const verifyUrl = `${baseUrl}/verificar-email?token=${token}`
    const loginUrl = getPortalLoginUrl(baseUrl)

    const transporter = createTransporter()

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>! Sua conta no <strong>Portal do Cliente MMC Lab</strong> foi criada com sucesso.
        </p>
        <p style="color: #475569;">
            Para garantir a segurança das suas informações e liberar seu acesso completo ao painel, confirme seu endereço de e-mail clicando no botão abaixo:
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #059669; color: #ffffff; padding: 15px 34px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                &check; Confirmar Meu E-mail
            </a>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; font-size: 13px; color: #475569;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a;"><strong>O que você encontra no Portal do Cliente:</strong></p>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.7;">
                <li>Solicitação rápida de novos ensaios tecnológicos</li>
                <li>Consulta e aceite digital de propostas comerciais</li>
                <li>Acompanhamento em tempo real do cronograma e execução</li>
                <li>Download imediato de laudos técnicos e notas fiscais</li>
            </ul>
        </div>

        ${renderProcessTrackingBanner(loginUrl)}

        <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #64748b; word-break: break-all;">
            <span>Caso o botão acima não funcione, copie e cole este link no navegador:</span><br/>
            <a href="${verifyUrl}" style="color: #0284c7; font-weight: 600;">${verifyUrl}</a>
        </div>
    `

    const mailOptions = {
        from: getSender(),
        to,
        subject: "Confirme seu e-mail e ative sua conta - MMC Lab",
        html: renderEmailLayout({
            baseUrl,
            badgeText: "Ativação de Conta",
            badgeColor: "#047857",
            badgeBg: "#d1fae5",
            title: `Bem-vindo(a) à MMC Lab, ${name}!`,
            subtitle: "Confirme seu e-mail para ativar seu acesso ao Portal do Cliente.",
            bodyHtml
        }),
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim()
        const emailPass = process.env.EMAIL_PASS?.trim()
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de verificação simulado para:", to)
            return { success: true, simulated: true }
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de verificação enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE VERIFICAÇÃO:", error)
        return { success: false, error }
    }
}

/**
 * 2) Envio de Proposta Comercial para o e-mail do cliente
 */
export async function sendProposalEmail(params: {
    to: string | string[]
    name: string
    requestId: string
    osCode?: string
    proposalCode: string
    type: string
    workName?: string | null
    location?: string | null
    quantidadeEnsaios?: string | null
    proposalPdfUrl?: string | null
}) {
    const { to, name, osCode, proposalCode, type, workName, location, quantidadeEnsaios, proposalPdfUrl } = params
    const recipients = normalizeRecipients(to)
    if (recipients.length === 0) {
        console.warn("Nenhum destinatário válido para proposta:", to)
        return { success: false, error: "Nenhum e-mail válido de destino" }
    }

    const loginUrl = getPortalLoginUrl()
    const proposalDownloadUrl = proposalPdfUrl && !proposalPdfUrl.startsWith("data:") ? proposalPdfUrl : loginUrl

    const transporter = createTransporter()

    const attachments: any[] = []
    const attachment = getPdfAttachment(proposalPdfUrl, `Proposta_${proposalCode || "MMC"}.pdf`)
    if (attachment) {
        attachments.push(attachment)
    }

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Elaboramos a proposta técnica-comercial referente à sua solicitação de <strong>${type}</strong>. Confira abaixo o resumo do atendimento:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                📋 Resumo da Proposta Comercial
            </div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 42%; border-bottom: 1px solid #f1f5f9;">Código da Proposta:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${proposalCode}</td>
                </tr>
                ${osCode ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Ordem de Serviço (OS):</td>
                    <td style="padding: 8px 0; color: #2563eb; font-weight: 700; border-bottom: 1px solid #f1f5f9;">#${osCode}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Ensaio / Serviço:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${type}</td>
                </tr>
                ${workName || location ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Obra / Local:</td>
                    <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${workName || location}</td>
                </tr>
                ` : ''}
                ${quantidadeEnsaios ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b;">Qtd. de Ensaios:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${quantidadeEnsaios}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        ${attachment ? `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px; margin: 18px 0; font-size: 13px; color: #1e40af;">
            📎 <strong>Arquivo em anexo:</strong> O documento PDF da proposta comercial também está anexado diretamente a este e-mail.
        </div>
        ` : ''}

        <div style="text-align: center; margin: 28px 0;">
            <a href="${proposalDownloadUrl}" style="background-color: #2563eb; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                📄 Visualizar / Aprovar Proposta no Portal
            </a>
        </div>

        <p style="font-size: 13px; color: #475569; text-align: center; margin: 0 0 20px 0;">
            Para registrar seu aceite comercial e liberar o agendamento do ensaio, acesse o Portal do Cliente ou responda a este e-mail.
        </p>

        ${renderProcessTrackingBanner(loginUrl)}
    `

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Proposta Comercial - ${type} [${proposalCode || osCode || "MMC Lab"}]`,
        html: renderEmailLayout({
            badgeText: "Proposta Comercial",
            badgeColor: "#1d4ed8",
            badgeBg: "#dbeafe",
            title: "Proposta Comercial Disponível",
            subtitle: `Olá, ${name}! Confira os detalhes da proposta elaborada para o seu ensaio.`,
            bodyHtml
        }),
        attachments
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim()
        const emailPass = process.env.EMAIL_PASS?.trim()
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de proposta simulado para:", recipients)
            return { success: true, simulated: true }
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de proposta enviado com sucesso para ${recipients.join(", ")}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE PROPOSTA:", error)
        return { success: false, error }
    }
}

/**
 * 3) E-mail de Boas-Vindas com Credenciais de Acesso
 */
export async function sendWelcomeEmail(to: string, name: string, rawPassword: string) {
    const loginUrl = getPortalLoginUrl()
    const transporter = createTransporter()

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Recebemos sua solicitação e preparamos seu acesso exclusivo ao <strong>Portal do Cliente MMC Lab</strong> para que você acompanhe todas as etapas dos seus ensaios em tempo real.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; padding: 22px; border-radius: 10px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                🔐 Suas Credenciais de Acesso
            </div>
            <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>E-mail de Login:</strong> ${to}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Senha Inicial:</strong> <code style="background-color: #e2e8f0; padding: 3px 8px; border-radius: 6px; font-weight: 700; color: #0f172a;">${rawPassword}</code></p>
            <p style="font-size: 12px; color: #64748b; margin: 12px 0 0 0;">
                * Para sua segurança, recomendamos alterar a senha após o primeiro acesso.
            </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="${loginUrl}" style="background-color: #2563eb; color: #ffffff; padding: 15px 34px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                Acessar o Portal do Cliente &rarr;
            </a>
        </div>
    `

    const mailOptions = {
        from: getSender(),
        to,
        subject: "Bem-vindo ao Portal do Cliente - MMC Lab",
        html: renderEmailLayout({
            badgeText: "Credenciais de Acesso",
            badgeColor: "#0369a1",
            badgeBg: "#e0f2fe",
            title: `Olá, ${name}!`,
            subtitle: "Seu acesso ao Portal do Cliente MMC Lab já está liberado.",
            bodyHtml
        }),
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim()
        const emailPass = process.env.EMAIL_PASS?.trim()
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de boas-vindas simulado para:", to)
            return { success: true, simulated: true }
        }

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

/**
 * 4) E-mail de Processo Finalizado
 */
export async function sendFinalizedEmail(to: string, name: string, requestId: string, type: string) {
    const portalUrl = getPortalLoginUrl()
    const transporter = createTransporter()

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Informamos que o processo referente ao ensaio de <strong>${type}</strong> foi concluído com sucesso pela nossa equipe técnica.
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; padding: 20px 22px; border-radius: 10px; margin: 24px 0;">
            <h2 style="margin: 0 0 10px 0; font-size: 16px; color: #065f46;">O que já está disponível para você:</h2>
            <ul style="padding-left: 20px; margin: 0; color: #1e293b; font-size: 14px; line-height: 1.7;">
                <li>Relatórios técnicos finais revisados e liberados para consulta.</li>
                <li>Download imediato dos documentos em PDF diretamente pelo Portal.</li>
                <li>Histórico completo de execução e faturamento da Ordem de Serviço.</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="${portalUrl}" style="background-color: #059669; color: #ffffff; padding: 15px 34px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                Acessar Documentos no Portal &rarr;
            </a>
        </div>

        ${renderProcessTrackingBanner(portalUrl)}
    `

    const mailOptions = {
        from: getSender(),
        to,
        subject: `Processo Finalizado - ${type} - MMC Lab`,
        html: renderEmailLayout({
            badgeText: "Processo Concluído",
            badgeColor: "#047857",
            badgeBg: "#d1fae5",
            title: "Seu Processo Foi Finalizado!",
            subtitle: `Olá, ${name}! Todos os documentos do ensaio de ${type} estão disponíveis.`,
            bodyHtml
        }),
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim()
        const emailPass = process.env.EMAIL_PASS?.trim()
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de finalização simulado para:", to)
            return { success: true, simulated: true }
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de finalização enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE FINALIZAÇÃO:", error)
        return { success: false, error }
    }
}

/**
 * 5) Envio de Relatório Técnico Parcial/Final + Pesquisa de Satisfação
 */
export async function sendReportWithSurveyEmail(params: {
    to: string | string[];
    name: string;
    requestId: string;
    type: string;
    itemNumber: number;
    totalItems: number;
    osCode?: string;
    reportPdfUrl?: string | null;
}) {
    const { to, name, requestId, type, itemNumber, totalItems, osCode, reportPdfUrl } = params;
    const recipients = normalizeRecipients(to);
    if (recipients.length === 0) {
        console.warn("Nenhum destinatário válido para relatório:", to);
        return { success: false, error: "Nenhum e-mail válido" };
    }

    const baseUrl = getBaseUrl();
    const loginUrl = getPortalLoginUrl(baseUrl);
    const surveyUrl = `${baseUrl}/portal-cliente/pesquisa/${requestId}`;
    const pdfUrl = reportPdfUrl && !reportPdfUrl.startsWith('/api/') && !reportPdfUrl.startsWith('data:') ? reportPdfUrl : loginUrl;

    const transporter = createTransporter();

    const attachments: any[] = [];
    const attachment = getPdfAttachment(reportPdfUrl, `Relatorio_Tecnico_Ensaio_${itemNumber}_${osCode || "MMC"}.pdf`);
    if (attachment) {
        attachments.push(attachment);
    }

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Informamos que o relatório técnico referente ao ensaio de <strong>${type}</strong> (Ensaio <strong>${itemNumber} de ${totalItems}</strong> contratados) foi aprovado pelo nosso corpo técnico e já está disponível.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                📄 Detalhes do Laudo Técnico
            </div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 42%; border-bottom: 1px solid #f1f5f9;">Ordem de Serviço (OS):</td>
                    <td style="padding: 8px 0; color: #2563eb; font-weight: 700; border-bottom: 1px solid #f1f5f9;">#${osCode || requestId.substring(0, 8)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Ensaio Entregue:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700; border-bottom: 1px solid #f1f5f9;">Ensaio ${itemNumber} de ${totalItems}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b;">Serviço Técnico:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${type}</td>
                </tr>
            </table>
        </div>

        ${attachment ? `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 16px; margin: 18px 0; font-size: 13px; color: #1e40af;">
            📎 <strong>Laudo em anexo:</strong> O arquivo PDF deste relatório técnico também segue anexado a este e-mail.
        </div>
        ` : ''}

        <div style="text-align: center; margin: 26px 0;">
            <a href="${pdfUrl}" style="background-color: #2563eb; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                📄 Baixar Relatório Técnico (PDF)
            </a>
        </div>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; padding: 20px; border-radius: 10px; margin: 26px 0;">
            <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #065f46;">
                ⭐ Pesquisa de Satisfação (${itemNumber} de ${totalItems})
            </h3>
            <p style="font-size: 13px; color: #334155; margin: 0 0 16px 0; line-height: 1.55;">
                Sua avaliação é fundamental para mantermos a excelência técnica do nosso laboratório. Leva menos de 1 minuto:
            </p>
            <div style="text-align: center;">
                <a href="${surveyUrl}" style="background-color: #059669; color: #ffffff; padding: 11px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 13px;">
                    Avaliar Atendimento &rarr;
                </a>
            </div>
        </div>

        ${renderProcessTrackingBanner(loginUrl)}
    `;

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Relatório de Ensaio (${itemNumber} de ${totalItems}) - ${osCode || 'MMC Lab'}`,
        html: renderEmailLayout({
            baseUrl,
            badgeText: "Laudo Técnico Liberado",
            badgeColor: "#1d4ed8",
            badgeBg: "#dbeafe",
            title: "Relatório Técnico Disponível",
            subtitle: `Olá, ${name}! O laudo técnico do ensaio ${itemNumber} de ${totalItems} foi concluído.`,
            bodyHtml
        }),
        attachments
    };

    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de relatório simulado para:", recipients);
            return { success: true, simulated: true };
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail de relatório enviado com sucesso para ${recipients.join(", ")}. MessageId: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE RELATÓRIO E PESQUISA:", error);
        return { success: false, error };
    }
}

/**
 * 6) Envio da Nota Fiscal para o cliente
 */
export async function sendInvoiceEmail(params: {
    to: string | string[];
    name: string;
    requestId: string;
    osCode?: string;
    invoiceNumber: string;
    valorNota?: number | null;
    qtdFaturada?: number | null;
    type: string;
    invoicePdfUrl?: string | null;
    observacoes?: string | null;
}) {
    const { to, name, osCode, invoiceNumber, valorNota, qtdFaturada, type, invoicePdfUrl, observacoes } = params;
    const recipients = normalizeRecipients(to);
    if (recipients.length === 0) {
        console.warn("Nenhum destinatário válido para nota fiscal:", to);
        return { success: false, error: "Nenhum e-mail de destino válido" };
    }

    const loginUrl = getPortalLoginUrl();
    const invoiceDownloadUrl = invoicePdfUrl && !invoicePdfUrl.startsWith("data:") ? invoicePdfUrl : loginUrl;

    const transporter = createTransporter();

    const attachments: any[] = [];
    const attachment = getPdfAttachment(invoicePdfUrl, `Nota_Fiscal_${invoiceNumber || "MMC"}.pdf`);
    if (attachment) {
        attachments.push(attachment);
    }

    const valorFormatado = valorNota != null
        ? valorNota.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : null;

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Informamos que a <strong>Nota Fiscal de Serviços (NF nº ${invoiceNumber})</strong> referente ao atendimento de <strong>${type}</strong> foi emitida e disponibilizada em sua conta.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                🧾 Resumo do Faturamento
            </div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 42%; border-bottom: 1px solid #f1f5f9;">Número da NF:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 800; border-bottom: 1px solid #f1f5f9;">NF nº ${invoiceNumber}</td>
                </tr>
                ${valorFormatado ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Valor Total da NF:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: 800; font-size: 16px; border-bottom: 1px solid #f1f5f9;">${valorFormatado}</td>
                </tr>
                ` : ''}
                ${osCode ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Ordem de Serviço (OS):</td>
                    <td style="padding: 8px 0; color: #2563eb; font-weight: 700; border-bottom: 1px solid #f1f5f9;">#${osCode}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Serviço Prestado:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${type}</td>
                </tr>
                ${qtdFaturada ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b; ${observacoes ? 'border-bottom: 1px solid #f1f5f9;' : ''}">Ensaios Faturados:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; ${observacoes ? 'border-bottom: 1px solid #f1f5f9;' : ''}">${qtdFaturada} ensaio(s)</td>
                </tr>
                ` : ''}
                ${observacoes ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b;">Observações:</td>
                    <td style="padding: 8px 0; color: #334155;">${observacoes}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        ${attachment ? `
        <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 12px 16px; margin: 18px 0; font-size: 13px; color: #5b21b6;">
            📎 <strong>Nota Fiscal em anexo:</strong> O arquivo PDF da Nota Fiscal nº ${invoiceNumber} segue anexado diretamente a este e-mail.
        </div>
        ` : ''}

        <div style="text-align: center; margin: 28px 0;">
            <a href="${invoiceDownloadUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">
                🧾 Visualizar / Baixar Nota Fiscal
            </a>
        </div>

        <p style="font-size: 13px; color: #475569; text-align: center; margin: 0 0 20px 0;">
            Você também pode consultar suas notas fiscais e informar o comprovante de pagamento diretamente no Portal do Cliente.
        </p>

        ${renderProcessTrackingBanner(loginUrl)}
    `;

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Nota Fiscal Emitida - ${type} [NF nº ${invoiceNumber}] - MMC Lab`,
        html: renderEmailLayout({
            badgeText: "Faturamento • Nota Fiscal",
            badgeColor: "#6d28d9",
            badgeBg: "#ede9fe",
            title: "Nota Fiscal de Serviços Emitida",
            subtitle: `Olá, ${name}! Disponibilizamos a Nota Fiscal nº ${invoiceNumber} referente aos serviços prestados.`,
            bodyHtml
        }),
        attachments
    };

    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de nota fiscal simulado para:", recipients);
            return { success: true, simulated: true };
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail de nota fiscal enviado com sucesso para ${recipients.join(", ")}. MessageId: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE NOTA FISCAL:", error);
        return { success: false, error };
    }
}

/**
 * 7) E-mail de Recuperação de Senha
 */
export async function sendResetPasswordEmail(to: string, name: string, token: string) {
    const baseUrl = getBaseUrl()
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    const transporter = createTransporter()

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá, <strong>${name}</strong>!
        </p>
        <p style="color: #475569;">
            Recebemos uma solicitação para redefinir a senha da sua conta no sistema da <strong>MMC Lab</strong>. Para criar uma nova senha, clique no botão abaixo:
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 15px 34px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                🔑 Redefinir Minha Senha
            </a>
        </div>

        <p style="font-size: 13px; color: #64748b; text-align: center;">
            Este link é válido por <strong>1 hora</strong>. Caso você não tenha solicitado esta alteração, ignore este e-mail com segurança.
        </p>
        
        <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-top: 24px; font-size: 12px; color: #64748b; word-break: break-all;">
            <span>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</span><br/>
            <a href="${resetUrl}" style="color: #0284c7; font-weight: 600;">${resetUrl}</a>
        </div>
    `

    const mailOptions = {
        from: getSender(),
        to,
        subject: "Recuperação de Senha - MMC Lab",
        html: renderEmailLayout({
            baseUrl,
            badgeText: "Segurança da Conta",
            badgeColor: "#1d4ed8",
            badgeBg: "#dbeafe",
            title: "Recuperação de Senha",
            subtitle: `Olá, ${name}! Redefina sua senha de acesso com segurança.`,
            bodyHtml
        }),
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de recuperação simulado para:", to);
            return { success: true, simulated: true };
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de recuperação enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE RECUPERAÇÃO:", error)
        return { success: false, error }
    }
}

/**
 * 8) E-mail de Compartilhamento de Processo de Ensaio (Acesso Rápido - Somente Visualização e Download)
 */
export async function sendShareProcessEmail(params: {
    to: string;
    sharedByName: string;
    processId: string;
    osCode?: string;
    processType: string;
    workName?: string | null;
    contractorName?: string | null;
    accessUrl: string;
    isNewUser?: boolean;
}) {
    const transporter = createTransporter()
    const { to, sharedByName, processId, osCode, processType, workName, contractorName, accessUrl } = params
    const codeDisplay = osCode || processId.split('-')[0].toUpperCase()
    const portalUrl = getPortalLoginUrl()

    const bodyHtml = `
        <p style="margin-top: 0; color: #334155;">
            Olá,
        </p>
        <p style="color: #475569;">
            <strong>${sharedByName}</strong> compartilhou com você o acompanhamento técnico do ensaio abaixo no sistema da <strong>MMC Lab</strong>:
        </p>

        <!-- Card de Detalhes do Ensaio -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; margin: 24px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                🔬 Dados do Processo Compartilhado
            </div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 40%; border-bottom: 1px solid #f1f5f9;">Código / OS:</td>
                    <td style="padding: 8px 0; color: #0284c7; font-weight: 800; border-bottom: 1px solid #f1f5f9;">OS #${codeDisplay}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b; ${(workName || contractorName) ? 'border-bottom: 1px solid #f1f5f9;' : ''}">Tipo de Ensaio:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700; ${(workName || contractorName) ? 'border-bottom: 1px solid #f1f5f9;' : ''}">${processType}</td>
                </tr>
                ${(workName || contractorName) ? `
                <tr>
                    <td style="padding: 8px 0; color: #64748b;">Obra / Local:</td>
                    <td style="padding: 8px 0; color: #334155; font-weight: 600;">${workName || contractorName}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <!-- Box Explicativo de Permissões -->
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 10px; padding: 18px 20px; margin: 24px 0;">
            <div style="font-size: 14px; font-weight: 800; color: #1e40af; margin-bottom: 8px;">
                🔒 Regras de Acesso e Permissões
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #1e3a8a; line-height: 1.65;">
                <li style="margin-bottom: 6px;">
                    <strong>Visualização e Download Liberados:</strong> Acompanhe o status, cronograma de execução e baixe propostas, relatórios técnicos e notas fiscais.
                </li>
                <li>
                    <strong>Modo Somente Consulta:</strong> Como este é um link de acompanhamento compartilhado, alterações cadastrais ou exclusões permanecem restritas ao titular.
                </li>
            </ul>
        </div>

        <!-- Botão de Acesso Rápido -->
        <div style="text-align: center; margin: 30px 0;">
            <a href="${accessUrl}" style="background-color: #0284c7; color: #ffffff; padding: 15px 34px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);">
                🚀 Acessar Dados do Ensaio
            </a>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
                Acesso direto pelo navegador (sem necessidade de senha inicial).
            </p>
        </div>

        <!-- Fallback Link -->
        <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 22px; font-size: 12px; color: #64748b; word-break: break-all;">
            <span>Caso o botão acima não funcione, copie e cole o link no seu navegador:</span><br/>
            <a href="${accessUrl}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">${accessUrl}</a>
        </div>

        <!-- Dica para criar conta -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; font-size: 13px; color: #64748b;">
            <p style="margin: 0 0 6px 0; color: #334155;">
                <strong>💡 Ainda não tem conta no Portal MMC Lab?</strong>
            </p>
            <p style="margin: 0; line-height: 1.55;">
                Para centralizar todos os seus ensaios em um único painel, você pode criar uma conta gratuita a qualquer momento com este mesmo e-mail: <a href="${portalUrl}" style="color: #0284c7; font-weight: 700; text-decoration: none;">Cadastrar-se no Portal do Cliente &rarr;</a>
            </p>
        </div>
    `

    const mailOptions = {
        from: getSender(),
        to,
        subject: `[MMC Lab] Ensaio Compartilhado com Você - OS #${codeDisplay}`,
        html: renderEmailLayout({
            badgeText: "Acesso Compartilhado",
            badgeColor: "#0369a1",
            badgeBg: "#e0f2fe",
            title: "Ensaio Técnico Compartilhado com Você",
            subtitle: "Acompanhe o andamento e acesse os laudos e documentos em tempo real.",
            bodyHtml
        }),
    }

    try {
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();
        if (!emailUser || !emailPass) {
            console.warn("[AVISO EMAIL] EMAIL_USER ou EMAIL_PASS não configurados. E-mail de compartilhamento simulado para:", to);
            return { success: true, simulated: true };
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`E-mail de compartilhamento de ensaio enviado com sucesso para ${to}. MessageId: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("ERRO AO ENVIAR E-MAIL DE COMPARTILHAMENTO:", error)
        return { success: false, error }
    }
}
