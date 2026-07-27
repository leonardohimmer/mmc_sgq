"use client"

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import React, { useState } from "react";
import { toast } from "sonner";
import SuccessModal from "@/components/SuccessModal";


const SERVICOS_AGRUPADOS = {
    "Ensaios": [
        {
            label: "Ensaios Acústicos",
            subitens: [
                "Ensaio de Isolamento Acústico em Laboratório (Rw)",
                "Ensaio de Isolamento ao Ruído de Impacto",
                "Mapa de Ruído",
                "Inspeção com Câmera Acústica",
            ]
        },
        "Ensaio de Ancoragem",
        "Ensaio de Esclerometria",
        "Ensaio de Guarda-corpo e Parapeito",
        "Ensaio de Impacto de Corpo Mole e Corpo Duro",
        "Ensaio de Integridade de Estacas (PIT)",
        "Ensaio de Peças Suspensas",
        "Ensaio de Percussão",
        "Ensaio de Permeabilidade",
        "Ensaio de Resistência de Aderência à Tração (Arrancamento)",
        "Ensaio Lumínico",
        "Inspeção de Fachadas",
        "Inspeção Termográfica",
    ],
    "Outros": [
        "Análise de Vibração",
        "Consultoria Acústica",
        "Licença de Instalação Acústica",
        "Projetos Acústicos",
        "Simulação Lumínica",
        "Simulação Térmica",
        "Simulações de Desempenho",
        "Outros",
    ]
}

const ESTADOS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.substring(0, 11);
    if (limited.length <= 2) {
        return limited;
    }
    if (limited.length <= 6) {
        return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
    }
    if (limited.length <= 10) {
        return `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`;
    }
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
};

type FormStatus = "idle" | "loading" | "success" | "error"

export default function ContatoPage() {
    const [form, setForm] = useState({
        tipoEnsaio: [{ tipo: "", quantidade: "" }],
        nomeContratante: "",
        nomeConstrutora: "",
        nomeObra: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        telefone: "",
        email: "",
        emailsProposta: [""],
        emailsRelatorio: [""],
        datasDesejadas: [""],
        observacoes: ""
    })
    const [status, setStatus] = useState<FormStatus>("idle")
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        if (name === "telefone") {
            value = formatPhoneNumber(value);
        }
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        const toastId = toast.loading("Enviando sua solicitação...")
        try {
            const res = await fetch("/api/orcamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    enderecoCompleto: `${form.rua}, ${form.numero}, ${form.bairro}, ${form.cidade} - ${form.estado}, CEP: ${form.cep}`,
                    emailProposta: form.emailsProposta.filter(e => e.trim() !== "").join(", "),
                    emailsRelatorio: form.emailsRelatorio.filter(e => e.trim() !== "").join(", "),
                    datasDesejadas: form.datasDesejadas.filter(d => d.trim() !== "").join(", "),
                    tipoEnsaio: form.tipoEnsaio.filter(t => t.tipo.trim() !== "").map(t => t.tipo).join(" + "),
                    quantidadeEnsaios: form.tipoEnsaio.filter(t => t.tipo.trim() !== "").map(t => t.quantidade).join(" + "),
                }),
            })
            if (res.ok) {
                setStatus("success")
                toast.dismiss(toastId)
                setIsSuccessModalOpen(true)
                setForm({
                    tipoEnsaio: [{ tipo: "", quantidade: "" }],
                    nomeContratante: "",
                    nomeConstrutora: "",
                    nomeObra: "",
                    rua: "",
                    numero: "",
                    bairro: "",
                    cidade: "",
                    estado: "",
                    cep: "",
                    telefone: "",
                    email: "",
                    emailsProposta: [""],
                    emailsRelatorio: [""],
                    datasDesejadas: [""],
                    observacoes: ""
                })
            } else {
                setStatus("error")
                toast.error("Erro ao enviar. Por favor, tente novamente.", { id: toastId })
            }
        } catch {
            setStatus("error")
            toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.", { id: toastId })
        } finally {
            setStatus("idle")
        }
    }

    return (
        <div className="bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 min-h-screen transition-colors duration-300 flex flex-col pt-[80px] overflow-hidden">
            <SiteHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-10 pb-16 sm:pt-14 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-primary/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-slate-800/50 text-primary font-bold text-sm mb-6 border border-primary/20 dark:border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(77,182,172,0.15)] dark:shadow-[0_0_15px_rgba(77,182,172,0.3)]">
                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                            Solicitação de Ensaio
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-lg">
                            Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">MMC Lab</span>
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 subpage-hero-p">
                            Preencha o formulário abaixo para análise da equipe técnica.
                        </p>
                    </div>
                </section>

                <section className="py-24 subpage-content bg-background-light dark:bg-slate-950 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* Formulário de Orçamento */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-[0_0_40px_rgba(77,182,172,0.1)] transition-shadow">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">Nova Solicitação de Ensaio</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10">Preencha os detalhes da sua demanda para análise da equipe técnica.</p>



                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Serviços Desejados e Quantidades</label>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-12 gap-3 items-center">
                                                <div className="col-span-9 sm:col-span-10 relative">
                                                    <select
                                                        value={form.tipoEnsaio[0].tipo}
                                                        onChange={(e) => {
                                                            const newTipos = [{ ...form.tipoEnsaio[0], tipo: e.target.value }];
                                                            setForm({ ...form, tipoEnsaio: newTipos });
                                                        }}
                                                        required
                                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-slate-700 dark:text-slate-300 not-italic text-sm md:text-base"
                                                    >
                                                        <option value="" disabled>Selecione um ensaio...</option>
                                                        {Object.entries(SERVICOS_AGRUPADOS).map(([grupo, itens]) => (
                                                            <optgroup key={grupo} label={grupo} className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 not-italic">
                                                                {itens.map((subItem, subIdx) => {
                                                                    if (typeof subItem === "string") {
                                                                        return <option key={subItem + subIdx} value={subItem} className="font-normal bg-white dark:bg-slate-950 not-italic">{subItem}</option>
                                                                    } else {
                                                                        return (
                                                                            <React.Fragment key={subItem.label + subIdx}>
                                                                                <option disabled className="font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 not-italic">── {subItem.label} ──</option>
                                                                                {subItem.subitens.map(s => (
                                                                                    <option key={s} value={s} className="font-normal bg-white dark:bg-slate-950 not-italic">
                                                                                        &nbsp;&nbsp;&nbsp;&nbsp;• {s}
                                                                                    </option>
                                                                                ))}
                                                                            </React.Fragment>
                                                                        )
                                                                    }
                                                                })}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-span-3 sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Qtd."
                                                        value={form.tipoEnsaio[0].quantidade}
                                                        onChange={(e) => {
                                                            const newTipos = [{ ...form.tipoEnsaio[0], quantidade: e.target.value }];
                                                            setForm({ ...form, tipoEnsaio: newTipos });
                                                        }}
                                                        required
                                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 text-sm md:text-base"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nome do contratante */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome do contratante</label>
                                            <input
                                                type="text"
                                                name="nomeContratante"
                                                value={form.nomeContratante}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nome da empresa ou pessoa"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 text-slate-700 dark:text-slate-300"
                                            />
                                        </div>

                                        {/* Nome da construtora */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da construtora <span className="text-xs font-normal text-slate-500">(opcional)</span></label>
                                            <input
                                                type="text"
                                                name="nomeConstrutora"
                                                value={form.nomeConstrutora}
                                                onChange={handleChange}
                                                placeholder="Construtora XYZ"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 text-slate-700 dark:text-slate-300"
                                            />
                                        </div>

                                        {/* Nome da obra */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da obra</label>
                                            <input
                                                type="text"
                                                name="nomeObra"
                                                value={form.nomeObra}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nome do empreendimento"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Endereço Detalhado */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Melhor e-mail do cliente</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="seu@email.com (será seu login)"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 placeholder-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label>
                                            <input
                                                type="text"
                                                name="telefone"
                                                value={form.telefone}
                                                onChange={handleChange}
                                                required
                                                maxLength={15}
                                                placeholder="(00) 00000-0000"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 placeholder-slate-400"
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Rua / Av.</label>
                                            <input
                                                type="text"
                                                name="rua"
                                                value={form.rua}
                                                onChange={handleChange}
                                                required
                                                placeholder="Logradouro"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Número</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                value={form.numero}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nº"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bairro</label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                value={form.bairro}
                                                onChange={handleChange}
                                                required
                                                placeholder="Bairro"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cidade</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                value={form.cidade}
                                                onChange={handleChange}
                                                required
                                                placeholder="Cidade"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Estado</label>
                                            <select
                                                name="estado"
                                                value={form.estado}
                                                onChange={handleChange}
                                                required
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            >
                                                <option value="">UF</option>
                                                {ESTADOS.map(uf => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">CEP</label>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={form.cep}
                                                onChange={handleChange}
                                                required
                                                placeholder="00000-000"
                                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                            />
                                        </div>

                                    </div>

                                    {/* E-mail - Proposta */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail para envio da proposta</label>
                                        <div className="space-y-2">
                                            {form.emailsProposta.map((email, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        type="email"
                                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                                        placeholder="seu@email.com"
                                                        value={email}
                                                        onChange={(e) => {
                                                            const newEmails = [...form.emailsProposta];
                                                            newEmails[idx] = e.target.value;
                                                            setForm({ ...form, emailsProposta: newEmails });
                                                        }}
                                                        required
                                                    />
                                                    {idx === form.emailsProposta.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setForm({ ...form, emailsProposta: [...form.emailsProposta, ""] })}
                                                            title="Adicionar mais um e-mail"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">add</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newEmails = form.emailsProposta.filter((_, i) => i !== idx);
                                                                setForm({ ...form, emailsProposta: newEmails });
                                                            }}
                                                            title="Remover e-mail"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors border border-red-200 dark:border-red-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* E-mail - Relatório */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail para envio do relatório</label>
                                        <div className="space-y-2">
                                            {form.emailsRelatorio.map((email, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        type="email"
                                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300"
                                                        placeholder="seu@email.com"
                                                        value={email}
                                                        onChange={(e) => {
                                                            const newEmails = [...form.emailsRelatorio];
                                                            newEmails[idx] = e.target.value;
                                                            setForm({ ...form, emailsRelatorio: newEmails });
                                                        }}
                                                        required
                                                    />
                                                    {idx === form.emailsRelatorio.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setForm({ ...form, emailsRelatorio: [...form.emailsRelatorio, ""] })}
                                                            title="Adicionar mais um e-mail"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">add</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newEmails = form.emailsRelatorio.filter((_, i) => i !== idx);
                                                                setForm({ ...form, emailsRelatorio: newEmails });
                                                            }}
                                                            title="Remover e-mail"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors border border-red-200 dark:border-red-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Datas Desejadas */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Datas desejadas para o serviço / retirada</label>
                                        <div className="space-y-2">
                                            {form.datasDesejadas.map((dataItem, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <input
                                                        type="date"
                                                        min={getTodayString()}
                                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 cursor-pointer"
                                                        value={dataItem}
                                                        onClick={(e) => {
                                                            try {
                                                                (e.currentTarget).showPicker();
                                                            } catch (err) {}
                                                        }}
                                                        onFocus={(e) => {
                                                            try {
                                                                (e.currentTarget).showPicker();
                                                            } catch (err) {}
                                                        }}
                                                        onChange={(e) => {
                                                            const selectedDate = e.target.value;
                                                            const today = getTodayString();
                                                            if (selectedDate && selectedDate < today) {
                                                                toast.error("Por favor, selecione hoje ou uma data futura.");
                                                                return;
                                                            }
                                                            const newDatas = [...form.datasDesejadas];
                                                            newDatas[idx] = selectedDate;
                                                            setForm({ ...form, datasDesejadas: newDatas });
                                                        }}
                                                        required
                                                    />
                                                    {idx === form.datasDesejadas.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setForm({ ...form, datasDesejadas: [...form.datasDesejadas, ""] })}
                                                            title="Adicionar mais uma data"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">add</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newDatas = form.datasDesejadas.filter((_, i) => i !== idx);
                                                                setForm({ ...form, datasDesejadas: newDatas });
                                                            }}
                                                            title="Remover data"
                                                            className="w-12 h-12 shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors border border-red-200 dark:border-red-500/30"
                                                        >
                                                            <span className="material-symbols-outlined">remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    


                                    {/* Observações */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações adicionais</label>
                                        <textarea
                                            name="observacoes"
                                            value={form.observacoes}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Detalhes específicos sobre o material, norma de referência, urgência, etc."
                                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className={`flex-1 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${status === "loading" ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-emerald-500/25'}`}
                                        >
                                            {status === "loading" ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">send</span>
                                                    Enviar Solicitação
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => window.history.back()}
                                            className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Info Box */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-emerald-50/50 dark:bg-slate-900/50 border border-emerald-100/80 dark:border-emerald-500/20 p-8 md:p-10 rounded-3xl text-slate-800 dark:text-white shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-tl-full blur-[30px] transition-transform group-hover:scale-125"></div>
                                    <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl">chat</span>
                                        Agilidade no WhatsApp
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 relative z-10">
                                        Precisa de resposta rápida urgente para o seu caso construtivo? Nosso atendimento via WhatsApp flui com dinâmica comercial para agilizar sua proposta.
                                    </p>
                                    <a href="#" className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full md:w-auto">
                                        Abrir Conversa Agora
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl mb-4">location_on</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Endereço Sede</h4>
                                        <a 
                                            href="https://www.google.com/maps/place/MMC+LAB+Controle+Tecnol%C3%B3gico+Ltda./@-29.9539486,-51.1727562,948m/data=!3m2!1e3!4b1!4m6!3m5!1s0x951977a750f45963:0xd3ae1b88081f216e!8m2!3d-29.9539486!4d-51.1727562!16s%2Fg%2F12mkvnkhn?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            Rua Bagé, 351<br />Niterói - Canoas/RS
                                        </a>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl mb-4">call</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Telefone PABX</h4>
                                        <a href="tel:05131032929" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">(51) 3103-2929</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />


            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<>Solicitação enviada<br />com sucesso!</>}
                message="Entraremos em contato em breve."
            />

        </div>
    );
}
