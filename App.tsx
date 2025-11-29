
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SECTIONS } from './constants';
import Navigation from './components/Navigation';
import Simulator from './components/Simulator';
import Article from './components/Article';
import FlowPlayer from './components/FlowPlayer';
import { ArrowDown, ShieldAlert, Headphones } from 'lucide-react';

const App: React.FC = () => {
  const [isFlowMode, setIsFlowMode] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 selection:text-white pb-safe">
      <Navigation />
      <FlowPlayer isOpen={isFlowMode} onClose={() => setIsFlowMode(false)} />

      {!isFlowMode && (
        <button 
          onClick={() => setIsFlowMode(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-transform flex items-center justify-center group"
          title="进入心流舱"
        >
          <Headphones size={24} />
        </button>
      )}

      {/* Simplified Hero & Diagnostic Section */}
      <section id="hero" className="relative pt-24 pb-12 px-4 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 text-[10px] md:text-xs font-mono tracking-widest text-muted">
             <ShieldAlert size={12} className="text-red-400" />
             ATTENTION_DEFICIT_RECOVERY_PROTOCOL
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            你的注意力<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">是不是碎了？</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            在被算法切碎的世界里，找回连续性。
            <br/>输入你的状态，系统将为你生成修复方案。
          </p>
        </div>

        {/* The Main Terminal */}
        <div id="simulator" className="max-w-6xl mx-auto px-2 relative z-20">
           <Simulator onEnterFlow={() => setIsFlowMode(true)} />
        </div>
      </section>

      {/* Content Sections */}
      <div className="bg-background">
        <div className="py-8 text-center text-xs font-mono text-muted/50 uppercase tracking-widest">Deep Dive Analysis</div>
        {SECTIONS.map((section, index) => (
          <Article 
            key={section.id} 
            data={section} 
            align={index % 2 === 0 ? 'left' : 'right'} 
          />
        ))}
      </div>

      <footer className="py-12 border-t border-white/10 text-center text-muted text-sm bg-surface/20">
        <div className="max-w-2xl mx-auto px-6">
          <p className="opacity-70">让每一个瞬间重新拥有重量。</p>
          <div className="pt-4 opacity-30 font-mono text-xs">MEANING ENGINEERING v7.0</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
