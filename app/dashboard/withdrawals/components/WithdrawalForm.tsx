"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WithdrawalFormProps {
    availableBalance: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function WithdrawalForm({ availableBalance, onSuccess, onCancel }: WithdrawalFormProps) {
    const [amount, setAmount] = useState("");
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const calculateFee = (value: number) => {
        return value * 0.01; // 1%
    };

    const calculateNetAmount = (value: number) => {
        return value - calculateFee(value);
    };

    const parsedAmount = parseFloat(amount) || 0;
    const fee = calculateFee(parsedAmount);
    const netAmount = calculateNetAmount(parsedAmount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validations
        if (parsedAmount < 100) {
            toast.error("Valor mínimo é 100 MT");
            return;
        }

        if (parsedAmount > availableBalance) {
            toast.error("Saldo insuficiente");
            return;
        }

        if (!mpesaPhone || mpesaPhone.length < 9) {
            toast.error("Número de telefone inválido");
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/partners/withdrawals", {
                amount: parsedAmount,
                mpesaPhone,
            });
            onSuccess();
        } catch (error: any) {
            console.error("Error creating withdrawal:", error);
            toast.error(error.response?.data?.message || "Erro ao criar pedido de levantamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Pedido de Levantamento</CardTitle>
                <CardDescription>
                    Preencha os dados abaixo para solicitar um levantamento
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Valor a Levantar (MT)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="100.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="100"
                            max={availableBalance}
                            step="0.01"
                            required
                        />
                        <p className="text-sm text-gray-600">
                            Disponível: {availableBalance.toFixed(2)} MT • Mínimo: 100 MT
                        </p>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Número Mpesa</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="84XXXXXXX ou 85XXXXXXX"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            required
                        />
                        <p className="text-sm text-gray-600">
                            O dinheiro será enviado para este número via Mpesa
                        </p>
                    </div>

                    {/* Calculation Summary */}
                    {parsedAmount >= 100 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm font-medium text-blue-900">
                                        Resumo do Levantamento
                                    </p>
                                    <div className="space-y-1 text-sm text-blue-800">
                                        <div className="flex justify-between">
                                            <span>Valor solicitado:</span>
                                            <span className="font-medium">{parsedAmount.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Taxa (1%):</span>
                                            <span className="font-medium">-{fee.toFixed(2)} MT</span>
                                        </div>
                                        <div className="flex justify-between border-t border-blue-300 pt-1 mt-1">
                                            <span className="font-bold">Você receberá:</span>
                                            <span className="font-bold text-lg">{netAmount.toFixed(2)} MT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-900">Importante</p>
                                <p className="text-sm text-yellow-800 mt-1">
                                    Os levantamentos são processados automaticamente todos os dias às 04:00.
                                    O dinheiro será enviado para o número Mpesa informado.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || parsedAmount < 100 || parsedAmount > availableBalance}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                "Solicitar Levantamento"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
