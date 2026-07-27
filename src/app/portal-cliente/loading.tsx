import MMCLoadingScreen from "@/components/MMCLoadingScreen";

export default function Loading() {
    return (
        <MMCLoadingScreen
            message="Carregando Portal do Cliente..."
            submessage="Buscando seus ensaios e atualizações em tempo real"
            fullScreen={true}
        />
    );
}
