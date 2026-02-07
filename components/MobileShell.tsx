
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

/**
 * MOBILE SHELL
 * BUSINESS INTENT: Simulate the WeChat Mini Program environment for high-fidelity demonstration.
 * Includes smart scaling for smaller screens.
 */
const MobileShell: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const [scale, setScale] = useState(1);
  
  // Smart scaling: auto-scale if container height is insufficient
  useEffect(() => {
    const calculateScale = () => {
      const containerHeight = window.innerHeight;
      const shellHeight = 900; // 812px + padding
      if (containerHeight < shellHeight) {
        setScale(Math.max(0.6, containerHeight / shellHeight));
      } else {
        setScale(1);
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div className="flex justify-center items-center py-2 bg-[#020617] h-full overflow-hidden">
      <div 
        className="relative w-[375px] h-[812px] bg-black rounded-[60px] border-[8px] border-slate-800 shadow-[0_0_100px_rgba(34,211,238,0.2)] overflow-hidden flex flex-col transition-transform duration-300"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
        </div>
        
        {/* Status Bar */}
        <div className="h-12 flex justify-between items-end px-8 pb-1 z-40">
           <span className="text-xs font-bold text-white">9:41</span>
           <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-white" />
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-4 h-4 text-white" />
           </div>
        </div>

        {/* WeChat Mini Program Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-40">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center">
                 <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">{title}</span>
           </div>
           <div className="flex items-center gap-4 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <div className="flex gap-1">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-px h-3 bg-white/20"></div>
              <div className="w-4 h-4 border-2 border-white rounded-full relative flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#020617] flex flex-col">
           {children}
           
           {/* Copyright Footer Notice in App */}
           <div className="mt-auto p-6 bg-slate-900/30 text-[8px] text-slate-500 text-center leading-relaxed border-t border-white/5">
             <p className="font-bold text-slate-400 mb-1 tracking-widest uppercase">Copyright Sovereignty & Traceability</p>
             本系统作品原始版权属于「星星的孩子」及其监护人；AI生成衍生资产版权属公益专户；企业获授权使用。
             基于区块链技术确权，每一比特皆可追溯。
           </div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-8 flex justify-center items-center">
           <div className="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileShell;
