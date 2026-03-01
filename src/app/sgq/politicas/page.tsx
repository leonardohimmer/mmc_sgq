export const metadata = {
    title: "Políticas do SGQ | MMC LAB",
    description: "Políticas institucionais de qualidade, imparcialidade e confidencialidade.",
};

export default function PoliticasPage() {
    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Políticas Institucionais</h1>
                <p className="text-slate-500 font-medium text-sm">
                    Diretrizes fundamentais que regem o Sistema de Gestão da Qualidade baseado na ABNT NBR ISO/IEC 17025:2017.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                {/* Política da Qualidade */}
                <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex flex-col hover:border-primary/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">verified_user</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Política da Qualidade</h2>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        O laboratório compromete-se a atender aos requisitos da ABNT NBR ISO/IEC 17025:2017, assegurando a competência técnica, a imparcialidade, a confidencialidade e a melhoria contínua do sistema de gestão.
                    </p>
                </div>

                {/* Política de Imparcialidade */}
                <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex flex-col hover:border-secondary/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">balance</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Política de Imparcialidade</h2>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        O laboratório identifica, analisa e controla riscos à imparcialidade, assegurando que nenhuma atividade comercial, financeira ou pessoal influencie os resultados dos ensaios.
                    </p>
                </div>

                {/* Política de Confidencialidade */}
                <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex flex-col hover:border-emerald-500/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">lock</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4">Política de Confidencialidade</h2>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Todas as informações dos clientes são tratadas como confidenciais, protegidas contra acesso não autorizado, conforme procedimentos internos.
                    </p>
                </div>

            </div>
        </div>
    )
}
