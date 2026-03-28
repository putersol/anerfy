import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { DiagnosticoForm } from "./schema";

interface RadioPillsProps {
  form: UseFormReturn<DiagnosticoForm>;
  name: keyof DiagnosticoForm;
  label: string;
  helper?: string;
  options?: [string, string][];
}

export function RadioPills({
  form,
  name,
  label,
  helper,
  options = [["si", "Sí"], ["no", "No"]],
}: RadioPillsProps) {
  const { setValue, watch, formState: { errors } } = form;
  const value = watch(name) as string;
  const error = errors[name];

  return (
    <div>
      <Label className="text-slate-200">{label}</Label>
      {helper && <p className="text-slate-500 text-xs mt-0.5">{helper}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map(([val, lbl]) => (
          <button
            key={val}
            type="button"
            onClick={() => setValue(name, val as never)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 min-h-[44px] active:scale-95 ${
              value === val
                ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1.5">
          {(error as { message?: string }).message}
        </p>
      )}
    </div>
  );
}

export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      {label && <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>}
      <div className="flex-1 h-px bg-gradient-to-l from-white/10 to-transparent" />
    </div>
  );
}
