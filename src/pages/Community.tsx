import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Stethoscope, Building, Home, Users, MessageCircle } from 'lucide-react';

const categories = [
  { title: 'Preparación documentos', icon: <FileText className="w-6 h-6" />, posts: 234, latest: '¿Alguien ha apostillado en Perú?', time: 'hace 2h' },
  { title: 'Aprendiendo alemán', icon: <BookOpen className="w-6 h-6" />, posts: 567, latest: 'B2 vs C1 para FSP: ¿realmente necesario C1?', time: 'hace 5h', trending: true },
  { title: 'Preparando FSP', icon: <Stethoscope className="w-6 h-6" />, posts: 432, latest: 'Aprobé FSP Bayern: mis tips', time: 'hace 1d', hot: true },
  { title: 'Ya trabajando en Alemania', icon: <Building className="w-6 h-6" />, posts: 789, latest: 'Primer contrato: ¿esto es normal?', time: 'hace 3h' },
  { title: 'Vida en Alemania', icon: <Home className="w-6 h-6" />, posts: 345, latest: 'Integración social: ¿cómo hacer amigos alemanes?', time: 'hace 8h' },
];

export default function CommunityPage() {
  return (
    <div className="container max-w-3xl py-8 px-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Comunidad MEDICUS</h1>
        </div>
        <p className="text-muted-foreground">Conecta con otros médicos en el mismo camino.</p>
      </motion.div>

      <div className="grid gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-foreground">{cat.title}</h3>
                    {cat.trending && <Badge variant="secondary" className="text-xs">🔥 Trending</Badge>}
                    {cat.hot && <Badge variant="secondary" className="text-xs">🔥 Hot</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">"{cat.latest}"</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {cat.posts} posts</span>
                    <span>{cat.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-8 text-center shadow-card bg-muted/50">
        <p className="text-muted-foreground text-sm">🚧 Forum completo en desarrollo — ¡Pronto podrás participar!</p>
        <Button variant="outline" className="mt-4">Notificarme cuando esté listo</Button>
      </Card>
    </div>
  );
}
