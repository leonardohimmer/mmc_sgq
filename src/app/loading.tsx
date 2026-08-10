import MMCLoadingScreen from "@/components/MMCLoadingScreen";

export default function Loading() {
  return (
    <MMCLoadingScreen
      message="Carregando portal MMC LAB..."
      submessage="Sincronizando seus dados com máxima velocidade"
      fullScreen={true}
    />
  );
}
