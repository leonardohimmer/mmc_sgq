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
    return `"MMC Lab" <${user}>`
}

function getPortalLoginUrl() {
    const baseUrl = process.env.NEXTAUTH_URL || "https://site-sgq-six.vercel.app"
    return `${baseUrl}/login-cliente`
}

/**
 * Cabeçalho visual oficial com a logo orbital animada da MMC LAB para e-mails de clientes
 */
export function renderEmailLogo(baseUrl?: string) {
    const host = baseUrl || process.env.NEXTAUTH_URL || "https://site-sgq-six.vercel.app"
    const logoUrl = `${host}/logo-animated.gif`
    return `
        <div style="text-align: center; margin-bottom: 22px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                <tr>
                    <td align="center" style="padding: 0;">
                        <img 
                            src="${logoUrl}" 
                            alt="MMC LAB" 
                            width="140" 
                            height="140" 
                            style="display: block; width: 140px; height: 140px; border: 0; outline: none; text-decoration: none; margin: 0 auto;" 
                        />
                    </td>
                </tr>
            </table>
            <div style="margin-top: 14px; font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #38bdf8; text-transform: uppercase;">MMC LAB</div>
            <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-top: 4px;">Controle Tecnológico &amp; Qualidade</div>
        </div>
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
 * Bloco corporativo obrigatório de acompanhamento no sistema com link de acesso à conta
 */
export function renderProcessTrackingBanner(loginUrl?: string) {
    const targetUrl = loginUrl || getPortalLoginUrl()
    return `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 24px; border-radius: 12px; margin: 28px 0; text-align: center; border: 1px solid #334155;">
            <div style="display: inline-block; background-color: rgba(56, 189, 248, 0.15); border-radius: 50px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="font-size: 13px; font-weight: bold; color: #38bdf8;">🌐 Portal do Cliente MMC Lab</span>
            </div>
            <h3 style="margin: 0 0 10px 0; font-size: 17px; color: #ffffff;">Acompanhe todo o seu processo em tempo real</h3>
            <p style="margin: 0 0 18px 0; font-size: 13px; color: #cbd5e1; line-height: 1.6; max-width: 480px; margin-left: auto; margin-right: auto;">
                Pelo nosso sistema você tem total transparência: acompanhe o status de cada ensaio, aprove propostas, baixe seus relatórios técnicos e consulte suas notas fiscais a qualquer momento.
            </p>
            <div style="margin-top: 10px;">
                <a href="${targetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);">
                    Acessar Minha Conta no Portal &rarr;
                </a>
            </div>
            <p style="margin: 14px 0 0 0; font-size: 11px; color: #94a3b8;">
                Link direto: <a href="${targetUrl}" style="color: #38bdf8; text-decoration: underline;">${targetUrl}</a>
            </p>
        </div>
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
    const baseUrl = process.env.NEXTAUTH_URL || "https://site-sgq-six.vercel.app"
    const verifyUrl = `${baseUrl}/verificar-email?token=${token}`
    const loginUrl = getPortalLoginUrl()

    const transporter = createTransporter()

    const mailOptions = {
        from: getSender(),
        to,
        subject: "Confirme seu e-mail e ative sua conta - MMC Lab",
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo(baseUrl)}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Bem-vindo(a), ${name}!</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Estamos muito felizes em ter você conosco.</p>
                </div>

                <div style="padding: 36px 30px; line-height: 1.6;">
                    <p style="font-size: 15px; margin-top: 0;">Sua conta no <strong>Portal do Cliente MMC Lab</strong> foi criada com sucesso!</p>
                    
                    <p style="font-size: 15px; color: #475569;">
                        Para garantir a segurança dos seus dados e ativar seu acesso completo ao sistema, confirme seu endereço de e-mail clicando no botão abaixo:
                    </p>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${verifyUrl}" style="background-color: #059669; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);">
                            &check; Confirmar Meu E-mail
                        </a>
                    </div>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 24px 0; font-size: 13px; color: #64748b;">
                        <p style="margin: 0 0 6px 0;"><strong>O que você pode fazer no portal?</strong></p>
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Solicitar novos ensaios com facilidade</li>
                            <li>Receber, avaliar e dar aceite em propostas comerciais</li>
                            <li>Acompanhar a execução dos seus ensaios em tempo real</li>
                            <li>Acessar e baixar relatórios técnicos e notas fiscais</li>
                        </ul>
                    </div>

                    ${renderProcessTrackingBanner(loginUrl)}

                    <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
                        Se o botão não funcionar, copie e cole o seguinte link no seu navegador:<br/>
                        <a href="${verifyUrl}" style="color: #2563eb; word-break: break-all;">${verifyUrl}</a>
                    </p>
                </div>

                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Controle Tecnológico e Engenharia</p>
                </div>
            </div>
        `,
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
    const { to, name, requestId, osCode, proposalCode, type, workName, location, quantidadeEnsaios, proposalPdfUrl } = params
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

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Proposta Comercial - ${type} [${proposalCode || osCode || "MMC Lab"}]`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo()}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Proposta Comercial Disponível</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Olá, ${name}! Analise os detalhes da proposta enviada para o seu ensaio.</p>
                </div>

                <div style="padding: 36px 30px; line-height: 1.6;">
                    <p style="font-size: 15px; margin-top: 0;">
                        Elaboramos a proposta técnica-comercial para o atendimento da sua solicitação de <strong>${type}</strong>.
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px; margin: 24px 0;">
                        <h2 style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                            📋 Dados da Proposta:
                        </h2>
                        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>Código da Proposta:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${proposalCode}</td>
                            </tr>
                            ${osCode ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Ordem de Serviço (OS):</strong></td>
                                <td style="padding: 6px 0; color: #2563eb; font-weight: bold;">${osCode}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Serviço Solicitado:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a;">${type}</td>
                            </tr>
                            ${workName || location ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Obra / Local:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a;">${workName || location}</td>
                            </tr>
                            ` : ''}
                            ${quantidadeEnsaios ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Qtd. de Ensaios:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a;">${quantidadeEnsaios}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>

                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${proposalDownloadUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                            📄 Visualizar / Baixar Proposta (PDF)
                        </a>
                    </div>

                    ${renderProcessTrackingBanner(loginUrl)}

                    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
                        Para dar o aceite comercial e agendar a execução do ensaio, basta acessar sua conta no portal ou responder a este e-mail.
                    </p>
                </div>

                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Controle Tecnológico e Engenharia</p>
                </div>
            </div>
        `,
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

export async function sendWelcomeEmail(to: string, name: string, rawPassword: string) {
    const loginUrl = `${process.env.NEXTAUTH_URL}/login-cliente`

    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Bem-vindo ao Portal do Cliente - MMC Lab",
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo()}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Olá, ${name}!</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Seu acesso ao Portal do Cliente está pronto.</p>
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

export async function sendFinalizedEmail(to: string, name: string, requestId: string, type: string) {
    const portalUrl = `${process.env.NEXTAUTH_URL}/login-cliente`
    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Processo Finalizado - ${type} - MMC Lab`,
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center; border-bottom: 3px solid #10b981;">
                    ${renderEmailLogo()}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Olá, ${name}!</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px; color: #34d399; font-weight: 600;">Temos ótimas notícias: seu processo foi finalizado!</p>
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

    const baseUrl = process.env.NEXTAUTH_URL || "https://site-sgq-six.vercel.app";
    const loginUrl = getPortalLoginUrl();
    const surveyUrl = `${baseUrl}/portal-cliente/pesquisa/${requestId}`;
    const pdfUrl = reportPdfUrl && !reportPdfUrl.startsWith('/api/') && !reportPdfUrl.startsWith('data:') ? reportPdfUrl : loginUrl;

    const transporter = createTransporter();

    const attachments: any[] = [];
    const attachment = getPdfAttachment(reportPdfUrl, `Relatorio_Tecnico_Ensaio_${itemNumber}_${osCode || "MMC"}.pdf`);
    if (attachment) {
        attachments.push(attachment);
    }

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Relatório de Ensaio (${itemNumber} de ${totalItems}) & Pesquisa de Satisfação - ${osCode || 'MMC Lab'}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo(baseUrl)}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Relatório Técnico Disponível</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Olá, ${name}! Seu laudo de ensaio já foi concluído e disponibilizado.</p>
                </div>

                <div style="padding: 36px 30px; line-height: 1.6;">
                    <p style="font-size: 15px; margin-top: 0;">
                        Informamos que o relatório referente ao ensaio de <strong>${type}</strong> (Ensaio <strong>${itemNumber} de ${totalItems}</strong> contratados) foi aprovado pelo nosso corpo técnico e está pronto para consulta.
                    </p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 22px 0;">
                        <h2 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                            📄 Detalhes da Entrega:
                        </h2>
                        <p style="margin: 6px 0; font-size: 14px;"><strong>OS:</strong> <span style="color: #2563eb; font-weight: bold;">${osCode || requestId.substring(0, 8)}</span></p>
                        <p style="margin: 6px 0; font-size: 14px;"><strong>Ensaio Entregue:</strong> ${itemNumber} de ${totalItems}</p>
                        <p style="margin: 6px 0; font-size: 14px;"><strong>Serviço:</strong> ${type}</p>
                    </div>

                    <div style="text-align: center; margin: 26px 0;">
                        <a href="${pdfUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                            📄 Baixar Relatório Técnico (PDF)
                        </a>
                    </div>

                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 24px 0;">
                        <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #065f46;">⭐ Pesquisa de Satisfação (${itemNumber} de ${totalItems} ensaios realizados)</h3>
                        <p style="font-size: 13px; color: #334155; margin-bottom: 14px; line-height: 1.5;">
                            Sua opinião é fundamental para a melhoria contínua dos nossos serviços de controle tecnológico. Por favor, dedique 1 minuto para avaliar este ensaio:
                        </p>
                        <div style="text-align: center;">
                            <a href="${surveyUrl}" style="background-color: #10b981; color: white; padding: 11px 22px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">
                                Responder Pesquisa de Satisfação
                            </a>
                        </div>
                    </div>

                    ${renderProcessTrackingBanner(loginUrl)}
                </div>

                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Controle Tecnológico e Engenharia</p>
                </div>
            </div>
        `,
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
 * 4) Envio da Nota Fiscal para o cliente
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
    const { to, name, requestId, osCode, invoiceNumber, valorNota, qtdFaturada, type, invoicePdfUrl, observacoes } = params;
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

    const mailOptions = {
        from: getSender(),
        to: recipients.join(", "),
        subject: `Nota Fiscal Emitida - ${type} [NF nº ${invoiceNumber}] - MMC Lab`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo()}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Nota Fiscal de Serviços Emitida</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Olá, ${name}! Disponibilizamos a nota fiscal referente aos serviços prestados.</p>
                </div>

                <div style="padding: 36px 30px; line-height: 1.6;">
                    <p style="font-size: 15px; margin-top: 0;">
                        Informamos que a <strong>Nota Fiscal de Serviços (NF nº ${invoiceNumber})</strong> referente ao atendimento de <strong>${type}</strong> foi emitida com sucesso.
                    </p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px; margin: 24px 0;">
                        <h2 style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                            🧾 Detalhes do Faturamento:
                        </h2>
                        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>Número da NF:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${invoiceNumber}</td>
                            </tr>
                            ${valorFormatado ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Valor Total da NF:</strong></td>
                                <td style="padding: 6px 0; color: #059669; font-weight: 800; font-size: 16px;">${valorFormatado}</td>
                            </tr>
                            ` : ''}
                            ${osCode ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Ordem de Serviço:</strong></td>
                                <td style="padding: 6px 0; color: #2563eb; font-weight: bold;">${osCode}</td>
                            </tr>
                            ` : ''}
                            ${qtdFaturada ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Ensaios Faturados:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a;">${qtdFaturada} ensaio(s)</td>
                            </tr>
                            ` : ''}
                            ${observacoes ? `
                            <tr>
                                <td style="padding: 6px 0; color: #64748b;"><strong>Observações:</strong></td>
                                <td style="padding: 6px 0; color: #0f172a;">${observacoes}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>

                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${invoiceDownloadUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
                            📄 Baixar Nota Fiscal (PDF)
                        </a>
                    </div>

                    ${renderProcessTrackingBanner(loginUrl)}

                    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
                        Caso necessite de segunda via ou informações adicionais sobre o pagamento, responda a este e-mail ou consulte diretamente no seu portal.
                    </p>
                </div>

                <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} MMC Lab - Controle Tecnológico e Engenharia</p>
                </div>
            </div>
        `,
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

export async function sendResetPasswordEmail(to: string, name: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    const transporter = createTransporter()

    const mailOptions = {
        from: `"MMC Lab" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Recuperação de Senha - MMC Lab",
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 36px 24px; text-align: center;">
                    ${renderEmailLogo()}
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Olá, ${name}!</h1>
                    <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Você solicitou a recuperação de sua senha.</p>
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

    const mailOptions = {
        from: getSender(),
        to,
        subject: `[MMC Lab] Ensaio Compartilhado com Você - OS #${codeDisplay}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                {/* Header */}
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 36px 30px; text-align: center;">
                    ${renderEmailLogo()}
                    <div style="display: inline-block; background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 50px; padding: 5px 14px; margin-bottom: 14px;">
                        <span style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">🌐 Portal do Cliente MMC Lab</span>
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Ensaio Técnico Compartilhado com Você</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; color: #94a3b8;">Acompanhe o andamento e acesse os laudos e documentos em tempo real.</p>
                </div>

                {/* Conteúdo Principal */}
                <div style="padding: 32px 28px; line-height: 1.6;">
                    <p style="font-size: 15px; margin: 0 0 16px 0; color: #334155;">
                        Olá,
                    </p>
                    <p style="font-size: 15px; margin: 0 0 24px 0; color: #334155;">
                        <strong>${sharedByName}</strong> concedeu permissão para você acompanhar o processo técnico do ensaio abaixo no sistema da <strong>MMC Lab</strong>:
                    </p>

                    {/* Card de Detalhes do Ensaio */}
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <div style="margin-bottom: 12px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Código / OS:</span>
                            <div style="font-size: 16px; font-weight: 800; color: #0284c7; margin-top: 2px;">OS #${codeDisplay}</div>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Tipo de Ensaio:</span>
                            <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">${processType}</div>
                        </div>
                        ${(workName || contractorName) ? `
                        <div>
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Obra / Local:</span>
                            <div style="font-size: 13px; font-weight: 600; color: #334155; margin-top: 2px;">${workName || contractorName}</div>
                        </div>
                        ` : ''}
                    </div>

                    {/* Box Explicativo de Permissões e Regras de Segurança */}
                    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 10px; padding: 18px; margin-bottom: 28px;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 14px; font-weight: 800; color: #1e40af;">🔒 Regras de Acesso e Permissões</span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
                            <li style="margin-bottom: 6px;">
                                <strong>Apenas Visualização e Download:</strong> Você pode acompanhar o status, cronograma de execução e realizar o download dos arquivos técnicos (como propostas, relatórios técnicos e notas fiscais).
                            </li>
                            <li>
                                <strong>Sem Permissão de Alteração:</strong> Como este é um acesso compartilhado de consulta, não é permitido editar dados, aprovar alterações, excluir ou modificar nada do processo original.
                            </li>
                        </ul>
                    </div>

                    {/* Botão de Acesso Rápido em Destaque */}
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${accessUrl}" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35); text-transform: uppercase; letter-spacing: 0.3px;">
                            🚀 Acessar Dados do Ensaio
                        </a>
                        <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b;">
                            Acesso rápido direto pelo navegador (sem necessidade de senha inicial).
                        </p>
                    </div>

                    {/* Fallback Link */}
                    <div style="background-color: #f1f5f9; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 12px; color: #64748b; word-break: break-all;">
                        <span>Caso o botão acima não funcione, copie e cole o link no seu navegador:</span><br/>
                        <a href="${accessUrl}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">${accessUrl}</a>
                    </div>

                    {/* Dica para criar conta */}
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b;">
                        <p style="margin: 0 0 8px 0;">
                            <strong>💡 Ainda não tem conta no Portal MMC Lab?</strong>
                        </p>
                        <p style="margin: 0; line-height: 1.5;">
                            Se você desejar centralizar e gerenciar seus ensaios em um painel completo, você pode criar uma conta gratuita a qualquer momento com este mesmo e-mail (<a href="${portalUrl}" style="color: #0284c7; font-weight: 600; text-decoration: none;">Cadastrar-se no Portal do Cliente</a>).
                        </p>
                    </div>
                </div>

                {/* Footer Corporativo */}
                <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; color: #64748b; padding: 22px; text-align: center; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">MMC Engenharia & Laboratório Tecnológico</p>
                    <p style="margin: 0;">Sistema de Gestão da Qualidade &bull; Todos os direitos reservados</p>
                </div>
            </div>
        `,
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

