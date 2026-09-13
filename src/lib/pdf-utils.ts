/**
 * Utilitário para download e visualização segura de PDFs (suporta Data URLs base64, URLs HTTP/HTTPS e Blobs).
 * Evita o problema de "about:blank" no Google Chrome/Edge ao abrir data URLs diretamente no window.open.
 */

function createBlobFromBase64OrDataUrl(input: string, fallbackMime = "application/pdf"): string | null {
    try {
        let base64 = input.trim();
        let mime = fallbackMime;

        if (base64.startsWith("data:")) {
            const commaIdx = base64.indexOf(",");
            if (commaIdx !== -1) {
                const header = base64.substring(0, commaIdx);
                const match = header.match(/:(.*?);/);
                if (match && match[1]) {
                    mime = match[1];
                }
                base64 = base64.substring(commaIdx + 1);
            }
        }

        // Remove espaços, quebras de linha e caracteres espúrios do base64
        base64 = base64.replace(/\s/g, "");

        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: mime });
        return URL.createObjectURL(blob);
    } catch (e) {
        console.error("Erro ao converter base64 em Blob para PDF:", e);
        return null;
    }
}

/**
 * Executa o download de um arquivo PDF com o nome indicado no dispositivo do usuário
 */
export async function downloadPdf(url: string | undefined | null, filename: string) {
    if (!url) {
        console.warn("URL de PDF inexistente para download.");
        return;
    }

    const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    // 1. Data URL ou Base64 puro
    if (url.startsWith("data:") || (!url.startsWith("http") && !url.startsWith("/") && url.length > 100)) {
        const blobUrl = createBlobFromBase64OrDataUrl(url, "application/pdf");
        if (blobUrl) {
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = cleanFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
            return;
        }
    }

    // 2. URL HTTP / HTTPS / Relativa
    try {
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = cleanFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
            return;
        }
    } catch (err) {
        console.warn("Tentativa de download via fetch falhou, utilizando fallback:", err);
    }

    // Fallback: Link âncora direto
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanFilename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Abre o PDF em uma nova aba usando Blob seguro para não abrir tela em branco (about:blank) no navegador
 */
export function viewPdf(url: string | undefined | null) {
    if (!url) return;

    if (url.startsWith("data:") || (!url.startsWith("http") && !url.startsWith("/") && url.length > 100)) {
        const blobUrl = createBlobFromBase64OrDataUrl(url, "application/pdf");
        if (blobUrl) {
            const win = window.open(blobUrl, "_blank");
            if (!win) {
                // Se o popup foi bloqueado pelo navegador, executa download como fallback
                downloadPdf(url, "documento.pdf");
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
            return;
        }
    }

    window.open(url, "_blank");
}
