"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import MMCLoadingScreen from "./MMCLoadingScreen";

export default function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Carregando informações MMC LAB...");

  // Resetar o estado de carregamento assim que a rota mudar
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Interceptador global de navegação e cliques em links internos
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href, window.location.href);
          const isSameOrigin = url.origin === window.location.origin;
          const isDifferentPath = url.pathname !== window.location.pathname || url.search !== window.location.search;
          const isSpecialTarget = anchor.getAttribute("target") === "_blank" || anchor.href.startsWith("mailto:") || anchor.href.startsWith("tel:") || anchor.href.startsWith("data:");

          if (isSameOrigin && isDifferentPath && !isSpecialTarget) {
            // Personaliza mensagem dependendo do destino
            if (url.pathname.includes("/sgq")) {
              setLoadingMessage("Carregando módulo de Gestão SGQ...");
            } else if (url.pathname.includes("/portal-cliente")) {
              setLoadingMessage("Carregando Portal do Cliente...");
            } else {
              setLoadingMessage("Carregando página...");
            }

            // Exibe a tela de carregamento com o logo da MMC LAB
            setIsNavigating(true);
          }
        } catch (err) {
          // Ignorar URLs inválidas
        }
      }
    };

    const handlePopState = () => {
      setIsNavigating(true);
    };

    window.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <MMCLoadingScreen
      fullScreen={true}
      message={loadingMessage}
      submessage="Sincronizando dados e preparando o ambiente MMC LAB"
    />
  );
}
