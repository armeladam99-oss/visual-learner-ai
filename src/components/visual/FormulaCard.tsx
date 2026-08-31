import { motion } from "framer-motion";

interface FormulaCardProps {
  title?: string;
  formulas: {
    name: string;
    expression: string;
    description?: string;
  }[];
  variant?: "default" | "highlighted";
}

export function FormulaCard({
  title,
  formulas,
  variant = "default",
}: FormulaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border p-5 space-y-4 ${
        variant === "highlighted"
          ? "border-accent/30 bg-accent/[0.04]"
          : "border-border/50 bg-card"
      }`}
    >
      {title && (
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="text-base">📐</span> {title}
        </h4>
      )}
      <div className="space-y-3">
        {formulas.map((f, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-baseline gap-3">
              {f.name && (
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {f.name}
                </span>
              )}
              <code className="text-base font-mono font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-lg inline-block">
                {f.expression}
              </code>
            </div>
            {f.description && (
              <p className="text-xs text-muted-foreground ml-0.5">
                {f.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface ConceptCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "tip" | "error";
}

const variantStyles = {
  info: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
  warning:
    "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
  tip: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
  error:
    "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
};

export function ConceptCard({
  icon,
  title,
  children,
  variant = "info",
}: ConceptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border p-5 space-y-2 ${variantStyles[variant]}`}
    >
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="text-base">{icon}</span> {title}
      </h4>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </motion.div>
  );
}

interface MethodCardProps {
  number: number;
  title: string;
  steps: string[];
}

export function MethodCard({ number, title, steps }: MethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <ol className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-foreground/80">{step}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

interface ExampleStepProps {
  step: number;
  title: string;
  content: React.ReactNode;
  isLast?: boolean;
}

export function ExampleStep({ step, title, content, isLast }: ExampleStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: step * 0.05 }}
      className={`flex gap-4 ${!isLast ? "pb-4" : ""}`}
    >
      <div className="flex flex-col items-center">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
      </div>
      <div className="flex-1 space-y-1 pt-0.5">
        <h5 className="text-sm font-semibold text-foreground">{title}</h5>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
