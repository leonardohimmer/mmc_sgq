export const metadata = {
    title: "O Laboratório | MMC LAB",
    description: "Conheça a missão, visão e valores do nosso laboratório.",
};

export default function SobrePage() {
    return (
        <div className="bg-background-light text-slate-700 min-h-screen font-sans pb-24">
            {/* Header Spacer (since header is in page.tsx for now, assuming standard page structure) */}
            <div className="h-20 bg-white border-b border-slate-200"></div>

            <main className="max-w-7xl mx-auto px-6 pt-16">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                        O Laboratório
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                        Nossa base é a excelência técnica. Conheça os pilares que guiam nossos ensaios e certificações, estabelecendo a confiança de nossos clientes e parceiros.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {/* Missão */}
                    <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:border-primary/30 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">track_changes</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900">Missão</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Realizar ensaios com excelência técnica, assegurando resultados confiáveis e atendimento às normas aplicáveis.
                        </p>
                    </div>

                    {/* Visão */}
                    <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:border-secondary/50 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">visibility</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900">Visão</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Ser referência em ensaios laboratoriais acreditados, reconhecido pela qualidade e credibilidade.
                        </p>
                    </div>

                    {/* Valores */}
                    <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:border-emerald-500/30 transition-colors group shadow-sm text-center items-center flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[32px]">security</span>
                        </div>
                        <h2 className="text-2xl font-extrabold mb-4 text-slate-900">Valores</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Imparcialidade, competência, ética, confiabilidade e melhoria contínua.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
