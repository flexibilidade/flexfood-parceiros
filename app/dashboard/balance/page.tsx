"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2, Wallet, TrendingUp, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface BalanceData {
    balance: number;
    totalEarned: number;
    pendingBalance: number;
    availableForWithdrawal: number;
    recentTransactions: Array<{
        id: string;
        type: string;
        amount: number;
        description: string;
        createdAt: string;
    }>;
    recentWithdrawals: Array<{
        id: string;
        amount: number;
        status: string;
        createdAt: string;
    }>;
}

export default function BalancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [balanceData, setBalanceData] = useState<BalanceData | null>(null);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/partners/balance");
            console.log("Balance response:", response.data);
            
            // O backend retorna { success: true, data: { balance, totalEarnings, ... } }
            if (response.data.success && response.data.data) {
                setBalanceData({
                    balance: response.data.data.balance,
                    totalEarned: response.data.data.totalEarnings,
                    pendingBalance: response.data.data.pendingBalance,
                    availableForWithdrawal: response.data.data.availableForWithdrawal,
                    recentTransactions: response.data.data.recentTransactions || [],
                    recentWithdrawals: response.data.data.recentWithdrawals || [],
                });
            } else {
                toast.error("Formato de resposta inválido");
            }
        } catch (error: any) {
            console.error("Error fetching balance:", error);
            toast.error(error.response?.data?.message || "Erro ao carregar saldo");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!balanceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Erro ao carregar dados</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 md:py-6 space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-xl font-bold text-gray-900">Meu Saldo</h1>
                    <p className="text-gray-600 mt-1">Gerencie seus ganhos e levantamentos</p>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Available Balance */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-green-100">Saldo Disponível</CardDescription>
                        <CardTitle className="text-xl font-bold">
                            {(balanceData.balance || 0).toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => router.push("/dashboard/withdrawals")}
                            className="w-full bg-white text-green-600 hover:bg-green-50"
                        >
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Levantar Dinheiro
                        </Button>
                    </CardContent>
                </Card>

                {/* Total Earned */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Total Ganho</CardDescription>
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {(balanceData.totalEarned || 0).toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">Desde o início</p>
                    </CardContent>
                </Card>

                {/* Pending Balance */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Saldo Pendente</CardDescription>
                            <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {(balanceData.pendingBalance || 0).toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">Pedidos não entregues</p>
                    </CardContent>
                </Card>

                {/* Available for Withdrawal */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription>Disponível p/ Levantar</CardDescription>
                            <Wallet className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {(balanceData.availableForWithdrawal || 0).toFixed(2)} MT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">Mínimo: 100 MT</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            {balanceData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Transações Recentes</CardTitle>
                        <CardDescription>Últimas movimentações na sua conta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!balanceData.recentTransactions || balanceData.recentTransactions.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Nenhuma transação ainda</p>
                        ) : (
                            <div className="space-y-3">
                                {balanceData.recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${transaction.type === "ORDER_EARNING"
                                                ? "bg-green-100"
                                                : transaction.type === "WITHDRAWAL"
                                                    ? "bg-red-100"
                                                    : "bg-gray-100"
                                                }`}>
                                                <DollarSign className={`h-4 w-4 ${transaction.type === "ORDER_EARNING"
                                                    ? "text-green-600"
                                                    : transaction.type === "WITHDRAWAL"
                                                        ? "text-red-600"
                                                        : "text-gray-600"
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(transaction.createdAt).toLocaleDateString("pt-PT", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${transaction.type === "ORDER_EARNING"
                                            ? "text-green-600"
                                            : transaction.type === "WITHDRAWAL"
                                                ? "text-red-600"
                                                : "text-gray-600"
                                            }`}>
                                            {transaction.type === "WITHDRAWAL" ? "-" : "+"}
                                            {transaction.amount.toFixed(2)} MT
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Recent Withdrawals */}
            {balanceData && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Levantamentos Recentes</CardTitle>
                                <CardDescription>Últimos pedidos de levantamento</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/dashboard/withdrawals")}
                            >
                                Ver Todos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!balanceData.recentWithdrawals || balanceData.recentWithdrawals.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Nenhum levantamento ainda</p>
                        ) : (
                            <div className="space-y-3">
                                {balanceData.recentWithdrawals.map((withdrawal) => (
                                    <div
                                        key={withdrawal.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {withdrawal.amount.toFixed(2)} MT
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(withdrawal.createdAt).toLocaleDateString("pt-PT", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${withdrawal.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : withdrawal.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : withdrawal.status === "PROCESSING"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                            {withdrawal.status === "COMPLETED"
                                                ? "Completado"
                                                : withdrawal.status === "PENDING"
                                                    ? "Pendente"
                                                    : withdrawal.status === "PROCESSING"
                                                        ? "Processando"
                                                        : "Falhado"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
