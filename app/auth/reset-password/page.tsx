import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white flex items-center justify-center"><div className="animate-pulse text-gray-600">Carregando...</div></div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
