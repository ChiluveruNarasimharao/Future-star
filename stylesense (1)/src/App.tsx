import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { OutfitDisplay } from './components/OutfitDisplay';
import { generateOutfitRecommendation, getFashionTrends } from './services/geminiService';
import { User, OutfitRecommendation } from './types';
import { Sparkles, Search, History, TrendingUp, LogOut, Menu, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [occasion, setOccasion] = useState('');
  const [trends, setTrends] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const t = await getFashionTrends();
        setTrends(t);
      } catch (e) {
        console.error("Failed to fetch trends", e);
      }
    };
    fetchTrends();
  }, []);

  const handleOnboarding = async (data: { name: string; style_preference: string; body_type: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const userData = await res.json();
      setUser({ ...data, id: userData.id });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !occasion) return;
    setLoading(true);
    try {
      const rec = await generateOutfitRecommendation(user.style_preference, occasion);
      setRecommendation(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async () => {
    if (!user || !recommendation) return;
    try {
      await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          outfitJson: JSON.stringify(recommendation),
          occasion: recommendation.occasion
        }),
      });
      alert("Outfit saved to your collection!");
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 border-r border-ink/10 bg-white p-8 flex flex-col h-screen sticky top-0 z-50"
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-ink text-white rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight">StyleSense</h1>
            </div>

            <nav className="flex-1 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-4 font-bold">Main Menu</p>
                <ul className="space-y-2">
                  <li>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-accent/10 text-accent font-medium">
                      <Search size={18} /> Stylist
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-ink/60 hover:bg-ink/5 transition-colors">
                      <History size={18} /> Collection
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-4 font-bold">Trending Now</p>
                <ul className="space-y-3">
                  {trends.map((trend, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink/70 group cursor-pointer">
                      <TrendingUp size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="group-hover:text-ink transition-colors">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="pt-8 border-t border-ink/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  {user.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-ink/40">{user.style_preference}</p>
                </div>
              </div>
              <button 
                onClick={() => setUser(null)}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex gap-4">
             <div className="px-4 py-2 rounded-full border border-ink/10 text-xs font-medium uppercase tracking-wider">
               {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
             </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <section className="mb-16">
            <h2 className="text-6xl font-serif mb-8 leading-tight">
              Find your perfect <br />
              <span className="italic text-accent">aesthetic</span> today.
            </h2>

            <form onSubmit={handleGenerate} className="flex gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                <input 
                  type="text" 
                  placeholder="What's the occasion? (e.g. Summer Wedding, Job Interview)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white shadow-sm"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !occasion}
                className="bg-ink text-white px-8 py-4 rounded-2xl font-medium hover:bg-ink/90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Consulting Stylist...' : 'Style Me'}
                <Sparkles size={18} />
              </button>
            </form>
          </section>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-serif italic text-xl text-ink/60">Curating your personalized look...</p>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="recommendation"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <OutfitDisplay recommendation={recommendation} onSave={saveOutfit} />
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-ink/5 rounded-3xl"></div>
                    <div className="h-4 bg-ink/10 w-2/3 rounded"></div>
                    <div className="h-4 bg-ink/10 w-1/2 rounded"></div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
