"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { menuService, Category } from "@/lib/services/menu-service";
import Image from "next/image";

type Session = {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export default function CategoriesClient({ session }: { session: Session }) {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await menuService.getCategories();
            setCategories(data.categories);
        } catch (error) {
            toast.error("Erro ao carregar categorias");
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await menuService.createCategory({
                name: categoryName,
                imageFile: imageFile || undefined,
            });
            toast.success("Categoria criada com sucesso!");
            setCategoryName("");
            setImageFile(null);
            setImagePreview(null);
            setShowModal(false);
            loadCategories();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao criar categoria";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

        try {
            await menuService.deleteCategory(id);
            toast.success("Categoria deletada com sucesso!");
            loadCategories();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao deletar categoria";
            toast.error(errorMessage);
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await menuService.updateCategory(id, { isAvailable: !currentStatus });
            toast.success("Status atualizado com sucesso!");
            loadCategories();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao atualizar status";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="py-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/dashboard/menu"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Cardápio
                </Link>
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    Categorias do Cardápio
                </h1>
                <p className="text-gray-600">
                    Organize seus produtos em categorias
                </p>
            </div>

            {/* Actions */}
            <div className="flex mb-6">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nova Categoria
                </button>
            </div>

            {/* Categories List */}
            {loadingCategories ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-600">Carregando categorias...</p>
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Nenhuma categoria cadastrada
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Crie categorias para organizar melhor seus produtos
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium"
                        >
                            Criar Primeira Categoria
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {category.imageUrl ? (
                                <div className="relative w-full h-40">
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                    <Plus className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {category._count?.products || 0} produtos
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAvailability(category.id, category.isAvailable)}
                                        className={`p-2 rounded-lg transition-colors ${category.isAvailable
                                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {category.isAvailable ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Nova Categoria
                        </h2>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagem da Categoria
                                </label>
                                {imagePreview ? (
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            Clique para fazer upload
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            PNG, JPG até 5MB
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome da Categoria *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Ex: Pratos Principais"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setCategoryName("");
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Criando..." : "Criar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
