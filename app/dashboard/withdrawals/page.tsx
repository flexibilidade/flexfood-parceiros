"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalForm } from "./components/WithdrawalForm";
import { WithdrawalList } from "./components/WithdrawalList";
import { toast } from "sonner";

interface BalanceData {
    balance: number;
    availableForWithdrawal: number;
}

interface Withdrawal {
    id: string;
    amount: number;
    fee: number;
    netAmount: number;
    mpesaPhone: string;
    status: string;
    createdAt: string;
    processedAt: string | null;
    completedAt: string | null;
    mpesaTransactionId: string | null;
    mpesaResultDesc: string | null;
    notes: string | null;
}

export default function WithdrawalsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [balanceResponse, withdrawalsResponse] = await Promise.all([
                api.get("/api/partners/balance"),
                api.get("/api/partners/withdrawals"),
            ]);

            console.log("Balance response:", balanceResponse.data);
            console.log("Withdrawals response:", withdrawalsResponse.data);

            setBalanceData(balanceResponse.data);
            setWithdrawals(withdrawalsResponse.data);
        } catch (error: any) {
            console.error("Error fetching data:", error);
            toast.error(error.response?.data?.message || "Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawalSuccess = () => {
        setShowForm(false);
        fetchData();
        toast.success("Pedido de levantamento criado com sucesso!");
    };

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
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard/balance")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Levantamentos</h1>
                        <p className="text-gray-600 mt-1">Solicite e acompanhe seus levantamentos</p>
                    </div>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Levantamento
                    </Button>
                )}
            </div>

            {/* Balance Info */}
            {balanceData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Saldo Disponível</CardDescription>
                            <CardTitle className="text-3xl font-bold text-green-600">
                                {(balanceData.balance || 0).toFixed(2)} MT
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Disponível para Levantar</CardDescription>
                            <CardTitle className="text-3xl font-bold text-blue-600">
                                {(balanceData.availableForWithdrawal || 0).toFixed(2)} MT
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Valor mínimo: 100 MT • Taxa: 1%
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Withdrawal Form */}
            {showForm && balanceData && (
                <WithdrawalForm
                    availableBalance={balanceData.availableForWithdrawal || 0}
                    onSuccess={handleWithdrawalSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Withdrawals List */}
            <WithdrawalList withdrawals={withdrawals} onRefresh={fetchData} />
        </div>
    );
}
