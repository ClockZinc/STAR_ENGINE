
import React, { useState } from 'react';
import { Box, Rotate3d, ShoppingBag, Share2, Sparkles, TrendingUp, ShieldCheck, Heart, Info } from 'lucide-react';

/**
 * MERCHANT AR PREVIEW (Small Program XR-Frame Implementation)
 * BUSINESS INTENT: Allow chamber members to preview "Starlight Infused" products in real space.
 * Includes product strategy and social impact metrics.
 */
const MerchantARPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d' | 'ar'>('3d');

  return (
    <div className="h-full bg-[#020617] flex flex-col p-6 space-y-6 animate-in fade-in duration-500">
      {/* 1. 3D/AR Viewport (Simulating WeChat XR-Frame) */}
      <div className="relative aspect-[4/5] rounded-[3rem] bg-black border border-slate-800 overflow-hidden shadow-2xl group shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
        
        {/* Mock 3D Model Rendering */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
           <Box className="w-32 h-32 text-cyan-400 opacity-20 animate-[spin_8s_linear_infinite]" />
           <div className="absolute bottom-12 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3">
              <Rotate3d className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">滑动以 360° 旋转联名样品</span>
           </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
           <div className="flex gap-2 p-1 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('3d')}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${activeTab === '3d' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                3D 预览
              </button>
              <button 
                onClick={() => setActiveTab('ar')}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${activeTab === 'ar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                AR 落地
              </button>
           </div>
           <button className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 text-white">
              <Share2 className="w-4 h-4" />
           </button>
        </div>

        {activeTab === 'ar' && (
          <div className="absolute inset-0 bg-cyan-900/20 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-10 animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,1)] mb-6">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
             </div>
             <h4 className="text-xl font-bold text-white font-orbitron">AR 虚拟摆放已就绪</h4>
             <p className="text-xs text-slate-300 mt-2 leading-relaxed italic">“请对准桌面或地面，点击将《午夜星系》联名灯具投射至现实空间。”</p>
             <button className="mt-8 px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                立刻开启 AR 视界
             </button>
          </div>
        )}
      </div>

      {/* 2. Commercial Strategy Panel */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-orbitron tracking-tight">Product_Strategy</h3>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
               IP 溢价率: +42%
            </span>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900/60 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">商会指导价</p>
               <h4 className="text-lg font-black text-white mt-1 group-hover:text-cyan-400 transition-colors">¥899.00</h4>
            </div>
            <div className="p-5 bg-slate-900/60 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">预估全网曝光</p>
               <h4 className="text-lg font-black text-white mt-1 group-hover:text-indigo-400 transition-colors">150k+</h4>
            </div>
         </div>

         <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-start gap-3">
               <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
               <p className="text-[11px] font-bold text-slate-300 leading-tight">星星的孩子公益金：10% (由系统智能分帐锁定)</p>
            </div>
            <div className="flex items-start gap-3">
               <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
               <p className="text-[11px] font-bold text-slate-300 leading-tight">法律合规确权：已由王律师通过数字签名审计</p>
            </div>
         </div>

         <button className="w-full py-5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-cyan-900/40 flex items-center justify-center gap-4 transition-all active:scale-95">
            <ShoppingBag className="w-5 h-5" />
            立即联名订货 / 锁定配额
         </button>
         
         <p className="text-[9px] text-slate-600 text-center italic flex items-center justify-center gap-2">
            <Info className="w-3 h-3" /> 点击订货即视为同意《星光 IP 算法授权分润协议》
         </p>
      </div>
    </div>
  );
};

export default MerchantARPreview;
