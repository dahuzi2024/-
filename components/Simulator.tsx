
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DIAGNOSTICS, SOLUTIONS, QUIZ_QUESTIONS, KEYWORDS_DB } from '../constants';
import { PhaseType, SimulationState } from '../types';
import { AlertTriangle, CheckCircle, Activity, PlayCircle, RefreshCw, ChevronRight, Terminal, PenTool, ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SimulatorProps {
  onEnterFlow: () => void;
}

const Simulator: React.FC<SimulatorProps> = ({ onEnterFlow }) => {
  // Mode: 'input' (default) | 'quiz' | 'result'
  const [mode, setMode] = useState<'input' | 'quiz' | 'result'>('input');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rawScores, setRawScores] = useState<Record<PhaseType, number[]>>({
    [PhaseType.Trajectory]: [],
    [PhaseType.Velocity]: [],
    [PhaseType.Viscosity]: []
  });

  // Final Values
  const [values, setValues] = useState<SimulationState>({
    [PhaseType.Trajectory]: 50,
    [PhaseType.Velocity]: 50,
    [PhaseType.Viscosity]: 50,
  });

  const [diagnosisKey, setDiagnosisKey] = useState<string>('unstable');

  // Diagnosis Logic
  const runDiagnosis = (traj: number, vel: number, visc: number) => {
    if (vel > 65 && (traj < 45 || visc < 40)) return 'fragmented';
    if (Math.abs(traj - vel) < 20 && Math.abs(vel - visc) < 20 && traj > 65) return 'balanced';
    if (traj > 75 && vel > 75 && visc < 45) return 'burnout';
    if (vel > 70 && visc < 50) return 'high_vel_low_visc';
    if (traj > 70 && visc < 45) return 'high_traj_low_visc';
    if (traj < 35 && vel < 35) return 'low_traj_low_vel';
    if (visc > 75 && vel < 40) return 'high_visc_low_vel';
    if (traj < 30 && vel < 30 && visc < 30) return 'nihilism';
    return 'unstable';
  };

  useEffect(() => {
    if (mode === 'result') {
      const key = runDiagnosis(values[PhaseType.Trajectory], values[PhaseType.Velocity], values[PhaseType.Viscosity]);
      setDiagnosisKey(key);
    }
  }, [values, mode]);

  // --- TEXT ANALYSIS LOGIC ---
  const analyzeText = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    
    // Base values (start from average)
    let scores = {
      [PhaseType.Trajectory]: 50,
      [PhaseType.Velocity]: 50,
      [PhaseType.Viscosity]: 50
    };
    
    // Simple Keyword matching
    const words = inputText.toLowerCase();
    
    KEYWORDS_DB.forEach(kw => {
      if (words.includes(kw.word)) {
        scores[kw.dimension] += kw.score;
      }
    });

    // Clamp values 0-100
    const clamp = (num: number) => Math.min(100, Math.max(0, num));
    
    setTimeout(() => {
      setValues({
        [PhaseType.Trajectory]: clamp(scores[PhaseType.Trajectory]),
        [PhaseType.Velocity]: clamp(scores[PhaseType.Velocity]),
        [PhaseType.Viscosity]: clamp(scores[PhaseType.Viscosity]),
      });
      setIsAnalyzing(false);
      setMode('result');
    }, 1500); // Fake processing delay for effect
  };

  // --- QUIZ LOGIC ---
  const handleStartQuiz = () => {
    setMode('quiz');
    setCurrentQuestionIndex(0);
    setRawScores({ [PhaseType.Trajectory]: [], [PhaseType.Velocity]: [], [PhaseType.Viscosity]: [] });
  };

  const handleQuizAnswer = (score: number) => {
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    const updatedScores = { ...rawScores, [currentQ.dimension]: [...rawScores[currentQ.dimension], score] };
    setRawScores(updatedScores);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
    } else {
      const calcAverage = (nums: number[]) => Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
      setValues({
        [PhaseType.Trajectory]: calcAverage(updatedScores[PhaseType.Trajectory]),
        [PhaseType.Velocity]: calcAverage(updatedScores[PhaseType.Velocity]),
        [PhaseType.Viscosity]: calcAverage(updatedScores[PhaseType.Viscosity]),
      });
      setMode('result');
    }
  };

  const handleReset = () => {
    setMode('input');
    setInputText('');
    setDiagnosisKey('unstable');
  };

  const getStatusColor = (key: string) => {
    if (key === 'balanced') return 'border-green-500 bg-green-900/20 text-green-400';
    if (key === 'fragmented' || key === 'nihilism' || key === 'burnout') return 'border-red-500 bg-red-900/20 text-red-400';
    return 'border-amber-500 bg-amber-900/20 text-amber-400';
  };

  const data = [
    { subject: '奔头 (S)', A: values[PhaseType.Trajectory], fullMark: 100 },
    { subject: '节奏 (I)', A: values[PhaseType.Velocity], fullMark: 100 },
    { subject: '扎实 (O)', A: values[PhaseType.Viscosity], fullMark: 100 },
  ];

  // --- VIEW: INPUT TERMINAL ---
  if (mode === 'input') {
    return (
      <div className="w-full max-w-4xl mx-auto bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in relative">
        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs font-mono text-muted">
             <Terminal size={14} />
             <span>DIAGNOSTIC_TERMINAL_V7.0</span>
           </div>
           <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
           </div>
        </div>
        
        <div className="p-6 md:p-10 flex flex-col gap-6">
           <div className="space-y-2">
             <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
               <Activity className="text-primary animate-pulse" />
               请输入你的当前状态
             </h3>
             <p className="text-muted text-sm">
               无需思考专业术语。直接告诉终端你最近的感觉。
               <br/>例如：“<span className="text-white/70 italic">最近工作很忙，但觉得没意义，心里很慌</span>” 或 “<span className="text-white/70 italic">感觉生活像白开水，提不起劲</span>”
             </p>
           </div>

           <div className="relative">
             <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在此输入..."
                className="w-full h-40 bg-black/30 border border-white/10 rounded-lg p-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none font-mono leading-relaxed"
             />
             {isAnalyzing && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10">
                 <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                 <span className="text-primary font-mono text-sm animate-pulse">ANALYZING_KEYWORDS...</span>
               </div>
             )}
           </div>

           <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             <button 
               onClick={handleStartQuiz}
               className="text-xs text-muted hover:text-white flex items-center gap-1 transition-colors"
             >
               <ClipboardList size={14} /> 不想打字？切换到选择题模式
             </button>

             <button 
               onClick={analyzeText}
               disabled={!inputText.trim() || isAnalyzing}
               className="w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <PenTool size={18} /> 开始分析
             </button>
           </div>
        </div>
      </div>
    );
  }

  // --- VIEW: QUIZ ---
  if (mode === 'quiz') {
    const question = QUIZ_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100;
    
    return (
      <div className="w-full max-w-2xl mx-auto bg-surface border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="mb-6 text-xs font-mono text-primary tracking-widest uppercase flex justify-between">
             <span>Q {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
             <button onClick={handleReset} className="hover:text-white transition-colors">EXIT</button>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuizAnswer(opt.score)} className="w-full text-left p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white flex justify-between group">
                <span>{opt.text}</span>
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: RESULT ---
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-fade-in">
      {/* Chart */}
      <div className="space-y-6 bg-surface p-6 md:p-8 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 opacity-50" />
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> 精神画像分析</h3>
           <button onClick={handleReset} className="text-xs flex items-center gap-1 text-muted hover:text-white transition-colors"><RefreshCw size={12} /> 重置</button>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Meaning" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted pt-4 border-t border-white/5">
           <div>奔头: <span className="text-blue-400 font-bold text-sm">{values[PhaseType.Trajectory]}</span></div>
           <div>节奏: <span className="text-red-400 font-bold text-sm">{values[PhaseType.Velocity]}</span></div>
           <div>扎实: <span className="text-amber-400 font-bold text-sm">{values[PhaseType.Viscosity]}</span></div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className={`p-6 md:p-8 rounded-xl border-l-4 transition-all shadow-lg h-full flex flex-col ${getStatusColor(diagnosisKey)}`}>
        <div className="flex items-center gap-3 mb-4">
          {diagnosisKey === 'balanced' ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
          <h4 className="font-bold text-xl md:text-2xl uppercase tracking-wide">{DIAGNOSTICS[diagnosisKey]}</h4>
        </div>
        <div className="text-sm md:text-base leading-relaxed text-gray-300 prose prose-invert prose-strong:text-white/90 border-t border-white/10 pt-4 flex-1">
          <ReactMarkdown>{SOLUTIONS[diagnosisKey]}</ReactMarkdown>
        </div>
        <button 
          onClick={onEnterFlow}
          className="mt-8 w-full py-4 font-bold rounded-lg bg-white text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
        >
          <PlayCircle className="w-5 h-5" />
          {diagnosisKey === 'balanced' ? '进入心流舱：保持状态' : '启动心流舱：物理修复'}
        </button>
      </div>
    </div>
  );
};

export default Simulator;
