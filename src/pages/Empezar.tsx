import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Loader2, Mail, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import FloatingShapes from "@/components/FloatingShapes";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";

type Step = "form" | "success";

export default function Empezar() {
  const [step, setStep] = useState<Step>("form");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Introduce un email válido.");
      return;
    }

    setLoading(true);

    const token = crypto.randomUUID();

    const { error: dbError } = await supabase
      .from("diagnostic_tokens")
      .insert({ token, email: email.trim().toLowerCase(), nombre: nombre.trim() });

    setLoading(false);

    if (dbError) {
      setError("Algo salió mal. Intenta de nuevo.");
      return;
    }

    setStep("success");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-background">
      <FloatingShapes />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={anerfyLogo} alt="Anerfy" className="h-8" />
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-3">
                  Descubre en qué punto está tu proceso hacia Alemania
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Un diagnóstico personalizado para médicos hispanohablantes. Sin rodeos.
                </p>
              </div>

              {/* Trust signals */}
              <div className="flex justify-center gap-4 mb-8 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  8 minutos
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Sin coste
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Resultado inmediato
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tu nombre</label>
                  <Input
                    type="text"
                    placeholder="Ej. María García"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="given-name"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tu email</label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Enviando..." : "Comenzar diagnóstico"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Recibirás tu link por email en segundos.
                </p>
              </form>

              {/* Social proof */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                Más de 200 médicos hispanohablantes ya conocen su ruta hacia Alemania
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <Mail className="w-7 h-7 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Revisa tu email
              </h2>
              <p className="text-muted-foreground mb-2">
                Te hemos enviado tu link de diagnóstico a
              </p>
              <p className="text-primary font-medium mb-6">{email}</p>
              <p className="text-sm text-muted-foreground">
                Si no lo ves en unos minutos, revisa la carpeta de spam.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
