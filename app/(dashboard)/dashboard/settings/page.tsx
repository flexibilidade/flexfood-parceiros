import { Metadata } from "next";
import SettingsClient from "./settings-client";

export const metadata: Metadata = {
  title: "Configurações | flexfood Partners",
  description: "Gerencie as configurações do seu restaurante",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
