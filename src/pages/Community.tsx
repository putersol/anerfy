import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const categories = [
  { title: 'Preparación documentos', posts: 234, latest: '¿Alguien ha apostillado en Perú?', time: 'hace 2h' },
  { title: 'Aprendiendo alemán', posts: 567, latest: 'B2 vs C1 para FSP: ¿realmente necesario C1?', time: 'hace 5h', trending: true },
  { title: 'Preparando FSP', posts: 432, latest: 'Aprobé FSP Bayern: mis tips', time: 'hace 1d', hot: true },
  { title: 'Ya trabajando en Alemania', posts: 789, latest: 'Primer contrato: ¿esto es normal?', time: 'hace 3h' },
  { title: 'Vida en Alemania', posts: 345, latest: 'Integración social: ¿cómo hacer amigos alemanes?', time: 'hace 8h' },
];

export default function CommunityPage() {
  return (
    <div className="container max-w-2xl py-6 sm:py-10 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Comunidad</h1>
        <p className="text-sm text-muted-foreground mt-1">Conecta con otros médicos en el mismo camino.</p>
      </motion.div>

      <div className="grid gap-2">
        {categories.map((cat, i) => (
          <motion.div key={cat.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-medium text-sm text-foreground">{cat.title}</h3>
                    {cat.trending && <Badge variant="secondary" className="text-[10px]">Trending</Badge>}
                    {cat.hot && <Badge variant="secondary" className="text-[10px]">Popular</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">"{cat.latest}"</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="w-3 h-3" /> {cat.posts}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{cat.time}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">Foro tipo Reddit en desarrollo — moderado por expertos.</p>
        <Button variant="outline" size="sm" className="mt-3 text-xs">Notificarme</Button>
      </div>
    </div>
  );
}
