"use client"

import React, { useState, useEffect, useMemo, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import MMCLoadingScreen from "@/components/MMCLoadingScreen"
import SuccessModal from "@/components/SuccessModal"
import ConfirmModal from "@/components/ConfirmModal"

// ============================================================================
// DEFINIÇÃO OFICIAL DOS ATRIBUTOS DA PLANILHA F35 - REVISÃO 03 (MMC LAB)
// ============================================================================
export type ScoreValue = 10 | 7.5 | 5 | 2.5 | null // null = Não Aplicável (N/A)

export interface AttributeDef {
    id: string
    categoryId: string
    label: string
}

export interface CategoryDef {
    id: string
    title: string
    shortTitle: string
    icon: string
    description: string
    color: string
    attributes: AttributeDef[]
}

export const F35_CATEGORIES: CategoryDef[] = [
    {
        id: "CALIBRACAO",
        title: "Calibração",
        shortTitle: "CALIBRAÇÃO",
        icon: "straighten",
        description: "Laboratórios de calibração RBC/Cgcre e serviços metrológicos",
        color: "blue",
        attributes: [
            { id: "cal_1", categoryId: "CALIBRACAO", label: "Acreditação vigente RBC" },
            { id: "cal_2", categoryId: "CALIBRACAO", label: "Prazo de execução" },
            { id: "cal_3", categoryId: "CALIBRACAO", label: "Qualidade e detalhamento dos certificados de calibração emitidos" },
            { id: "cal_4", categoryId: "CALIBRACAO", label: "Qualidade do serviço prestado" },
            { id: "cal_5", categoryId: "CALIBRACAO", label: "Facilidade de comunicação para esclarecimento de dúvidas e resolução de problemas" },
            { id: "cal_6", categoryId: "CALIBRACAO", label: "Rapidez no atendimento" },
            { id: "cal_7", categoryId: "CALIBRACAO", label: "Preço" },
        ]
    },
    {
        id: "EQUIPAMENTOS",
        title: "Equipamentos",
        shortTitle: "EQUIPAMENTOS",
        icon: "precision_manufacturing",
        description: "Avaliação de fornecedores que vendem equipamentos, instrumentos de medição e acessórios para o laboratório",
        color: "indigo",
        attributes: [
            { id: "eq_1", categoryId: "EQUIPAMENTOS", label: "Qualidade técnica, precisão e desempenho do equipamento fornecido" },
            { id: "eq_2", categoryId: "EQUIPAMENTOS", label: "Conformidade com as especificações técnicas solicitadas e normas aplicáveis" },
            { id: "eq_3", categoryId: "EQUIPAMENTOS", label: "Cumprimento do prazo de entrega acordado e integridade na entrega" },
            { id: "eq_4", categoryId: "EQUIPAMENTOS", label: "Documentação técnica fornecida (manuais em português, certificados e termo de garantia)" },
            { id: "eq_5", categoryId: "EQUIPAMENTOS", label: "Suporte técnico na instalação, configuração e treinamento operacional para a equipe" },
            { id: "eq_6", categoryId: "EQUIPAMENTOS", label: "Garantia, assistência técnica pós-venda e disponibilidade de peças de reposição" },
            { id: "eq_7", categoryId: "EQUIPAMENTOS", label: "Condições comerciais, relação custo-benefício e facilidade de negociação" },
        ]
    },
    {
        id: "SERVICOS_LAB",
        title: "Serviços no Laboratório",
        shortTitle: "SERVIÇOS NO LABORATÓRIO",
        icon: "engineering",
        description: "Avaliação de fornecedores que prestam serviços técnicos, manutenção ou instalações no laboratório",
        color: "cyan",
        attributes: [
            { id: "srv_1", categoryId: "SERVICOS_LAB", label: "Qualidade técnica e eficácia do serviço executado no laboratório" },
            { id: "srv_2", categoryId: "SERVICOS_LAB", label: "Pontualidade e cumprimento dos prazos agendados para execução do serviço" },
            { id: "srv_3", categoryId: "SERVICOS_LAB", label: "Qualificação, competência técnica e postura profissional da equipe no laboratório" },
            { id: "srv_4", categoryId: "SERVICOS_LAB", label: "Cumprimento das normas de segurança, limpeza, organização e regras do laboratório" },
            { id: "srv_5", categoryId: "SERVICOS_LAB", label: "Clareza e detalhamento da Ordem de Serviço (OS) ou relatório técnico emitido" },
            { id: "srv_6", categoryId: "SERVICOS_LAB", label: "Agilidade no atendimento a chamados, comunicação e garantia pós-serviço" },
            { id: "srv_7", categoryId: "SERVICOS_LAB", label: "Custo-benefício e conformidade com o orçamento aprovado" },
        ]
    },
    {
        id: "AUDITORIA",
        title: "Auditoria e Consultoria",
        shortTitle: "AUDITORIA",
        icon: "fact_check",
        description: "Auditores internos/externos e avaliadores de sistemas de gestão (ISO/IEC 17025, ISO 9001)",
        color: "violet",
        attributes: [
            { id: "aud_1", categoryId: "AUDITORIA", label: "Conhecimento e experiência profissional" },
            { id: "aud_2", categoryId: "AUDITORIA", label: "Objetividade e Imparcialidade para a condução da avaliação" },
            { id: "aud_3", categoryId: "AUDITORIA", label: "Habilidade em identificar não conformidades e áreas de melhoria." },
            { id: "aud_4", categoryId: "AUDITORIA", label: "Qualidade e clareza dos relatórios de auditoria." },
            { id: "aud_5", categoryId: "AUDITORIA", label: "Capacidade de comunicação" },
            { id: "aud_6", categoryId: "AUDITORIA", label: "Custo-benefício" },
        ]
    },
    {
        id: "PROVEDOR_EP",
        title: "Provedor de EP (Ensaio de Proficiência)",
        shortTitle: "PROVEDOR DE EP",
        icon: "science",
        description: "Provedores de Ensaios de Proficiência e Comparações Interlaboratoriais",
        color: "teal",
        attributes: [
            { id: "ep_1", categoryId: "PROVEDOR_EP", label: "Acreditação" },
            { id: "ep_2", categoryId: "PROVEDOR_EP", label: "Ser cadastrado no EPTIS" },
            { id: "ep_3", categoryId: "PROVEDOR_EP", label: "Transparência nos processos e Confidencialidade" },
            { id: "ep_4", categoryId: "PROVEDOR_EP", label: "Qualidade técnica" },
            { id: "ep_5", categoryId: "PROVEDOR_EP", label: "Disponibilidade, qualidade do suporte técnico e comunicação" },
        ]
    },
    {
        id: "OUTROS",
        title: "Outros Serviços / Critérios Específicos",
        shortTitle: "OUTROS",
        icon: "more_horiz",
        description: "Critérios complementares aplicáveis ao fornecedor avaliado",
        color: "amber",
        attributes: [
            { id: "out_1", categoryId: "OUTROS", label: "Outros (descrever)" },
        ]
    }
]

export const ALL_ATTRIBUTES = F35_CATEGORIES.flatMap(c => c.attributes)

export interface Supplier {
    id: string
    name: string
    category?: string
    qualified: boolean
    score: number | null
    active: boolean
}

export function getSupplierF35CategoryIds(supplier?: Supplier | null): string[] {
    if (!supplier || !supplier.category) return ["CALIBRACAO"]
    const lower = supplier.category.toLowerCase()
    const matched: string[] = []
    if (lower.includes("calibra")) matched.push("CALIBRACAO")
    if (lower.includes("profici") || lower.includes("ensaio") || lower.includes("ep")) matched.push("PROVEDOR_EP")
    if (lower.includes("auditor") || lower.includes("consult")) matched.push("AUDITORIA")
    if (lower.includes("equipamento") || lower.includes("insumo")) matched.push("EQUIPAMENTOS")
    if (lower.includes("servi") || lower.includes("laborat")) matched.push("SERVICOS_LAB")
    if (lower.includes("outro")) matched.push("OUTROS")
    return matched.length > 0 ? matched : ["CALIBRACAO"]
}

export interface EvaluationItemState {
    score: ScoreValue
    justification: string
}

export interface SupplierEvaluationRecord {
    id: string
    supplierId: string
    supplierName: string
    evaluatorName: string
    evaluationDate: string
    nextEvaluationDate: string
    referenceDoc: string
    otherDescription: string
    activeCategories: string[]
    items: Record<string, EvaluationItemState>
    po: number
    pp: number
    percentage: number
    finalClass: "A" | "B" | "C" | "D"
    classLabel: string
    classObservations: Record<"A" | "B" | "C" | "D", string>
    generalNotes: string
    actionPlanRequired: boolean
    actionPlanDescription: string
    homologationStatus: "HOMOLOGADO" | "RESTRICAO" | "REPROVADO"
    createdAt: string
    updatedAt?: string
}

const SCORE_OPTIONS: {
    value: ScoreValue
    label: string
    numLabel: string
    concept: string
    desc: string
    bgActive: string
    borderActive: string
    textActive: string
    badgeBg: string
    excelHex: string
}[] = [
    {
        value: 10,
        label: "10",
        numLabel: "10,0",
        concept: "Ótimo",
        desc: "Atende Plenamente",
        bgActive: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20",
        borderActive: "border-emerald-600",
        textActive: "text-emerald-600 dark:text-emerald-400",
        badgeBg: "bg-emerald-500 text-white",
        excelHex: "#00b050"
    },
    {
        value: 7.5,
        label: "7,5",
        numLabel: "7,5",
        concept: "Bom",
        desc: "Atende",
        bgActive: "bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/20",
        borderActive: "border-yellow-400",
        textActive: "text-yellow-600 dark:text-yellow-400",
        badgeBg: "bg-yellow-400 text-slate-950",
        excelHex: "#ffff00"
    },
    {
        value: 5,
        label: "5",
        numLabel: "5,0",
        concept: "Regular",
        desc: "Atende parcialmente",
        bgActive: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
        borderActive: "border-amber-500",
        textActive: "text-amber-600 dark:text-amber-400",
        badgeBg: "bg-amber-500 text-white",
        excelHex: "#ffc000"
    },
    {
        value: 2.5,
        label: "2,5",
        numLabel: "2,5",
        concept: "Ruim",
        desc: "Não atende",
        bgActive: "bg-red-600 text-white shadow-md shadow-red-600/20",
        borderActive: "border-red-600",
        textActive: "text-red-600 dark:text-red-400",
        badgeBg: "bg-red-600 text-white",
        excelHex: "#ff0000"
    },
    {
        value: null,
        label: "N/A",
        numLabel: "N/A",
        concept: "Não Aplicável",
        desc: "Fora do escopo",
        bgActive: "bg-slate-600 text-white shadow-sm",
        borderActive: "border-slate-500",
        textActive: "text-slate-500",
        badgeBg: "bg-slate-200 text-slate-700",
        excelHex: "#e2e8f0"
    }
]

export function getClassificationInfo(percentage: number) {
    if (percentage >= 85) {
        return {
            finalClass: "A" as const,
            label: "ÓTIMO",
            range: "P ≥ 85 pontos",
            homologationStatus: "HOMOLOGADO" as const,
            homologationText: "Fornecedor Qualificado / Homologado",
            colorClass: "text-emerald-600 dark:text-emerald-400",
            bgClass: "bg-emerald-500",
            softBgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60",
            strokeColor: "#10b981",
            description: "Atende plenamente aos requisitos de qualidade do laboratório (MMC LAB). Apto para fornecimento contínuo."
        }
    }
    if (percentage >= 75) {
        return {
            finalClass: "B" as const,
            label: "BOM",
            range: "85 > P ≥ 75 pontos",
            homologationStatus: "HOMOLOGADO" as const,
            homologationText: "Fornecedor Qualificado / Homologado",
            colorClass: "text-yellow-600 dark:text-yellow-400",
            bgClass: "bg-yellow-400 text-slate-950",
            softBgClass: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/60",
            strokeColor: "#eab308",
            description: "Atende satisfatoriamente aos requisitos técnicos. Qualificado para fornecimento com monitoramento periódico."
        }
    }
    if (percentage >= 60) {
        return {
            finalClass: "C" as const,
            label: "REGULAR",
            range: "75 > P ≥ 60 pontos",
            homologationStatus: "RESTRICAO" as const,
            homologationText: "Homologado com Restrição (Requer Ação)",
            colorClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-500 text-white",
            softBgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60",
            strokeColor: "#f59e0b",
            description: "Atende parcialmente. Requer notificação ao fornecedor, justificativa técnica ou plano de ação corretiva."
        }
    }
    return {
        finalClass: "D" as const,
        label: "RUIM",
        range: "P < 60 pontos",
        homologationStatus: "REPROVADO" as const,
        homologationText: "Não Qualificado / Bloqueado",
        colorClass: "text-red-600 dark:text-red-400",
        bgClass: "bg-red-600 text-white",
        softBgClass: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/60",
        strokeColor: "#ef4444",
        description: "Desempenho insatisfatório. Fornecedor reprovado/bloqueado; abrir Não Conformidade (RNC) ou substituir provedor."
    }
}

function buildDefaultItems(): Record<string, EvaluationItemState> {
    const initial: Record<string, EvaluationItemState> = {}
    ALL_ATTRIBUTES.forEach(attr => {
        initial[attr.id] = { score: 10, justification: "" }
    })
    return initial
}

function AvaliacaoFornecedoresContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const router = useRouter()

    const preselectedSupplierId = searchParams.get("supplierId") || ""

    // Abas principais (Inicia no Painel IQF & Homologação como página inicial de Fornecedores)
    const [activeTab, setActiveTab] = useState<"avaliar" | "dashboard" | "historico">(
        preselectedSupplierId ? "avaliar" : "dashboard"
    )

    // Dados carregados
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [evaluations, setEvaluations] = useState<SupplierEvaluationRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Estado do Formulário F35
    const [editingEvalId, setEditingEvalId] = useState<string | null>(null)
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>(preselectedSupplierId)
    const [evaluatorName, setEvaluatorName] = useState<string>("")
    const [evaluationDate, setEvaluationDate] = useState<string>(() => new Date().toISOString().split("T")[0])
    const [validityMonths, setValidityMonths] = useState<number>(12)
    const [nextEvaluationDate, setNextEvaluationDate] = useState<string>(() => {
        const d = new Date()
        d.setMonth(d.getMonth() + 12)
        return d.toISOString().split("T")[0]
    })
    const [referenceDoc, setReferenceDoc] = useState<string>("")
    const [otherDescription, setOtherDescription] = useState<string>("")
    const [activeCategories, setActiveCategories] = useState<string[]>(["CALIBRACAO"])
    const [items, setItems] = useState<Record<string, EvaluationItemState>>(buildDefaultItems)
    const [classObservations, setClassObservations] = useState<Record<"A" | "B" | "C" | "D", string>>({
        A: "",
        B: "",
        C: "",
        D: ""
    })
    const [generalNotes, setGeneralNotes] = useState<string>("")
    const [actionPlanRequired, setActionPlanRequired] = useState<boolean>(false)
    const [actionPlanDescription, setActionPlanDescription] = useState<string>("")

    // Filtro de visualização rápida no formulário (Mostrar todas as categorias ativas ou focar em uma)
    const [focusedCategory, setFocusedCategory] = useState<string>("ALL")
    const [onlyShowDeviations, setOnlyShowDeviations] = useState<boolean>(false)

    // Modal de Novo Fornecedor Rápido
    const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false)
    const [newSupplierName, setNewSupplierName] = useState("")
    const [newSupplierCategory, setNewSupplierCategory] = useState("Calibração")
    const [isCreatingSupplier, setIsCreatingSupplier] = useState(false)

    // Modal de Visualização / Impressão Oficial F35
    const [previewEvaluation, setPreviewEvaluation] = useState<SupplierEvaluationRecord | null>(null)

    // Filtros na aba de Histórico
    const [historySearch, setHistorySearch] = useState("")
    const [historyClassFilter, setHistoryClassFilter] = useState<string>("ALL")

    // Ordenação da Matriz de Fornecedores (Fornecedor / Categorias)
    const [matrixSortField, setMatrixSortField] = useState<"name" | "category">("name")
    const [matrixSortOrder, setMatrixSortOrder] = useState<"asc" | "desc">("asc")

    const handleToggleMatrixSort = (field: "name" | "category") => {
        if (matrixSortField === field) {
            setMatrixSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
        } else {
            setMatrixSortField(field)
            setMatrixSortOrder("asc")
        }
    }

    // Modais de feedback
    const [notification, setNotification] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: "success" | "error" | "info"
    }>({ isOpen: false, title: "", message: "", type: "success" })

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
    }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })

    // Preenche o avaliador com o usuário logado
    useEffect(() => {
        if (session?.user?.name && !evaluatorName) {
            setEvaluatorName(session.user.name)
        }
    }, [session, evaluatorName])

    // Atualiza data da próxima reavaliação quando evaluationDate ou validityMonths mudam
    useEffect(() => {
        if (evaluationDate && validityMonths > 0) {
            const d = new Date(evaluationDate + "T12:00:00")
            if (!isNaN(d.getTime())) {
                d.setMonth(d.getMonth() + validityMonths)
                setNextEvaluationDate(d.toISOString().split("T")[0])
            }
        }
    }, [evaluationDate, validityMonths])

    // Seleciona fornecedor vindo da URL
    useEffect(() => {
        if (preselectedSupplierId) {
            setSelectedSupplierId(preselectedSupplierId)
            setActiveTab("avaliar")
        }
    }, [preselectedSupplierId])

    // Sincroniza automaticamente a categoria de avaliação F35 com a categoria cadastrada no fornecedor selecionado
    useEffect(() => {
        if (editingEvalId) return
        if (suppliers.length === 0) return

        if (selectedSupplierId) {
            const sup = suppliers.find(s => s.id === selectedSupplierId)
            if (sup) {
                const supCats = getSupplierF35CategoryIds(sup)
                setActiveCategories(supCats)
                setFocusedCategory("ALL")
            }
        } else if (!preselectedSupplierId) {
            const firstActive = suppliers.find(s => s.active)
            if (firstActive) {
                setSelectedSupplierId(firstActive.id)
                setActiveCategories(getSupplierF35CategoryIds(firstActive))
            }
        }
    }, [selectedSupplierId, suppliers, editingEvalId, preselectedSupplierId])

    // Carrega fornecedores e avaliações
    const fetchAllData = async () => {
        setIsLoading(true)
        try {
            const [supRes, evalRes] = await Promise.all([
                fetch("/api/suppliers"),
                fetch("/api/suppliers/evaluations")
            ])

            if (supRes.ok) {
                const supData = await supRes.json()
                setSuppliers(Array.isArray(supData) ? supData : [])
            }

            if (evalRes.ok) {
                const evalData = await evalRes.json()
                setEvaluations(Array.isArray(evalData.evaluations) ? evalData.evaluations : [])
            }
        } catch (err) {
            console.error("Erro ao carregar dados de fornecedores:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    // ========================================================================
    // CÁLCULO EM TEMPO REAL (PO, PP, % e CLASSE FINAL)
    // ========================================================================
    const calculation = useMemo(() => {
        let po = 0
        let pp = 0
        let answeredCount = 0
        let lowScoreWithoutJustification = 0

        const categoryBreakdown: Record<string, { po: number; pp: number; pct: number; active: boolean }> = {}

        for (const cat of F35_CATEGORIES) {
            const isCatActive = activeCategories.includes(cat.id)
            let catPo = 0
            let catPp = 0

            if (isCatActive) {
                for (const attr of cat.attributes) {
                    const itemState = items[attr.id]
                    const score = itemState ? itemState.score : 10
                    if (score !== null) {
                        catPo += score
                        catPp += 10
                        answeredCount++
                        if ((score === 5 || score === 2.5) && (!itemState?.justification || !itemState.justification.trim())) {
                            lowScoreWithoutJustification++
                        }
                    }
                }
            }

            po += catPo
            pp += catPp
            categoryBreakdown[cat.id] = {
                po: catPo,
                pp: catPp,
                pct: catPp > 0 ? Number(((catPo * 100) / catPp).toFixed(1)) : 0,
                active: isCatActive
            }
        }

        const percentage = pp > 0 ? Number(((po * 100) / pp).toFixed(1)) : 0
        const classification = getClassificationInfo(percentage)

        return {
            po,
            pp,
            percentage,
            answeredCount,
            lowScoreWithoutJustification,
            categoryBreakdown,
            classification
        }
    }, [activeCategories, items])

    // Ativa alerta de Plano de Ação automaticamente quando cai para Classe C ou D
    useEffect(() => {
        if (calculation.classification.finalClass === "C" || calculation.classification.finalClass === "D") {
            setActionPlanRequired(true)
        }
    }, [calculation.classification.finalClass])

    // ========================================================================
    // HANDLERS DE INTERAÇÃO FLUÍDA
    // ========================================================================
    const handleScoreChange = (attrId: string, newScore: ScoreValue) => {
        setItems(prev => ({
            ...prev,
            [attrId]: {
                score: newScore,
                justification: prev[attrId]?.justification || ""
            }
        }))
    }

    const handleJustificationChange = (attrId: string, text: string) => {
        setItems(prev => ({
            ...prev,
            [attrId]: {
                score: prev[attrId]?.score !== undefined ? prev[attrId].score : 10,
                justification: text
            }
        }))
    }

    const toggleCategoryScope = (catId: string) => {
        setActiveCategories(prev => {
            if (prev.includes(catId)) {
                if (prev.length === 1) return prev // Mantém pelo menos 1 categoria ativa
                return prev.filter(id => id !== catId)
            }
            return [...prev, catId]
        })
    }

    const selectPresetScope = (catIds: string[]) => {
        setActiveCategories(catIds)
        if (catIds.length === 1) {
            setFocusedCategory(catIds[0])
        } else {
            setFocusedCategory("ALL")
        }
    }

    const setCategoryAllScore = (catId: string, score: ScoreValue) => {
        const category = F35_CATEGORIES.find(c => c.id === catId)
        if (!category) return
        setItems(prev => {
            const next = { ...prev }
            category.attributes.forEach(attr => {
                next[attr.id] = {
                    score,
                    justification: prev[attr.id]?.justification || ""
                }
            })
            return next
        })
    }

    const setAllScoresGlobal = (score: ScoreValue) => {
        setItems(prev => {
            const next = { ...prev }
            ALL_ATTRIBUTES.forEach(attr => {
                next[attr.id] = {
                    score,
                    justification: prev[attr.id]?.justification || ""
                }
            })
            return next
        })
    }

    const resetForm = () => {
        setEditingEvalId(null)
        setItems(buildDefaultItems())
        const currentSup = suppliers.find(s => s.id === selectedSupplierId)
        setActiveCategories(getSupplierF35CategoryIds(currentSup))
        setReferenceDoc("")
        setOtherDescription("")
        setClassObservations({ A: "", B: "", C: "", D: "" })
        setGeneralNotes("")
        setActionPlanRequired(false)
        setActionPlanDescription("")
        setEvaluationDate(new Date().toISOString().split("T")[0])
    }

    // Criação rápida de fornecedor direto na tela de avaliação
    const handleQuickCreateSupplier = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSupplierName.trim()) return
        setIsCreatingSupplier(true)
        try {
            const res = await fetch("/api/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newSupplierName.trim(),
                    category: newSupplierCategory,
                    qualified: true,
                    score: 10,
                    active: true
                })
            })
            if (res.ok) {
                const created = await res.json()
                setSuppliers(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
                setEditingEvalId(null)
                setItems(buildDefaultItems())
                setReferenceDoc("")
                setOtherDescription("")
                setClassObservations({ A: "", B: "", C: "", D: "" })
                setGeneralNotes("")
                setActionPlanRequired(false)
                setActionPlanDescription("")
                setEvaluationDate(new Date().toISOString().split("T")[0])
                setSelectedSupplierId(created.id)
                setActiveCategories(getSupplierF35CategoryIds(created))
                setNewSupplierName("")
                setNewSupplierCategory("Calibração")
                setIsNewSupplierModalOpen(false)
                setActiveTab("avaliar")
                setNotification({
                    isOpen: true,
                    title: "Fornecedor Cadastrado!",
                    message: `"${created.name}" (${created.category}) foi adicionado e o painel de avaliação em andamento foi aberto.`,
                    type: "success"
                })
            } else {
                setNotification({
                    isOpen: true,
                    title: "Não foi possível cadastrar",
                    message: "Verifique sua conexão ou permissões e tente novamente.",
                    type: "error"
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsCreatingSupplier(false)
        }
    }

    // Monta o objeto de avaliação atual (para salvar ou visualizar F35)
    const buildCurrentEvaluationRecord = (): SupplierEvaluationRecord => {
        const supplierObj = suppliers.find(s => s.id === selectedSupplierId)
        return {
            id: editingEvalId || `eval-${Date.now()}`,
            supplierId: selectedSupplierId,
            supplierName: supplierObj?.name || "Fornecedor Não Selecionado",
            evaluatorName: evaluatorName || session?.user?.name || "Responsável SGQ",
            evaluationDate,
            nextEvaluationDate,
            referenceDoc,
            otherDescription,
            activeCategories,
            items,
            po: calculation.po,
            pp: calculation.pp,
            percentage: calculation.percentage,
            finalClass: calculation.classification.finalClass,
            classLabel: calculation.classification.label,
            classObservations,
            generalNotes,
            actionPlanRequired,
            actionPlanDescription,
            homologationStatus: calculation.classification.homologationStatus,
            createdAt: new Date().toISOString()
        }
    }

    const handleSaveEvaluation = async () => {
        if (!selectedSupplierId) {
            setNotification({
                isOpen: true,
                title: "Selecione um Fornecedor",
                message: "Por favor, selecione o fornecedor que está sendo avaliado (ou cadastre um novo no botão '+ Novo').",
                type: "error"
            })
            return
        }

        if (calculation.pp === 0) {
            setNotification({
                isOpen: true,
                title: "Sem Critérios Avaliados",
                message: "Ative pelo menos uma categoria e atribua nota a pelo menos um atributo.",
                type: "error"
            })
            return
        }

        setIsSaving(true)
        try {
            const payload = buildCurrentEvaluationRecord()
            const res = await fetch("/api/suppliers/evaluations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data.evaluations)) {
                    setEvaluations(data.evaluations)
                }
                // Atualiza a lista de fornecedores local para refletir a nova nota e status
                const supRes = await fetch("/api/suppliers")
                if (supRes.ok) {
                    setSuppliers(await supRes.json())
                }

                setNotification({
                    isOpen: true,
                    title: editingEvalId ? "Avaliação F35 Atualizada!" : "Avaliação F35 Registrada!",
                    message: `Fornecedor classificado na Classe ${payload.finalClass} (${payload.percentage}% - ${payload.classLabel}). Nota do fornecedor sincronizada no sistema!`,
                    type: "success"
                })
                setEditingEvalId(null)
            } else {
                setNotification({
                    isOpen: true,
                    title: "Erro ao Salvar",
                    message: "Não foi possível registrar a avaliação. Tente novamente.",
                    type: "error"
                })
            }
        } catch (err) {
            console.error(err)
            setNotification({
                isOpen: true,
                title: "Erro de Conexão",
                message: "Falha ao comunicar com o servidor.",
                type: "error"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleLoadEvaluationToEdit = (record: SupplierEvaluationRecord) => {
        setEditingEvalId(record.id)
        setSelectedSupplierId(record.supplierId)
        setEvaluatorName(record.evaluatorName)
        setEvaluationDate(record.evaluationDate)
        setNextEvaluationDate(record.nextEvaluationDate || "")
        setReferenceDoc(record.referenceDoc || "")
        setOtherDescription(record.otherDescription || "")
        setActiveCategories(record.activeCategories || F35_CATEGORIES.map(c => c.id))
        setItems({ ...buildDefaultItems(), ...(record.items || {}) })
        setClassObservations(record.classObservations || { A: "", B: "", C: "", D: "" })
        setGeneralNotes(record.generalNotes || "")
        setActionPlanRequired(Boolean(record.actionPlanRequired))
        setActionPlanDescription(record.actionPlanDescription || "")
        setActiveTab("avaliar")
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDeleteEvaluation = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Excluir Registro F35",
            message: "Tem certeza que deseja excluir esta avaliação do histórico? Esta ação não poderá ser desfeita.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/suppliers/evaluations?id=${encodeURIComponent(id)}`, {
                        method: "DELETE"
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setEvaluations(data.evaluations || [])
                        setNotification({
                            isOpen: true,
                            title: "Avaliação Excluída",
                            message: "O registro F35 foi removido com sucesso.",
                            type: "info"
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        })
    }

    const handleDeleteSupplier = (supplier: Supplier) => {
        setConfirmModal({
            isOpen: true,
            title: "Excluir Fornecedor",
            message: `Tem certeza que deseja excluir o fornecedor "${supplier.name}" da Matriz de Homologação? Caso não deseje excluir, clique em "Cancelar".`,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/suppliers/${encodeURIComponent(supplier.id)}`, {
                        method: "DELETE"
                    })
                    if (res.ok) {
                        setSuppliers(prev => prev.filter(s => s.id !== supplier.id))
                        if (selectedSupplierId === supplier.id) {
                            const remaining = suppliers.filter(s => s.id !== supplier.id && s.active)
                            setSelectedSupplierId(remaining[0]?.id || "")
                        }
                        setNotification({
                            isOpen: true,
                            title: "Fornecedor Excluído",
                            message: `O fornecedor "${supplier.name}" foi removido com sucesso da matriz.`,
                            type: "info"
                        })
                    } else {
                        setNotification({
                            isOpen: true,
                            title: "Erro ao Excluir",
                            message: "Não foi possível excluir o fornecedor. Verifique suas permissões.",
                            type: "error"
                        })
                    }
                } catch (err) {
                    console.error("Erro ao excluir fornecedor:", err)
                }
            }
        })
    }

    // ========================================================================
    // ESTATÍSTICAS EXECUTIVAS (ESTILO QUALIEX / 8QUALI)
    // ========================================================================
    const dashboardStats = useMemo(() => {
        const activeSuppliers = suppliers.filter(s => s.active)
        const totalEvaluations = evaluations.length

        // Última avaliação de cada fornecedor
        const latestBySupplier = new Map<string, SupplierEvaluationRecord>()
        evaluations.forEach(ev => {
            if (!latestBySupplier.has(ev.supplierId)) {
                latestBySupplier.set(ev.supplierId, ev)
            }
        })

        // Contabiliza FORNECEDORES ATIVOS em cada Classe (A, B, C, D) e calcula IQF médio por fornecedor
        const classCounts = { A: 0, B: 0, C: 0, D: 0 }
        let totalSupplierPct = 0
        let evaluatedSuppliersCount = 0

        activeSuppliers.forEach(sup => {
            const latestEval = latestBySupplier.get(sup.id)
            const pct = latestEval
                ? latestEval.percentage
                : sup.score !== null && sup.score !== undefined
                ? Number((sup.score * 10).toFixed(1))
                : null

            if (pct !== null) {
                const cls = getClassificationInfo(pct).finalClass
                classCounts[cls]++
                totalSupplierPct += pct
                evaluatedSuppliersCount++
            }
        })

        const avgIqf = evaluatedSuppliersCount > 0
            ? Number((totalSupplierPct / evaluatedSuppliersCount).toFixed(1))
            : 100

        const pendingEvaluationSuppliers = activeSuppliers.filter(s => !latestBySupplier.has(s.id) && s.score === null)

        return {
            activeSuppliersCount: activeSuppliers.length,
            totalEvaluations,
            avgIqf,
            classCounts,
            latestBySupplier,
            pendingEvaluationSuppliers
        }
    }, [suppliers, evaluations])

    const sortedMatrixSuppliers = useMemo(() => {
        const list = suppliers.filter(s => s.active)
        return [...list].sort((a, b) => {
            if (matrixSortField === "name") {
                const cmp = a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
                return matrixSortOrder === "asc" ? cmp : -cmp
            } else {
                const getCatLabel = (sup: Supplier) => {
                    const latestEval = dashboardStats.latestBySupplier.get(sup.id)
                    const catIds = latestEval ? latestEval.activeCategories : getSupplierF35CategoryIds(sup)
                    return catIds
                        .map(cid => F35_CATEGORIES.find(x => x.id === cid)?.shortTitle || cid)
                        .join(", ")
                }
                const catA = getCatLabel(a)
                const catB = getCatLabel(b)
                const cmp = catA.localeCompare(catB, "pt-BR", { sensitivity: "base" })
                if (cmp !== 0) return matrixSortOrder === "asc" ? cmp : -cmp
                return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
            }
        })
    }, [suppliers, matrixSortField, matrixSortOrder, dashboardStats.latestBySupplier])

    const filteredEvaluations = useMemo(() => {
        return evaluations.filter(ev => {
            const matchesSearch =
                ev.supplierName?.toLowerCase().includes(historySearch.toLowerCase()) ||
                ev.evaluatorName?.toLowerCase().includes(historySearch.toLowerCase()) ||
                ev.referenceDoc?.toLowerCase().includes(historySearch.toLowerCase())
            const matchesClass = historyClassFilter === "ALL" || ev.finalClass === historyClassFilter
            return matchesSearch && matchesClass
        })
    }, [evaluations, historySearch, historyClassFilter])

    if (isLoading) {
        return (
            <MMCLoadingScreen
                message="Carregando Gestão e Avaliação de Fornecedores (F35)..."
                submessage="Sincronizando matrizes de qualificação, IQF e histórico de homologação"
            />
        )
    }

    // Cálculo para o anel SVG do velocímetro IQF
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (Math.min(100, Math.max(0, calculation.percentage)) / 100) * circumference

    return (
        <div className="space-y-6 pb-16 animate-in fade-in duration-300">
            {/* ================================================================
                CABEÇALHO OFICIAL DO MÓDULO (F35 - REVISÃO 03 + QUALIEX/8QUALI)
            ================================================================ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0f243c] via-[#1e4370] to-[#132c4a] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-blue-400/20">
                {/* Efeitos visuais de iluminação no cabeçalho */}
                <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -top-24 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute right-24 -bottom-20 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xs">
                                <span className="material-symbols-outlined text-[15px] text-cyan-300">verified</span>
                                Documento do Sistema de Gestão • F35 • Revisão 03
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-400/35 text-emerald-200 shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                ISO/IEC 17025 & ISO 9001 (8.4)
                            </span>
                        </div>
                        <div className="flex items-center gap-3.5">
                            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400/25 to-cyan-400/15 border border-white/20 items-center justify-center shadow-inner shrink-0">
                                <span className="material-symbols-outlined text-2xl text-cyan-200">local_shipping</span>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
                                    Avaliação e Homologação de Fornecedores
                                </h1>
                                <p className="text-blue-100/90 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
                                    Gestão e qualificação técnica de provedores de <strong>Calibração</strong>, <strong>Equipamentos</strong>, <strong>Serviços no Laboratório</strong>, <strong>Auditoria</strong> e <strong>Ensaios de Proficiência</strong> com cálculo automático de <strong>IQF (%)</strong> e <strong>Classes A, B, C, D</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mini KPIs no Banner */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                        <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-center shadow-lg shadow-slate-950/20">
                            <div className="flex items-center justify-center gap-1 text-blue-200 mb-0.5">
                                <span className="material-symbols-outlined text-[15px] text-emerald-300">Query_Stats</span>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold">IQF Médio Global</p>
                            </div>
                            <p className="text-2xl font-black text-white">{dashboardStats.avgIqf}%</p>
                            <span className="text-[10px] text-emerald-300 font-bold">Meta SGQ ≥ 75%</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-center shadow-lg shadow-slate-950/20">
                            <div className="flex items-center justify-center gap-1 text-blue-200 mb-0.5">
                                <span className="material-symbols-outlined text-[15px] text-cyan-300">domain_verification</span>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold">Fornecedores Ativos</p>
                            </div>
                            <p className="text-2xl font-black text-white">{dashboardStats.activeSuppliersCount}</p>
                            <span className="text-[10px] text-blue-200 font-semibold">Base Homologada</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-center shadow-lg shadow-slate-950/20">
                            <div className="flex items-center justify-center gap-1 text-blue-200 mb-0.5">
                                <span className="material-symbols-outlined text-[15px] text-amber-300">fact_check</span>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold">Fichas F35</p>
                            </div>
                            <p className="text-2xl font-black text-white">{dashboardStats.totalEvaluations}</p>
                            <span className="text-[10px] text-blue-200 font-semibold">Avaliações salvas</span>
                        </div>
                    </div>
                </div>

                {/* Navegação por Abas e Ações do Cabeçalho */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-7 pt-5 border-t border-white/15">
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Botão Novo Fornecedor no lugar de Nova Avaliação */}
                        <button
                            type="button"
                            onClick={() => setIsNewSupplierModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-950/40 border border-white/25 cursor-pointer active:scale-[0.99]"
                        >
                            <span className="material-symbols-outlined text-[19px]">add_business</span>
                            Novo Fornecedor
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("dashboard")}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "dashboard"
                                    ? "bg-white text-[#1e3a5f] shadow-lg"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[19px]">monitoring</span>
                            Painel IQF & Homologação
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("historico")}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "historico"
                                    ? "bg-white text-[#1e3a5f] shadow-lg"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[19px]">history_edu</span>
                            Histórico de Avaliações F35
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "historico" ? "bg-[#1e3a5f] text-white" : "bg-white/20 text-white"}`}>
                                {evaluations.length}
                            </span>
                        </button>

                        {activeTab === "avaliar" && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("avaliar")}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 bg-white text-[#1e3a5f] shadow-lg"
                            >
                                <span className="material-symbols-outlined text-[19px]">rate_review</span>
                                {editingEvalId ? "Editando Avaliação F35" : "Avaliação F35 em Andamento"}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPreviewEvaluation(buildCurrentEvaluationRecord())}
                            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center gap-2 shadow-md shadow-emerald-950/30 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">print</span>
                            Visualizar / Imprimir F35 Oficial
                        </button>
                    </div>
                </div>
            </div>

            {/* ================================================================
                ABA 1: FORMULÁRIO INTERATIVO DE AVALIAÇÃO (F35 - REVISÃO 03)
            ================================================================ */}
            {activeTab === "avaliar" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* COLUNA PRINCIPAL (ESQUERDA - 8 COLUNAS) */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* 1. CABEÇALHO DE IDENTIFICAÇÃO DA AVALIAÇÃO */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2b5c92] dark:text-blue-400 flex items-center justify-center font-black">
                                        <span className="material-symbols-outlined">badge</span>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            1. Identificação do Fornecedor e Rastreabilidade
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Dados do cabeçalho oficial F35 e ciclo de homologação
                                        </p>
                                    </div>
                                </div>
                                {editingEvalId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1 self-start sm:self-auto"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                        Cancelar Edição / Nova Ficha
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Seleção do Fornecedor */}
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Fornecedor Avaliado <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedSupplierId}
                                            onChange={(e) => setSelectedSupplierId(e.target.value)}
                                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                                        >
                                            <option value="">-- Selecione um Fornecedor --</option>
                                            {suppliers.filter(s => s.active).map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} • {s.category || "Calibração"} {s.score !== null ? `(Nota atual: ${s.score.toFixed(2)})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsNewSupplierModalOpen(true)}
                                            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-sm"
                                            title="Cadastrar novo fornecedor rapidamente"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                            Novo
                                        </button>
                                    </div>
                                </div>

                                {/* Responsável pela Avaliação */}
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Resp. Avaliação <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={evaluatorName}
                                        onChange={(e) => setEvaluatorName(e.target.value)}
                                        placeholder="Nome do avaliador / Gestor da Qualidade"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Data da Avaliação */}
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Data da Avaliação
                                    </label>
                                    <input
                                        type="date"
                                        value={evaluationDate}
                                        onChange={(e) => setEvaluationDate(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Periodicidade / Próxima Reavaliação (Estilo 8Quali / Qualiex) */}
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Validade / Reavaliação
                                    </label>
                                    <div className="flex gap-1.5">
                                        <select
                                            value={validityMonths}
                                            onChange={(e) => setValidityMonths(Number(e.target.value))}
                                            className="px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500"
                                        >
                                            <option value={6}>6 meses</option>
                                            <option value={12}>12 meses</option>
                                            <option value={24}>24 meses</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={nextEvaluationDate}
                                            onChange={(e) => setNextEvaluationDate(e.target.value)}
                                            className="flex-1 min-w-0 px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Documento de Referência (NF, Certificado RBC, Contrato, Auditoria) */}
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Doc. Referência / Certificado / NF
                                    </label>
                                    <input
                                        type="text"
                                        value={referenceDoc}
                                        onChange={(e) => setReferenceDoc(e.target.value)}
                                        placeholder="Ex: Cert. RBC #4821, NF 1092..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. ITENS DE AVALIAÇÃO DA CATEGORIA DO FORNECEDOR */}
                        <div className="space-y-5">
                            {F35_CATEGORIES.filter(cat => activeCategories.includes(cat.id)).map((cat) => {
                                const isCatActive = true
                                const catStats = calculation.categoryBreakdown[cat.id]

                                const visibleAttributes = cat.attributes.filter(attr => {
                                    if (!onlyShowDeviations) return true
                                    const s = items[attr.id]?.score
                                    return s !== null && s !== undefined && s < 10
                                })

                                return (
                                    <div
                                        key={cat.id}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all overflow-hidden shadow-md hover:shadow-lg"
                                    >
                                        {/* Header da Categoria */}
                                        <div className="bg-gradient-to-r from-slate-100 via-blue-50/60 to-slate-100 dark:from-slate-800/95 dark:via-blue-950/30 dark:to-slate-800/95 px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2b5c92] to-blue-700 text-white shadow-md shadow-blue-900/20">
                                                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                                                            2. Itens de Avaliação — {cat.shortTitle}
                                                        </h3>
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                                            {cat.attributes.length} atributos • {catStats.po}/{catStats.pp} pts
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                                                <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 cursor-pointer mr-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={onlyShowDeviations}
                                                        onChange={(e) => setOnlyShowDeviations(e.target.checked)}
                                                        className="rounded border-slate-300 accent-[#2b5c92]"
                                                    />
                                                    Apenas desvios (&lt; 10)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setCategoryAllScore(cat.id, 10)}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 transition cursor-pointer"
                                                >
                                                    Tudo 10
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCategoryAllScore(cat.id, 7.5)}
                                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/25 transition cursor-pointer"
                                                >
                                                    Tudo 7,5
                                                </button>
                                            </div>
                                        </div>

                                        {/* Corpo dos Atributos */}
                                        {isCatActive ? (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                                {visibleAttributes.length === 0 ? (
                                                    <div className="p-6 text-center text-xs text-slate-400">
                                                        Nenhum desvio nesta categoria (todos os itens estão com nota 10).
                                                    </div>
                                                ) : (
                                                    visibleAttributes.map((attr) => {
                                                        const itemState = items[attr.id] || { score: 10, justification: "" }
                                                        const currentScore = itemState.score
                                                        const activeOption = SCORE_OPTIONS.find(o => o.value === currentScore) || SCORE_OPTIONS[0]
                                                        const needsAttention = currentScore === 5 || currentScore === 2.5

                                                        return (
                                                            <div
                                                                key={attr.id}
                                                                className={`p-4 sm:p-5 transition-all duration-200 ${
                                                                    needsAttention
                                                                        ? "bg-amber-50/40 dark:bg-amber-950/15"
                                                                        : "hover:bg-blue-50/30 dark:hover:bg-slate-800/35"
                                                                }`}
                                                            >
                                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                                    {/* Nome do Atributo */}
                                                                    <div className="flex items-start gap-3 flex-1">
                                                                        <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-transform ${activeOption.badgeBg}`}>
                                                                            {activeOption.label}
                                                                        </span>
                                                                        <div className="flex-1 space-y-1">
                                                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                                                                                {attr.label}
                                                                            </p>
                                                                            {attr.id === "out_1" && (
                                                                                <input
                                                                                    type="text"
                                                                                    value={otherDescription}
                                                                                    onChange={(e) => setOtherDescription(e.target.value)}
                                                                                    placeholder="Descreva qual outro atributo/serviço está sendo avaliado (opcional)..."
                                                                                    className="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Botões de Seleção de Nota (10 | 7,5 | 5 | 2,5 | N/A) */}
                                                                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                                                        {SCORE_OPTIONS.map((opt) => {
                                                                            const isSelected = currentScore === opt.value
                                                                            return (
                                                                                <button
                                                                                    key={String(opt.value)}
                                                                                    type="button"
                                                                                    onClick={() => handleScoreChange(attr.id, opt.value)}
                                                                                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center min-w-[60px] border cursor-pointer ${
                                                                                        isSelected
                                                                                            ? `${opt.bgActive} ${opt.borderActive} scale-[1.04]`
                                                                                            : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                                                                                    }`}
                                                                                >
                                                                                    <span className="text-sm leading-none">{opt.label}</span>
                                                                                    <span className={`text-[9px] font-bold mt-0.5 uppercase tracking-tighter ${isSelected ? "opacity-95" : "opacity-65"}`}>
                                                                                        {opt.concept}
                                                                                    </span>
                                                                                </button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Campo de Justificativa (Preencher quando necessário - F35) */}
                                                                <div className="mt-3 pl-0 lg:pl-11">
                                                                    <div className="relative">
                                                                        <input
                                                                            type="text"
                                                                            value={itemState.justification}
                                                                            onChange={(e) => handleJustificationChange(attr.id, e.target.value)}
                                                                            placeholder={
                                                                                needsAttention
                                                                                    ? "⚠️ Nota Regular/Ruim: Preencha a justificativa técnica ou evidência do desvio..."
                                                                                    : "Justificativa / Evidência (preencher quando necessário)..."
                                                                            }
                                                                            className={`w-full px-3.5 py-2 rounded-xl text-xs border transition outline-none ${
                                                                                needsAttention && !itemState.justification.trim()
                                                                                    ? "bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 text-slate-900 dark:text-slate-100 placeholder:text-amber-700 dark:placeholder:text-amber-400 font-medium"
                                                                                    : "bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ============================================================
                        COLUNA LATERAL STICKY (DIREITA - 4 COLUNAS): RESULTADO + QUADRO DE CLASSES F35
                    ============================================================ */}
                    <div className="xl:col-span-4 xl:sticky xl:top-6 space-y-5">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 relative overflow-hidden">
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                        Cálculo Automático F35
                                    </span>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Resultado da Avaliação
                                    </h3>
                                </div>
                                <div className={`px-3.5 py-1.5 rounded-xl font-black text-lg shadow-sm transition-all ${calculation.classification.bgClass}`}>
                                    Classe {calculation.classification.finalClass}
                                </div>
                            </div>

                            {/* Gauge Circular SVG + IQF (%) */}
                            <div className="flex flex-col items-center justify-center py-1">
                                <div className="relative w-36 h-36 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90 drop-shadow-xs" viewBox="0 0 128 128">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r={radius}
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            className="text-slate-100 dark:text-slate-800"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r={radius}
                                            fill="transparent"
                                            stroke={calculation.classification.strokeColor}
                                            strokeWidth="10"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            className="transition-all duration-500 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IQF / Resultado</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                                            {calculation.percentage}%
                                        </span>
                                        <span className={`text-xs font-extrabold uppercase ${calculation.classification.colorClass}`}>
                                            {calculation.classification.label}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-400 mt-1.5">
                                    Fórmula F35: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">Resultado (%) = (PO × 100) / PP</code>
                                </p>
                            </div>

                            {/* PO e PP Fiéis à Planilha */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
                                    <span className="text-[11px] font-black uppercase text-slate-400 block">Pontos Obtidos (PO)</span>
                                    <span className="text-2xl font-black text-[#2b5c92] dark:text-blue-400 mt-0.5 block">
                                        {calculation.po.toLocaleString("pt-BR")}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Soma das notas</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center">
                                    <span className="text-[11px] font-black uppercase text-slate-400 block">Pontos Possíveis (PP)</span>
                                    <span className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                                        {calculation.pp.toLocaleString("pt-BR")}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{calculation.answeredCount} atributos ativos</span>
                                </div>
                            </div>

                            {/* Status de Homologação (Parecer Automático) */}
                            <div className={`rounded-2xl p-4 border transition-colors ${calculation.classification.softBgClass}`}>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                                        Classificação Final: Classe {calculation.classification.finalClass}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${calculation.classification.bgClass}`}>
                                        {calculation.classification.label}
                                    </span>
                                </div>
                                <p className={`text-xs font-bold ${calculation.classification.colorClass}`}>
                                    {calculation.classification.homologationText}
                                </p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                    {calculation.classification.description}
                                </p>
                            </div>

                            {/* Quadro de Classificação de Fornecedores (Classes A, B, C, D) */}
                            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-blue-500">workspace_premium</span>
                                        Quadro de Classificação (F35)
                                    </span>
                                </div>
                                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-[11px] font-extrabold uppercase">
                                                <th className="py-2.5 px-3 w-16 text-center border-r border-slate-200 dark:border-slate-700/80">Classe</th>
                                                <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700/80">Pontuação</th>
                                                <th className="py-2.5 px-3 text-center">Avaliação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                            {([
                                                { cls: "A" as const, range: "P ≥ 85 pontos", label: "ÓTIMO", badgeBg: "bg-[#00b050] text-white" },
                                                { cls: "B" as const, range: "85 > P ≥ 75 pontos", label: "BOM", badgeBg: "bg-[#ffff00] text-slate-950" },
                                                { cls: "C" as const, range: "75 > P ≥ 60 pontos", label: "REGULAR", badgeBg: "bg-[#ffc000] text-slate-950" },
                                                { cls: "D" as const, range: "P < 60 pontos", label: "RUIM", badgeBg: "bg-[#ff0000] text-white" },
                                            ]).map((row) => {
                                                const isCurrentClass = calculation.classification.finalClass === row.cls
                                                return (
                                                    <tr
                                                        key={row.cls}
                                                        className={`transition-all ${
                                                            isCurrentClass
                                                                ? "bg-blue-50/80 dark:bg-blue-950/50 ring-1 ring-inset ring-blue-500/70"
                                                                : "bg-white dark:bg-slate-900/80"
                                                        }`}
                                                    >
                                                        <td className={`py-2.5 px-3 font-black text-sm text-center border-r border-slate-200 dark:border-slate-800 ${row.badgeBg}`}>
                                                            {row.cls}
                                                        </td>
                                                        <td className="py-2.5 px-3 font-bold text-center text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                                                            {row.range}
                                                        </td>
                                                        <td className="py-2.5 px-3 font-extrabold text-center text-slate-900 dark:text-white">
                                                            <div className="inline-flex items-center justify-center gap-1.5">
                                                                <span>{row.label}</span>
                                                                {isCurrentClass && (
                                                                    <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-blue-600 text-white uppercase tracking-wider shadow-xs">
                                                                        Atual
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Desempenho por Categoria Ativa */}
                            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Desempenho por Escopo
                                </p>
                                {F35_CATEGORIES.map(cat => {
                                    const st = calculation.categoryBreakdown[cat.id]
                                    if (!st.active) return null
                                    return (
                                        <div key={cat.id} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{cat.shortTitle}</span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">
                                                    {st.po}/{st.pp} ({st.pct}%)
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        st.pct >= 85
                                                            ? "bg-emerald-500"
                                                            : st.pct >= 75
                                                            ? "bg-yellow-400"
                                                            : st.pct >= 60
                                                            ? "bg-amber-500"
                                                            : "bg-red-500"
                                                    }`}
                                                    style={{ width: `${Math.min(100, st.pct)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Alerta de Justificativas Pendentes */}
                            {calculation.lowScoreWithoutJustification > 0 && (
                                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-xl p-3 flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">warning</span>
                                    <p className="text-xs text-amber-800 dark:text-amber-300">
                                        Há <strong>{calculation.lowScoreWithoutJustification}</strong> atributo(s) com nota Regular (5) ou Ruim (2,5) sem justificativa preenchida.
                                    </p>
                                </div>
                            )}

                            {/* Botões de Ação Final */}
                            <div className="space-y-2.5 pt-2">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={handleSaveEvaluation}
                                    className="w-full py-3.5 px-4 bg-[#2b5c92] hover:bg-blue-800 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    {isSaving ? "Salvando Avaliação F35..." : editingEvalId ? "Atualizar Avaliação F35" : "Salvar e Homologar Fornecedor"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPreviewEvaluation(buildCurrentEvaluationRecord())}
                                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    Espelho Oficial F35 (Revisão 03)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================
                ABA 2: PAINEL IQF & HOMOLOGAÇÃO (MODELO QUALIEX & 8QUALI)
            ================================================================ */}
            {activeTab === "dashboard" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Cards de Distribuição por Classe F35 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm border-l-4 border-l-[#00b050]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-500">Classe A • ÓTIMO</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#00b050] text-white">P ≥ 85%</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{dashboardStats.classCounts.A}</p>
                            <p className="text-xs text-slate-500 mt-1">Fornecedores de excelência (Homologados)</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm border-l-4 border-l-yellow-400">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-500">Classe B • BOM</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ffff00] text-slate-950">75% a 84,9%</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{dashboardStats.classCounts.B}</p>
                            <p className="text-xs text-slate-500 mt-1">Qualificados sem restrições</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm border-l-4 border-l-amber-500">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-500">Classe C • REGULAR</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ffc000] text-slate-950">60% a 74,9%</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{dashboardStats.classCounts.C}</p>
                            <p className="text-xs text-slate-500 mt-1">Qualificados com restrição / observação</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm border-l-4 border-l-red-600">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-500">Classe D • RUIM</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ff0000] text-white">P &lt; 60%</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{dashboardStats.classCounts.D}</p>
                            <p className="text-xs text-slate-500 mt-1">Reprovados / Bloqueados para compras</p>
                        </div>
                    </div>

                    {/* Matriz de Homologação e Ranking IQF dos Fornecedores */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-600">leaderboard</span>
                                    Matriz de Homologação e Índice de Qualificação de Fornecedores (IQF)
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Visão consolidada de todos os fornecedores cadastrados, nota atual, classe F35 e validade da qualificação.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm()
                                    setActiveTab("avaliar")
                                }}
                                className="px-4 py-2 bg-[#2b5c92] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_task</span>
                                Avaliar Fornecedor
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                                        <th className="py-3.5 px-5">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleMatrixSort("name")}
                                                className="inline-flex items-center gap-1.5 uppercase font-bold hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer select-none group"
                                                title="Ordenar por Fornecedor (Crescente / Decrescente)"
                                            >
                                                <span>Fornecedor</span>
                                                <span className={`material-symbols-outlined text-[16px] transition-colors ${matrixSortField === "name" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"}`}>
                                                    {matrixSortField === "name"
                                                        ? matrixSortOrder === "asc"
                                                            ? "arrow_upward"
                                                            : "arrow_downward"
                                                        : "unfold_more"}
                                                </span>
                                            </button>
                                        </th>
                                        <th className="py-3.5 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleMatrixSort("category")}
                                                className="inline-flex items-center justify-center gap-1.5 uppercase font-bold hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer select-none group mx-auto"
                                                title="Ordenar por Categorias (Crescente / Decrescente)"
                                            >
                                                <span>Categorias</span>
                                                <span className={`material-symbols-outlined text-[16px] transition-colors ${matrixSortField === "category" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"}`}>
                                                    {matrixSortField === "category"
                                                        ? matrixSortOrder === "asc"
                                                            ? "arrow_upward"
                                                            : "arrow_downward"
                                                        : "unfold_more"}
                                                </span>
                                            </button>
                                        </th>
                                        <th className="py-3.5 px-4 text-center">IQF (%) / Nota</th>
                                        <th className="py-3.5 px-4 text-center">Classe F35</th>
                                        <th className="py-3.5 px-4 text-center">Status Homologação</th>
                                        <th className="py-3.5 px-4 text-center">Próx. Reavaliação</th>
                                        <th className="py-3.5 px-5 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {sortedMatrixSuppliers.map((sup) => {
                                        const latestEval = dashboardStats.latestBySupplier.get(sup.id)
                                        const pct = latestEval ? latestEval.percentage : (sup.score !== null ? Number((sup.score * 10).toFixed(1)) : null)
                                        const clsInfo = pct !== null ? getClassificationInfo(pct) : null

                                        return (
                                            <tr key={sup.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition">
                                                <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                                                    {sup.name}
                                                    {latestEval?.referenceDoc && (
                                                        <span className="block text-[11px] font-normal text-slate-400">
                                                            Ref: {latestEval.referenceDoc}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {(latestEval ? latestEval.activeCategories : getSupplierF35CategoryIds(sup)).map(cid => {
                                                            const c = F35_CATEGORIES.find(x => x.id === cid)
                                                            return c ? (
                                                                <span key={cid} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                                                                    {c.shortTitle}
                                                                </span>
                                                            ) : null
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {pct !== null ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="font-black text-slate-900 dark:text-white">
                                                                {pct}% <span className="text-xs font-semibold text-slate-400">({(pct / 10).toFixed(2)})</span>
                                                            </span>
                                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${clsInfo?.bgClass.split(" ")[0]}`}
                                                                    style={{ width: `${Math.min(100, pct)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Não avaliado</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {clsInfo ? (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${clsInfo.bgClass}`}>
                                                            Classe {clsInfo.finalClass} • {clsInfo.label}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {sup.qualified ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                            Homologado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                            Não Qualificado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center text-xs text-slate-600 dark:text-slate-400">
                                                    {latestEval?.nextEvaluationDate
                                                        ? new Date(latestEval.nextEvaluationDate + "T12:00:00").toLocaleDateString("pt-BR")
                                                        : "Pendente"}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {latestEval && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewEvaluation(latestEval)}
                                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                                                title="Visualizar F35"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">description</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                resetForm()
                                                                setSelectedSupplierId(sup.id)
                                                                setActiveTab("avaliar")
                                                            }}
                                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition cursor-pointer"
                                                        >
                                                            Avaliar F35
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteSupplier(sup)}
                                                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200/70 dark:border-red-800/60 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                                            title={`Excluir fornecedor ${sup.name}`}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================
                ABA 3: HISTÓRICO DE AVALIAÇÕES F35 E RASTREABILIDADE
            ================================================================ */}
            {activeTab === "historico" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                    {/* Barra de Filtros do Histórico */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                            <input
                                type="text"
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                placeholder="Buscar por fornecedor, avaliador ou documento de referência..."
                                className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {["ALL", "A", "B", "C", "D"].map(cls => (
                                <button
                                    key={cls}
                                    type="button"
                                    onClick={() => setHistoryClassFilter(cls)}
                                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition ${
                                        historyClassFilter === cls
                                            ? "bg-[#2b5c92] text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                    }`}
                                >
                                    {cls === "ALL" ? "Todas as Classes" : `Classe ${cls}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredEvaluations.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-3xl">assignment_add</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Nenhuma avaliação F35 encontrada
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                                Utilize a aba &ldquo;Nova Avaliação (Planilha F35)&rdquo; para pontuar um fornecedor e gerar o primeiro registro auditável.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveTab("avaliar")}
                                className="px-4 py-2.5 bg-[#2b5c92] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition"
                            >
                                Criar Primeira Avaliação F35
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredEvaluations.map((ev) => {
                                const clsInfo = getClassificationInfo(ev.percentage)
                                return (
                                    <div
                                        key={ev.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-400 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-2 flex-1">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-black ${clsInfo.bgClass}`}>
                                                    Classe {ev.finalClass} • {ev.classLabel}
                                                </span>
                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                    {ev.supplierName}
                                                </h3>
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full">
                                                    IQF: {ev.percentage}% ({ev.po}/{ev.pp} pts)
                                                </span>
                                                {ev.actionPlanRequired && (
                                                    <span className="text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">report_problem</span>
                                                        Plano de Ação Vinculado
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">person</span>
                                                    Resp.: <strong>{ev.evaluatorName}</strong>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">event</span>
                                                    Avaliado em: <strong>{new Date(ev.evaluationDate + "T12:00:00").toLocaleDateString("pt-BR")}</strong>
                                                </span>
                                                {ev.nextEvaluationDate && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[15px]">update</span>
                                                        Próx. Avaliação: <strong>{new Date(ev.nextEvaluationDate + "T12:00:00").toLocaleDateString("pt-BR")}</strong>
                                                    </span>
                                                )}
                                                {ev.referenceDoc && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                                                        Ref.: <strong>{ev.referenceDoc}</strong>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewEvaluation(ev)}
                                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-[17px]">print</span>
                                                Ver F35 Oficial
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleLoadEvaluationToEdit(ev)}
                                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-[17px]">edit</span>
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEvaluation(ev.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                                                title="Excluir avaliação"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ================================================================
                MODAL DE CRIAÇÃO RÁPIDA DE FORNECEDOR
            ================================================================ */}
            {isNewSupplierModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Cadastrar Novo Fornecedor
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsNewSupplierModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleQuickCreateSupplier} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                                    Razão Social / Nome Fantasia do Fornecedor
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={newSupplierName}
                                    onChange={(e) => setNewSupplierName(e.target.value)}
                                    placeholder="Ex: Laboratório de Calibração ABC Ltda"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                                    Categoria do Fornecedor
                                </label>
                                <select
                                    value={newSupplierCategory}
                                    onChange={(e) => setNewSupplierCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="Calibração">Calibração</option>
                                    <option value="Ensaio de Proficiência">Ensaio de Proficiência</option>
                                    <option value="Auditoria">Auditoria</option>
                                    <option value="Equipamentos">Equipamentos</option>
                                    <option value="Serviços no Laboratório">Serviços no Laboratório</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNewSupplierModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingSupplier}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2b5c92] hover:bg-blue-800 text-white"
                                >
                                    {isCreatingSupplier ? "Salvando..." : "Cadastrar e Selecionar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================================================================
                MODAL ESPELHO FIEL À PLANILHA EXCEL (DOCUMENTO F35 - REVISÃO 03)
            ================================================================ */}
            {previewEvaluation && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
                    <div className="bg-white text-slate-950 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
                        {/* Barra de Ações do Modal (Oculta na impressão) */}
                        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-400">description</span>
                                <span className="text-sm font-bold">
                                    Espelho Oficial do Documento SGQ — F35 (Revisão 03)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                                >
                                    <span className="material-symbols-outlined text-[16px]">print</span>
                                    Imprimir / Salvar PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewEvaluation(null)}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo Imprimível Fiel à Planilha F35 */}
                        <div className="p-4 sm:p-8 overflow-y-auto space-y-4 bg-white text-black text-xs">
                            {/* Cabeçalho F35 */}
                            <table className="w-full border-collapse border-2 border-black">
                                <tbody>
                                    <tr>
                                        <td rowSpan={2} className="border border-black p-3 w-44 text-center align-middle bg-white">
                                            <div className="font-black text-2xl tracking-tighter text-teal-600 leading-none">
                                                <span className="text-xs block font-bold text-slate-500 tracking-widest">MMC</span>
                                                LAB
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                                controle tecnológico
                                            </div>
                                        </td>
                                        <td className="border border-black py-1.5 px-3 text-center font-bold text-xs uppercase">
                                            DOCUMENTO DO SISTEMA DE GESTÃO
                                        </td>
                                        <td className="border border-black py-1.5 px-3 w-28 text-center font-black text-base">
                                            F35
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black py-2.5 px-3 text-center font-black text-base uppercase">
                                            AVALIAÇÃO DE FORNECEDORES
                                        </td>
                                        <td className="border border-black py-2.5 px-2 text-center font-bold text-xs uppercase">
                                            REVISÃO 03
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Campos Fornecedor / Resp / Data */}
                            <table className="w-full border-collapse border border-black">
                                <tbody>
                                    <tr>
                                        <td className="border border-black py-1.5 px-2 font-bold w-32 bg-white">Fornecedor:</td>
                                        <td colSpan={3} className="border border-black py-1.5 px-3 font-bold bg-[#ffff99]">
                                            {previewEvaluation.supplierName}
                                            {previewEvaluation.referenceDoc ? ` (Ref: ${previewEvaluation.referenceDoc})` : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black py-1.5 px-2 font-bold bg-white">Resp. Avaliação:</td>
                                        <td className="border border-black py-1.5 px-3 font-semibold bg-[#ffff99]">
                                            {previewEvaluation.evaluatorName}
                                        </td>
                                        <td className="border border-black py-1.5 px-2 font-bold w-36 bg-white text-right">
                                            Data da avaliação:
                                        </td>
                                        <td className="border border-black py-1.5 px-3 font-semibold w-36 bg-[#ffff99] text-center">
                                            {previewEvaluation.evaluationDate
                                                ? new Date(previewEvaluation.evaluationDate + "T12:00:00").toLocaleDateString("pt-BR")
                                                : ""}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Tabela de Legenda de Notas */}
                            <div className="max-w-2xl mx-auto">
                                <table className="w-full border-collapse border border-black text-center text-xs">
                                    <thead>
                                        <tr>
                                            <th colSpan={4} className="border border-black py-1 bg-[#8ea9db] font-bold">
                                                NOTAS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-[#d9e1f2] font-bold">
                                            <td className="border border-black py-1 w-1/4">10</td>
                                            <td className="border border-black py-1 w-1/4">7,5</td>
                                            <td className="border border-black py-1 w-1/4">5</td>
                                            <td className="border border-black py-1 w-1/4">2,5</td>
                                        </tr>
                                        <tr className="bg-[#d9e1f2]">
                                            <td className="border border-black py-1">Atende Plenamente</td>
                                            <td className="border border-black py-1">Atende</td>
                                            <td className="border border-black py-1">Atende parcialmente</td>
                                            <td className="border border-black py-1">Não atende</td>
                                        </tr>
                                        <tr className="font-bold">
                                            <td className="border border-black py-1 bg-[#00b050] text-black">Ótimo</td>
                                            <td className="border border-black py-1 bg-[#ffff00] text-black">Bom</td>
                                            <td className="border border-black py-1 bg-[#ffc000] text-black">Regular</td>
                                            <td className="border border-black py-1 bg-[#ff0000] text-black">Ruim</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Tabela Principal de Atributos F35 */}
                            <table className="w-full border-collapse border border-black text-xs">
                                <thead>
                                    <tr className="bg-[#8ea9db] font-bold text-center">
                                        <th colSpan={2} className="border border-black py-2 px-3">Atributos</th>
                                        <th className="border border-black py-2 px-2 w-20">Notas</th>
                                        <th className="border border-black py-2 px-3 w-1/2">
                                            Justificativa<br />(preencher quando necessário)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {F35_CATEGORIES.filter((cat) => (previewEvaluation.activeCategories || ["CALIBRACAO"]).includes(cat.id)).map((cat) => {
                                        const isCatActive = true
                                        return cat.attributes.map((attr, idx) => {
                                            const item = previewEvaluation.items?.[attr.id]
                                            const score: ScoreValue = isCatActive ? (item !== undefined ? item.score : 10) : null
                                            const scoreBg =
                                                score === 10
                                                    ? "bg-[#00b050]"
                                                    : score === 7.5
                                                    ? "bg-[#ffff00]"
                                                    : score === 5
                                                    ? "bg-[#ffc000]"
                                                    : score === 2.5
                                                    ? "bg-[#ff0000]"
                                                    : "bg-slate-200"

                                            return (
                                                <tr key={attr.id}>
                                                    {idx === 0 && (
                                                        <td
                                                            rowSpan={cat.attributes.length}
                                                            className="border border-black bg-[#d9e1f2] font-bold text-center align-middle w-10 px-1 py-2"
                                                            style={{ writingMode: cat.attributes.length > 1 ? "vertical-rl" : undefined, transform: cat.attributes.length > 1 ? "rotate(180deg)" : undefined }}
                                                        >
                                                            <span className="text-[10px] tracking-wider uppercase">
                                                                {cat.id === "OUTROS" ? "" : cat.shortTitle}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="border border-black bg-[#d9e1f2] py-1.5 px-2.5 font-medium">
                                                        {attr.label}
                                                        {attr.id === "out_1" && previewEvaluation.otherDescription
                                                            ? `: ${previewEvaluation.otherDescription}`
                                                            : ""}
                                                    </td>
                                                    <td className={`border border-black py-1.5 px-2 text-center font-bold ${scoreBg}`}>
                                                        {score !== null ? String(score).replace(".", ",") : "N/A"}
                                                    </td>
                                                    <td className="border border-black bg-[#ffff99] py-1.5 px-2.5">
                                                        {item?.justification || ""}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    })}
                                </tbody>
                            </table>

                            {/* PO, PP e Resultado (%) */}
                            <table className="w-full border-collapse border border-black text-xs">
                                <tbody>
                                    <tr className="bg-[#d9e1f2]">
                                        <td className="border border-black py-1.5 px-2 font-medium">Total de pontos obtidos</td>
                                        <td className="border border-black py-1.5 px-2 font-bold text-center w-16">PO</td>
                                        <td className="border border-black py-1.5 px-2 font-bold text-center w-20 bg-white">
                                            {String(previewEvaluation.po).replace(".", ",")}
                                        </td>
                                        <td className="border border-black py-1.5 px-3 text-center font-medium">
                                            Resultado (%) = (PO*100)/PP
                                        </td>
                                        <td className="border border-black py-1.5 px-3 font-black text-center w-24 bg-white">
                                            {String(previewEvaluation.percentage).replace(".", ",")}
                                        </td>
                                        <td className="border border-black py-1.5 px-2 text-center w-10 font-bold">%</td>
                                    </tr>
                                    <tr className="bg-[#d9e1f2]">
                                        <td className="border border-black py-1.5 px-2 font-medium">Total de pontos possíveis</td>
                                        <td className="border border-black py-1.5 px-2 font-bold text-center">PP</td>
                                        <td className="border border-black py-1.5 px-2 font-bold text-center bg-white">
                                            {previewEvaluation.pp}
                                        </td>
                                        <td colSpan={3} className="border border-black py-1.5 px-3 text-center">
                                            Veja abaixo o quadro de classificação de fornecedores.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Quadro de Classificação Final */}
                            <table className="w-full border-collapse border border-black text-xs">
                                <thead>
                                    <tr className="bg-[#d9e1f2] text-center font-bold">
                                        <th className="border border-black py-2 px-2 w-16">Classe</th>
                                        <th className="border border-black py-2 px-3 w-44">Pontuação</th>
                                        <th className="border border-black py-2 px-3 w-40">Avaliação</th>
                                        <th className="border border-black py-2 px-3">
                                            Observação<br />(preencher quando necessário)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black py-1.5 text-center font-bold bg-[#00b050]">A</td>
                                        <td className="border border-black py-1.5 text-center">P ≥ 85 pontos</td>
                                        <td className="border border-black py-1.5 text-center">ÓTIMO</td>
                                        <td className="border border-black py-1.5 px-2 bg-[#ffff99]">
                                            {previewEvaluation.classObservations?.A || ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black py-1.5 text-center font-bold bg-[#ffff00]">B</td>
                                        <td className="border border-black py-1.5 text-center">85 &gt; P ≥ 75 pontos</td>
                                        <td className="border border-black py-1.5 text-center">BOM</td>
                                        <td className="border border-black py-1.5 px-2 bg-[#ffff99]">
                                            {previewEvaluation.classObservations?.B || ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black py-1.5 text-center font-bold bg-[#ffc000]">C</td>
                                        <td className="border border-black py-1.5 text-center">75 &gt; P ≥ 60 pontos</td>
                                        <td className="border border-black py-1.5 text-center">REGULAR</td>
                                        <td className="border border-black py-1.5 px-2 bg-[#ffff99]">
                                            {previewEvaluation.classObservations?.C || ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black py-1.5 text-center font-bold bg-[#ff0000]">D</td>
                                        <td className="border border-black py-1.5 text-center">P &lt; 60 pontos</td>
                                        <td className="border border-black py-1.5 text-center">RUIM</td>
                                        <td className="border border-black py-1.5 px-2 bg-[#ffff99]">
                                            {previewEvaluation.classObservations?.D || ""}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Classificação Final no Canto Direito */}
                            <div className="flex justify-end items-center gap-3 pt-2">
                                <span className="font-black text-sm">Classificação final:</span>
                                <div
                                    className={`w-28 py-2 text-center font-black text-base border border-black ${
                                        previewEvaluation.finalClass === "A"
                                            ? "bg-[#00b050]"
                                            : previewEvaluation.finalClass === "B"
                                            ? "bg-[#ffff00]"
                                            : previewEvaluation.finalClass === "C"
                                            ? "bg-[#ffc000]"
                                            : "bg-[#ff0000] text-white"
                                    }`}
                                >
                                    {previewEvaluation.finalClass}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                autoClose={true}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type="danger"
            />
        </div>
    )
}

export default function AvaliacaoFornecedoresPage() {
    return (
        <Suspense
            fallback={
                <MMCLoadingScreen
                    message="Carregando Avaliação de Fornecedores (F35)..."
                    submessage="Preparando formulário e indicadores de qualificação"
                />
            }
        >
            <AvaliacaoFornecedoresContent />
        </Suspense>
    )
}
