// ═══════════════════════════════════════════════════════════════
// 🔧 LAB MODIFIER — Universal modification engine
// ═══════════════════════════════════════════════════════════════

import type { LabVizSpec, LabWorkspace, LabParameter, LabScene, LabObject } from "./lab-schema";
import { generateId } from "./lab-schema";

// ═══════════════════════════════════════════════════════════════
// 📋 COMMAND TYPES
// ═══════════════════════════════════════════════════════════════

export interface LabModCommand {
  type: "add" | "remove" | "update" | "move" | "rotate" | "scale" | "animate" | "show" | "hide" | "reset";
  target?: string; // object id, viz id, "last", "all"
  data: Record<string, unknown>;
}

export interface ModifierResult {
  success: boolean;
  workspace: LabWorkspace;
  message: string;
  newSliders?: LabParameter[];
}

// ═══════════════════════════════════════════════════════════════
// 🔧 APPLY COMMAND
// ═══════════════════════════════════════════════════════════════

export function applyCommand(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  switch (cmd.type) {
    case "add":
      return applyAdd(ws, cmd);
    case "remove":
      return applyRemove(ws, cmd);
    case "update":
      return applyUpdate(ws, cmd);
    case "move":
      return applyMove(ws, cmd);
    case "animate":
      return applyAnimate(ws, cmd);
    case "show":
      return applyShowHide(ws, cmd, true);
    case "hide":
      return applyShowHide(ws, cmd, false);
    case "reset":
      return applyReset(ws);
    default:
      return { success: false, workspace: ws, message: `Commande "${cmd.type}" non reconnue.` };
  }
}

// ─── ADD ───
function applyAdd(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  const data = cmd.data;
  const activeId = ws.activeVizId || ws.visualizations[ws.visualizations.length - 1]?.id;
  if (!activeId) return { success: false, workspace: ws, message: "Aucune visualisation active." };

  const newVizs = ws.visualizations.map((v) => {
    if (v.id !== activeId) return v;

    // Add object to scene
    if (data.object && v.scene) {
      const newObj: LabObject = {
        id: generateId(),
        type: (data.objectType as LabObject["type"]) || "sphere",
        position: Array.isArray(data.position) ? data.position as [number, number, number] : [0, 0, 0],
        color: (data.color as string) || "#6366f1",
        label: (data.label as string) || undefined,
        props: (data.props as Record<string, unknown>) || {},
      };
      return {
        ...v,
        scene: { ...v.scene, objects: [...v.scene.objects, newObj] },
        title: v.title,
      };
    }

    // Add function to multi-function plot
    if (data.expression && (v.type === "function-plot" || v.type === "multi-function-plot")) {
      const existingFuncs = (v.params.functions as string[]) || [v.params.expr as string];
      return {
        ...v,
        type: "multi-function-plot" as const,
        params: {
          ...v.params,
          functions: [...existingFuncs, data.expression],
          labels: [...((v.params.labels as string[]) || ["f(x)"]), `h(x)`],
          colors: [...((v.params.colors as string[]) || ["#6366f1"]), "#10b981"],
        },
      };
    }

    // Add molecule
    if (data.molecule && v.type === "molecule-3d") {
      const existing = (v.params.molecules as string[]) || [v.params.molecule as string];
      if (!existing.includes(data.molecule as string)) {
        return {
          ...v,
          params: { ...v.params, molecules: [...existing, data.molecule] },
        };
      }
    }

    return v;
  });

  return {
    success: true,
    workspace: { ...ws, visualizations: newVizs },
    message: `Objet ajouté !`,
  };
}

// ─── REMOVE ───
function applyRemove(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  const activeId = ws.activeVizId || ws.visualizations[ws.visualizations.length - 1]?.id;
  if (!activeId) return { success: false, workspace: ws, message: "Aucune visualisation active." };

  const target = cmd.target?.toLowerCase() || "";
  const data = cmd.data;

  // Remove molecule
  if (data.molecule || target) {
    const molName = (data.molecule as string) || target;
    const newVizs = ws.visualizations.map((v) => {
      if (v.id !== activeId) return v;
      if (v.type === "molecule-3d" && molName) {
        const molecules = (v.params.molecules as string[]) || [v.params.molecule as string];
        const filtered = molecules.filter((m) => m.toUpperCase() !== molName.toUpperCase());
        if (filtered.length === 0) return { ...v, params: { ...v.params, molecule: "H2O", molecules: [] } };
        if (filtered.length === 1) return { ...v, params: { ...v.params, molecule: filtered[0], molecules: [] } };
        return { ...v, params: { ...v.params, molecules: filtered } };
      }
      return v;
    });
    return { success: true, workspace: { ...ws, visualizations: newVizs }, message: `${molName} supprimé.` };
  }

  // Remove scene object
  const newVizs = ws.visualizations.map((v) => {
    if (v.id !== activeId || !v.scene) return v;
    const objs = v.scene.objects.filter((o) => o.id !== target && o.label !== target);
    return { ...v, scene: { ...v.scene, objects: objs } };
  });
  return { success: true, workspace: { ...ws, visualizations: newVizs }, message: `Objet supprimé.` };
}

// ─── UPDATE (parameter change) ───
function applyUpdate(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  const data = cmd.data;
  const activeId = ws.activeVizId || ws.visualizations[ws.visualizations.length - 1]?.id;
  if (!activeId) return { success: false, workspace: ws, message: "Aucune visualisation active." };

  const newVizs = ws.visualizations.map((v) => {
    if (v.id !== activeId) return v;
    const newParams = { ...v.params, ...data };
    return { ...v, params: newParams };
  });

  const newSliders = ws.sliders.map((s) => {
    if (data[s.id] !== undefined && typeof data[s.id] === "number") {
      return { ...s, value: data[s.id] as number };
    }
    return s;
  });

  return {
    success: true,
    workspace: { ...ws, visualizations: newVizs, sliders: newSliders },
    message: `Paramètres mis à jour.`,
  };
}

// ─── MOVE (position change) ───
function applyMove(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  const target = cmd.target || "last";
  const pos = cmd.data.position as [number, number, number] || [0, 0, 0];

  const newVizs = ws.visualizations.map((v) => {
    if (!v.scene) return v;
    const objs = v.scene.objects.map((o) => {
      if (o.id === target || o.label?.toLowerCase() === target.toLowerCase() || target === "last") {
        return { ...o, position: pos };
      }
      return o;
    });
    return { ...v, scene: { ...v.scene, objects: objs } };
  });
  return { success: true, workspace: { ...ws, visualizations: newVizs }, message: `Objet déplacé.` };
}

// ─── ANIMATE ───
function applyAnimate(ws: LabWorkspace, cmd: LabModCommand): ModifierResult {
  const activeId = ws.activeVizId || ws.visualizations[ws.visualizations.length - 1]?.id;
  if (!activeId) return { success: false, workspace: ws, message: "Aucune visualisation active." };

  const newVizs = ws.visualizations.map((v) => {
    if (v.id !== activeId) return v;
    if (v.scene?.camera) {
      return { ...v, scene: { ...v.scene, camera: { ...v.scene.camera, autoRotate: true } } };
    }
    return { ...v, params: { ...v.params, animated: true } };
  });
  return { success: true, workspace: { ...ws, visualizations: newVizs }, message: `Animation activée !` };
}

// ─── SHOW/HIDE ───
function applyShowHide(ws: LabWorkspace, cmd: LabModCommand, show: boolean): ModifierResult {
  const activeId = ws.activeVizId || ws.visualizations[ws.visualizations.length - 1]?.id;
  if (!activeId) return { success: false, workspace: ws, message: "Aucune visualisation active." };

  const newVizs = ws.visualizations.map((v) => {
    if (v.id !== activeId || !v.scene) return v;
    const objs = v.scene.objects.map((o) => {
      if (o.id === cmd.target || o.label?.toLowerCase() === cmd.target?.toLowerCase()) {
        return { ...o, visible: show };
      }
      return o;
    });
    return { ...v, scene: { ...v.scene, objects: objs } };
  });
  return { success: true, workspace: { ...ws, visualizations: newVizs }, message: show ? "Objet affiché." : "Objet masqué." };
}

// ─── RESET ───
function applyReset(ws: LabWorkspace): ModifierResult {
  return {
    success: true,
    workspace: { ...ws, visualizations: [], sliders: [], parameters: [], activeVizId: null },
    message: "Workspace réinitialisé.",
  };
}

// ═══════════════════════════════════════════════════════════════
// 🧠 PARSE NATURAL LANGUAGE → COMMAND
// ═══════════════════════════════════════════════════════════════

export function parseModification(msg: string, ws: LabWorkspace): LabModCommand | null {
  const lower = msg.toLowerCase();

  // ─── ADD ───
  if (/ajoute?|ajout|ajouter/i.test(lower)) {
    // Add molecule
    const molMatch = lower.match(/ajoute?\s+(?:une?\s+)?(?:mol[ée]cule\s+(?:de\s+)?)?(\w+)/i);
    if (molMatch && /h2o|co2|ch4|nh3|o2|n2|hcl|nahc|h2so4|c2h5oh|ethanol|eau|méthane|methane/i.test(molMatch[1])) {
      return { type: "add", data: { molecule: molMatch[1].toUpperCase() } };
    }
    // Add function
    const funcMatch = msg.match(/ajoute?r?\s+(?:la\s+)?(?:courbe|fonction)\s+(.+?)(?:\s+au|\s+sur|\s*$)/i);
    if (funcMatch) {
      return { type: "add", data: { expression: funcMatch[1].trim() } };
    }
    // Add object to scene
    const objMatch = lower.match(/ajoute?r?\s+(?:une?\s+)?(sph[èe]re|cube|cylindre|c[ôo]ne|plan[èe]te|lune|objet)/i);
    if (objMatch) {
      const colors: Record<string, string> = { "sphère": "#6366f1", "sphere": "#6366f1", "cube": "#10b981", "cylindre": "#f59e0b", "cône": "#ef4444", "cone": "#ef4444", "planète": "#3b82f6", "planete": "#3b82f6", "lune": "#94a3b8", "objet": "#8b5cf6" };
      return { type: "add", data: { object: true, objectType: objMatch[1], color: colors[objMatch[1]] || "#6366f1" } };
    }
    // Generic add
    return { type: "add", data: { message: msg } };
  }

  // ─── REMOVE ───
  if (/supprime?|enl[èe]ve|retire?|enlever/i.test(lower)) {
    const molMatch = lower.match(/supprime?r?\s+(?:la\s+)?(?:mol[ée]cule\s+(?:de\s+)?)?(\w+)/i);
    if (molMatch) return { type: "remove", data: { molecule: molMatch[1] } };
    return { type: "remove", target: "last", data: {} };
  }

  // ─── UPDATE PARAMETERS ───
  const paramPatterns: [RegExp, string][] = [
    [/(?:gravit[ée]|g)\s*(?:à|=|est)\s*([\d.]+)/i, "g"],
    [/(?:masse|m)\s*(?:à|=|est)\s*([\d.]+)/i, "mass"],
    [/(?:vitesse|v)\s*(?:à|=|est)\s*([\d.]+)/i, "v0"],
    [/(?:angle|θ)\s*(?:à|=|est)\s*([\d.]+)/i, "angle"],
    [/(?:r[ée]sistance|R)\s*(?:à|=|est)\s*([\d.]+)/i, "R"],
    [/(?:tension|U)\s*(?:à|=|est)\s*([\d.]+)/i, "U0"],
    [/(?:longueur|L)\s*(?:à|=|est)\s*([\d.]+)/i, "length"],
    [/(?:amplitude|A)\s*(?:à|=|est)\s*([\d.]+)/i, "amplitude"],
    [/(?:fr[ée]quence|f)\s*(?:à|=|est)\s*([\d.]+)/i, "frequency"],
    [/(?:rayon|r)\s*(?:à|=|est)\s*([\d.]+)/i, "radius"],
    [/(?:hauteur|h)\s*(?:à|=|est)\s*([\d.]+)/i, "h0"],
    [/(?:intervalle|plage)\s+(?:à\s*\[?)?(-?\d+)\s*(?:,|\s*(?:et|à))\s*(-?\d+)/i, "_range_"],
  ];

  if (/change?|modifie|met(?:s)?|ajuste|double|augment|diminu/i.test(lower)) {
    for (const [regex, param] of paramPatterns) {
      const m = msg.match(regex);
      if (m) {
        if (param === "_range_") {
          return { type: "update", data: { xMin: parseInt(m[1]), xMax: parseInt(m[2]) } };
        }
        return { type: "update", data: { [param]: parseFloat(m[1]) } };
      }
    }
    // Double value
    const doubleMatch = msg.match(/double\s+(?:la\s+)?(\w+)/i);
    if (doubleMatch) {
      const paramName = doubleMatch[1];
      const activeViz = ws.visualizations.find((v) => v.id === ws.activeVizId) || ws.visualizations[ws.visualizations.length - 1];
      if (activeViz && typeof activeViz.params[paramName] === "number") {
        return { type: "update", data: { [paramName]: (activeViz.params[paramName] as number) * 2 } };
      }
    }
  }

  // ─── ANIMATE ───
  if (/anime?|rotation|tourne|fait tourner/i.test(lower)) {
    return { type: "animate", data: {} };
  }

  // ─── RESET ───
  if (/remet|reset|z[ée]ro|recommence|nouveau/i.test(lower)) {
    return { type: "reset", data: {} };
  }

  return null;
}
