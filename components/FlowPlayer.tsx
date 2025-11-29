
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Wind, CloudRain, Zap, Waves, Flame, Droplets, Activity, Radio, Moon, Sun, Disc } from 'lucide-react';

interface FlowPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

type SoundType = 
  | 'white' | 'pink' | 'brown' 
  | 'ocean' | 'rain' | 'wind' 
  | 'stream' | 'fire' | 'fan' 
  | 'space' | 'focus' | 'om';

interface SoundPreset {
  id: SoundType;
  label: string;
  icon: any;
  color: string; // Tailwind color class for active state
  desc: string;
}

const SOUNDS: SoundPreset[] = [
  // Row 1: Basic Noise
  { id: 'white', label: '白噪声', icon: Zap, color: 'text-gray-200', desc: '全频段屏蔽干扰' },
  { id: 'pink', label: '粉红噪声', icon: CloudRain, color: 'text-rose-300', desc: '舒缓自然频率' },
  { id: 'brown', label: '红噪声', icon: Moon, color: 'text-amber-700', desc: '深沉低频掩蔽' },
  
  // Row 2: Nature Water
  { id: 'ocean', label: '海浪', icon: Waves, color: 'text-blue-400', desc: '呼吸式潮汐' },
  { id: 'rain', label: '暴雨', icon: CloudRain, color: 'text-slate-400', desc: '持续降雨声' },
  { id: 'stream', label: '溪流', icon: Droplets, color: 'text-cyan-300', desc: '清脆流水' },

  // Row 3: Nature Air/Fire
  { id: 'wind', label: '狂风', icon: Wind, color: 'text-indigo-300', desc: '动态气流声' },
  { id: 'fire', label: '篝火', icon: Flame, color: 'text-orange-500', desc: '温暖爆裂声' },
  { id: 'fan', label: '机械', icon: Disc, color: 'text-emerald-200', desc: '稳定风扇转动' },

  // Row 4: Mind & Space
  { id: 'space', label: '深空', icon: Radio, color: 'text-violet-400', desc: '极低频震动' },
  { id: 'focus', label: '专注', icon: Activity, color: 'text-yellow-400', desc: '40Hz 双耳节拍' },
  { id: 'om', label: '冥想', icon: Sun, color: 'text-orange-300', desc: '神圣和弦' },
];

const FlowPlayer: React.FC<FlowPlayerProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeSound, setActiveSound] = useState<SoundType>('brown');
  const [timer, setTimer] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Audio Context Refs
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]); // Keep track of all nodes to stop them
  
  const timerRef = useRef<number | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  // --- UI INTERACTION LOGIC ---
  const resetInteractionTimer = () => {
    setShowControls(true);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    if (isPlaying) {
      interactionTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetInteractionTimer);
    window.addEventListener('touchstart', resetInteractionTimer);
    return () => {
      window.removeEventListener('mousemove', resetInteractionTimer);
      window.removeEventListener('touchstart', resetInteractionTimer);
    };
  }, [isPlaying]);

  // --- AUDIO ENGINE ---
  const initAudioContext = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  };

  const stopAllSounds = () => {
    nodesRef.current.forEach(node => {
      try {
        if (node instanceof AudioBufferSourceNode || node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      } catch (e) { /* ignore */ }
    });
    nodesRef.current = [];
  };

  // Helper: Create Noise Buffer
  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  // Helper: Make a Noise Source
  const makeNoiseSource = (ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; 
      } else if (type === 'pink') {
        data[i] = (lastOut + (0.05 * white)) / 1.05; 
        lastOut = data[i];
        data[i] *= 2.5; 
      } else {
        data[i] = white;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  // MAIN SYNTHESIS LOGIC
  const playSound = (type: SoundType) => {
    initAudioContext();
    const ctx = ctxRef.current!;
    const dest = masterGainRef.current!;
    
    stopAllSounds(); // Clear previous

    const register = (node: AudioNode) => nodesRef.current.push(node);

    switch (type) {
      case 'white':
      case 'pink':
      case 'brown': {
        const src = makeNoiseSource(ctx, type);
        src.connect(dest);
        src.start();
        register(src);
        break;
      }

      case 'ocean': {
        // Pink noise + LFO on gain
        const src = makeNoiseSource(ctx, 'pink');
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; // 0.15Hz waves
        
        // Modulate gain between 0.2 and 0.8
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3; // depth
        
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        
        src.connect(gain);
        gain.connect(dest);
        
        src.start();
        lfo.start();
        register(src); register(lfo); register(gain); register(lfoGain);
        break;
      }

      case 'rain': {
        // Brown noise + Highpass to remove muddy lows + slight variation
        const src = makeNoiseSource(ctx, 'brown');
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 200;
        
        src.connect(filter);
        filter.connect(dest);
        src.start();
        register(src); register(filter);
        break;
      }

      case 'stream': {
        // White noise + Bandpass + Low gain LFO for sparkle
        const src = makeNoiseSource(ctx, 'white');
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const filter2 = ctx.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.value = 400;

        src.connect(filter);
        filter.connect(filter2);
        filter2.connect(dest);
        src.start();
        register(src); register(filter); register(filter2);
        break;
      }

      case 'wind': {
        // White noise + Bandpass Filter modulated by LFO
        const src = makeNoiseSource(ctx, 'white');
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 1;
        
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2; // Slowly changing wind speed
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 400; // Modulate freq by +/- 400Hz
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        filter.frequency.value = 600; // Center freq
        
        src.connect(filter);
        filter.connect(dest);
        
        src.start();
        lfo.start();
        register(src); register(lfo); register(lfoGain); register(filter);
        break;
      }

      case 'fire': {
        // Brown noise for rumble + Random clicks? 
        // Simplified: Filtered Brown noise with crackle simulation is hard. 
        // Let's do a heavy Lowpass Brown noise (rumble) + jittery gain
        const src = makeNoiseSource(ctx, 'brown');
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        
        // Jitter? Using a high freq LFO on gain?
        const lfo = ctx.createOscillator();
        lfo.type = 'sawtooth';
        lfo.frequency.value = 10; // Flicker
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(dest.gain); // Modulate master gain slightly

        src.connect(filter);
        filter.connect(dest);
        src.start();
        lfo.start();
        register(src); register(filter); register(lfo); register(lfoGain);
        break;
      }

      case 'fan': {
        // Low freq triangle drone + lowpass white noise
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 60; // 60Hz hum
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.1;

        const noise = makeNoiseSource(ctx, 'white');
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.3;

        osc.connect(oscGain);
        oscGain.connect(dest);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(dest);

        osc.start();
        noise.start();
        register(osc); register(oscGain); register(noise); register(filter); register(noiseGain);
        break;
      }

      case 'space': {
        // Deep Drone: Multiple Sine/Saw waves detuned
        const freqs = [55, 57, 110]; // A1, slightly detuned A1, A2
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          const gain = ctx.createGain();
          gain.gain.value = 0.15;
          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          register(osc); register(gain);
        });
        // Add subtle LP noise
        const noise = makeNoiseSource(ctx, 'brown');
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 80;
        noise.connect(filter);
        filter.connect(dest);
        noise.start();
        register(noise); register(filter);
        break;
      }

      case 'focus': {
        // Binaural Beats (Fake stereo using merger)
        // L: 200Hz, R: 240Hz -> 40Hz Gamma beat
        const merger = ctx.createChannelMerger(2);
        const leftOsc = ctx.createOscillator();
        leftOsc.frequency.value = 200;
        const rightOsc = ctx.createOscillator();
        rightOsc.frequency.value = 240;
        
        const gain = ctx.createGain();
        gain.gain.value = 0.1;

        leftOsc.connect(merger, 0, 0);
        rightOsc.connect(merger, 0, 1);
        
        merger.connect(gain);
        gain.connect(dest);
        
        leftOsc.start();
        rightOsc.start();
        register(leftOsc); register(rightOsc); register(merger); register(gain);
        break;
      }

      case 'om': {
        // Chord Drone
        const freqs = [136.1, 204.15, 272.2]; // C# earth tone ish
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          const g = ctx.createGain();
          g.gain.value = 0.1;
          osc.connect(g);
          g.connect(dest);
          osc.start();
          register(osc); register(g);
        });
        break;
      }
    }
  };

  // Update volume
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume, ctxRef.current!.currentTime, 0.1);
    }
  }, [volume]);

  // Handle Play/Pause/Switch
  useEffect(() => {
    if (isPlaying) {
      playSound(activeSound);
    } else {
      stopAllSounds();
    }
    return () => stopAllSounds();
  }, [activeSound, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Visual Helper for background color
  const getBgColor = (id: SoundType) => {
    if (['white','stream','wind'].includes(id)) return 'bg-blue-900';
    if (['pink','ocean','fire'].includes(id)) return 'bg-rose-900';
    if (['brown','rain','fan'].includes(id)) return 'bg-amber-900';
    return 'bg-violet-900';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in touch-none select-none">
      
      {/* Background Visuals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[120px] transition-all duration-[6000ms] ease-in-out mix-blend-screen
          ${isPlaying ? 'scale-125 opacity-40 animate-breathe' : 'scale-100 opacity-20'}
          ${getBgColor(activeSound)}
        `} />
      </div>

      {/* Main Breathing Circle (Moves up when controls are shown) */}
      <div className={`relative z-10 transition-all duration-700 flex flex-col items-center
         ${showControls ? '-translate-y-24 md:-translate-y-32 scale-75 md:scale-90' : 'translate-y-0 scale-100'}
      `}>
         <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-2 transition-all duration-[4000ms] flex items-center justify-center backdrop-blur-sm
           ${isPlaying ? 'animate-breathe border-white/20 bg-white/5' : 'border-white/5 bg-transparent'}
         `}>
            <div className="text-5xl md:text-6xl font-mono font-thin text-white/90 tabular-nums">
                {formatTime(timer)}
            </div>
         </div>
         <div className={`mt-6 text-center transition-opacity duration-500 ${showControls ? 'opacity-0' : 'opacity-100'}`}>
             <p className="text-white/50 text-sm tracking-widest uppercase mb-1">Current Frequency</p>
             <p className={`text-xl font-bold ${SOUNDS.find(s=>s.id===activeSound)?.color.replace('text-','text-')}`}>
               {SOUNDS.find(s=>s.id === activeSound)?.label}
             </p>
         </div>
      </div>

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 h-[60vh] md:h-auto bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col justify-end px-4 pb-8 md:pb-12 transition-transform duration-500 ease-out z-20 ${showControls ? 'translate-y-0' : 'translate-y-[85%]'}`}>
        
        {/* Toggle Handle for Mobile */}
        <div 
          onClick={() => setShowControls(!showControls)}
          className="absolute top-8 left-1/2 -translate-x-1/2 p-4 cursor-pointer md:hidden w-full flex justify-center"
        >
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 md:gap-8">
          
          {/* Sound Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 overflow-y-auto max-h-[30vh] md:max-h-none p-1">
            {SOUNDS.map((sound) => {
              const Icon = sound.icon;
              const isActive = activeSound === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => setActiveSound(sound.id)}
                  className={`relative group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300
                    ${isActive 
                      ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  <Icon 
                    size={24} 
                    className={`transition-colors duration-300 ${isActive ? sound.color : 'text-gray-500 group-hover:text-gray-300'}`} 
                  />
                  <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {sound.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Bar: Volume & Play & Close */}
          <div className="flex items-center justify-between gap-4 md:gap-8 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            
            {/* Volume */}
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs text-muted font-mono">VOL</span>
              <input 
                type="range" min="0" max="1" step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Play/Pause Main */}
            <button 
              onClick={togglePlay}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
            </button>

            {/* Close */}
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-white/10 text-white/50 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlowPlayer;
