import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, MapPin, Calendar, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const spendingData = [
  { name: 'Traducciones', value: 800 },
  { name: 'Cursos alemán', value: 1400 },
  { name: 'Tasas', value: 500 },
  { name: 'Vivienda', value: 500 },
];
const grays = ['hsl(0,0%,15%)', 'hsl(0,0%,35%)', 'hsl(0,0%,55%)', 'hsl(0,0%,75%)'];

export default function ProfilePage() {
  return (
    <div className="container max-w-2xl py-6 sm:py-10 px-4 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">Dr. Juan Pérez</h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" /> México → Berlín
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> Desde marzo 2025
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Progress */}
        <Card className="p-5 shadow-card space-y-3">
          <h2 className="font-display text-sm font-medium text-foreground">Progreso</h2>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium text-foreground">75%</span>
            </div>
            <Progress value={75} className="h-1.5" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Próximos pasos:</p>
            <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-0.5">
              <li>FSP examen — 15.04.2026</li>
              <li>Buscar Berufserlaubnis</li>
              <li>Optimizar Steuerklasse</li>
            </ol>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-5 shadow-card space-y-3">
          <h2 className="font-display text-sm font-medium text-foreground">Línea de tiempo</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted rounded-lg p-2.5">
              <p className="text-muted-foreground">Inicio</p>
              <p className="font-medium text-foreground">Enero 2025</p>
            </div>
            <div className="bg-muted rounded-lg p-2.5">
              <p className="text-muted-foreground">Approbation est.</p>
              <p className="font-medium text-foreground">Julio 2026</p>
            </div>
            <div className="bg-muted rounded-lg p-2.5">
              <p className="text-muted-foreground">Transcurrido</p>
              <p className="font-medium text-foreground">6 meses</p>
            </div>
            <div className="bg-muted rounded-lg p-2.5">
              <p className="text-muted-foreground">Restante</p>
              <p className="font-medium text-foreground">5–7 meses</p>
            </div>
          </div>
        </Card>

        {/* Budget */}
        <Card className="p-5 shadow-card space-y-3">
          <h2 className="font-display text-sm font-medium text-foreground">Presupuesto</h2>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">€3.200 / €6.500</span>
              <span className="font-medium text-foreground">49%</span>
            </div>
            <Progress value={49} className="h-1.5" />
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendingData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {spendingData.map((_, i) => <Cell key={i} fill={grays[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`€${v}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-5 shadow-card space-y-3">
          <h2 className="font-display text-sm font-medium text-foreground">Mis Servicios</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2.5 bg-muted rounded-lg">
              <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Profesora Leipzig</p>
                <p className="text-[10px] text-muted-foreground">Activo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-muted rounded-lg">
              <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Hispano Akademie</p>
                <p className="text-[10px] text-muted-foreground">Pendiente cita</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Button variant="outline" className="w-full h-10 text-xs">
        <Edit className="w-3.5 h-3.5 mr-1.5" /> Editar perfil
      </Button>
    </div>
  );
}
