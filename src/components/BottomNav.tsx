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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/90 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <Icon
                className={`size-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
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
