import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Loader2, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const elements = ['火', '水', '風', '雷', '光', '闇'];
const rarities = ['SSR', 'SR', 'R', 'N'];
const roles = ['アタッカー', 'タンク', 'サポーター', 'ヒーラー'];
const weapons = ['剣', '槍', '弓', '杖', '拳', '双剣'];

const sortKeys = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'ATK' },
  { key: 'defense', label: 'DEF' },
  { key: 'speed', label: 'SPD' },
  { key: 'critical_rate', label: 'クリ率' },
];

const rarityOrder = { 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 };

export default function CharacterSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [sortKey, setSortKey] = useState('hp');

  const { data: characters = [], isLoading } = useQuery({
    queryKey: ['characters-search'],
    queryFn: () => base44.entities.Character.list('-created_date', 200),
  });

  const toggleFilter = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const filtered = useMemo(() => {
    let result = characters.filter(c => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedElements.length && !selectedElements.includes(c.element)) return false;
      if (selectedRarities.length && !selectedRarities.includes(c.rarity)) return false;
      if (selectedRoles.length && !selectedRoles.includes(c.role)) return false;
      if (selectedWeapons.length && !selectedWeapons.includes(c.weapon)) return false;
      return true;
    });
    result.sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
    return result;
  }, [characters, search, selectedElements, selectedRarities, selectedRoles, selectedWeapons, sortKey]);

  const maxVal = useMemo(() => Math.max(...filtered.map(c => c[sortKey] || 0)) || 1, [filtered, sortKey]);

  const activeFilterCount = selectedElements.length + selectedRarities.length + selectedRoles.length + selectedWeapons.length;

  const clearAll = () => {
    setSelectedElements([]); setSelectedRarities([]);
    setSelectedRoles([]); setSelectedWeapons([]);
    setSearch('');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Sort criteria bar */}
      <div className="flex items-stretch flex-wrap border-b border-border bg-card flex-shrink-0">
        <div className="p-3 px-5 border-r border-border">
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">ソート項目</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {sortKeys.map(sk => (
              <button
                key={sk.key}
                onClick={() => setSortKey(sk.key)}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  sortKey === sk.key ? "text-amber-400" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn(
                  "w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all",
                  sortKey === sk.key
                    ? "bg-amber-500 border-amber-500 shadow-[0_0_5px_#f59e0b]"
                    : "border-current"
                )} />
                {sk.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 px-5 border-r border-border ml-auto">
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2 flex items-center gap-2">
            <SlidersHorizontal className="w-3 h-3" /> フィルター
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-muted-foreground hover:text-destructive flex items-center gap-0.5 ml-1">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <FilterBtns items={elements} selected={selectedElements} onToggle={v => toggleFilter(selectedElements, setSelectedElements, v)} />
            <div className="w-px bg-border" />
            <FilterBtns items={roles} selected={selectedRoles} onToggle={v => toggleFilter(selectedRoles, setSelectedRoles, v)} />
          </div>
        </div>
        <div className="p-3 px-5 flex items-end">
          <div className="relative">
            <Input
              placeholder="名前で検索"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 text-xs bg-secondary border-border w-36"
            />
          </div>
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">条件に一致するキャラクターが見つかりません</div>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {filtered.map((c, i) => {
              const val = c[sortKey] || 0;
              const pct = Math.round((val / maxVal) * 100);
              const rank = i + 1;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/characters/${c.id}`)}
                  className="flex items-center gap-3 border border-border bg-card hover:border-amber-500/30 hover:bg-secondary/50 transition-all cursor-pointer p-2 pr-4"
                >
                  {/* Rank */}
                  <div className={cn(
                    "font-heading font-bold text-lg min-w-[32px] text-center",
                    rank === 1 ? "text-amber-400" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-muted-foreground/40"
                  )}>
                    {rank}
                  </div>

                  {/* Portrait */}
                  <div className="w-14 h-14 flex-shrink-0 border-2 border-amber-500/40 overflow-hidden relative">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground/30">
                        {c.name?.[0]}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-[100px]">
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{c.rarity} · {c.element} · {c.role}</div>
                  </div>

                  {/* Stat bar */}
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground min-w-[36px]">
                      {sortKeys.find(s => s.key === sortKey)?.label}
                    </span>
                    <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: '#c9a94a' }}
                      />
                    </div>
                    <span className="font-heading font-semibold text-sm min-w-[60px] text-right text-foreground">
                      {val.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtns({ items, selected, onToggle }) {
  return (
    <>
      {items.map(item => (
        <button
          key={item}
          onClick={() => onToggle(item)}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            selected.includes(item) ? "text-amber-400" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className={cn(
            "w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all",
            selected.includes(item) ? "bg-amber-500 border-amber-500 shadow-[0_0_5px_#f59e0b]" : "border-current"
          )} />
          {item}
        </button>
      ))}
    </>
  );
}