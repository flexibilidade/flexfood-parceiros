"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, TrendingUp, Package, DollarSign, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface OrderEarning {
    id: string;
    orderNumber: number;
    deliveredAt: string;
    distance: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    partnerEarnings: number;
    deliverymanEarnings: number;
    platformEarnings: number;
    customerName: string;
}

export default function EarningsPage() {
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState<OrderEarning[]>([]);
    const [filteredEarnings, setFilteredEarnings] = useState<OrderEarning[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchEarnings();
    }, []);

    useEffect(() => {
        filterEarnings();
    }, [earnings, startDate, endDate]);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/partners/earnings");
            setEarnings(response.data.earnings || []);
        } catch (error: any) {
            console.error("Error fetching earnings:", error);
            toast.error(error.response?.data?.message || "Erro ao carregar ganhos");
        } finally {
            setLoading(false);
        }
    };

    const filterEarnings = () => {
        let filtered = [...earnings];

        if (startDate) {
            filtered = filtered.filter(
                (e) => new Date(e.deliveredAt) >= new Date(startDate)
            );
        }

        if (endDate) {
            filtered = filtered.filter(
                (e) => new Date(e.deliveredAt) <= new Date(endDate)
            );
        }

        setFilteredEarnings(filtered);
    };

    const calculateTotals = () => {
        return filteredEarnings.reduce(
            (acc, earning) => ({
                totalOrders: acc.totalOrders + 1,
                totalRevenue: acc.totalRevenue + earning.partnerEarnings,
                totalDeliveryFees: acc.totalDeliveryFees + earning.deliveryFee,
                totalSales: acc.totalSales + earning.total,
            }),
            { totalOrders: 0, totalRevenue: 0, totalDeliveryFees: 0, totalSales: 0 }
        );
    };

    const totals = calculateTotals();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 md:py-6 space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-xl font-bold text-gray-900">Histórico de Ganhos</h1>
                    <p className="text-gray-600 mt-1">Veja todos os seus pedidos e ganhos</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Total de Pedidos</CardDescription>
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {totals.totalOrders}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Vendas Totais</CardDescription>
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {totals.totalSales.toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Seu Ganho</CardDescription>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-green-600">
                            {totals.totalRevenue.toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Taxas de Entrega</CardDescription>
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {totals.totalDeliveryFees.toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Filtre por período</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Data Início</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Data Fim</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="w-full"
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings List */}
            <Card>
                <CardHeader>
                    <CardTitle>Pedidos Completados</CardTitle>
                    <CardDescription>
                        {filteredEarnings.length} {filteredEarnings.length === 1 ? "pedido" : "pedidos"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredEarnings.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Nenhum pedido encontrado</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {startDate || endDate
                                    ? "Tente ajustar os filtros"
                                    : "Você ainda não completou nenhum pedido"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEarnings.map((earning) => (
                                <div
                                    key={earning.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">
                                                Pedido #{earning.orderNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Cliente: {earning.customerName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-green-600">
                                                +{earning.partnerEarnings.toFixed(2)} MT
                                            </p>
                                            <p className="text-xs text-gray-500">Seu ganho</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(earning.deliveredAt).toLocaleDateString("pt-PT", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>{earning.distance.toFixed(1)} km</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Taxa: {earning.deliveryFee.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Package className="h-4 w-4" />
                                            <span>Total: {earning.total.toFixed(2)} MT</span>
                                        </div>
                                    </div>

                                    {/* Financial Breakdown */}
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Produtos:</span>
                                            <span className="font-medium">{earning.subtotal.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taxa de Entrega:</span>
                                            <span className="font-medium">{earning.deliveryFee.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                                            <span className="text-gray-600">Seu Ganho:</span>
                                            <span className="font-bold text-green-600">{earning.partnerEarnings.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Entregador:</span>
                                            <span>{earning.deliverymanEarnings.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Plataforma:</span>
                                            <span>{earning.platformEarnings.toFixed(2)} MT</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
