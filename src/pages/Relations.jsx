import React, { useMemo, useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const relationColors = {
  '仲間':  { line: '#10b981', label: '#10b981', bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
  'ライバル': { line: '#ef4444', label: '#ef4444', bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  '師弟':  { line: '#3b82f6', label: '#3b82f6', bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  '家族':  { line: '#f59e0b', label: '#f59e0b', bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  '恋人':  { line: '#ec4899', label: '#ec4899', bg: 'rgba(236,72,153,0.15)', text: '#ec4899' },
  '敵対':  { line: '#b91c1c', label: '#b91c1c', bg: 'rgba(185,28,28,0.15)', text: '#ef4444' },
  '主従':  { line: '#a855f7', label: '#a855f7', bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
};

export default function Relations() {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 60, y: 40 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [selectedType, setSelectedType] = useState('all');

  const { data: characters = [], isLoading: loadingChars } = useQuery({
    queryKey: ['chars-relations'],
    queryFn: () => base44.entities.Character.list('name', 200),
  });

  const { data: relationships = [], isLoading: loadingRels } = useQuery({
    queryKey: ['relationships'],
    queryFn: () => base44.entities.Relationship.list('-created_date', 200),
  });

  const isLoading = loadingChars || loadingRels;

  const charMap = useMemo(() => {
    const map = {};
    characters.forEach(c => { map[c.id] = c; });
    return map;
  }, [characters]);

  // Layout: arrange characters in a circle
  const nodePositions = useMemo(() => {
    const positions = {};
    const n = characters.length;
    if (n === 0) return positions;
    const cx = 400, cy = 300, r = Math.min(250, 60 * n);
    characters.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      positions[c.id] = {
        x: cx + r * Math.cos(angle) - 35,
        y: cy + r * Math.sin(angle) - 35,
        cx: cx + r * Math.cos(angle),
        cy: cy + r * Math.sin(angle),
      };
    });
    return positions;
  }, [characters]);

  const filteredRels = useMemo(() => {
    if (selectedType === 'all') return relationships;
    return relationships.filter(r => r.relation_type === selectedType);
  }, [relationships, selectedType]);

  // Drag handlers
  const onMouseDown = (e) => {
    if (e.target.closest('.char-node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOrigin({ x: offset.x, y: offset.y });
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      setOffset({ x: dragOrigin.x + e.clientX - dragStart.x, y: dragOrigin.y + e.clientY - dragStart.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, dragStart, dragOrigin]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setScale(s => Math.max(0.3, Math.min(2.5, s + (e.deltaY < 0 ? 0.1 : -0.1))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const W = 800, H = 600;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-card/80 flex-shrink-0 flex-wrap">
        <h1 className="font-heading font-bold text-base text-foreground">相関図</h1>
        <div className="w-px h-5 bg-border" />
        {['all', ...Object.keys(relationColors)].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "px-3 py-1 text-xs border transition-all",
              selectedType === type
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground bg-transparent"
            )}
          >
            {type === 'all' ? 'すべて' : type}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="w-8 h-8 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">＋</button>
          <button onClick={() => setScale(s => Math.max(0.3, s - 0.2))} className="w-8 h-8 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">－</button>
          <button onClick={() => { setScale(1); setOffset({ x: 60, y: 40 }); }} className="w-8 h-8 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">⌂</button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        onMouseDown={onMouseDown}
        className="flex-1 overflow-hidden relative"
        style={{
          background: '#0a0a10',
          backgroundImage: 'radial-gradient(circle, #1e1e28 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <div style={{ transform: `translate(${offset.x}px,${offset.y}px) scale(${scale})`, transformOrigin: '0 0', position: 'absolute' }}>
          {/* SVG for lines */}
          <svg width={W} height={H} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}>
            {filteredRels.map((rel, i) => {
              const p1 = nodePositions[rel.character1_id];
              const p2 = nodePositions[rel.character2_id];
              if (!p1 || !p2) return null;
              const col = relationColors[rel.relation_type];
              const color = col?.line || '#888';
              const mx = (p1.cx + p2.cx) / 2;
              const my = (p1.cy + p2.cy) / 2;
              return (
                <g key={rel.id}>
                  <line x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} stroke={color} strokeWidth="2" strokeOpacity="0.7" />
                  <foreignObject x={mx - 22} y={my - 10} width={56} height={22}>
                    <div
                      style={{
                        background: color,
                        color: '#0a0a0c',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                      }}
                    >
                      {rel.relation_type}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Character nodes */}
          {characters.map(c => {
            const pos = nodePositions[c.id];
            if (!pos) return null;
            return (
              <div
                key={c.id}
                className="char-node absolute flex flex-col items-center gap-1 cursor-pointer group"
                style={{ left: pos.x, top: pos.y, width: 70 }}
                onClick={() => navigate(`/characters/${c.id}`)}
              >
                <div
                  className="w-[70px] h-[70px] overflow-hidden flex items-center justify-center transition-all group-hover:-translate-y-1"
                  style={{
                    border: '2px solid #c9a94a',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    position: 'relative',
                  }}
                >
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground/40">
                      {c.name?.[0]}
                    </div>
                  )}
                </div>
                <div
                  className="text-[11px] font-medium text-foreground text-center whitespace-nowrap px-1.5 py-0.5"
                  style={{ background: 'rgba(10,10,12,0.85)', letterSpacing: '0.04em' }}
                >
                  {c.name}
                </div>
              </div>
            );
          })}
        </div>

        {relationships.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            相関関係がまだ登録されていません
          </div>
        )}
      </div>
    </div>
  );
}