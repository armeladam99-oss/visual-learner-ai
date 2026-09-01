import type { LessonSection } from "@/types/lessons";
import { getMathLimitesSections } from "./math-limites";
import { getMathDerivationSections } from "./math-derivation";
import { getMathSuitesSections } from "./math-suites";
import { getSuitesNumeriquesV2 } from "@/data/courses/math-suites-v2";
import { getMathExpoSections } from "./math-exponentielle";
import { getPhysicsOndesSections } from "./physics-ondes";
import { getPhysicsOndesPeriodiquesSections } from "./physics-ondes-periodiques";
import { getPhysicsOndesLumineusesSections } from "./physics-ondes-lumineuses";
import { getChimieAcidoSections } from "./chimie-acido";
import { getChimieSuiviSections } from "./chimie-suivi";
import { getChimieNucleaireSections } from "./chimie-nucleaire";

export function getLessonSections(chapterId: string): LessonSection[] {
  switch (chapterId) {
    case "limites-continuite":
      return getMathLimitesSections();
    case "derivation-fonctions":
      return getMathDerivationSections();
    case "suites-numeriques":
      return getSuitesNumeriquesV2();
    case "fonction-exponentielle":
      return getMathExpoSections();
    case "ondes-mecaniques":
      return getPhysicsOndesSections();
    case "ondes-periodiques":
      return getPhysicsOndesPeriodiquesSections();
    case "ondes-lumineuses":
      return getPhysicsOndesLumineusesSections();
    case "acido-basique":
      return getChimieAcidoSections();
    case "suivi-temporel":
      return getChimieSuiviSections();
    case "transformations-nucleaires":
      return getChimieNucleaireSections();
    default:
      return [];
  }
}
