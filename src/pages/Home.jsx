import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, Swords, Network, Map, ArrowRight, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const quickLinks = [
  { path: '/characters', label: 'キャラクター図鑑', desc: '全キャラクターの詳細情報', icon: BookOpen, color: 'from-purple-500/20 to-purple-600/5' },
  { path: '/search', label: 'キャラクター検索', desc: 'ソート・フィルター検索', icon: Search, color: 'from-blue-500/20 to-blue-600/5' },
  { path: '/glossary', label: '用語解説', desc: 'スキル内用語の解説', icon: Swords, color: 'from-red-500/20 to-red-600/5' },
  { path: '/relations', label: '相関図', desc: 'キャラクター同士の関係', icon: Network, color: 'from-emerald-500/20 to-emerald-600/5' },
  { path: '/map', label: 'マップ', desc: 'ゲーム世界のマップ', icon: Map, color: 'from-amber-500/20 to-amber-600/5' },
];

export default function Home() {
  const { data: characters = [] } = useQuery({
    queryKey: ['characters'],
    queryFn: () => base44.entities.Character.list('-created_date', 6),
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card border border-border p-8 lg:p-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">GameWiki</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold tracking-tight mb-4">
            ゲーム攻略Wiki
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm lg:text-base leading-relaxed">
            キャラクター図鑑、スキル用語解説、相関図、マップなど、ゲーム攻略に必要な情報を網羅したWikiサイトです。
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{characters.length} キャラクター</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <section>
        <h2 className="font-heading font-bold text-xl mb-6">クイックアクセス</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={item.path} className="group block">
                <div className={cn(
                  "p-6 rounded-2xl border border-border bg-gradient-to-br transition-all duration-300",
                  "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  item.color
                )}>
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-bold text-sm mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Characters */}
      {characters.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl">最近追加されたキャラクター</h2>
            <Link to="/characters" className="text-xs text-primary hover:underline flex items-center gap-1">
              すべて見る <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {characters.map((c) => (
              <Link key={c.id} to={`/characters/${c.id}`} className="group">
                <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all">
                  <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-2xl font-heading font-bold text-muted-foreground/30">{c.name?.[0]}</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.rarity} · {c.element}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}