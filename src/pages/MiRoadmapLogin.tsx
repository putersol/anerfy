import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

export default function MiRoadmapLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSendLink = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Email inválido', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // Check if email exists in completed submissions first
    const { data: submission } = await supabase
      .from('diagnostico_submissions')
      .select('submission_id')
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'completed')
      .maybeSingle();

    if (!submission) {
      toast({
        title: 'No encontramos tu diagnóstico',
        description: 'Asegúrate de haber completado el diagnóstico con este email.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/mi-roadmap/${submission.submission_id}`,
      },
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Error al enviar el link', description: error.message, variant: 'destructive' });
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={anerfyLogo} alt="Anerfy" className="h-8 brightness-0 invert" />
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold">Mi Roadmap Personalizado</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Accede a tu roadmap personalizado post-asesoría. Te enviaremos un link mágico al email con el que completaste tu diagnóstico.
          </p>

          {sent ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-success mb-3" />
              <h2 className="font-semibold mb-1">Link enviado</h2>
              <p className="text-sm text-muted-foreground">
                Revisa tu email <strong>{email}</strong> y haz click en el link para acceder.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Tu email</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLink()}
                />
              </div>
              <Button onClick={handleSendLink} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Enviar link de acceso
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
