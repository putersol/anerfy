import { useEffect, useRef, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChevronRight, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DiagnosticoForm, DOCUMENT_NAMES } from "./schema";
import { QuestionDef, COUNTRIES } from "./questions";

interface Props {
  question: QuestionDef;
  form: UseFormReturn<DiagnosticoForm>;
  onNext: () => void;
}

export default function QuestionView({ question, form, onNext }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const value = watch(question.field);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const autoAdvance = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onNext, 400);
  }, [onNext]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onNext();
    }
  };

  // ── Radio (si/no default) ──
  if (question.type === "radio") {
    const options = question.options || [
      { value: "si", label: "Sí" },
      { value: "no", label: "No" },
    ];
    return (
      <Shell q={question}>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setValue(question.field, opt.value as never);
                autoAdvance();
              }}
              className={`w-full px-6 py-4 rounded-xl text-left text-lg font-medium border transition-all active:scale-[0.98] ${
                value === opt.value
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "bg-secondary/80 border-border text-secondary-foreground hover:bg-secondary hover:border-muted-foreground/20"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  value === opt.value ? "border-primary" : "border-muted-foreground/30"
                }`}>
                  {value === opt.value && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </span>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Cards (multiple choice, auto-advance) ──
  if (question.type === "cards") {
    const options = question.options || [];
    return (
      <Shell q={question}>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setValue(question.field, opt.value as never);
                autoAdvance();
              }}
              className={`w-full px-6 py-4 rounded-xl text-left text-lg font-medium border transition-all active:scale-[0.98] ${
                value === opt.value
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "bg-secondary/80 border-border text-secondary-foreground hover:bg-secondary hover:border-muted-foreground/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {!question.required && <SkipBtn onClick={onNext} />}
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Select dropdown ──
  if (question.type === "select") {
    const options = question.options || [];
    return (
      <Shell q={question}>
        <div className="w-full max-w-sm">
          <Select
            onValueChange={(v) => {
              setValue(question.field, v as never);
              autoAdvance();
            }}
            value={(value as string) || ""}
          >
            <SelectTrigger className="bg-secondary/80 border-border text-foreground min-h-[52px] text-base">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!question.required && <SkipBtn onClick={onNext} />}
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Country (sets paisOrigen + nacionalidad) ──
  if (question.type === "country") {
    const paisOrigen = watch("paisOrigen");
    const nacionalidad = watch("nacionalidad");

    return (
      <Shell q={question}>
        <div className="w-full max-w-sm space-y-4">
          <Select
            onValueChange={(pais) => {
              setValue("paisOrigen", pais);
              const match = COUNTRIES.find((c) => c.name === pais);
              if (match) setValue("nacionalidad", match.nationality);
            }}
            value={paisOrigen || ""}
          >
            <SelectTrigger className="bg-secondary/80 border-border text-foreground min-h-[52px] text-base">
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="mr-2">{c.flag}</span> {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {paisOrigen && (
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Nacionalidad</Label>
              <Select
                onValueChange={(v) => setValue("nacionalidad", v)}
                value={nacionalidad || ""}
              >
                <SelectTrigger className="bg-secondary/80 border-border text-foreground min-h-[52px] text-base">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.nationality} value={c.nationality}>
                      <span className="mr-2">{c.flag}</span> {c.nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {paisOrigen && nacionalidad && (
            <NextBtn onClick={onNext} label="Continuar" />
          )}
        </div>
        <ErrorMsg errors={errors} field="paisOrigen" />
        <ErrorMsg errors={errors} field="nacionalidad" />
      </Shell>
    );
  }

  // ── Text input ──
  if (question.type === "text") {
    return (
      <Shell q={question}>
        <div className="w-full max-w-sm" onKeyDown={handleKeyDown}>
          <Input
            {...register(question.field)}
            placeholder={question.placeholder}
            className="bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground min-h-[52px] text-base"
            autoFocus
          />
          <div className="flex items-center justify-between mt-8">
            {!question.required ? <SkipBtn onClick={onNext} /> : <span />}
            <OkBtn onClick={onNext} />
          </div>
        </div>
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Number input ──
  if (question.type === "number") {
    const fieldName = question.field;
    const currentYear = new Date().getFullYear();
    return (
      <Shell q={question}>
        <div className="w-full max-w-sm" onKeyDown={handleKeyDown}>
          <Input
            {...register(question.field)}
            type="number"
            min={fieldName === "edad" ? 1 : undefined}
            max={fieldName === "anioGraduacion" ? currentYear : undefined}
            placeholder={question.placeholder}
            className="bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground min-h-[52px] text-base"
            autoFocus
          />
          <div className="flex items-center justify-between mt-8">
            {!question.required ? <SkipBtn onClick={onNext} /> : <span />}
            <OkBtn onClick={onNext} />
          </div>
        </div>
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Textarea ──
  if (question.type === "textarea") {
    return (
      <Shell q={question}>
        <div className="w-full max-w-lg">
          <Textarea
            {...register(question.field)}
            placeholder={question.placeholder}
            className="bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground min-h-[120px] text-base"
            autoFocus
          />
          <div className="flex items-center justify-end mt-4">
            <NextBtn onClick={onNext} label="Continuar" />
          </div>
        </div>
        <ErrorMsg errors={errors} field={question.field} />
      </Shell>
    );
  }

  // ── Checkbox multi ──
  if (question.type === "checkbox-multi") {
    const selected = (watch(question.field) as string[] | undefined) || [];
    const options = question.options || [];
    const toggle = (val: string) => {
      const updated = selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val];
      setValue(question.field, updated as never);
    };

    return (
      <Shell q={question}>
        <div className="w-full max-w-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`flex items-center gap-3 text-left text-sm p-4 rounded-xl border transition-all ${
                  selected.includes(opt.value)
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-secondary/80 border-border text-secondary-foreground hover:bg-secondary"
                }`}
              >
                <Checkbox
                  checked={selected.includes(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                />
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            {!question.required ? <SkipBtn onClick={onNext} /> : <span />}
            <NextBtn onClick={onNext} label="Continuar" />
          </div>
        </div>
      </Shell>
    );
  }

  // ── Documents checklist ──
  if (question.type === "documents") {
    const documentos = (watch("documentos") || {}) as Record<string, string>;
    const tengoCount = Object.values(documentos).filter((v) => v === "tengo").length;
    const enProcesoCount = Object.values(documentos).filter((v) => v === "en_proceso").length;
    const STATUS_OPTIONS: [string, string, string][] = [
      ["tengo", "Tengo", "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"],
      ["en_proceso", "En proceso", "bg-amber-500/20 text-amber-300 border-amber-500/30"],
      ["no_tengo", "No tengo", "bg-red-500/20 text-red-300 border-red-500/30"],
    ];

    return (
      <Shell q={question}>
        <div className="w-full max-w-lg">
          <div className="flex gap-3 text-xs text-muted-foreground mb-4">
            <span className="text-emerald-400">{tengoCount} listos</span>
            <span className="text-amber-400">{enProcesoCount} en proceso</span>
            <span className="text-red-400">{DOCUMENT_NAMES.length - tengoCount - enProcesoCount} pendientes</span>
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {DOCUMENT_NAMES.map((doc, i) => {
              const key = `doc_${i}`;
              const currentVal = documentos[key] || "no_tengo";
              return (
                <div key={key} className="rounded-xl border border-border bg-secondary/80 p-3">
                  <Label className="text-secondary-foreground text-sm font-medium block mb-1">{doc}</Label>
                  {doc === "Certificado médico de salud" && (
                    <p className="text-muted-foreground text-xs mb-2">Debe ser emitido por un médico de la lista oficial de la embajada alemana en tu país.</p>
                  )}
                  <RadioGroup
                    value={currentVal}
                    onValueChange={(v) => setValue("documentos", { ...documentos, [key]: v } as never)}
                    className="flex flex-wrap gap-2"
                  >
                    {STATUS_OPTIONS.map(([val, lbl, cls]) => (
                      <label
                        key={val}
                        className={`flex items-center gap-1.5 cursor-pointer text-xs px-3 py-1.5 rounded-full border transition-all ${
                          currentVal === val ? cls : "border-border text-muted-foreground"
                        }`}
                      >
                        <RadioGroupItem value={val} className="h-3 w-3" />
                        {lbl}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end mt-4">
            <NextBtn onClick={onNext} label="Continuar" />
          </div>
        </div>
      </Shell>
    );
  }

  // ── Motivation ──
  if (question.type === "motivation") {
    const motivacion = (watch("motivacion") || "") as string;
    return (
      <Shell q={question}>
        <div className="w-full max-w-lg">
          <Textarea
            {...register("motivacion")}
            placeholder="Comparte tu motivación aquí..."
            className="bg-secondary/80 border-border text-foreground placeholder:text-muted-foreground min-h-[180px] text-base leading-relaxed"
            autoFocus
          />
          <div className="flex justify-between items-center mt-1.5">
            {errors.motivacion ? (
              <p className="text-red-400 text-sm">{errors.motivacion.message}</p>
            ) : <span />}
            <span className={`text-xs ${motivacion.length >= 10 ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
              {motivacion.length} caracteres
            </span>
          </div>
          <div className="bg-secondary/80 border border-border rounded-xl p-4 mt-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-primary font-medium">Tip:</span> No hay respuestas incorrectas.
              Queremos conocer tu situación real para poder ayudarte mejor.
            </p>
          </div>
          <div className="flex items-center justify-end mt-4">
            <NextBtn onClick={onNext} label="Continuar" />
          </div>
        </div>
      </Shell>
    );
  }

  return null;
}

// ── Shared sub-components ──

function Shell({ q, children }: { q: QuestionDef; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center mb-10 w-full max-w-lg">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
          {q.group}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {q.label}
        </h2>
        {q.helper && (
          <p className="text-muted-foreground text-sm mt-3">{q.helper}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function NextBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
    >
      {label} <ChevronRight className="w-4 h-4" />
    </button>
  );
}

function OkBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
    >
      OK <CornerDownLeft className="w-4 h-4" />
    </button>
  );
}

function SkipBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Saltar →
    </button>
  );
}

function ErrorMsg({ errors, field }: { errors: Record<string, unknown>; field: string }) {
  const error = errors[field] as { message?: string } | undefined;
  if (!error?.message) return null;
  return <p className="text-red-400 text-sm mt-2">{error.message}</p>;
}
