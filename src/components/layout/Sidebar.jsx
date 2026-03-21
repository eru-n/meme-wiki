import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Swords, Network, Map, Home, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './GlobalSearch';

const navItems = [
  { path: '/', label: 'ホーム', icon: Home },
  { path: '/characters', label: 'キャラクター図鑑', icon: BookOpen },
  { path: '/search', label: 'キャラクター検索', icon: Search },
  { path: '/glossary', label: '用語解説', icon: Swords },
  { path: '/relations', label: '相関図', icon: Network },
  { path: '/map', label: 'マップ', icon: Map },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-sidebar-border">
          <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 lg:hidden">
            <X className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Swords className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-sidebar-foreground tracking-tight">
                GameWiki
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Encyclopaedia
              </p>
            </div>
          </Link>
          <GlobalSearch />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-colors", isActive && "text-primary")} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto text-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">データ更新</p>
            <p className="text-xs font-medium text-sidebar-foreground mt-1">v2.4.0 — 2026.03.20</p>
          </div>
        </div>
      </aside>
    </>
  );
}