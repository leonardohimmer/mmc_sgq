"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SessionWatcher() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [initialUser, setInitialUser] = useState<string | null>(null);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (session?.user?.id) {
            // Se ainda não temos um usuário inicial registrado, registramos
            if (!initialUser) {
                setInitialUser(session.user.id);
            }
            // Se já temos um usuário inicial, mas o ID recebido agora da sessão é diferente,
            // significa que o cookie foi sobrescrito em outra aba!
            else if (initialUser !== session.user.id) {
                setHasChanged(true);
            }
        } else if (initialUser && !session?.user) {
            // O usuário foi deslogado em outra aba
            setHasChanged(true);
        }
    }, [session, status, initialUser]);

    if (!hasChanged) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-red-500/20 animate-fade-in-up">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <span className="material-symbols-outlined text-[40px]">security_update_warning</span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Sessão Alterada
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                    Identificamos que você conectou uma conta diferente nesta mesma janela do navegador (em outra aba). Por motivos de segurança, sua interface foi bloqueada para evitar conflito de dados.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Atualizar Aba
                    </button>
                    <p className="text-xs text-slate-400 font-medium">
                        Ao atualizar, você carregará a sessão da nova aba.
                    </p>
                </div>
            </div>
        </div>
    );
}
