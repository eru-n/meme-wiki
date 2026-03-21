import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import CharacterCard from '@/components/characters/CharacterCard';
import { Loader2 } from 'lucide-react';

export default function CharacterList() {
  const { data: characters = [], isLoading } = useQuery({
    queryKey: ['characters-all'],
    queryFn: () => base44.entities.Character.list('-created_date', 100),
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight">キャラクター図鑑</h1>
        <p className="text-sm text-muted-foreground mt-2">全{characters.length}キャラクター</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          キャラクターがまだ登録されていません
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}