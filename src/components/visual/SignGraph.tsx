"use client";

import { motion } from "framer-motion";

interface SignEntry {
  value: number | string;
  sign: "+" | "0" | "−";
  label?: string;
}

interface SignGraphProps {
  title: string;
  expression: string;
  entries: SignEntry[];
  highlights?: { index: number; color: string }[];
}

export function SignGraph({
  title,
  expression,
  entries,
  highlights = [],
}: SignGraphProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">📊</span>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Signe de <code className="font-mono text-primary bg-primary/5 px-1 rounded">{expression}</code>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          {/* Values row */}
          <thead>
            <tr className="border-b-2 border-foreground/20">
              <th className="px-3 py-2 text-xs font-medium text-muted-foreground text-left w-16">
                x
              </th>
              {entries.map((entry, i) => {
                const highlight = highlights.find((h) => h.index === i);
                return (
                  <td
                    key={i}
                    className={`px-3 py-2 text-sm font-mono font-semibold ${
                      highlight
                        ? `bg-${highlight.color}-50 text-${highlight.color}-700`
                        : "text-foreground"
                    }`}
                  >
                    {entry.value}
                  </td>
                );
              })}
            </tr>
          </thead>

          {/* Sign row */}
          <tbody>
            <tr>
              <td className="px-3 py-3 text-xs font-medium text-muted-foreground text-left">
                Signe
              </td>
              {entries.map((entry, i) => {
                const colorMap = {
                  "+": "text-emerald-600 bg-emerald-50",
                  "0": "text-amber-600 bg-amber-50",
                  "−": "text-red-600 bg-red-50",
                };
                return (
                  <td
                    key={i}
                    className={`px-3 py-3 text-lg font-bold ${colorMap[entry.sign]}`}
                  >
                    {entry.sign === "0" ? "0" : entry.sign}
                  </td>
                );
              })}
            </tr>
          </tbody>

          {/* Labels row */}
          {entries.some((e) => e.label) && (
            <tfoot>
              <tr className="border-t border-border/30">
                <td className="px-3 py-1.5 text-xs text-muted-foreground text-left">
                  f(x)
                </td>
                {entries.map((entry, i) => (
                  <td
                    key={i}
                    className="px-3 py-1.5 text-[10px] text-muted-foreground"
                  >
                    {entry.label || ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </motion.div>
  );
}
