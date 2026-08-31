"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ParamSlider {
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

interface InteractiveGraphProps {
  title: string;
  description?: string;
  params: ParamSlider[];
  computePoints: (params: Record<string, number>) => { x: number; y: number }[];
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  showTangent?: boolean;
  tangentPoint?: number;
  annotations?: {
    x: number;
    y: number;
    label: string;
  }[];
  variant?: "line" | "area";
  color?: string;
}

export function InteractiveGraph({
  title,
  description,
  params: paramDefs,
  computePoints,
  xLabel = "x",
  yLabel = "y",
  xDomain = [-10, 10],
  yDomain,
  annotations = [],
  variant = "line",
  color = "#4f46e5",
}: InteractiveGraphProps) {
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    Object.fromEntries(paramDefs.map((p) => [p.symbol, p.defaultValue]))
  );

  const data = useMemo(
    () => computePoints(paramValues),
    [computePoints, paramValues]
  );

  const computedYDomain = useMemo(() => {
    if (yDomain) return yDomain;
    const ys = data.map((d) => d.y).filter((y) => isFinite(y));
    if (ys.length === 0) return [-10, 10];
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const padding = Math.max((max - min) * 0.15, 2);
    return [
      Math.floor((min - padding) * 2) / 2,
      Math.ceil((max + padding) * 2) / 2,
    ];
  }, [data, yDomain]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { x, y } = payload[0].payload;
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-medium text-muted-foreground">
          {xLabel} = {typeof x === "number" ? x.toFixed(2) : x}
        </p>
        <p className="text-sm font-semibold text-foreground">
          {yLabel} = {typeof y === "number" ? y.toFixed(2) : y}
        </p>
      </div>
    );
  };

  const Chart = variant === "area" ? AreaChart : LineChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <span className="text-lg">📊</span> {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Chart */}
          <div className="w-full h-[320px] rounded-lg bg-muted/30 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <Chart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.85 0.01 250)"
                  strokeWidth={0.5}
                />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={xDomain}
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.8 0.02 260)" }}
                  label={{
                    value: xLabel,
                    position: "insideBottomRight",
                    offset: -5,
                    style: {
                      fontSize: 12,
                      fontWeight: 600,
                      fill: "oklch(0.4 0.03 260)",
                    },
                  }}
                  allowDataOverflow
                />
                <YAxis
                  type="number"
                  domain={computedYDomain}
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 260)" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.8 0.02 260)" }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: {
                      fontSize: 12,
                      fontWeight: 600,
                      fill: "oklch(0.4 0.03 260)",
                    },
                  }}
                  allowDataOverflow
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="oklch(0.7 0.02 260)" strokeWidth={1} />
                <ReferenceLine x={0} stroke="oklch(0.7 0.02 260)" strokeWidth={1} />
                {annotations.map((ann, i) => (
                  <ReferenceLine
                    key={i}
                    x={ann.x}
                    stroke={color}
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                ))}
                {variant === "area" ? (
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, fill: "white", stroke: color }}
                    fill={color}
                    fillOpacity={0.08}
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, fill: "white", stroke: color }}
                  />
                )}
              </Chart>
            </ResponsiveContainer>
          </div>

          {/* Sliders */}
          {paramDefs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paramDefs.map((param) => (
                <div key={param.symbol} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      {param.name}
                    </label>
                    <span className="text-sm font-mono font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded">
                      {param.symbol} = {paramValues[param.symbol]}
                    </span>
                  </div>
                  <Slider
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={[paramValues[param.symbol]]}
                    onValueChange={([val]) =>
                      setParamValues((prev) => ({ ...prev, [param.symbol]: val }))
                    }
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{param.min}</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GraphExplainer({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 space-y-3"
    >
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="text-base">🔎</span> Comment lire ce graphique ?
      </h4>
      <ol className="space-y-2 text-sm text-muted-foreground leading-relaxed list-none">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-foreground/80">{item}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
