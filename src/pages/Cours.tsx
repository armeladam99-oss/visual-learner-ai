"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chaptersV2 } from "@/data/chapters-v2";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

const subjectFilters = [
  { id: "all", label: "Toutes", icon: "📚" },
  { id: "math", label: "Mathématiques", icon: "📐" },
  { id: "physics", label: "Physique", icon: "⚛️" },
  { id: "chemistry", label: "Chimie", icon: "🧪" },
];

export default function CoursPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = activeFilter === "all"
    ? chaptersV2
    : chaptersV2.filter((c) => c.subject === activeFilter);

  const mathCount = chaptersV2.filter((c) => c.subject === "math").length;
  const physicsCount = chaptersV2.filter((c) => c.subject === "physics").length;
  const chemCount = chaptersV2.filter((c) => c.subject === "chemistry").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span className="text-base font-bold text-foreground">📚 Cours</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>📐 {mathCount}</span>
            <span>⚛️ {physicsCount}</span>
            <span>🧪 {chemCount}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 space-y-6">
        {/* Subject filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {subjectFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Subject sections */}
        {["math", "physics", "chemistry"].map((subject) => {
          const subjectChapters = filtered.filter((c) => c.subject === subject);
          if (subjectChapters.length === 0) return null;

          const subjectInfoMap: Record<string, { label: string; icon: string; color: string }> = {
            math: { label: "Mathématiques", icon: "📐", color: "from-blue-500 to-indigo-600" },
            physics: { label: "Physique", icon: "⚛️", color: "from-emerald-500 to-teal-600" },
            chemistry: { label: "Chimie", icon: "🧪", color: "from-amber-500 to-orange-600" },
          };
          const subjectInfo = subjectInfoMap[subject];

          return (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{subjectInfo.icon}</span>
                <h2 className="text-lg font-bold text-foreground">{subjectInfo.label}</h2>
                <Badge variant="secondary" className="text-[10px]">{subjectChapters.length} chapitres</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {subjectChapters.map((chapter, i) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card
                      className="group border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/lesson/${chapter.id}`)}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
                          {chapter.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {chapter.title}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {chapter.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="size-2.5" />{chapter.estimatedTime}
                            </span>
                            <Badge variant="outline" className="text-[9px] border-border/50">{chapter.difficulty}</Badge>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
