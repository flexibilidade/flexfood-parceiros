"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, MapPin, Phone, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { onboardingService } from "@/lib/services/onboarding-service";
import { LocationPicker } from "@/components/location-picker";

type Session = {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export default function OnboardingClient({ session }: { session: Session }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        ownerName: session.user.name,
        ownerEmail: session.user.email,
        phone: "",
        ownerPhone: "",
        description: "",
        address: "",
        city: "Nampula",
        province: "Nampula",
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.name || !formData.phone) {
                toast.error("Preencha todos os campos obrigatórios");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
            address: address,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate location
        if (!formData.latitude || !formData.longitude) {
            toast.error("Por favor, selecione a localização do restaurante");
            return;
        }

        setIsLoading(true);

        try {
            await onboardingService.completeOnboarding({
                name: formData.name,
                description: formData.description,
                phone: formData.phone,
                ownerName: formData.ownerName,
                ownerEmail: formData.ownerEmail,
                ownerPhone: formData.ownerPhone,
                address: formData.address,
                city: formData.city,
                province: formData.province,
                country: "Moçambique",
                latitude: formData.latitude,
                longitude: formData.longitude,
            });

            toast.success("Cadastro concluído com sucesso!");
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Onboarding error:", err);
            const errorMessage =
                err?.response?.data?.error || "Erro ao concluir cadastro";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const provinces = ["Nampula"];
    const cities = ["Nampula"];

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50/30 to-white">
            <div className="flex items-center justify-center p-4 py-16">
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                flexfood
                            </span>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                            Configure seu negócio
                        </h1>
                        <p className="text-gray-600">
                            Passo {step} de 2 - Vamos começar com as informações básicas
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-2">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                            </div>
                            <div
                                className={`h-1 w-24 ${step >= 2 ? "bg-primary" : "bg-gray-200"
                                    }`}
                            ></div>
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                2
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome do Negócio *
                                        </label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Ex: Restaurante Sabor Moçambicano"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nome do Proprietário *
                                            </label>
                                            <input
                                                name="ownerName"
                                                type="text"
                                                required
                                                value={formData.ownerName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email do Proprietário *
                                            </label>
                                            <input
                                                name="ownerEmail"
                                                type="email"
                                                required
                                                value={formData.ownerEmail}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefone do Negócio *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="+258 84 123 4567"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefone do Proprietário
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    name="ownerPhone"
                                                    type="tel"
                                                    value={formData.ownerPhone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="+258 84 123 4567"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descrição do Negócio
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                            placeholder="Conte um pouco sobre seu negócio..."
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition-all font-semibold flex items-center justify-center gap-2"
                                    >
                                        Próximo
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Localização do Restaurante *
                                            </label>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Escolha a localização exata do seu restaurante para que os clientes possam encontrá-lo facilmente.
                                            </p>
                                        </div>

                                        <LocationPicker
                                            initialLat={formData.latitude || undefined}
                                            initialLng={formData.longitude || undefined}
                                            onLocationSelect={handleLocationSelect}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Província *
                                            </label>
                                            <select
                                                name="province"
                                                required
                                                value={formData.province}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                                                disabled
                                            >
                                                {provinces.map((prov) => (
                                                    <option key={prov} value={prov}>
                                                        {prov}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-1.5 text-xs text-gray-500">
                                                Disponível apenas em Nampula
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cidade *
                                            </label>
                                            <select
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                                                disabled
                                            >
                                                {cities.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-1.5 text-xs text-gray-500">
                                                Disponível apenas em Nampula
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-primary text-white py-3 rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "Processando..." : "Concluir Cadastro"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
