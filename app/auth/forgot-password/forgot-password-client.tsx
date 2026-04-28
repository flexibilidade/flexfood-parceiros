"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", { email });

      if (response.data.status === "success") {
        toast.success("Código enviado!", {
          description: "Verifique seu email para o código de recuperação",
        });
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error("Erro", {
        description:
          error.response?.data?.message ||
          "Erro ao enviar código de recuperação",
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
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Flexfood</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Esqueceu sua senha?
          </h1>
          <p className="text-gray-600">
            Digite seu email para receber um código de recuperação
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>

          <div className="mt-6 text-center">
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
