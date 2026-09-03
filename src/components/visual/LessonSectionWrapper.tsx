import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface LessonSectionWrapperProps {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  index: number;
  totalSections?: number;
}

export function LessonSectionWrapper({
  id,
  icon,
  title,
  children,
  index,
  totalSections = 18,
}: LessonSectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="scroll-mt-24"
    >
      <Separator className="mb-8" />
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {index + 1}/{totalSections}
          </span>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </motion.section>
  );
}
