import { Suspense } from "react";

export const metadata = {
  title: "Mapa de Entrega - flexfood",
  description: "Visualize a rota de entrega",
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>;
}
