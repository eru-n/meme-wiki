import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sword, BarChart3, BookOpen, Lightbulb, Star, Shield, Heart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const elementColors = {
  '火': 'text-red-400',
  '水': 'text-blue-400',
  '風': 'text-emerald-400',
  '雷': 'text-yellow-400',
  '光': 'text-amber-300',
  '闇': 'text-purple-400',
};

function StatBar({ label, value, max = 10000, color = "bg-primary" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-heading font-semibold">{value?.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SkillCard({ name, description, cooldown, icon: Icon }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-semibold text-sm">{name || '—'}</span>
        </div>
        {cooldown !== undefined && cooldown !== null && (
          <Badge variant="outline" className="text-[10px]">CT: {cooldown}</Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description || '説明なし'}</p>
    </div>
  );
}

export default function CharacterDetailTabs({ character }) {
  const c = character;

  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="w-full bg-secondary/50 border border-border p-1 rounded-xl h-auto flex-wrap">
        <TabsTrigger value="stats" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-xs py-2.5">
          <BarChart3 className="w-3.5 h-3.5" /> ステータス
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-xs py-2.5">
          <Sword className="w-3.5 h-3.5" /> スキル
        </TabsTrigger>
        <TabsTrigger value="lore" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-xs py-2.5">
          <BookOpen className="w-3.5 h-3.5" /> ストーリー
        </TabsTrigger>
        <TabsTrigger value="tips" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-xs py-2.5">
          <Lightbulb className="w-3.5 h-3.5" /> 運用Tips
        </TabsTrigger>
      </TabsList>

      {/* Sheet 1: ステータス */}
      <TabsContent value="stats" className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">レアリティ</p>
            <div className="flex justify-center gap-0.5">
              {Array.from({ length: { 'SSR': 5, 'SR': 4, 'R': 3, 'N': 2 }[c.rarity] || 0 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">属性</p>
            <p className={cn("font-heading font-bold", elementColors[c.element])}>{c.element}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">役割</p>
            <p className="font-heading font-semibold text-sm">{c.role}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">武器</p>
            <p className="font-heading font-semibold text-sm">{c.weapon}</p>
          </div>
        </div>
        <div className="space-y-4">
          <StatBar label="HP" value={c.hp} max={15000} color="bg-emerald-500" />
          <StatBar label="攻撃力" value={c.attack} max={5000} color="bg-red-500" />
          <StatBar label="防御力" value={c.defense} max={5000} color="bg-blue-500" />
          <StatBar label="速度" value={c.speed} max={300} color="bg-yellow-500" />
          <StatBar label="会心率" value={c.critical_rate} max={100} color="bg-primary" />
        </div>
      </TabsContent>

      {/* Sheet 2: スキル */}
      <TabsContent value="skills" className="mt-6 space-y-4">
        <SkillCard name={c.skill1_name} description={c.skill1_description} cooldown={c.skill1_cooldown} icon={Sword} />
        <SkillCard name={c.skill2_name} description={c.skill2_description} cooldown={c.skill2_cooldown} icon={Shield} />
        <SkillCard name={c.ultimate_name} description={c.ultimate_description} icon={Zap} />
        <SkillCard name={c.passive_name} description={c.passive_description} icon={Heart} />
      </TabsContent>

      {/* Sheet 3: ストーリー */}
      <TabsContent value="lore" className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">CV（声優）</p>
            <p className="font-semibold text-sm">{c.voice_actor || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">出身地域</p>
            <p className="font-semibold text-sm">{c.region || '—'}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 border border-border col-span-2">
            <p className="text-xs text-muted-foreground mb-1">所属</p>
            <p className="font-semibold text-sm">{c.affiliation || '—'}</p>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">キャラクターストーリー</p>
          <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
            {c.lore || 'ストーリーはまだ追加されていません。'}
          </p>
        </div>
      </TabsContent>

      {/* Sheet 4: 運用Tips */}
      <TabsContent value="tips" className="mt-6 space-y-6">
        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">入手方法</p>
          <p className="text-sm">{c.obtain_method || '—'}</p>
        </div>
        <div className="p-5 rounded-xl bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">運用Tips / おすすめ編成</p>
          <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
            {c.tips || '運用Tipsはまだ追加されていません。'}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}