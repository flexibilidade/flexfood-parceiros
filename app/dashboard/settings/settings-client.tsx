"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Store, Clock, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { partnerService } from "@/lib/services/partner-service";
import { LocationPicker } from "@/components/location-picker";

interface PartnerSettings {
  availability: "OPEN" | "CLOSED" | "BUSY";
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  photoUrl?: string;
  bannerUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export default function SettingsClient() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [settings, setSettings] = useState<PartnerSettings>({
    availability: "CLOSED",
    name: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    photoUrl: "",
    bannerUrl: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await partnerService.getPartnerProfile();

      setSettings({
        availability: data.availability || "CLOSED",
        name: data.name || "",
        description: data.description || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        province: data.province || "",
        photoUrl: data.photoUrl || "",
        bannerUrl: data.bannerUrl || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await partnerService.updatePartnerProfile({
        name: settings.name,
        description: settings.description,
        phone: settings.phone,
        address: settings.address,
        city: settings.city,
        province: settings.province,
        latitude: settings.latitude ?? undefined,
        longitude: settings.longitude ?? undefined,
      });
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityToggle = async (checked: boolean) => {
    const newAvailability = checked ? "OPEN" : "CLOSED";

    try {
      await partnerService.updatePartnerProfile({
        availability: newAvailability,
      });

      setSettings((prev) => ({
        ...prev,
        availability: newAvailability,
      }));

      toast.success(
        checked
          ? "Restaurante aberto para pedidos"
          : "Restaurante fechado para pedidos"
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Erro ao atualizar disponibilidade");
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const response = await partnerService.uploadPartnerPhoto(file);

      setSettings((prev) => ({
        ...prev,
        photoUrl: response.photoUrl,
      }));

      toast.success("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Erro ao fazer upload da foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    try {
      setUploadingBanner(true);
      const response = await partnerService.uploadPartnerBanner(file);

      setSettings((prev) => ({
        ...prev,
        bannerUrl: response.bannerUrl,
      }));

      toast.success("Banner atualizado com sucesso!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Erro ao fazer upload do banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSettings((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do seu restaurante
        </p>
      </div>

      {/* Disponibilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Disponibilidade
          </CardTitle>
          <CardDescription>
            Controle se seu restaurante está aceitando pedidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="availability" className="text-base font-medium">
                Restaurante{" "}
                {settings.availability === "OPEN" ? "Aberto" : "Fechado"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {settings.availability === "OPEN"
                  ? "Seu restaurante está aceitando pedidos"
                  : "Seu restaurante não está aceitando pedidos"}
              </p>
            </div>
            <Switch
              id="availability"
              checked={settings.availability === "OPEN"}
              onCheckedChange={handleAvailabilityToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Foto do Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Foto do Restaurante
          </CardTitle>
          <CardDescription>
            Adicione ou atualize a foto do seu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-6">
            {/* Preview da foto */}
            <div className="flex-shrink-0">
              {settings.photoUrl ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={settings.photoUrl}
                    alt="Foto do restaurante"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <Store className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload button */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="photo-upload" className="text-sm font-medium">
                Escolha uma foto
              </Label>
              <p className="text-sm text-muted-foreground">
                Recomendamos uma imagem quadrada de pelo menos 400x400px. Máximo
                5MB.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingPhoto}
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 mr-2" />
                      Escolher Foto
                    </>
                  )}
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner do Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Banner do Restaurante
          </CardTitle>
          <CardDescription>
            Adicione ou atualize o banner do seu restaurante (aparece no topo)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Preview do banner */}
            {settings.bannerUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={settings.bannerUrl}
                  alt="Banner do restaurante"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <Store className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Upload button */}
            <div className="space-y-2">
              <Label htmlFor="banner-upload" className="text-sm font-medium">
                Escolha um banner
              </Label>
              <p className="text-sm text-muted-foreground">
                Recomendamos uma imagem de 1200x400px ou similar. Máximo 5MB.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingBanner}
                  onClick={() =>
                    document.getElementById("banner-upload")?.click()
                  }
                >
                  {uploadingBanner ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 mr-2" />
                      Escolher Banner
                    </>
                  )}
                </Button>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localização do Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização do Restaurante
          </CardTitle>
          <CardDescription>
            Defina a localização exata do seu restaurante para cálculo de entregas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationPicker
            initialLat={settings.latitude ?? undefined}
            initialLng={settings.longitude ?? undefined}
            onLocationSelect={handleLocationSelect}
          />
        </CardContent>
      </Card>

      {/* Informações do Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Informações do Restaurante
          </CardTitle>
          <CardDescription>
            Atualize as informações básicas do seu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Restaurante</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nome do seu restaurante"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descreva seu restaurante..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+258 84 000 0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização
          </CardTitle>
          <CardDescription>Endereço do seu restaurante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Rua, número, bairro..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Nampula"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Província</Label>
              <Input
                id="province"
                value={settings.province}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, province: e.target.value }))
                }
                placeholder="Nampula"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
