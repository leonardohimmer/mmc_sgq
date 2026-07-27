import MMCLoadingScreen from "@/components/MMCLoadingScreen";

export default function Loading() {
    return (
        <MMCLoadingScreen
            message="Carregando Sistema SGQ..."
            submessage="Acessando fluxo produtivo e painel técnico MMC LAB"
            fullScreen={true}
        />
    );
}
