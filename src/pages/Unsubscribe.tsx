import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, MailX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error';

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
        const res = await fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });
        const data = await res.json();
        if (!res.ok) { setStatus('invalid'); return; }
        if (data.valid === false && data.reason === 'already_unsubscribed') { setStatus('already'); return; }
        setStatus('valid');
      } catch { setStatus('invalid'); }
    })();
  }, [token]);

  async function handleUnsubscribe() {
    setStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', { body: { token } });
      if (error) { setStatus('error'); return; }
      if (data?.success) { setStatus('success'); }
      else if (data?.reason === 'already_unsubscribed') { setStatus('already'); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />}
        {status === 'valid' && (
          <>
            <MailX className="w-12 h-12 text-muted-foreground mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">Cancelar suscripción</h1>
            <p className="text-muted-foreground text-sm">¿Estás seguro de que deseas dejar de recibir correos de Anerfy?</p>
            <Button onClick={handleUnsubscribe} variant="destructive">Confirmar cancelación</Button>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">Suscripción cancelada</h1>
            <p className="text-muted-foreground text-sm">Ya no recibirás correos de nuestra parte.</p>
          </>
        )}
        {status === 'already' && (
          <>
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">Ya estás desuscrito</h1>
            <p className="text-muted-foreground text-sm">Tu email ya fue removido de nuestra lista.</p>
          </>
        )}
        {status === 'invalid' && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">Link inválido</h1>
            <p className="text-muted-foreground text-sm">Este enlace no es válido o ya expiró.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">Error</h1>
            <p className="text-muted-foreground text-sm">Ocurrió un error. Intenta de nuevo más tarde.</p>
          </>
        )}
      </div>
    </div>
  );
}
