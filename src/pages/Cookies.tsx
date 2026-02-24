import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-2xl mx-auto flex-1 py-16 px-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">← Volver</Link>
        <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
        <p className="text-muted-foreground">Próximamente.</p>
      </div>
    </div>
  );
}
