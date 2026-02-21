import React from 'react';
import { motion } from 'motion/react';
import { OutfitRecommendation } from '../types';
import { Bookmark, Share2, Info } from 'lucide-react';

interface OutfitDisplayProps {
  recommendation: OutfitRecommendation;
  onSave: () => void;
}

export const OutfitDisplay: React.FC<OutfitDisplayProps> = ({ recommendation, onSave }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">{recommendation.title}</h2>
          <p className="text-ink/60 max-w-xl">{recommendation.description}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onSave}
            className="p-3 rounded-full bg-white border border-ink/10 hover:bg-ink hover:text-white transition-all"
          >
            <Bookmark size={20} />
          </button>
          <button className="p-3 rounded-full bg-white border border-ink/10 hover:bg-ink hover:text-white transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendation.items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="aspect-[3/4] rounded-3xl bg-ink/5 overflow-hidden mb-4 relative">
              <img 
                src={`https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/400/600`}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-sm italic">{item.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-lg">{item.name}</h4>
                <p className="text-xs uppercase tracking-widest text-ink/40">{item.category}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
                {item.color}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 text-accent">
            <Info size={20} />
            <h3 className="text-xl font-serif">Styling Tips</h3>
          </div>
          <ul className="space-y-3">
            {recommendation.stylingTips.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-ink/70">
                <span className="text-accent font-serif italic">{idx + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-ink text-white p-8 rounded-3xl flex flex-col justify-center">
          <h3 className="text-2xl font-serif mb-4">The Occasion</h3>
          <p className="text-white/70 italic text-lg">
            "Tailored specifically for your {recommendation.occasion.toLowerCase()} event, considering your unique aesthetic and current trends."
          </p>
        </div>
      </div>
    </div>
  );
};
