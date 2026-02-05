"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { menuService, Category, Product } from "@/lib/services/menu-service";

type Session = {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export default function EditProductClient({
    session,
    productId,
}: {
    session: Session;
    productId: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        preparationTime: "",
        isAvailable: true,
    });

    useEffect(() => {
        loadCategories();
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            const data = await menuService.getProducts();
            const product = data.products.find((p) => p.id === productId);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: String(product.price),
                    categoryId: product.menuCategoryId,
                    preparationTime: String(product.preparationTime),
                    isAvailable: product.isAvailable,
                });
                if (product.imageUrl) {
                    setImagePreview(product.imageUrl);
                }
            } else {
                toast.error("Produto não encontrado");
                router.push("/dashboard/menu");
            }
        } catch (error) {
            toast.error("Erro ao carregar produto");
        } finally {
            setLoadingProduct(false);
        }
    };

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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await menuService.updateProduct(productId, {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                menuCategoryId: formData.categoryId,
                preparationTime: parseInt(formData.preparationTime),
                isAvailable: formData.isAvailable,
                imageFile: imageFile || undefined,
            });
            toast.success("Produto atualizado com sucesso!");
            router.push("/dashboard/menu");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao atualizar produto";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingProduct) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Carregando produto...</p>
            </div>
        );
    }

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
                <h1 className="text-xl font-bold text-gray-900 mb-2">Editar Produto</h1>
                <p className="text-gray-600">Atualize as informações do produto</p>
            </div>

            {/* Form */}
            <div className="max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto do Produto
                            </label>
                            {imagePreview ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
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
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
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
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ex: Pizza Margherita"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Descreva os ingredientes e características do produto..."
                            />
                        </div>

                        {/* Category and Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoria *
                                </label>
                                <select
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loadingCategories}
                                >
                                    <option value="">
                                        {loadingCategories ? "Carregando..." : "Selecione..."}
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preço (MZN) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Preparation Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tempo de Preparo (minutos) *
                            </label>
                            <input
                                type="number"
                                name="preparationTime"
                                required
                                min="1"
                                value={formData.preparationTime}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ex: 30"
                            />
                        </div>

                        {/* Availability */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                id="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                                Produto disponível para venda
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Link
                            href="/dashboard/menu"
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
