import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, Sword, Shield, Heart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const elementColors = {
  '火': 'bg-red-500/15 text-red-400 border-red-500/20',
  '水': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  '風': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  '雷': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  '光': 'bg-amber-300/15 text-amber-300 border-amber-300/20',
  '闇': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

const elementGlows = {
  '火': 'shadow-red-500/10',
  '水': 'shadow-blue-500/10',
  '風': 'shadow-emerald-500/10',
  '雷': 'shadow-yellow-500/10',
  '光': 'shadow-amber-300/10',
  '闇': 'shadow-purple-500/10',
};

const rarityStars = { 'SSR': 5, 'SR': 4, 'R': 3, 'N': 2 };

const roleIcons = {
  'アタッカー': Sword,
  'タンク': Shield,
  'ヒーラー': Heart,
  'サポーター': Zap,
};

export default function CharacterCard({ character, index = 0 }) {
  const RoleIcon = roleIcons[character.role] || Sword;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/characters/${character.id}`}>
        <div className={cn(
          "group relative rounded-2xl border border-border bg-card overflow-hidden",
          "hover:border-primary/30 transition-all duration-300",
          "hover:shadow-xl", elementGlows[character.element]
        )}>
          {/* Image */}
          <div className="aspect-[3/4] bg-secondary relative overflow-hidden">
            {character.image_url ? (
              <img src={character.image_url} alt={character.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-heading font-bold text-muted-foreground/30">
                  {character.name?.[0]}
                </span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Rarity stars */}
            <div className="absolute top-3 left-3 flex gap-0.5">
              {Array.from({ length: rarityStars[character.rarity] || 0 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Element badge */}
            <Badge className={cn("absolute top-3 right-3 border text-[10px]", elementColors[character.element])}>
              {character.element}
            </Badge>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-card-foreground truncate">
                {character.name}
              </h3>
              <RoleIcon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            {character.title && (
              <p className="text-[11px] text-muted-foreground truncate">{character.title}</p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] border-border">
                {character.role}
              </Badge>
              <Badge variant="outline" className="text-[10px] border-border">
                {character.weapon}
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}