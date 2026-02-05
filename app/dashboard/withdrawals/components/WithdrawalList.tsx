"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Clock,
    CheckCircle,
    XCircle,
    Loader2 as LoaderIcon,
    Search,
    Calendar,
    Phone,
    DollarSign
} from "lucide-react";

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

interface WithdrawalListProps {
    withdrawals: Withdrawal[];
    onRefresh: () => void;
}

export function WithdrawalList({ withdrawals, onRefresh }: WithdrawalListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    // Ensure withdrawals is always an array
    const withdrawalsArray = Array.isArray(withdrawals) ? withdrawals : [];

    const filteredWithdrawals = withdrawalsArray.filter((withdrawal) => {
        const matchesSearch =
            withdrawal.mpesaPhone.includes(searchTerm) ||
            withdrawal.amount.toString().includes(searchTerm) ||
            (withdrawal.mpesaTransactionId && withdrawal.mpesaTransactionId.includes(searchTerm));

        const matchesStatus = statusFilter === "ALL" || withdrawal.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    label: "Pendente",
                    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
                    icon: Clock,
                };
            case "PROCESSING":
                return {
                    label: "Processando",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: LoaderIcon,
                };
            case "COMPLETED":
                return {
                    label: "Completado",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: CheckCircle,
                };
            case "FAILED":
                return {
                    label: "Falhado",
                    color: "bg-red-100 text-red-700 border-red-200",
                    icon: XCircle,
                };
            default:
                return {
                    label: status,
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    icon: Clock,
                };
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Histórico de Levantamentos</CardTitle>
                        <CardDescription>
                            {filteredWithdrawals.length} de {withdrawalsArray.length} levantamentos
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        Atualizar
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por telefone, valor ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === "ALL" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("ALL")}
                        >
                            Todos
                        </Button>
                        <Button
                            variant={statusFilter === "PENDING" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("PENDING")}
                        >
                            Pendentes
                        </Button>
                        <Button
                            variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("COMPLETED")}
                        >
                            Completados
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredWithdrawals.length === 0 ? (
                    <div className="text-center py-12">
                        <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Nenhum levantamento encontrado</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchTerm || statusFilter !== "ALL"
                                ? "Tente ajustar os filtros"
                                : "Você ainda não fez nenhum levantamento"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredWithdrawals.map((withdrawal) => {
                            const statusConfig = getStatusConfig(withdrawal.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={withdrawal.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${statusConfig.color}`}>
                                                <StatusIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-gray-900">
                                                    {withdrawal.amount.toFixed(2)} MT
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Receberá: {withdrawal.netAmount.toFixed(2)} MT
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{withdrawal.mpesaPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Taxa: {withdrawal.fee.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(withdrawal.createdAt).toLocaleDateString("pt-PT", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {withdrawal.mpesaTransactionId && (
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-xs text-gray-500">
                                                ID Transação: {withdrawal.mpesaTransactionId}
                                            </p>
                                        </div>
                                    )}

                                    {withdrawal.mpesaResultDesc && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-600">
                                                {withdrawal.mpesaResultDesc}
                                            </p>
                                        </div>
                                    )}

                                    {withdrawal.notes && (
                                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                                            {withdrawal.notes}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
