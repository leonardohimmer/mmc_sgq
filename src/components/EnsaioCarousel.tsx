"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Camera } from "lucide-react"

interface EnsaioCarouselProps {
    ensaioId: string
}

export function EnsaioCarousel({ ensaioId }: EnsaioCarouselProps) {
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("/api/site-content")
                if (res.ok) {
                    const data = await res.json()
                    if (data.ensaio_fotos && data.ensaio_fotos[ensaioId]) {
                        setImages(data.ensaio_fotos[ensaioId])
                    }
                }
            } catch (e) {
                console.error("Erro ao buscar fotos do ensaio:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchImages()
    }, [ensaioId])

    // Autoplay effect
    useEffect(() => {
        if (images.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [images])

    if (loading || images.length === 0) {
        return null
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    return (
        <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[2rem] p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white flex items-center justify-center gap-2">
                    <Camera className="text-primary w-6 h-6 sm:w-8 h-8" />
                    Galeria do Ensaio em Ação
                </h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold">
                    Veja registros fotográficos reais de nossa equipe executando este serviço.
                </p>
            </div>

            <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-200 dark:border-slate-800 group">
                {/* Imagens com Framer Motion */}
                <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`Foto do ensaio ${ensaioId} - ${currentIndex + 1}`}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    {/* Overlay Gradiente de Sombra */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />
                </div>

                {/* Botões de Navegação (aparecem ao passar o mouse) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md pointer-events-auto border border-white/10"
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md pointer-events-auto border border-white/10"
                            aria-label="Próxima foto"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Dots de Indicadores */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-slate-950/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        currentIndex === idx
                                            ? "bg-[#00bfa5] w-6"
                                            : "bg-white/50 hover:bg-white"
                                    }`}
                                    aria-label={`Ir para foto ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Contador de Imagens */}
                <div className="absolute top-6 right-6 bg-slate-950/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold font-mono border border-white/10">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    )
}
