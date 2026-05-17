"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";
import SuccessModal from "@/components/SuccessModal";



const StarRating = ({ 
    value, 
    onChange, 
    label, 
    hint,
    justification,
    onJustificationChange,
    isCompleted
}: { 
    value: number, 
    onChange: (val: number) => void, 
    label: string, 
    hint: string,
    justification: string,
    onJustificationChange: (val: string) => void,
    isCompleted?: boolean
}) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
                <label className="block text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {label}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {hint}
                </p>
            </div>
            <div className="flex justify-center items-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={isCompleted}
                        onClick={() => onChange(star)}
                        className={`p-1.5 transition-all ${!isCompleted && "hover:scale-110"} ${value >= star ? "text-amber-400" : "text-slate-200 dark:text-slate-700 hover:text-amber-200 dark:hover:text-amber-900"}`}
                    >
                        <span className="material-symbols-outlined text-[32px] sm:text-[40px]" style={{ fontVariationSettings: value >= star ? '"FILL" 1' : '"FILL" 0' }}>star</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="flex justify-end text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-2 pr-1 space-x-4">
            {value === 1 && <span className="font-medium text-red-500">Péssimo</span>}
            {value === 2 && <span className="font-medium text-orange-500">Ruim</span>}
            {value === 3 && <span className="font-medium text-yellow-500">Regular</span>}
            {value === 4 && <span className="font-medium text-emerald-500">Bom</span>}
            {value === 5 && <span className="font-medium text-emerald-600">Ótimo</span>}
        </div>

        {/* Caixa de justificativa condicional */}
        {value > 0 && value <= 3 && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                    Por favor, nos conte o que podemos melhorar neste item:
                </label>
                <textarea
                    disabled={isCompleted}
                    value={justification}
                    onChange={(e) => onJustificationChange(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 placeholder:text-slate-400 resize-none transition-all"
                    placeholder="Sua justificativa é muito importante para nós..."
                    rows={2}
                    required
                />
            </div>
        )}
    </div>
);

export default function PesquisaSatisfacaoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [survey, setSurvey] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ratingSpeed, setRatingSpeed] = useState<number>(0);
    const [ratingComm, setRatingComm] = useState<number>(0);
    const [ratingTime, setRatingTime] = useState<number>(0);
    const [ratingQuality, setRatingQuality] = useState<number>(0);
    const [ratingDoc, setRatingDoc] = useState<number>(0);
    
    // Novas justificativas
    const [justificationSpeed, setJustificationSpeed] = useState("");
    const [justificationComm, setJustificationComm] = useState("");
    const [justificationTime, setJustificationTime] = useState("");
    const [justificationQuality, setJustificationQuality] = useState("");
    const [justificationDoc, setJustificationDoc] = useState("");

    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useEffect(() => {
        fetch(`/api/solicitacoes/pesquisa/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.error(data.error);
                    router.push("/portal-cliente");
                    return;
                }
                setSurvey(data);
                if (data.status === "COMPLETED") {
                    setRatingSpeed(data.ratingSpeed);
                    setRatingComm(data.ratingComm);
                    setRatingTime(data.ratingTime);
                    setRatingQuality(data.ratingQuality);
                    setRatingDoc(data.ratingDoc);
                    
                    setJustificationSpeed(data.justificationSpeed || "");
                    setJustificationComm(data.justificationComm || "");
                    setJustificationTime(data.justificationTime || "");
                    setJustificationQuality(data.justificationQuality || "");
                    setJustificationDoc(data.justificationDoc || "");

                    setFeedback(data.feedback);
                    setSuccess(true);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Erro ao carregar pesquisa.");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ratingSpeed || !ratingComm || !ratingTime || !ratingQuality || !ratingDoc) {
            toast.error("Por favor, avalie todos os itens antes de enviar.");
            return;
        }

        // Validar se justificativas obrigatórias foram preenchidas
        if ((ratingSpeed <= 3 && !justificationSpeed.trim()) ||
            (ratingComm <= 3 && !justificationComm.trim()) ||
            (ratingTime <= 3 && !justificationTime.trim()) ||
            (ratingQuality <= 3 && !justificationQuality.trim()) ||
            (ratingDoc <= 3 && !justificationDoc.trim())) {
            toast.error("Por favor, preencha a justificativa para as notas 3 ou menores.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/solicitacoes/pesquisa/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ratingSpeed, 
                    ratingComm, 
                    ratingTime, 
                    ratingQuality, 
                    ratingDoc, 
                    justificationSpeed,
                    justificationComm,
                    justificationTime,
                    justificationQuality,
                    justificationDoc,
                    feedback 
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Pesquisa enviada com sucesso!");
                setSuccess(true);
                setShowSuccessModal(true);
            } else {
                toast.error(data.error || "Erro ao enviar pesquisa.");
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao enviar pesquisa.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="MMC LAB"
                        width={180}
                        height={60}
                        className="mx-auto object-contain dark:brightness-200 dark:grayscale mb-6"
                    />
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Pesquisa de Satisfação</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-[40px]">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Muito obrigado!</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Agradecemos seu tempo e feedback. Sua opinião é fundamental para aprimorarmos continuamente a qualidade dos nossos processos e relatórios técnicos.
                            </p>
                            <Link href="/portal-cliente" className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Voltar para o Portal
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 mb-8">
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                                    <strong>Prezado cliente,</strong><br/>
                                    Estamos enviando esta breve pesquisa para que possamos conhecer a vossa satisfação com os ensaios realizados em seu Empreendimento. É muito importante a sua resposta para que tenhamos uma melhoria constante nos nossos processos e relatórios técnicos apresentados.
                                </p>
                                {survey?.request && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider font-semibold mb-1">Tipo de ensaio</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{survey.request.type}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider font-semibold mb-1">Empreendimento</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{survey.request.workName || "Não informado"}</span>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider font-semibold mb-1">Relatório(s) Técnico(s)</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{survey.request.reportNumber || "N/A"}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                                    Avalie os itens abaixo
                                </h3>
                                
                                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-[18px]">info</span>
                                    <p>Legenda: 1=Péssimo / 2=Ruim / 3=Regular / 4=Bom / 5=Ótimo</p>
                                </div>

                                <StarRating 
                                    label="1. Rapidez no atendimento" 
                                    hint="Tempo em que a MMC Lab responde a uma solicitação do cliente para o envio do orçamento." 
                                    value={ratingSpeed} 
                                    onChange={setRatingSpeed} 
                                    justification={justificationSpeed}
                                    onJustificationChange={setJustificationSpeed}
                                    isCompleted={success}
                                />
                                <StarRating 
                                    label="2. Comunicação técnica" 
                                    hint="Capacidade técnica de comunicação e esclarecimento de dúvidas que possam ter surgido." 
                                    value={ratingComm} 
                                    onChange={setRatingComm} 
                                    justification={justificationComm}
                                    onJustificationChange={setJustificationComm}
                                    isCompleted={success}
                                />
                                <StarRating 
                                    label="3. Tempo de execução do serviço" 
                                    hint="Tempo para a execução do serviço solicitado." 
                                    value={ratingTime} 
                                    onChange={setRatingTime} 
                                    justification={justificationTime}
                                    onJustificationChange={setJustificationTime}
                                    isCompleted={success}
                                />
                                <StarRating 
                                    label="4. Qualidade do serviço prestado" 
                                    hint="Se o serviço prestado atendeu as necessidades esperadas pelo cliente." 
                                    value={ratingQuality} 
                                    onChange={setRatingQuality} 
                                    justification={justificationQuality}
                                    onJustificationChange={setJustificationQuality}
                                    isCompleted={success}
                                />
                                <StarRating 
                                    label="5. Documentação apresentada" 
                                    hint="Conteúdo da documentação apresentada, tais como: orçamento, checklist e relatórios." 
                                    value={ratingDoc} 
                                    onChange={setRatingDoc} 
                                    justification={justificationDoc}
                                    onJustificationChange={setJustificationDoc}
                                    isCompleted={success}
                                />
                            </div>

                            <div className="pt-6 space-y-3 border-t border-slate-100 dark:border-slate-800 mt-8">
                                <label className="block text-base font-bold text-slate-800 dark:text-slate-200">
                                    Sugestões de melhoria (Opcional)
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none transition-shadow"
                                    placeholder="Deixe aqui seus comentários, sugestões ou pontos de melhoria..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    disabled={success}
                                ></textarea>
                            </div>

                            <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                                <Link href="/portal-cliente" className="w-full sm:w-auto text-center px-6 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold transition-colors">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !ratingSpeed || !ratingComm || !ratingTime || !ratingQuality || !ratingDoc}
                                    className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        "Enviando..."
                                    ) : (
                                        <>
                                            Enviar Avaliação
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Pesquisa enviada com sucesso!"
                message="Obrigado pelo seu feedback. Sua opinião é fundamental para aprimorarmos continuamente nossos serviços."
            />
        </div>

    );
}
