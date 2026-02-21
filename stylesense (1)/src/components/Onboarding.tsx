import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, User, Palette, Ruler } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { name: string; style_preference: string; body_type: string }) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    style_preference: '',
    body_type: '',
  });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-serif mb-2">Welcome to StyleSense</h2>
            <p className="text-ink/60 mb-6">Let's start with your name.</p>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white/50"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <button 
              onClick={nextStep}
              disabled={!formData.name}
              className="w-full mt-8 bg-ink text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-serif mb-2">Your Aesthetic</h2>
            <p className="text-ink/60 mb-6">How would you describe your style?</p>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Minimalist, Streetwear, Bohemian"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white/50"
                value={formData.style_preference}
                onChange={e => setFormData({ ...formData, style_preference: e.target.value })}
              />
            </div>
            <button 
              onClick={nextStep}
              disabled={!formData.style_preference}
              className="w-full mt-8 bg-ink text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-serif mb-2">Final Detail</h2>
            <p className="text-ink/60 mb-6">What's your body type or fit preference?</p>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Athletic, Slim, Oversized"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white/50"
                value={formData.body_type}
                onChange={e => setFormData({ ...formData, body_type: e.target.value })}
              />
            </div>
            <button 
              onClick={() => onComplete(formData)}
              disabled={!formData.body_type}
              className="w-full mt-8 bg-accent text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              Complete Profile <Sparkles size={18} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
