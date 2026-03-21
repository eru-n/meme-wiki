import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const regionConfig = {
  '王都':    { fill: 'rgba(245,158,11,0.5)',  stroke: '#c9a94a', labelFill: '#e8d878', path: 'M 320 60 L 480 50 L 520 180 L 440 240 L 300 220 L 280 120 Z', lx: 400, ly: 145 },
  '東の森':  { fill: 'rgba(16,185,129,0.45)', stroke: '#3abf6a', labelFill: '#88e0a8', path: 'M 520 50 L 680 60 L 700 200 L 560 240 L 520 180 L 480 50 Z', lx: 600, ly: 145 },
  '北の山脈': { fill: 'rgba(59,130,246,0.45)', stroke: '#4a7fc9', labelFill: '#a8c8f0', path: 'M 80 40 L 320 60 L 280 120 L 300 220 L 120 240 L 60 140 Z', lx: 190, ly: 145 },
  '南の砂漠': { fill: 'rgba(202,138,4,0.45)',  stroke: '#bfb03a', labelFill: '#e8d080', path: 'M 280 120 L 300 220 L 440 240 L 520 180 L 560 240 L 520 380 L 300 400 L 160 360 L 120 240 L 300 220 Z', lx: 370, ly: 310 },
  '西の海岸': { fill: 'rgba(6,182,212,0.45)',  stroke: '#4abfc9', labelFill: '#88d8e0', path: 'M 60 140 L 120 240 L 160 360 L 60 400 L 20 300 L 20 180 Z', lx: 80, ly: 280 },
  '魔界':    { fill: 'rgba(168,85,247,0.45)', stroke: '#a855f7', labelFill: '#d0a8f0', path: 'M 560 240 L 700 200 L 740 360 L 640 420 L 520 380 L 560 240 Z', lx: 625, ly: 310 },
};

const W = 760, H = 460;

export default function GameMap() {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 40, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['map-locations'],
    queryFn: () => base44.entities.MapLocation.list('name', 200),
  });

  const onMouseDown = (e) => {
    if (e.target.closest('.loc-pin') || e.target.closest('.map-controls')) return;
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
      setScale(s => Math.max(0.3, Math.min(3, s + (e.deltaY < 0 ? 0.15 : -0.15))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Convert % position to SVG coords
  const locToSvg = (loc) => ({
    x: (loc.x_position / 100) * W,
    y: (loc.y_position / 100) * H,
  });

  const activeDesc = activeRegion ? `${activeRegion}：${
    { '王都': '世界の中心に位置する巨大な城都。騎士団と軍参謀部が本拠を構える。',
      '東の森': '常に霧がかかる神秘的な森。星詠みの神殿がある。',
      '北の山脈': '北の山脈にそびえる難攻不落の要塞。氷壁騎士団の拠点。',
      '南の砂漠': '広大な砂漠の中にある稀少なオアシス。遊牧民たちの交易拠点。',
      '西の海岸': '西の海岸に位置する活気ある港町。商人や冒険者が集まる。',
      '魔界': '魔界への入り口。強力な魔物が跋扈する危険地帯。',
    }[activeRegion] || ''
  }` : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border bg-card flex-shrink-0 flex-wrap">
        <div className="flex border border-border">
          <button onClick={() => setShowLabels(true)} className={cn("px-3 py-1 text-xs transition-all", showLabels ? "bg-amber-500/10 text-amber-400 border-r border-amber-500/30" : "text-muted-foreground border-r border-border hover:text-foreground")}>文字あり</button>
          <button onClick={() => setShowLabels(false)} className={cn("px-3 py-1 text-xs transition-all", !showLabels ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:text-foreground")}>文字なし</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(regionConfig).map(r => (
            <button
              key={r}
              onClick={() => setActiveRegion(a => a === r ? null : r)}
              className={cn(
                "px-3 py-1 text-xs border transition-all",
                activeRegion === r
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="map-controls ml-auto flex gap-1">
          <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="w-7 h-7 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">＋</button>
          <button onClick={() => setScale(s => Math.max(0.3, s - 0.2))} className="w-7 h-7 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">－</button>
          <button onClick={() => { setScale(1); setOffset({ x: 40, y: 20 }); }} className="w-7 h-7 border border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground flex items-center justify-center text-sm transition-all">⌂</button>
        </div>
      </div>

      {/* Desc panel */}
      <div className={cn(
        "px-5 py-2.5 border-b border-border text-xs leading-relaxed flex-shrink-0 min-h-[40px]",
        activeDesc ? "text-muted-foreground bg-secondary/30" : "text-muted-foreground/40 italic"
      )}>
        {activeDesc || '地域をクリックすると説明が表示されます'}
      </div>

      {/* Canvas + detail */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map canvas */}
        <div
          ref={wrapRef}
          onMouseDown={onMouseDown}
          className="flex-1 relative overflow-hidden"
          style={{
            background: '#0a0a10',
            backgroundImage: 'radial-gradient(circle, #1e1e28 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <div style={{ transform: `translate(${offset.x}px,${offset.y}px) scale(${scale})`, transformOrigin: '0 0', position: 'absolute' }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow2"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width={W} height={H} fill="#0a1020" />
              {Object.entries(regionConfig).map(([name, cfg]) => (
                <g key={name} onClick={() => setActiveRegion(a => a === name ? null : name)} style={{ cursor: 'pointer' }}>
                  <path
                    d={cfg.path}
                    fill={cfg.fill}
                    stroke={cfg.stroke}
                    strokeWidth={activeRegion === name ? 2.5 : 1.5}
                    filter={activeRegion === name ? 'url(#glow2)' : undefined}
                    opacity={activeRegion && activeRegion !== name ? 0.5 : 1}
                  />
                  {showLabels && (
                    <text x={cfg.lx} y={cfg.ly} fontFamily="serif" fontSize="14" fontWeight="bold" fill={cfg.labelFill} textAnchor="middle" style={{ pointerEvents: 'none', letterSpacing: '0.08em' }}>
                      {name}
                    </text>
                  )}
                </g>
              ))}
              {/* Location pins */}
              {locations.map(loc => {
                const { x, y } = locToSvg(loc);
                const isSelected = selectedLocation?.id === loc.id;
                const regCfg = regionConfig[loc.region];
                const color = regCfg?.stroke || '#888';
                return (
                  <g key={loc.id} className="loc-pin" onClick={e => { e.stopPropagation(); setSelectedLocation(l => l?.id === loc.id ? null : loc); }} style={{ cursor: 'pointer' }}>
                    <circle cx={x} cy={y} r={isSelected ? 10 : 7} fill={color} stroke="#0a0a10" strokeWidth="1.5" opacity={0.9} />
                    {isSelected && <circle cx={x} cy={y} r={14} fill="none" stroke={color} strokeWidth="1" opacity={0.5} />}
                    {showLabels && (
                      <text x={x} y={y + 20} fontSize="10" fill="#e8e4d8" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                        {loc.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Location list + detail */}
        <div className="w-64 flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
          {selectedLocation && (
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-heading font-bold text-sm">{selectedLocation.name}</h3>
                <button onClick={() => setSelectedLocation(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>
              <div className="text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 inline-block mb-2">{selectedLocation.region}</div>
              {selectedLocation.description && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{selectedLocation.description}</p>
              )}
              {selectedLocation.level_range && (
                <div className="flex justify-between text-xs py-1 border-b border-border">
                  <span className="text-muted-foreground">推奨レベル</span>
                  <span className="font-medium">{selectedLocation.level_range}</span>
                </div>
              )}
              {selectedLocation.notable_drops && (
                <div className="flex justify-between text-xs py-1">
                  <span className="text-muted-foreground">ドロップ</span>
                  <span className="font-medium text-right max-w-[120px]">{selectedLocation.notable_drops}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(l => l?.id === loc.id ? null : loc)}
                className={cn(
                  "w-full text-left px-4 py-2.5 border-b border-border flex items-center gap-2 transition-all text-xs",
                  selectedLocation?.id === loc.id
                    ? "bg-amber-500/10 text-amber-400 border-l-2 border-l-amber-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: regionConfig[loc.region]?.stroke || '#888' }} />
                <span className="truncate">{loc.name}</span>
                <span className="ml-auto text-[10px] opacity-60">{loc.region}</span>
              </button>
            ))}
            {locations.length === 0 && !isLoading && (
              <div className="p-4 text-xs text-muted-foreground text-center">ロケーション未登録</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}