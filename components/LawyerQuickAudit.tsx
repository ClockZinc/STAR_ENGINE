
import React, { useState } from 'react';
import { Gavel, Fingerprint, ShieldCheck, Check, X, ScrollText, User, AlertCircle, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { wechatService } from '../services/wechatService.ts';

/**
 * LAWYER QUICK AUDIT (Small Program Implementation)
 * BUSINESS INTENT: Mobile-optimized approval for lawyers to ensure continuous workflow.
 * Integrated with mock WeChat services.
 */
const LawyerQuickAudit: React.FC = () => {
  const [step, setStep] = useState<'review' | 'signing' | 'done'>('review');
  const [signingProgress, setSigningProgress] = useState(false);

  const handleStartSign = async () => {
    setStep('signing');
  };

  const handleFinishSign = async () => {
    setSigningProgress(true);
    await wechatService.signContract('IP-2024-X49');
    setSigningProgress(false);
    setStep('done');
  };

  return (
    <div className="h-full bg-[#020617] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      {step === 'review' && (
        <div className="flex-1 flex flex-col p-6 space-y-8 h-full">
           <div className="flex items-center gap-4 border-b border-white/5 pb-6 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                 <Gavel className="w-7 h-7 text-white" />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white font-orbitron uppercase tracking-tight">IP_Audit_Express</h3>
                 <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-widest">Pending_ID: IP-2024-X49</p>
              </div>
           </div>

           <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-blue-400" />
                    协议详情摘要
                 </h4>
                 <div className="p-5 bg-slate-900/80 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-500 font-medium">授权模式</span>
                       <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-[10px]">风格授权 (算法级)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-500 font-medium">受益主体</span>
                       <span className="text-white">小宇 (星星的孩子)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-slate-500 font-medium">商业标的</span>
                       <span className="text-white">温州商会 - 陶瓷联名款</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    合规自动预警
                 </h4>
                 <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-[10px] text-amber-200/70 leading-relaxed italic border-l-4">
                    “已检测到品牌宣传语中存在‘治愈系’关键词。基于最新广告法，系统已自动挂载医疗豁免声明免责条款。”
                 </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   溯源版权链
                </h4>
                <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 font-mono text-[9px] text-slate-500 truncate">
                   ROOT_HASH: 0x9f2a7b3c1d5e8f0a2c4b6d8e0f1a3c5e...
                </div>
              </div>
           </div>

           <div className="flex gap-4 pt-6 shrink-0">
              <button className="flex-1 py-5 bg-slate-900 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/5 flex items-center justify-center gap-2">
                 <X className="w-4 h-4" /> 驳回
              </button>
              <button 
                onClick={handleStartSign}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                 <ShieldCheck className="w-4 h-4" /> 通过并签名
              </button>
           </div>
        </div>
      )}

      {step === 'signing' && (
        <div className="flex-1 flex flex-col p-8 items-center justify-center text-center space-y-12 animate-in zoom-in duration-500 h-full">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse"></div>
              <div className="w-32 h-32 bg-slate-900 border-2 border-blue-500/40 rounded-[3rem] flex items-center justify-center relative z-10 shadow-2xl">
                 <Fingerprint className={`w-16 h-16 ${signingProgress ? 'text-emerald-500 animate-bounce' : 'text-blue-400 animate-pulse'}`} />
              </div>
           </div>
           
           <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-bold text-white font-orbitron">电子签名验证</h3>
              <p className="text-sm text-slate-400">{signingProgress ? '正在确权上链中...' : '正在调用微信 CA 证书...'}</p>
           </div>

           <div className="w-full h-48 bg-slate-900/60 border border-white/10 rounded-[3rem] relative flex items-center justify-center group overflow-hidden shadow-inner">
              {!signingProgress ? (
                <>
                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:opacity-0 transition-opacity">请点击此处确认意愿并签名</span>
                   <button 
                    onClick={handleFinishSign}
                    className="absolute inset-0 z-20"
                   />
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                   <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                   <p className="text-[10px] text-slate-600 font-mono">BLOCKCHAIN_COMMITTING...</p>
                </div>
              )}
           </div>

           {!signingProgress && (
             <button 
              onClick={() => setStep('review')}
              className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors flex items-center gap-2"
             >
               <ArrowLeft className="w-3 h-3" /> 取消本次操作
             </button>
           )}
        </div>
      )}

      {step === 'done' && (
        <div className="flex-1 flex flex-col p-10 items-center justify-center text-center space-y-8 animate-in fade-in duration-500 h-full">
           <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
           </div>
           <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-orbitron">IP 审计完成</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                 该资产已正式获得“法律合规”标签，版权溯源链已合龙，并已实时通知温州商会分会。
              </p>
           </div>
           <div className="pt-10 w-full space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 font-mono text-[8px] text-emerald-500/60 text-left">
                TX_HASH: 0x8a92f0...392d1c<br/>
                TIMESTAMP: {new Date().toISOString()}
              </div>
              <button className="w-full py-5 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl">
                 查看存证证书 (DCI)
              </button>
              <button 
                onClick={() => setStep('review')}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                 返回任务列表
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default LawyerQuickAudit;
