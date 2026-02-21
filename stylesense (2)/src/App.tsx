/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  CloudSun, 
  ShoppingBag, 
  ChevronRight, 
  RefreshCw,
  Camera,
  Heart,
  Share2,
  User
} from 'lucide-react';
import { generateOutfitRecommendation, generateOutfitImage, OutfitRecommendation } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [occasion, setOccasion] = useState('');
  const [style, setStyle] = useState('');
  const [weather, setWeather] = useState('');
  const [gender, setGender] = useState('Women');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasion && !style) return;

    setLoading(true);
    setOutfitImage(null);
    try {
      const prompt = `Gender: ${gender}. Occasion: ${occasion}. Preferred Style: ${style}. Weather/Location: ${weather}.`;
      const rec = await generateOutfitRecommendation(prompt);
      setRecommendation(rec);
      
      // Generate image based on the items
      const imageDesc = rec.items.map(i => `${i.category}: ${i.item}`).join(', ');
      const img = await generateOutfitImage(`${rec.title}. ${imageDesc}`);
      setOutfitImage(img);
    } catch (error) {
      console.error("Failed to generate outfit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">StyleSense</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#" className="hover:opacity-60 transition-opacity">Collection</a>
          <a href="#" className="hover:opacity-60 transition-opacity">Trends</a>
          <a href="#" className="hover:opacity-60 transition-opacity">About</a>
        </div>
        <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ShoppingBag className="w-5 h-5" />
        </button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Input */}
          <section className="space-y-12">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-serif leading-tight"
              >
                Your <br />
                <span className="italic text-brand-gold">Personal</span> <br />
                Stylist.
              </motion.h1>
              <p className="text-lg text-black/60 max-w-md">
                Generative AI tailored to your unique aesthetic. Tell us the occasion, and we'll craft the perfect look.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 block mb-2">Gender</label>
                  <div className="flex gap-4">
                    {['Women', 'Men', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border text-sm transition-all",
                          gender === g 
                            ? "bg-brand-black text-white border-brand-black" 
                            : "bg-transparent border-black/10 text-black/60 hover:border-black/30"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 block mb-2">Occasion</label>
                  <div className="relative">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input 
                      type="text" 
                      placeholder="e.g. Summer Wedding, Tech Interview, Date Night"
                      className="input-field pl-7"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 block mb-2">Style Preference</label>
                  <div className="relative">
                    <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input 
                      type="text" 
                      placeholder="e.g. Minimalist, Streetwear, Old Money"
                      className="input-field pl-7"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 block mb-2">Weather / Location</label>
                  <div className="relative">
                    <CloudSun className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input 
                      type="text" 
                      placeholder="e.g. Sunny Paris, Rainy London, Tropical Bali"
                      className="input-field pl-7"
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Generate Look
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-black/5 flex gap-8">
              <div className="space-y-1">
                <div className="text-2xl font-serif">10k+</div>
                <div className="text-[10px] uppercase tracking-widest text-black/40">Styles Curated</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif">98%</div>
                <div className="text-[10px] uppercase tracking-widest text-black/40">Match Rate</div>
              </div>
            </div>
          </section>

          {/* Right Column: Result */}
          <section className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
              {!recommendation && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 luxury-card bg-black/5 border-dashed border-2"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                    <Camera className="w-6 h-6 text-black/20" />
                  </div>
                  <h3 className="text-xl font-serif mb-2">Awaiting your vision</h3>
                  <p className="text-sm text-black/40 max-w-xs">
                    Fill in your preferences to see your personalized AI-generated outfit recommendation.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 luxury-card bg-white"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-gold animate-pulse" />
                  </div>
                  <h3 className="text-xl font-serif mt-8 mb-2">Curating your look...</h3>
                  <p className="text-sm text-black/40">Our AI is browsing the latest trends for you.</p>
                </motion.div>
              )}

              {recommendation && !loading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[3/4] luxury-card bg-zinc-100 group">
                    {outfitImage ? (
                      <img 
                        src={outfitImage} 
                        alt={recommendation.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                          <RefreshCw className="w-8 h-8 text-black/10 animate-spin" />
                          <span className="text-[10px] uppercase tracking-widest text-black/30">Visualizing...</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70 mb-1">Recommended Look</div>
                      <h2 className="text-3xl font-serif">{recommendation.title}</h2>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="luxury-card p-8 space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">The Concept</h3>
                      <p className="text-black/70 leading-relaxed italic">
                        "{recommendation.description}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">Ensemble Details</h3>
                      <div className="grid gap-4">
                        {recommendation.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 pb-4 border-b border-black/5 last:border-0">
                            <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                              <span className="text-xs font-mono text-brand-gold">0{idx + 1}</span>
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-black/40">{item.category}</div>
                              <div className="font-medium">{item.item}</div>
                              <div className="text-sm text-black/60 mt-0.5">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40">Stylist Notes</h3>
                      <ul className="space-y-2">
                        {recommendation.stylingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-black/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-black rounded-full flex items-center justify-center">
              <Sparkles className="text-white w-3 h-3" />
            </div>
            <span className="font-serif text-lg font-bold">StyleSense</span>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-black/40">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-black/20">
            © 2024 StyleSense AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
