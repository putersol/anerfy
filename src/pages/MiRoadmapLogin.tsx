import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

export default function MiRoadmapLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendLink = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Email inválido', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // Check if email exists in completed submissions first
    const { data: submissions } = await supabase
      .from('diagnostico_submissions')
      .select('submission_id, client_access_unlocked, updated_at')
      .ilike('email', email.trim())
      .eq('status', 'completed')
      .order('updated_at', { ascending: false });

    const submission =
      submissions?.find((s) => s.client_access_unlocked) ?? submissions?.[0];

    if (!submission) {
      toast({
        title: 'No encontramos tu diagnóstico',
        description: 'Asegúrate de haber completado el diagnóstico con este email.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (!submission.client_access_unlocked) {
      toast({
        title: 'Acceso aún no disponible',
        description: 'Tu roadmap se habilita después de tu asesoría de 90 min.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(`/mi-roadmap/${submission.submission_id}`);
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
            Accede a tu roadmap personalizado post-asesoría. Ingresa el email con el que completaste tu diagnóstico.
          </p>

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
                Acceder a mi roadmap
              </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
