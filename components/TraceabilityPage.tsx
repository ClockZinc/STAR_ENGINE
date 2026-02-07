import React, { useState } from 'react';
import { 
  ShieldCheck, Heart, Share2, Award, Volume2, Music2, 
  Boxes, Info, Sparkles, Copy, ChevronRight, 
  Clock, Gavel, Cpu, Package, CheckCircle2
} from 'lucide-react';
import StarVisualizer from './StarVisualizer.tsx';

/**
 * TRACEABILITY PAGE (NFC Digital Twin Simulator)
 * THEME: "Digital Ownership Capsule"
 */
const TraceabilityPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeView, setActiveView] = useState<'3d' | 'original'>('3d');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("DCI-STAR-2026-X889");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineNodes = [
    { label: '灵感捕捉', date: '2026.01.12', icon: Heart, color: 'text-rose-400' },
    { label: '法律确权', date: '2026.01.20', icon: Gavel, color: 'text-emerald-400' },
    { label: '数字孪生', date: '2026.01.28', icon: Cpu, color: 'text-cyan-400' },
    { label: '物理绑定', date: '2026.02.05', icon: Package, color: 'text-indigo-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#050A18] animate-in fade-in duration-700 overflow-x-hidden relative custom-scrollbar">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[80%] h-[60%] bg-cyan-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Header Shield */}
      <div className="p-8 pb-4 relative z-20 flex flex-col items-center text-center space-y-4">
         <div className="relative group">
            <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="w-20 h-20 bg-slate-900 border-2 border-cyan-400/30 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl transition-transform group-hover:rotate-12">
               <ShieldCheck className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#050A18] flex items-center justify-center">
               <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
         </div>
         
         <div className="space-y-1">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] font-orbitron">Verified_Artifact</h4>
            <div 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition-all"
            >
               <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">DCI-STAR-2026-X889</span>
               <Copy className={`w-3 h-3 ${copied ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
         </div>
      </div>

      {/* Hero Asset Viewport */}
      <div className="px-6 space-y-8 relative z-10">
         <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-2 border-white/5 shadow-2xl bg-black">
            {/* View Switch */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-30">
               <div className="flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setActiveView('3d')}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest ${activeView === '3d' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500'}`}
                  >
                    3D Twin
                  </button>
                  <button 
                    onClick={() => setActiveView('original')}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest ${activeView === 'original' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
                  >
                    Original
                  </button>
               </div>
               <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white/60">
                  <Share2 className="w-4 h-4" />
               </button>
            </div>

            {/* Asset Rendering */}
            <div className="absolute inset-0 transition-all duration-1000">
               {activeView === 'original' ? (
                 <img src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80" className="w-full h-full object-cover opacity-80" />
               ) : (
                 <div className="w-full h-full relative flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?w=800&q=80" className="w-full h-full object-cover opacity-30 mix-blend-screen" />
                    <Boxes className="w-40 h-40 text-cyan-400/20 absolute animate-[spin_30s_linear_infinite]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-black/80"></div>
                 </div>
               )}
            </div>
            
            {/* Audio Visualization Layer */}
            <StarVisualizer isPlaying={isPlaying} assetName="午夜星系" />

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.8)] z-40 active:scale-90 transition-transform"
            >
               {isPlaying ? <Volume2 className="w-8 h-8 text-white" /> : <Music2 className="w-8 h-8 text-white animate-pulse" />}
            </button>

            <div className="absolute bottom-10 left-10 z-30">
               <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="w-4 h-4 text-amber-400" />
                 <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-600/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-500/30">Voice of Star Active</span>
               </div>
               <h3 className="text-3xl font-black text-white font-orbitron tracking-tighter uppercase leading-none">Midnight<br/>Soul</h3>
            </div>
         </div>

         {/* Trust Timeline */}
         <div className="p-10 glass-panel rounded-[3.5rem] space-y-8 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-white font-orbitron uppercase tracking-[0.4em] flex items-center gap-3">
               <Boxes className="w-4 h-4 text-indigo-400" />
               Provenance_Chain
            </h3>
            
            <div className="space-y-8 relative">
               <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/5"></div>
               {timelineNodes.map((node, i) => (
                  <div key={i} className="flex gap-8 group animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i*100}ms` }}>
                     <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center bg-[#050A18] border border-white/5 ${node.color} shadow-lg`}>
                        <node.icon className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h5 className="text-sm font-bold text-white tracking-tight">{node.label}</h5>
                           <span className="text-[9px] font-mono text-slate-500">{node.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">区块链节点：NODE-7218-SECURE</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Social Impact Metrics */}
         <div className="p-8 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-[3rem] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                        <Heart className="w-5 h-5 text-[#D4AF37]" />
                     </div>
                     <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">社会价值守护</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-white font-orbitron">120</span>
                     <span className="text-xs font-bold text-[#D4AF37] uppercase">康复支持时长</span>
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed italic">
                     “该作品每一件物理实物的认养，都将为创作者提供必要的康复辅助。”
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">全球位次</p>
                  <p className="text-2xl font-black text-white font-orbitron">#008</p>
               </div>
            </div>
         </div>

         {/* Action Button */}
         <div className="pb-16 pt-4 space-y-6">
            <button className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
               <Share2 className="w-5 h-5" /> 见证我的艺术守护
            </button>
            <div className="flex items-center justify-center gap-2 opacity-40">
               <Info className="w-3 h-3 text-slate-400" />
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Security Verified by Starlight Engine v1.4</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TraceabilityPage;