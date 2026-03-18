import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

export default function AuthPage() {
  const { user, loading: authLoading, signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #1a1040 100%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (user) return <Navigate to="/mapa" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setResetSent(true);
        toast({ title: '✉️ Email enviado', description: 'Revisa tu bandeja de entrada para resetear tu contraseña.' });
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast({ title: 'Error', description: 'Email o contraseña incorrectos.', variant: 'destructive' });
          } else {
            throw error;
          }
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ title: 'Ya registrado', description: 'Este email ya tiene cuenta. Inicia sesión.', variant: 'destructive' });
            setMode('login');
          } else {
            throw error;
          }
        } else {
          toast({ title: '🎉 ¡Cuenta creada!', description: 'Ya puedes acceder a tu roadmap personalizado.' });
        }
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Algo salió mal.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #1a1040 50%, #0d2137 100%)' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={anerfyLogo} alt="Anerfy" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'register' ? 'Crea tu cuenta' : 'Recuperar contraseña'}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {mode === 'login'
              ? 'Accede a tu roadmap de homologación'
              : mode === 'register'
              ? 'Tu camino a la Approbation empieza aquí'
              : 'Te enviaremos un link para resetear'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 h-12"
            />
          </div>

          {mode !== 'reset' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500/50 h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (mode === 'reset' && resetSent)}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === 'login' ? (
              <>Entrar <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : mode === 'register' ? (
              <>Crear cuenta <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : resetSent ? (
              '✉️ Email enviado'
            ) : (
              'Enviar link de reset'
            )}
          </Button>
        </form>

        {/* Mode toggle */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('reset')} className="text-xs text-white/40 hover:text-white/60 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-sm text-white/50">
                ¿No tienes cuenta?{' '}
                <button onClick={() => setMode('register')} className="text-blue-400 font-medium hover:text-blue-300">
                  Regístrate
                </button>
              </p>
            </>
          ) : (
            <p className="text-sm text-white/50">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => { setMode('login'); setResetSent(false); }} className="text-blue-400 font-medium hover:text-blue-300">
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
