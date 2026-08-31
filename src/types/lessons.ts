export type Subject = "math" | "physics" | "chemistry";

export interface ChapterMeta {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedTime: string;
  difficulty: "débutant" | "intermédiaire" | "avancé";
}

export interface LessonSection {
  id: string;
  type:
    | "why-study"
    | "objectives"
    | "prerequisites"
    | "intro"
    | "course"
    | "visualization"
    | "graph-explanation"
    | "formulas"
    | "methods"
    | "guided-example"
    | "hard-example"
    | "common-mistakes"
    | "exercises"
    | "ask-ai"
    | "draw-me"
    | "mini-test"
    | "summary"
    | "next-steps";
  title: string;
  icon: string;
  content: React.ReactNode;
}

export interface Lesson {
  id: string;
  subject: Subject;
  chapterTitle: string;
  sections: LessonSection[];
}
