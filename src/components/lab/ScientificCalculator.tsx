import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Calculator,
  Zap,
  FlaskConical,
  Atom,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

type CalcCategory = "physics" | "chemistry" | "electricity";

interface CalcField {
  label: string;
  symbol: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  isResult?: boolean;
}

interface CalcFormula {
  name: string;
  formula: string;
  fields: CalcField[];
  compute: (values: Record<string, number>) => Record<string, number>;
}

const ELECTRICITY_FORMULAS: CalcFormula[] = [
  {
    name: "Loi d'Ohm",
    formula: "U = R * I",
    fields: [
      { label: "Resistance", symbol: "R", unit: "Ohm", value: 100, min: 1, max: 10000, step: 1 },
      { label: "Tension", symbol: "U", unit: "V", value: 12, min: 0.1, max: 240, step: 0.1 },
      { label: "Courant", symbol: "I", unit: "A", value: 0.12, isResult: true },
    ],
    compute: (v) => ({ I: (v.U ?? 12) / (v.R ?? 100) }),
  },
  {
    name: "Puissance electrique",
    formula: "P = U * I",
    fields: [
      { label: "Tension", symbol: "U", unit: "V", value: 12, min: 0.1, max: 240, step: 0.1 },
      { label: "Courant", symbol: "I", unit: "A", value: 0.12, min: 0.001, max: 10, step: 0.001 },
      { label: "Puissance", symbol: "P", unit: "W", value: 1.44, isResult: true },
    ],
    compute: (v) => ({ P: (v.U ?? 12) * (v.I ?? 0.12) }),
  },
  {
    name: "Resistance serie",
    formula: "Req = R1 + R2 + R3",
    fields: [
      { label: "R1", symbol: "R1", unit: "Ohm", value: 100, min: 1, max: 10000, step: 1 },
      { label: "R2", symbol: "R2", unit: "Ohm", value: 220, min: 1, max: 10000, step: 1 },
      { label: "R3", symbol: "R3", unit: "Ohm", value: 330, min: 1, max: 10000, step: 1 },
      { label: "Req", symbol: "Req", unit: "Ohm", value: 650, isResult: true },
    ],
    compute: (v) => ({ Req: (v.R1 ?? 100) + (v.R2 ?? 220) + (v.R3 ?? 330) }),
  },
  {
    name: "Resistance parallele",
    formula: "1/Req = 1/R1 + 1/R2",
    fields: [
      { label: "R1", symbol: "R1", unit: "Ohm", value: 100, min: 1, max: 10000, step: 1 },
      { label: "R2", symbol: "R2", unit: "Ohm", value: 200, min: 1, max: 10000, step: 1 },
      { label: "Req", symbol: "Req", unit: "Ohm", value: 66.67, isResult: true },
    ],
    compute: (v) => ({ Req: 1 / (1 / (v.R1 ?? 100) + 1 / (v.R2 ?? 200)) }),
  },
  {
    name: "Energie electrique",
    formula: "E = P * t",
    fields: [
      { label: "Puissance", symbol: "P", unit: "W", value: 100, min: 1, max: 10000, step: 1 },
      { label: "Temps", symbol: "t", unit: "s", value: 3600, min: 1, max: 86400, step: 1 },
      { label: "Energie", symbol: "E", unit: "J", value: 360000, isResult: true },
    ],
    compute: (v) => ({ E: (v.P ?? 100) * (v.t ?? 3600) }),
  },
  {
    name: "Charge condensateur",
    formula: "Q = C * U",
    fields: [
      { label: "Capacite", symbol: "C", unit: "uF", value: 100, min: 1, max: 10000, step: 1 },
      { label: "Tension", symbol: "U", unit: "V", value: 5, min: 0.1, max: 240, step: 0.1 },
      { label: "Charge", symbol: "Q", unit: "uC", value: 500, isResult: true },
    ],
    compute: (v) => ({ Q: (v.C ?? 100) * (v.U ?? 5) }),
  },
];

const PHYSICS_FORMULAS: CalcFormula[] = [
  {
    name: "Vitesse uniforme",
    formula: "v = d / t",
    fields: [
      { label: "Distance", symbol: "d", unit: "m", value: 100, min: 0.1, max: 10000, step: 0.1 },
      { label: "Temps", symbol: "t", unit: "s", value: 10, min: 0.01, max: 3600, step: 0.01 },
      { label: "Vitesse", symbol: "v", unit: "m/s", value: 10, isResult: true },
    ],
    compute: (v) => ({ v: (v.d ?? 100) / (v.t ?? 10) }),
  },
  {
    name: "Chute libre - temps",
    formula: "t = sqrt(2h/g)",
    fields: [
      { label: "Hauteur", symbol: "h0", unit: "m", value: 20, min: 0.1, max: 500, step: 0.1 },
      { label: "Gravite", symbol: "g", unit: "m/s2", value: 9.81, min: 1, max: 25, step: 0.01 },
      { label: "Temps de chute", symbol: "t", unit: "s", value: 2.02, isResult: true },
    ],
    compute: (v) => ({ t: Math.sqrt((2 * (v.h0 ?? 20)) / (v.g ?? 9.81)) }),
  },
  {
    name: "Chute libre - vitesse",
    formula: "v = g * t",
    fields: [
      { label: "Gravite", symbol: "g", unit: "m/s2", value: 9.81, min: 1, max: 25, step: 0.01 },
      { label: "Temps", symbol: "t", unit: "s", value: 3, min: 0.01, max: 100, step: 0.01 },
      { label: "Vitesse", symbol: "v", unit: "m/s", value: 29.43, isResult: true },
    ],
    compute: (v) => ({ v: (v.g ?? 9.81) * (v.t ?? 3) }),
  },
  {
    name: "Energie cinetique",
    formula: "Ec = 0.5 * m * v2",
    fields: [
      { label: "Masse", symbol: "m", unit: "kg", value: 2, min: 0.01, max: 1000, step: 0.01 },
      { label: "Vitesse", symbol: "v", unit: "m/s", value: 10, min: 0.01, max: 1000, step: 0.01 },
      { label: "Energie cinetique", symbol: "Ec", unit: "J", value: 100, isResult: true },
    ],
    compute: (v) => ({ Ec: 0.5 * (v.m ?? 2) * (v.v ?? 10) * (v.v ?? 10) }),
  },
  {
    name: "Energie potentielle",
    formula: "Ep = m * g * h",
    fields: [
      { label: "Masse", symbol: "m", unit: "kg", value: 5, min: 0.01, max: 1000, step: 0.01 },
      { label: "Gravite", symbol: "g", unit: "m/s2", value: 9.81, min: 1, max: 25, step: 0.01 },
      { label: "Hauteur", symbol: "h", unit: "m", value: 10, min: 0.01, max: 500, step: 0.01 },
      { label: "Energie potentielle", symbol: "Ep", unit: "J", value: 490.5, isResult: true },
    ],
    compute: (v) => ({ Ep: (v.m ?? 5) * (v.g ?? 9.81) * (v.h ?? 10) }),
  },
  {
    name: "Periode pendule",
    formula: "T = 2*pi*sqrt(L/g)",
    fields: [
      { label: "Longueur", symbol: "L", unit: "m", value: 1, min: 0.01, max: 10, step: 0.01 },
      { label: "Gravite", symbol: "g", unit: "m/s2", value: 9.81, min: 1, max: 25, step: 0.01 },
      { label: "Periode", symbol: "T", unit: "s", value: 2.007, isResult: true },
    ],
    compute: (v) => ({ T: 2 * Math.PI * Math.sqrt((v.L ?? 1) / (v.g ?? 9.81)) }),
  },
  {
    name: "Force",
    formula: "F = m * a",
    fields: [
      { label: "Masse", symbol: "m", unit: "kg", value: 10, min: 0.01, max: 10000, step: 0.01 },
      { label: "Acceleration", symbol: "a", unit: "m/s2", value: 9.81, min: 0.01, max: 1000, step: 0.01 },
      { label: "Force", symbol: "F", unit: "N", value: 98.1, isResult: true },
    ],
    compute: (v) => ({ F: (v.m ?? 10) * (v.a ?? 9.81) }),
  },
  {
    name: "Frequence / Periode",
    formula: "f = 1/T",
    fields: [
      { label: "Periode", symbol: "T", unit: "s", value: 0.02, min: 0.0001, max: 100, step: 0.0001 },
      { label: "Frequence", symbol: "f", unit: "Hz", value: 50, isResult: true },
    ],
    compute: (v) => ({ f: 1 / (v.T ?? 0.02) }),
  },
];

const CHEMISTRY_FORMULAS: CalcFormula[] = [
  {
    name: "Concentration",
    formula: "C = n / V",
    fields: [
      { label: "Quantite (mol)", symbol: "n", unit: "mol", value: 0.5, min: 0.001, max: 100, step: 0.001 },
      { label: "Volume (L)", symbol: "V", unit: "L", value: 0.5, min: 0.001, max: 100, step: 0.001 },
      { label: "Concentration", symbol: "C", unit: "mol/L", value: 1, isResult: true },
    ],
    compute: (v) => ({ C: (v.n ?? 0.5) / (v.V ?? 0.5) }),
  },
  {
    name: "Quantite de matiere",
    formula: "n = m / M",
    fields: [
      { label: "Masse", symbol: "m", unit: "g", value: 18, min: 0.001, max: 10000, step: 0.001 },
      { label: "Masse molaire", symbol: "M", unit: "g/mol", value: 18, min: 0.001, max: 10000, step: 0.001 },
      { label: "Quantite", symbol: "n", unit: "mol", value: 1, isResult: true },
    ],
    compute: (v) => ({ n: (v.m ?? 18) / (v.M ?? 18) }),
  },
  {
    name: "Masse a partir de C",
    formula: "m = C * V * M",
    fields: [
      { label: "Concentration", symbol: "C", unit: "mol/L", value: 1, min: 0.001, max: 100, step: 0.001 },
      { label: "Volume", symbol: "V", unit: "L", value: 0.5, min: 0.001, max: 100, step: 0.001 },
      { label: "Masse molaire", symbol: "M", unit: "g/mol", value: 58.5, min: 0.001, max: 10000, step: 0.001 },
      { label: "Masse", symbol: "m", unit: "g", value: 29.25, isResult: true },
    ],
    compute: (v) => ({ m: (v.C ?? 1) * (v.V ?? 0.5) * (v.M ?? 58.5) }),
  },
  {
    name: "Dilution",
    formula: "C1*V1 = C2*V2",
    fields: [
      { label: "C1 (initiale)", symbol: "C1", unit: "mol/L", value: 2, min: 0.001, max: 100, step: 0.001 },
      { label: "V1 (initial)", symbol: "V1", unit: "L", value: 0.1, min: 0.001, max: 100, step: 0.001 },
      { label: "V2 (final)", symbol: "V2", unit: "L", value: 0.5, min: 0.001, max: 100, step: 0.001 },
      { label: "C2 (finale)", symbol: "C2", unit: "mol/L", value: 0.4, isResult: true },
    ],
    compute: (v) => ({ C2: ((v.C1 ?? 2) * (v.V1 ?? 0.1)) / (v.V2 ?? 0.5) }),
  },
  {
    name: "Demi-vie (ordre 1)",
    formula: "t1/2 = ln(2) / k",
    fields: [
      { label: "Constante k", symbol: "k", unit: "s-1", value: 0.05, min: 0.001, max: 100, step: 0.001 },
      { label: "Demi-vie", symbol: "t_half", unit: "s", value: 13.86, isResult: true },
    ],
    compute: (v) => ({ t_half: Math.LN2 / (v.k ?? 0.05) }),
  },
  {
    name: "pH solution",
    formula: "pH = -log10[H+]",
    fields: [
      { label: "Concentration H+", symbol: "H", unit: "mol/L", value: 0.001, min: 0.0000001, max: 1, step: 0.000001 },
      { label: "pH", symbol: "pH", unit: "", value: 3, isResult: true },
    ],
    compute: (v) => ({ pH: -Math.log10(v.H ?? 0.001) }),
  },
  {
    name: "Gaz parfait",
    formula: "PV = nRT",
    fields: [
      { label: "Pression", symbol: "P", unit: "Pa", value: 101325, min: 1000, max: 1000000, step: 100 },
      { label: "Volume", symbol: "V", unit: "L", value: 22.4, min: 0.001, max: 1000, step: 0.001 },
      { label: "Temperature", symbol: "T", unit: "K", value: 273.15, min: 1, max: 10000, step: 0.01 },
      { label: "Quantite n", symbol: "n", unit: "mol", value: 1, isResult: true },
    ],
    compute: (v) => {
      const R = 8.314;
      return { n: ((v.P ?? 101325) * ((v.V ?? 22.4) / 1000)) / (R * (v.T ?? 273.15)) };
    },
  },
];

export function ScientificCalculator() {
  const [category, setCategory] = useState<CalcCategory>("physics");
  const [expandedFormula, setExpandedFormula] = useState<number | null>(0);
  const [values, setValues] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const formulas = useMemo(() => {
    switch (category) {
      case "physics": return PHYSICS_FORMULAS;
      case "chemistry": return CHEMISTRY_FORMULAS;
      case "electricity": return ELECTRICITY_FORMULAS;
    }
  }, [category]);

  const getValue = (fi: number, symbol: string, field: CalcField): number => {
    const key = `${fi}-${symbol}`;
    if (values[key] !== undefined) return values[key];
    return field.value;
  };

  const resultValues = useMemo(() => {
    const results: Record<number, Record<string, number>> = {};
    for (let i = 0; i < formulas.length; i++) {
      const inputValues: Record<string, number> = {};
      for (const field of formulas[i].fields) {
        if (!field.isResult) {
          inputValues[field.symbol] = getValue(i, field.symbol, field);
        }
      }
      results[i] = formulas[i].compute(inputValues);
    }
    return results;
  }, [formulas, values]);

  const handleValueChange = (fi: number, symbol: string, value: number) => {
    setValues((prev) => ({ ...prev, [`${fi}-${symbol}`]: value }));
  };

  const handleCopy = (fi: number, formula: CalcFormula) => {
    const result = resultValues[fi];
    let text = `${formula.name}\n${formula.formula}\n`;
    for (const field of formula.fields) {
      const val = field.isResult ? result[field.symbol] : getValue(fi, field.symbol, field);
      text += `${field.symbol} = ${val.toFixed(4)} ${field.unit}\n`;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const categories = [
    { key: "physics" as CalcCategory, icon: Atom, label: "Physique", color: "text-blue-400" },
    { key: "electricity" as CalcCategory, icon: Zap, label: "Electricite", color: "text-amber-400" },
    { key: "chemistry" as CalcCategory, icon: FlaskConical, label: "Chimie", color: "text-emerald-400" },
  ];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Calculator className="size-4 text-primary" />
          Calculatrice scientifique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1">
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant={category === cat.key ? "default" : "ghost"}
              size="sm"
              className={`text-[10px] h-7 flex-1 ${category === cat.key ? "" : "text-muted-foreground"}`}
              onClick={() => { setCategory(cat.key); setExpandedFormula(0); }}
            >
              <cat.icon className={`size-3 mr-1 ${cat.color}`} />
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {formulas.map((formula, fi) => {
            const isExpanded = expandedFormula === fi;
            const result = resultValues[fi];

            return (
              <div key={fi} className="rounded-lg border border-border/30 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => setExpandedFormula(isExpanded ? null : fi)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{formula.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{formula.formula}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-5 p-0"
                      onClick={(e) => { e.stopPropagation(); handleCopy(fi, formula); }}
                    >
                      {copied && expandedFormula === fi ? (
                        <Check className="size-3 text-emerald-400" />
                      ) : (
                        <Copy className="size-3 text-muted-foreground" />
                      )}
                    </Button>
                    {isExpanded ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-3 border-t border-border/30 pt-3">
                        {formula.fields.map((field) => {
                          const val = field.isResult
                            ? result[field.symbol] ?? 0
                            : getValue(fi, field.symbol, field);

                          return (
                            <div key={field.symbol} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-medium text-muted-foreground">
                                  {field.label} ({field.symbol})
                                </label>
                                <Badge
                                  variant={field.isResult ? "default" : "secondary"}
                                  className={`text-[9px] font-mono ${field.isResult ? "bg-primary/10 text-primary" : ""}`}
                                >
                                  {val.toFixed(field.isResult ? 4 : 2)} {field.unit}
                                </Badge>
                              </div>
                              {!field.isResult && field.min !== undefined && field.max !== undefined && (
                                <div className="flex items-center gap-2">
                                  <Slider
                                    value={[val]}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step || 1}
                                    onValueChange={(v) => handleValueChange(fi, field.symbol, v[0])}
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    value={val}
                                    onChange={(e) => {
                                      const num = parseFloat(e.target.value);
                                      if (!isNaN(num)) handleValueChange(fi, field.symbol, num);
                                    }}
                                    className="w-20 h-7 text-[10px] text-right font-mono bg-muted/50"
                                    step={field.step || 1}
                                    min={field.min}
                                    max={field.max}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
