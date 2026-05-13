import { motion } from 'framer-motion';
import { MailCheck, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

const isValidMagicLink = (value: string | null) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    const expectedOrigin = new URL(import.meta.env.VITE_SUPABASE_URL).origin;

    return url.origin === expectedOrigin && url.pathname === '/auth/v1/verify';
  } catch {
    return false;
  }
};

export default function MiRoadmapAccess() {
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');
  const tokenHash = searchParams.get('token_hash');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const redirectTo = searchParams.get('redirect_to') ?? '/mi-roadmap';
  const isReady = isValidMagicLink(next) || (!!type && (!!tokenHash || !!token));

  const handleManualAccess = async () => {
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
      if (!error) window.location.assign(redirectTo);
      return;
    }

    window.location.assign(next ?? '/mi-roadmap');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={anerfyLogo} alt="Anerfy" className="h-8 brightness-0 invert" />
        </div>

        <Card className="p-8 space-y-5">
          <div className="flex items-center gap-3">
            {isReady ? (
              <ShieldCheck className="w-6 h-6 text-primary" />
            ) : (
              <TriangleAlert className="w-6 h-6 text-destructive" />
            )}
            <div>
              <h1 className="text-xl font-semibold">Acceso seguro a tu roadmap</h1>
              <p className="text-sm text-muted-foreground">
                {isReady
                  ? 'Confirma manualmente para evitar que el enlace expire antes de tiempo.'
                  : 'Este enlace ya no es válido o expiró.'}
              </p>
            </div>
          </div>

          {isReady ? (
            <>
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                Algunos proveedores de email abren enlaces automáticamente. Por eso protegimos el acceso con este paso intermedio.
              </div>

              <Button onClick={handleManualAccess} className="w-full">
                <MailCheck className="w-4 h-4 mr-2" />
                Entrar a mi roadmap
              </Button>
            </>
          ) : (
            <Button asChild className="w-full">
              <Link to="/mi-roadmap">Pedir un nuevo enlace</Link>
            </Button>
          )}
        </Card>
      </motion.div>
    </div>
  );
}