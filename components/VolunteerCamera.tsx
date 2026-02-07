
import React, { useState } from 'react';
import { Camera, RefreshCw, Zap, Heart, Info, ArrowLeft, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * VOLUNTEER CAMERA (Small Program Implementation)
 * BUSINESS INTENT: Ensure high-quality input for 3D modeling using a guided composition mask.
 * Includes a simulated AI processing phase.
 */
const VolunteerCamera: React.FC = () => {
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleCapture = async () => {
    setCaptured(true);
    setProcessing(true);
    // Simulate AI perception and blockchain minting
    await new Promise(r => setTimeout(r, 2500));
    setProcessing(false);
    setMinted(true);
  };

  const handleReset = () => {
    setCaptured(false);
    setProcessing(false);
    setMinted(false);
  };

  return (
    <div className="h-full flex flex-col bg-black relative animate-in fade-in duration-500">
      {/* 1. Camera Viewport */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" 
          className={`w-full h-full object-cover transition-all duration-700 ${captured ? 'brightness-50 grayscale' : 'brightness-100'}`} 
        />
        
        {/* 2. Composition Mask */}
        {!captured && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
             <div className="w-full aspect-square border-2 border-dashed border-cyan-400/50 rounded-[4rem] relative shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                <div className="absolute inset-0 bg-cyan-400/5 backdrop-blur-[2px]"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/20"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/20"></div>
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                   <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest animate-pulse">将画作置于圆环中心</p>
                   <p className="text-white/40 text-[8px] mt-1 font-medium italic">确保光线均匀，避免阴影遮挡视觉 DNA</p>
                </div>
             </div>
          </div>
        )}

        {/* 3. AI Scan Animation */}
        {!captured && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_3s_linear_infinite] shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
        )}

        {/* 4. Processing Overlay */}
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
             <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
             <p className="text-xs font-bold text-white uppercase tracking-widest">正在提取视觉 DNA</p>
             <p className="text-[8px] text-slate-500 mt-2 font-mono">ENCRYPTING_METADATA_0X9F2...</p>
          </div>
        )}

        {/* 5. Minted Result */}
        {minted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-30 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-6">
                <ShieldCheck className="w-10 h-10 text-white" />
             </div>
             <h4 className="text-lg font-bold text-white">确权存证已完成</h4>
             <p className="text-[10px] text-slate-400 mt-2 text-center leading-relaxed">
               该画作已正式进入「星光引擎」确权流程，区块链哈希已生成，并实时同步给律师端进行合规审计。
             </p>
             <button 
                onClick={handleReset}
                className="mt-8 px-6 py-2 bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
             >
               拍摄下一张
             </button>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
           <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
              <Zap className={`w-3 h-3 ${captured ? 'text-slate-500' : 'text-amber-400'}`} />
              <span className="text-[10px] font-black text-white uppercase">{captured ? 'Processing' : 'AI_Vision: Active'}</span>
           </div>
        </div>
      </div>

      {/* 6. Controls */}
      <div className="h-40 bg-[#020617] border-t border-white/5 flex items-center justify-around px-10 relative overflow-hidden shrink-0">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-600/10 blur-[60px] rounded-full"></div>

        <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white transition-all active:scale-90">
           <RefreshCw className="w-6 h-6" />
        </button>

        <button 
          onClick={handleCapture}
          disabled={captured || processing}
          className="w-20 h-20 rounded-full border-[6px] border-white/20 p-1 group transition-all disabled:opacity-50"
        >
           <div className="w-full h-full bg-white rounded-full group-active:scale-90 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]"></div>
        </button>

        <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white transition-all active:scale-90">
           <Info className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VolunteerCamera;
