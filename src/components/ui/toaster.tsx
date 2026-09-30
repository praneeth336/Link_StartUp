import { useToast } from "@/hooks/use-toast";
import { Sparkles, X } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto glass rounded-xl p-4 border border-primary/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3 bg-card/95"
        >
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {t.title && <div className="font-semibold text-sm text-foreground">{t.title}</div>}
            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
