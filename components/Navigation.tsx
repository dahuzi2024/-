import React from 'react';
import { Layers } from 'lucide-react';

const Navigation: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-mono cursor-pointer" onClick={() => scrollTo('hero')}>
          <Layers className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <span className="font-bold text-sm md:text-base hidden xs:block">意义工程</span>
        </div>
        
        <div className="flex gap-3 md:gap-8 text-xs md:text-sm font-medium text-muted">
          <button onClick={() => scrollTo('simulator')} className="px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition-all">模拟器</button>
          <button onClick={() => scrollTo('trajectory')} className="px-2 py-1 rounded-md hover:text-blue-400 hover:bg-blue-500/10 transition-all">轨迹</button>
          <button onClick={() => scrollTo('velocity')} className="px-2 py-1 rounded-md hover:text-red-400 hover:bg-red-500/10 transition-all">速度</button>
          <button onClick={() => scrollTo('viscosity')} className="px-2 py-1 rounded-md hover:text-amber-400 hover:bg-amber-500/10 transition-all">粘性</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;