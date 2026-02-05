"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Grid, List, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { menuService, Product } from "@/lib/services/menu-service";
import { toast } from "sonner";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Session = {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export default function MenuClient({ session }: { session: Session }) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await menuService.getProducts();
            setProducts(data.products);
        } catch (error) {
            toast.error("Erro ao carregar produtos");
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await menuService.updateProduct(id, { isAvailable: !currentStatus });
            toast.success("Status atualizado com sucesso!");
            loadProducts();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao atualizar status";
            toast.error(errorMessage);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Tem certeza que deseja deletar este produto?")) return;

        try {
            await menuService.deleteProduct(id);
            toast.success("Produto deletado com sucesso!");
            loadProducts();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Erro ao deletar produto";
            toast.error(errorMessage);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Cardápio</h1>
                <p className="text-gray-600">
                    Gerencie suas categorias e produtos
                </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div>
                    <div className="md:flex-1  max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg border transition-colors ${viewMode === "list"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg border transition-colors ${viewMode === "grid"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>

                    <Link
                        href="/dashboard/menu/categories"
                        className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Categorias
                    </Link>

                    <Link
                        href="/dashboard/menu/products/new"
                        className="px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Produto
                    </Link>
                </div>
            </div>

            {/* Products List */}
            {loadingProducts ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-600">Carregando produtos...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery
                                ? "Tente buscar com outros termos"
                                : "Comece adicionando categorias e produtos ao seu cardápio"}
                        </p>
                        {!searchQuery && (
                            <div className="flex items-center justify-center gap-3">
                                <Link
                                    href="/dashboard/menu/categories"
                                    className="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Criar Categoria
                                </Link>
                                <Link
                                    href="/dashboard/menu/products/new"
                                    className="px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium"
                                >
                                    Adicionar Produto
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {product.imageUrl ? (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                    <Plus className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {product.menuCategory?.name}
                                        </p>
                                        <p className="text-lg font-bold text-primary">
                                            {product.price.toFixed(2)} MZN
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAvailability(product.id, product.isAvailable)}
                                        className={`p-2 rounded-lg transition-colors ${product.isAvailable
                                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {product.isAvailable ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">
                                    Preparo: {product.preparationTime} min
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/menu/products/${product.id}`}
                                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
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
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Produto
                                </TableHead>
                                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoria
                                </TableHead>
                                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preço
                                </TableHead>
                                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preparo
                                </TableHead>
                                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </TableHead>
                                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Plus className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">
                                                {product.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                                        {product.menuCategory?.name}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm font-semibold text-primary">
                                        {product.price.toFixed(2)} MZN
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                                        {product.preparationTime} min
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleAvailability(product.id, product.isAvailable)}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.isAvailable
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {product.isAvailable ? (
                                                <>
                                                    <Eye className="w-3 h-3" />
                                                    Disponível
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3 h-3" />
                                                    Indisponível
                                                </>
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/menu/products/${product.id}`}
                                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
