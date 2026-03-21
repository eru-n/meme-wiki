import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['バフ', 'デバフ', '状態異常', '属性効果', '戦闘メカニクス', 'その他'];

const categoryColors = {
  'バフ': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'デバフ': 'bg-red-500/15 text-red-400 border-red-500/20',
  '状態異常': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  '属性効果': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  '戦闘メカニクス': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'その他': 'bg-secondary text-muted-foreground border-border',
};

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: terms = [], isLoading } = useQuery({
    queryKey: ['skill-terms'],
    queryFn: () => base44.entities.SkillTerm.list('term', 200),
  });

  const filtered = useMemo(() => {
    return terms.filter(t => {
      if (search && !t.term?.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      return true;
    });
  }, [terms, search, selectedCategory]);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight">用語解説</h1>
        <p className="text-sm text-muted-foreground mt-2">スキル内で使われる用語の解説一覧</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="用語を検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            selectedCategory === 'all'
              ? "bg-primary/15 border-primary/30 text-primary"
              : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
          )}
        >
          すべて
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              selectedCategory === cat
                ? "bg-primary/15 border-primary/30 text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {terms.length === 0 ? '用語がまだ登録されていません' : '条件に一致する用語が見つかりません'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((term, i) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-bold text-base">{term.term}</h3>
                      <Badge className={cn("border text-[10px]", categoryColors[term.category])}>
                        {term.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}