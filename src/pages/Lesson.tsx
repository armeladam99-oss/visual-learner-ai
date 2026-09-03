"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, Clock, BookOpen, ListTree } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chapters, subjectLabels, subjectColors } from "@/data/chapters";
import { getLessonSections } from "@/data/lessons";
import { LessonSectionWrapper } from "@/components/visual/LessonSectionWrapper";
import { ProgressBar } from "@/components/visual/ProgressBar";
import { ScrollToTop } from "@/components/visual/ScrollToTop";

export default function Lesson() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("");

  const chapter = useMemo(
    () => chapters.find((c) => c.id === chapterId),
    [chapterId]
  );

  const sections = useMemo(
    () => (chapterId ? getLessonSections(chapterId) : []),
    [chapterId]
  );

  // Get next chapter for navigation
  const currentIndex = useMemo(
    () => chapters.findIndex((c) => c.id === chapterId),
    [chapterId]
  );
  const nextChapter = currentIndex >= 0 ? chapters[currentIndex + 1] : undefined;

  const activeIndex = useMemo(() => {
    const idx = sections.findIndex((s) => s.id === activeSection);
    return idx >= 0 ? idx : 0;
  }, [sections, activeSection]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (!chapter) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Chapitre introuvable</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Retour au tableau de bord
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <ProgressBar />
      <ScrollToTop />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <span className="text-lg">{chapter.icon}</span>
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-tight">
                  {chapter.title}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${subjectColors[chapter.subject]}`}
                  >
                    {subjectLabels[chapter.subject]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    {chapter.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Dynamic lesson progress */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
              Section {activeIndex + 1}/{sections.length}
            </span>
            <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 25 }}
              />
            </div>
          </div>
          <Badge variant="outline" className="text-xs sm:hidden">
            {activeIndex + 1}/{sections.length}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-7xl flex">
        {/* Sidebar navigation */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border/30">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
            <ScrollArea className="h-full">
              <nav className="p-4 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  Sommaire
                </p>
                {sections.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(section.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="text-sm flex-shrink-0">{section.icon}</span>
                    <span className="truncate leading-tight">{section.title}</span>
                  </a>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-2">
            {/* Mobile section nav — compact dropdown + progress */}
            <div className="lg:hidden mb-6 space-y-2">
              <Select
                value={activeSection || sections[0]?.id || ""}
                onValueChange={scrollToSection}
              >
                <SelectTrigger className="w-full h-10 bg-background border-border/50 text-xs font-medium">
                  <ListTree className="size-3.5 text-primary" />
                  <SelectValue placeholder="Aller à une section..." />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section, i) => (
                    <SelectItem
                      key={section.id}
                      value={section.id}
                      className="text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <span>{section.icon}</span>
                        <span className="truncate">
                          {i + 1}. {section.title}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    animate={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 25 }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground tabular-nums flex-shrink-0">
                  {activeIndex + 1}/{sections.length}
                </span>
              </div>
            </div>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-4xl">{chapter.icon}</span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {chapter.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {chapter.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Badge
                  className={`text-xs ${subjectColors[chapter.subject]}`}
                >
                  {subjectLabels[chapter.subject]}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {chapter.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {chapter.estimatedTime}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <BookOpen className="size-3" />
                  {sections.length} sections
                </span>
              </div>
            </motion.div>

            {/* Lesson sections */}
            {sections.map((section, i) => (
              <LessonSectionWrapper
                key={section.id}
                id={section.id}
                icon={section.icon}
                title={section.title}
                index={i}
                totalSections={sections.length}
              >
                {section.content}
              </LessonSectionWrapper>
            ))}

            {/* Next chapter */}
            {nextChapter && (
              <div className="pt-8">
                <Separator className="mb-8" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                    Chapitre suivant
                  </p>
                  <Link
                    to={`/lesson/${nextChapter.id}`}
                    className="group block rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{nextChapter.icon}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {nextChapter.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {nextChapter.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Footer spacing (keeps content clear of the fixed bottom nav) */}
            <div className="h-28" />
          </div>
        </div>
      </div>
    </main>
  );
}
