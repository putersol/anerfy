import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/calculator', label: 'Calculadora' },
  { to: '/services', label: 'Servicios' },
  { to: '/guides', label: 'Guías' },
  { to: '/community', label: 'Comunidad' },
  { to: '/jobs', label: 'Empleo' },
  { to: '/profile', label: 'Perfil' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-12 sm:h-14">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">ANERFY</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="container py-2 flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname === item.to
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">© 2026 ANERFY</span>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="mailto:info@anerfy.com" className="hover:text-foreground transition-colors">info@anerfy.com</a>
            <span className="hover:text-foreground cursor-pointer transition-colors">Legal</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacidad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
