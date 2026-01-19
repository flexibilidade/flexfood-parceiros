"use client";

import { useSocket } from "@/contexts/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

export function EnableSoundButton() {
  const { audioEnabled, enableAudio } = useSocket();

  // Don't show if already enabled
  if (audioEnabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          onClick={enableAudio}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm animate-pulse"
        >
          <Volume2 className="w-5 h-5 mr-2" />
          Habilitar Som
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
