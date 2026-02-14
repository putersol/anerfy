import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, MapPin, Calendar, TrendingUp, Wallet, BookOpen, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const spendingData = [
  { name: 'Traducciones', value: 800 },
  { name: 'Cursos alemán', value: 1400 },
  { name: 'Tasas', value: 500 },
  { name: 'Vivienda', value: 500 },
];
const colors = ['hsl(222,80%,40%)', 'hsl(160,84%,39%)', 'hsl(38,92%,50%)', 'hsl(270,60%,50%)'];

export default function ProfilePage() {
  return (
    <div className="container max-w-3xl py-8 px-4 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Dr. Juan Pérez</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" /> México → Berlín
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" /> En Alemania desde: Marzo 2025
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress */}
        <Card className="p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Progreso</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso total</span>
              <span className="font-bold text-foreground">75%</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Próximos pasos:</p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>FSP examen — 15.04.2026</li>
              <li>Buscar Berufserlaubnis</li>
              <li>Optimizar Steuerklasse</li>
            </ol>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Línea de tiempo</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground">Inicio</p>
              <p className="font-bold text-foreground">Enero 2025</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground">Approbation est.</p>
              <p className="font-bold text-foreground">Julio 2026</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground">Transcurrido</p>
              <p className="font-bold text-foreground">6 meses</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground">Restante</p>
              <p className="font-bold text-foreground">5-7 meses</p>
            </div>
          </div>
        </Card>

        {/* Budget */}
        <Card className="p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Presupuesto</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">€3.200 / €6.500</span>
              <span className="font-bold text-foreground">49%</span>
            </div>
            <Progress value={49} className="h-3" />
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendingData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                  {spendingData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`€${v}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Mis Servicios</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Profesora Leipzig</p>
                <p className="text-xs text-secondary font-medium">Activo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Hispano Akademie</p>
                <p className="text-xs text-accent font-medium">Pendiente cita</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Button variant="outline" className="w-full h-11">
        <Edit className="w-4 h-4 mr-2" /> Editar perfil
      </Button>
    </div>
  );
}
