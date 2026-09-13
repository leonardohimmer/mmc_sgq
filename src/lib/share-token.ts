import crypto from "crypto";

interface ShareTokenPayload {
    requestId: string;
    email: string;
    exp: number; // Unix timestamp em milissegundos
    type: "shared_process_access";
}

function getSecretKey(): string {
    return process.env.NEXTAUTH_SECRET || "mmc-sgq-shared-process-secret-salt-key-2026";
}

/**
 * Gera um token assinado seguro para acesso direto a um processo compartilhado.
 * Validade padrão: 30 dias.
 */
export function generateShareToken(requestId: string, email: string, expiresInDays = 30): string {
    const cleanEmail = email.trim().toLowerCase();
    const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

    const payload: ShareTokenPayload = {
        requestId,
        email: cleanEmail,
        exp,
        type: "shared_process_access"
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", getSecretKey())
        .update(payloadBase64)
        .digest("base64url");

    return `${payloadBase64}.${signature}`;
}

/**
 * Verifica a assinatura e expiração de um token de compartilhamento.
 * Retorna o payload se for válido ou null se for inválido/expirado/adulterado.
 */
export function verifyShareToken(token: string): { requestId: string; email: string } | null {
    try {
        if (!token || typeof token !== "string" || !token.includes(".")) {
            return null;
        }

        const [payloadBase64, signature] = token.split(".");
        if (!payloadBase64 || !signature) {
            return null;
        }

        const expectedSignature = crypto
            .createHmac("sha256", getSecretKey())
            .update(payloadBase64)
            .digest("base64url");

        const sigBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
            return null;
        }

        const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
        const payload: ShareTokenPayload = JSON.parse(payloadJson);

        if (payload.type !== "shared_process_access") {
            return null;
        }

        if (Date.now() > payload.exp) {
            return null; // Token expirado
        }

        return {
            requestId: payload.requestId,
            email: payload.email
        };
    } catch (e) {
        console.error("Erro ao validar token de compartilhamento:", e);
        return null;
    }
}
