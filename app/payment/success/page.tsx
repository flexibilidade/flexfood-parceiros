"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Receipt,
  DollarSign,
  Home,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showAppPrompt, setShowAppPrompt] = useState(false);

  // Get parameters from URL
  const reference = searchParams.get("reference");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    setMounted(true);

    // Try to open the app via deep link
    const deepLink = `flexfood://payment/success?reference=${reference}&amount=${amount}&orderId=${orderId}`;

    // Attempt to open the app
    const timeout = setTimeout(() => {
      // If still on page after 2 seconds, app is not installed
      setShowAppPrompt(true);
    }, 2000);

    // Try to open deep link
    window.location.href = deepLink;

    return () => clearTimeout(timeout);
  }, [reference, amount, orderId]);

  if (!mounted) {
    return null;
  }

  const handleOpenApp = () => {
    const deepLink = `flexfood://payment/success?reference=${reference}&amount=${amount}&orderId=${orderId}`;
    window.location.href = deepLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* App Prompt Banner */}
      {showAppPrompt && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white rounded-xl shadow-2xl p-4 z-50"
        >
          <div className="flex items-start gap-3">
            <Smartphone className="w-6 h-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Abrir no App flexfood</h3>
              <p className="text-sm text-blue-100 mb-3">
                Tenha uma melhor experiência no aplicativo
              </p>
              <button
                onClick={handleOpenApp}
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
              >
                Abrir App
              </button>
            </div>
            <button
              onClick={() => setShowAppPrompt(false)}
              className="text-white hover:text-blue-100"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-green-500 rounded-full p-8 shadow-2xl">
              <CheckCircle className="w-24 h-24 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl md:text-xl font-bold text-gray-900 mb-4">
            Parabéns!
          </h1>
          <p className="text-xl text-gray-600">
            Pagamento realizado com sucesso
          </p>
        </motion.div>

        {/* Payment Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          {/* Reference */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Referência do Pagamento
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900 ml-11">
              {reference || "N/A"}
            </p>
          </div>

          {/* Amount */}
          {amount && (
            <>
              <div className="border-t border-gray-200 my-6" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Valor Pago
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600 ml-11">
                  {parseFloat(amount).toFixed(2)} MT
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">ℹ️</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Próximos Passos
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Seu pedido foi confirmado e está sendo preparado. Você receberá
                notificações sobre o status do pedido. Pode fechar esta janela e
                voltar ao aplicativo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => handleOpenApp()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <Home className="w-5 h-5" />
            <span>Voltar ao app</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Pode fechar esta janela e voltar ao aplicativo flexfood
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
