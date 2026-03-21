import React, { useState, useRef, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const { data: characters = [] } = useQuery({
    queryKey: ['chars-global'],
    queryFn: () => base44.entities.Character.list('name', 200),
  });
  const { data: terms = [] } = useQuery({
    queryKey: ['terms-global'],
    queryFn: () => base44.entities.SkillTerm.list('term', 200),
  });

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out = [];
    characters.forEach(c => {
      const hit = [c.name, c.title, c.lore, c.tips, c.skill1_name, c.skill1_description, c.skill2_name, c.skill2_description, c.ultimate_name, c.passive_name]
        .filter(Boolean)
        .find(t => t.toLowerCase().includes(q));
      if (hit) {
        let matchType = 'キャラ名';
        if (c.name?.toLowerCase().includes(q)) matchType = 'キャラ名';
        else if (c.title?.toLowerCase().includes(q)) matchType = '称号';
        else if ([c.skill1_name, c.skill2_name, c.ultimate_name, c.passive_name].some(s => s?.toLowerCase().includes(q))) matchType = 'スキル名';
        else if ([c.skill1_description, c.skill2_description, c.ultimate_name, c.passive_description].some(s => s?.toLowerCase().includes(q))) matchType = 'スキル説明';
        else if (c.lore?.toLowerCase().includes(q)) matchType = 'ストーリー';
        out.push({ kind: 'char', item: c, matchType });
      }
    });
    terms.forEach(t => {
      if (t.term?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
        out.push({ kind: 'term', item: t, matchType: '用語' });
      }
    });
    return out.slice(0, 12);
  }, [query, characters, terms]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (r) => {
    setOpen(false);
    setQuery('');
    if (r.kind === 'char') navigate(`/characters/${r.item.id}`);
    else navigate('/glossary');
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        className="flex items-center border border-border focus-within:border-amber-500/50 transition-colors"
        style={{ background: '#1a1a22' }}
      >
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="全体検索（キャラ・用語等）"
          className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none px-3 py-1.5 w-48"
        />
        <button className="px-2 py-1.5 text-muted-foreground hover:text-foreground border-l border-border text-sm">⌕</button>
      </div>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 border border-amber-500/30 z-[300] max-h-80 overflow-y-auto shadow-xl"
          style={{ background: '#0d0d12', minWidth: '280px' }}
        >
          {!query.trim() ? (
            <div className="px-4 py-3 text-xs text-muted-foreground">キーワードを入力してください</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-xs text-muted-foreground">「{query}」に一致する結果が見つかりませんでした</div>
          ) : (
            <>
              <div className="px-4 py-2 text-[10px] text-muted-foreground tracking-widest uppercase border-b border-border">検索結果</div>
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-border/50 hover:bg-secondary/40 transition-colors text-left"
                >
                  <div className="w-9 h-9 border border-amber-500/40 flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: '#17171e' }}>
                    {r.kind === 'char' && r.item.image_url ? (
                      <img src={r.item.image_url} alt={r.item.name} className="w-full h-full object-cover" />
                    ) : r.kind === 'char' ? (
                      <span className="text-base font-bold text-muted-foreground/30">{r.item.name?.[0]}</span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400">語</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{r.kind === 'char' ? r.item.name : r.item.term}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{r.kind === 'char' ? r.item.title || '' : r.item.category}</div>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 flex-shrink-0">
                    {r.matchType}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}