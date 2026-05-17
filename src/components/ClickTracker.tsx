"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ClickTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Não rastrear dentro do painel administrativo
        if (pathname?.startsWith("/sgq")) return

        const handleClick = async (e: MouseEvent) => {
            const target = e.target as HTMLElement
            
            // Tentar encontrar o elemento clicável mais próximo (botão ou link)
            const clickable = target.closest("button, a, [role='button']") as HTMLElement
            
            const data = {
                path: pathname,
                selector: clickable ? getSelector(clickable) : getSelector(target),
                elementTag: clickable ? clickable.tagName : target.tagName,
                elementText: (clickable?.innerText || target.innerText || "").slice(0, 100).trim(),
                x: e.pageX / document.documentElement.scrollWidth, // Posição relativa
                y: e.pageY / document.documentElement.scrollHeight, // Posição relativa
                viewWidth: window.innerWidth
            }

            // Ignorar cliques sem texto ou em elementos irrelevantes (opcional)
            if (!data.elementText && !clickable) return

            try {
                fetch("/api/monitoramento", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    keepalive: true // Garante que a requisição termine se a página mudar
                })
            } catch (err) {
                // Silencioso para não afetar UX
            }
        }

        function getSelector(el: HTMLElement): string {
            if (el.id) return `#${el.id}`
            if (el.className) {
                const firstClass = el.className.toString().split(" ")[0]
                if (firstClass && typeof firstClass === 'string') return `.${firstClass}`
            }
            return el.tagName.toLowerCase()
        }

        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [pathname])

    return null
}
