"use client";

import { useAuth } from "@/hooks/use-auth";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Clock, ChevronRight, GraduationCap, BookOpen } from "lucide-react";
import { chapters as oldChapters, subjectLabels, subjectColors } from "@/data/chapters";
import { chaptersV2 } from "@/data/chapters-v2";
const chapters = chaptersV2;
import { getLessonSections } from "@/data/lessons";
import { useState } from "react";

const subjects = [
  { id: "all", label: "Toutes", icon: "📚" },
  { id: "math", label: "Mathématiques", icon: "📐" },
  { id: "physics", label: "Physique-Chimie", icon: "🚀" },
  { id: "chemistry", label: "Chimie", icon: "⚗️" },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredChapters =
    activeFilter === "all"
      ? chapters
      : chapters.filter((c) => c.subject === activeFilter);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="size-6 text-primary" />
              <span className="text-lg font-bold text-foreground tracking-tight">
                ProfVisuel
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.name || user?.email || "Étudiant"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-muted-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Bonjour{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Choisis un chapitre et commence à réviser. Chaque cours inclut des
            graphiques interactifs et des exercices progressifs.
          </p>
        </motion.div>

        {/* Subject filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {subjects.map((s) => (
            <Button
              key={s.id}
              variant={activeFilter === s.id ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs whitespace-nowrap ${
                activeFilter === s.id ? "" : "border-border/50"
              }`}
              onClick={() => setActiveFilter(s.id)}
            >
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </Button>
          ))}
        </motion.div>

        {/* Chapters grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <Card
                className="group border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer h-full"
                onClick={() => navigate(`/lesson/${chapter.id}`)}
              >
                <CardContent className="p-5 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center text-2xl shadow-sm`}
                  >
                    {chapter.icon}
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${subjectColors[chapter.subject]}`}
                    >
                      {subjectLabels[chapter.subject]}
                    </Badge>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        {chapter.estimatedTime}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border/50"
                      >
                        {chapter.difficulty}
                      </Badge>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 pt-4"
        >
          {[
            { label: "Chapitres", value: chapters.length, icon: BookOpen },
            {
              label: "Matières",
              value: new Set(chapters.map((c) => c.subject)).size,
              icon: GraduationCap,
            },
            { label: "Sections", value: chapters.reduce((acc, c) => acc + getLessonSections(c.id).length, 0), icon: BookOpen },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center rounded-xl border border-border/30 bg-muted/30 p-4"
            >
              <stat.icon className="size-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
