import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, StickyNote, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AdvisorToolsProps {
  currentSlide: number;
  submissionId: string;
  onNotesChange?: (notes: Record<number, string>) => void;
}

export default function AdvisorTools({ currentSlide, submissionId, onNotesChange }: AdvisorToolsProps) {
  const [visible, setVisible] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Timer
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        setVisible(v => !v);
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        setShowNotes(n => !n);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const updateNote = useCallback((text: string) => {
    const updated = { ...notes, [currentSlide]: text };
    setNotes(updated);
    onNotesChange?.(updated);
  }, [notes, currentSlide, onNotesChange]);

  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');
  const timerColor = elapsed < 1800 ? 'text-success' : elapsed < 2700 ? 'text-warning' : 'text-destructive';

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center opacity-20 hover:opacity-80 transition-opacity"
        title="Ctrl+Shift+H para mostrar"
      >
        <Eye className="w-3 h-3 text-muted-foreground" />
      </button>
    );
  }

  return (
    <>
      {/* Timer */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
        <button
          onClick={() => setPaused(p => !p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border text-sm font-mono ${timerColor} opacity-85 hover:opacity-100 transition-opacity`}
        >
          <Timer className="w-3.5 h-3.5" />
          {mm}:{ss}
        </button>
        <button
          onClick={() => setShowNotes(n => !n)}
          className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
          title="Ctrl+Shift+N"
        >
          <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button
          onClick={() => setVisible(false)}
          className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
          title="Ctrl+Shift+H"
        >
          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Notes Panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-[9998] w-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">Notas — Slide {currentSlide + 1}</span>
              <button onClick={() => setShowNotes(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-3">
              <Textarea
                value={notes[currentSlide] || ''}
                onChange={e => updateNote(e.target.value)}
                placeholder="Notas del asesor para esta slide..."
                className="bg-muted/50 border-border text-sm min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">Auto-guardado por slide</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
