import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";
import Diagnostico from "./Diagnostico";

function StatusScreen({
  icon,
  title,
  description,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f1729]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-md space-y-6"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src={anerfyLogo}
            alt="Anerfy"
            className="w-8 h-8 brightness-0 invert object-contain scale-[1.6]"
          />
          <span className="text-sm font-bold tracking-[0.35em] text-white/80">
            ANERFY
          </span>
        </div>

        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border ${iconColor}`}
        >
          {icon}
        </div>

        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 leading-relaxed">{description}</p>

        <Link to="/">
          <Button
            variant="outline"
            className="border-white/10 text-slate-300 hover:bg-white/5 mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function DiagnosticoGated() {
  const { token } = useParams<{ token: string }>();
  const { status, data } = useTokenValidation(token);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1729]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <StatusScreen
        icon={<ShieldX className="w-10 h-10 text-red-400" />}
        iconColor="bg-red-500/15 border-red-500/30"
        title="Link inválido"
        description="Este link de diagnóstico no existe o no es válido. Si crees que es un error, contacta al equipo de Anerfy."
      />
    );
  }

  if (status === "used") {
    return (
      <StatusScreen
        icon={<CheckCircle2 className="w-10 h-10 text-emerald-400" />}
        iconColor="bg-emerald-500/15 border-emerald-500/30"
        title="Diagnóstico completado"
        description="Ya completaste tu diagnóstico migratorio. Revisa tu email para los próximos pasos y acceso a tu roadmap personalizado."
      />
    );
  }

  if (status === "expired") {
    return (
      <StatusScreen
        icon={<Clock className="w-10 h-10 text-amber-400" />}
        iconColor="bg-amber-500/15 border-amber-500/30"
        title="Link expirado"
        description="Este link de diagnóstico ha expirado. Contacta al equipo de Anerfy para obtener uno nuevo."
      />
    );
  }

  // Valid! Render the actual diagnostico with token context
  return <Diagnostico tokenData={data!} />;
}
