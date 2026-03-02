"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Key, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function ResetPasswordClient() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      if (response.data.status === "success") {
        toast.success("Senha redefinida com sucesso!", {
          description: "Você já pode fazer login com sua nova senha",
        });
        router.push("/auth");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error("Erro", {
        description: error.response?.data?.message || "Erro ao redefinir senha",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/auth" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Flexcursos</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Redefinir Senha
          </h1>
          <p className="text-gray-600">
            Digite o código recebido por email e sua nova senha
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="code">Código de Recuperação</Label>
              <div className="relative mt-2">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-11 font-mono text-center tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Código de 6 dígitos enviado para seu email
              </p>
            </div>

            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-11"
                  placeholder="••••••••"
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11"
                  placeholder="••••••••"
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Mínimo de 8 caracteres
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              href="/auth/forgot-password"
              className="block text-sm text-primary hover:underline"
            >
              Não recebeu o código? Reenviar
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
