import MMCLoadingScreen from "@/components/MMCLoadingScreen";

export default function SGQLoading() {
  return (
    <MMCLoadingScreen
      message="Carregando módulo SGQ..."
      submessage="Sincronizando processos, solicitações e indicadores"
      fullScreen={true}
    />
  );
}
