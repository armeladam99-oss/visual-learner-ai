import type { LessonSection } from "@/types/lessons";
import { getMathQuadraticSections } from "./math-quadratic";
import { getPhysicsCinematiqueSections } from "./physics-cinematique";
import { getChemistrySolutionsSections } from "./chemistry-solutions";

export function getLessonSections(chapterId: string): LessonSection[] {
  switch (chapterId) {
    case "polynomes-2nd-degre":
      return getMathQuadraticSections();
    case "cinematique":
      return getPhysicsCinematiqueSections();
    case "solutions-molaires":
      return getChemistrySolutionsSections();
    default:
      return [];
  }
}
