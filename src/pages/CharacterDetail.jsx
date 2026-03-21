import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CharacterDetailTabs from '@/components/characters/CharacterDetailTabs';

const elementColors = {
  '火': 'bg-red-500/15 text-red-400 border-red-500/20',
  '水': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  '風': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  '雷': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  '光': 'bg-amber-300/15 text-amber-300 border-amber-300/20',
  '闇': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

export default function CharacterDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split('/');
  const charId = pathParts[pathParts.length - 1];

  const { data: character, isLoading } = useQuery({
    queryKey: ['character', charId],
    queryFn: () => base44.entities.Character.filter({ id: charId }),
    select: (data) => data?.[0],
    enabled: !!charId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">キャラクターが見つかりません</p>
        <Link to="/characters" className="text-primary text-sm hover:underline mt-2 inline-block">
          図鑑に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <Link to="/characters" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> キャラクター図鑑に戻る
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-64 shrink-0">
          <div className="aspect-[3/4] rounded-2xl border border-border bg-secondary overflow-hidden">
            {character.image_url ? (
              <img src={character.image_url} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-heading font-bold text-muted-foreground/20">
                  {character.name?.[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {Array.from({ length: { 'SSR': 5, 'SR': 4, 'R': 3, 'N': 2 }[character.rarity] || 0 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight">
              {character.name}
            </h1>
            {character.title && (
              <p className="text-muted-foreground mt-1">{character.title}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={cn("border", elementColors[character.element])}>
              {character.element}
            </Badge>
            <Badge variant="outline">{character.role}</Badge>
            <Badge variant="outline">{character.weapon}</Badge>
            <Badge variant="outline">{character.rarity}</Badge>
          </div>
        </div>
      </div>

      {/* 4 Tabs */}
      <CharacterDetailTabs character={character} />
    </div>
  );
}