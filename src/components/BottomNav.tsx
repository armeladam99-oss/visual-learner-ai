"use client";

import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Home, BookOpen, FlaskConical, BarChart3, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/cours", label: "Cours", icon: BookOpen },
  { path: "/labo", label: "Labo IA", icon: FlaskConical },
  { path: "/progression", label: "Stats", icon: BarChart3 },
  { path: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on auth and landing pages
  if (location.pathname === "/auth" || location.pathname === "/") return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl safe-area-bottom shadow-[0_-12px_30px_-15px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pt-1 pb-1.5">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 max-w-[84px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all active:scale-95"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <Icon
                className={`size-[22px] transition-colors ${
                  isActive
                    ? "text-primary drop-shadow-[0_2px_6px_var(--primary)]"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium leading-none transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
