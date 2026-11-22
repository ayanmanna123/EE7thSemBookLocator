import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function Dialog({ open, onOpenChange, children, className }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className={cn(
          "relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-sky-500/30 bg-card text-card-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between border-b border-border/60 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-xl font-extrabold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function DialogClose({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer",
        className
      )}
      title="Close dialog (Esc)"
    >
      <X className="size-5" />
    </button>
  );
}

function DialogBody({ className, ...props }) {
  return (
    <div
      className={cn("overflow-y-auto p-5 space-y-4 text-sm text-foreground", className)}
      {...props}
    />
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogClose, DialogBody };
