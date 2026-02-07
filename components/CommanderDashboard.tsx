
import React, { useState } from 'react';
import { 
  Terminal, ShieldCheck, Activity, Award, Heart, Gavel, 
  Globe, Zap, ArrowUpRight, Lock, Eye, EyeOff, 
  Workflow, Box, Rotate3d, Share2, MoreVertical, 
  TrendingUp, Fingerprint, Search, Sparkles, LayoutGrid, User
} from 'lucide-react';
import { AssetWorkflowStatus, IPAsset } from '../types.ts';

/**
 * COMMANDER DASHBOARD (Master View)
 * BUSINESS INTENT: The supreme control center integrating Charity, Law, Commerce, and Tech.
 * VISUAL: Glassmorphism, Fluorescent Blue accents, Rose Gold highlights.
 */

// Fix: Added missing required property 'copyrightOwner' to mock commander assets
const mockCommanderAssets: IPAsset[] = [
  { id: 'ip-001', title: '午夜星系 (Midnight Galaxy)', creator: '小宇', type: 'image', status: AssetWorkflowStatus.DISTRIBUTING, date: '2024-05-18', preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80', royaltySplit: '12%', legalHash: '0x88ea...f21', copyrightOwner: 'Creator/Guardian' },
  { id: 'ip-002', title: '彩虹森林 (Rainbow Forest)', creator: '晨晨', type: 'image', status: AssetWorkflowStatus.LEGAL_LOCKED, date: '2024-05-20', preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', royaltySplit: '15%', copyrightOwner: 'Creator/Guardian' },
];

const CommanderDashboard: React.FC = () => {
  const [privacyLocked, setPrivacyLocked] = useState(true);
  const [selectedAssetId, setSelectedAssetId] = useState('ip-001');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 relative">
      
      {/* 顶部状态条：全网态势 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '公益 IP 资产池', value: '124', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: '商会联名项目', value: '42', icon: LayoutGrid, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: '全网累计曝光', value: '2.4M', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: '合规确权存证', value: '1,250', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-[2rem] border-slate-800/50 flex items-center gap-6 group hover:border-slate-700 transition-all">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5`}>
               <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
               <h4 className="text-2xl font-black text-white font-orbitron mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* 左侧：星光资产流 (Waterfall / Stream) */}
        <div className="xl:col-span-8 space-y-10">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Workflow className="w-5 h-5 text-cyan-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white font-orbitron tracking-tight uppercase">Asset_Evolution_Stream</h3>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">按热度排序</button>
                 <button className="px-4 py-2 bg-cyan-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-cyan-900/30">一键全局确权</button>
              </div>
           </div>

           {/* 核心联动大卡片 */}
           <div className="space-y-6">
              {mockCommanderAssets.map((asset) => (
                 <div key={asset.id} className="glass-panel rounded-[3rem] overflow-hidden border border-slate-800/50 group hover:border-cyan-500/20 transition-all duration-500 bg-slate-900/40">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                       
                       {/* 1. 灵感与拓扑联动区 (Charity + Tech) */}
                       <div className="lg:col-span-5 p-8 border-r border-slate-800/50 flex flex-col justify-between min-h-[400px]">
                          <div className="flex justify-between items-start mb-6">
                             <div className="px-4 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20 flex items-center gap-2">
                                <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">灵感原件</span>
                             </div>
                             <span className="text-[10px] font-mono text-slate-600">ASSET_REF: {asset.id}</span>
                          </div>

                          <div className="flex-1 flex gap-6 items-center">
                             <div className="w-1/2 aspect-square rounded-[2rem] overflow-hidden border border-slate-800 group-hover:scale-105 transition-transform duration-700">
                                <img src={asset.preview} className="w-full h-full object-cover" />
                             </div>
                             <div className="w-12 flex flex-col items-center gap-4">
                                <div className="w-px h-12 bg-gradient-to-b from-slate-800 to-cyan-500 animate-pulse"></div>
                                <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 animate-spin-slow">
                                   <Rotate3d className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="w-px h-12 bg-gradient-to-t from-slate-800 to-cyan-500 animate-pulse"></div>
                             </div>
                             <div className="w-1/2 aspect-square rounded-[2rem] bg-black/60 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <Box className="w-12 h-12 text-cyan-400 opacity-20 animate-bounce" />
                                <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">3D_拓扑就绪</p>
                                <div className="flex gap-1 w-full justify-center">
                                   <div className="w-1 h-4 bg-cyan-500/30 rounded-full animate-pulse"></div>
                                   <div className="w-1 h-6 bg-cyan-500/60 rounded-full animate-pulse delay-75"></div>
                                   <div className="w-1 h-4 bg-cyan-500/30 rounded-full animate-pulse delay-150"></div>
                                </div>
                             </div>
                          </div>

                          <div className="mt-8">
                             <h4 className="text-xl font-bold text-white">{asset.title}</h4>
                             <p className="text-xs text-slate-500 mt-1">创作者：{asset.creator} · 情绪定位：{asset.status === AssetWorkflowStatus.DISTRIBUTING ? '深邃/沉静' : '待分析'}</p>
                          </div>
                       </div>

                       {/* 2. 信任堆栈与确权 (Law + Trust) */}
                       <div className="lg:col-span-4 p-8 bg-black/20 flex flex-col border-r border-slate-800/50">
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-8">
                             <ShieldCheck className="w-4 h-4 text-emerald-500" />
                             TRUST_STACK_PROGRESS
                          </h5>
                          
                          <div className="space-y-6 flex-1">
                             {[
                                { label: '律师初核 (Lawyer Review)', status: 'complete', icon: Gavel },
                                { label: '版权存证 (IPFS Mint)', status: 'complete', icon: Fingerprint },
                                { label: 'DCI 证书 (Certification)', status: asset.status === AssetWorkflowStatus.DISTRIBUTING ? 'complete' : 'pending', icon: Award }
                             ].map((step, idx) => (
                                <div key={idx} className={`flex items-center gap-4 ${step.status === 'complete' ? 'opacity-100' : 'opacity-30'}`}>
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.status === 'complete' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800 text-emerald-500'}`}>
                                      <step.icon className="w-5 h-5" />
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-[10px] font-bold text-white leading-none">{step.label}</p>
                                      {step.status === 'complete' ? (
                                        <p className="text-[8px] text-emerald-500 mt-1 font-mono uppercase">VERIFIED_0X{Math.random().toString(16).slice(2,8)}</p>
                                      ) : (
                                        <p className="text-[8px] text-slate-600 mt-1 uppercase tracking-widest">PENDING_APPROVAL</p>
                                      )}
                                   </div>
                                </div>
                             ))}
                          </div>

                          <div className="pt-6 border-t border-slate-800/50">
                             <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-white/5">
                                <div className="text-left">
                                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">分账逻辑锁定</p>
                                   <p className="text-xs font-bold text-emerald-400">10% 公益基金 / 5% 律师维权</p>
                                </div>
                                <Lock className="w-4 h-4 text-slate-700" />
                             </div>
                          </div>
                       </div>

                       {/* 3. 商业分发看板 (Commerce) */}
                       <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                             <TrendingUp className="w-4 h-4 text-blue-400" />
                             REALTIME_MATRIX
                          </h5>

                          <div className="space-y-6">
                             <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                   <span className="text-[9px] font-black text-slate-600 uppercase">抖音矩阵曝光</span>
                                   <span className="text-xs font-bold text-white">421k+</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-cyan-500" style={{width: '75%'}}></div>
                                </div>
                             </div>
                             <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                   <span className="text-[9px] font-black text-slate-600 uppercase">私域询盘数</span>
                                   <span className="text-xs font-bold text-white">124</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{width: '45%'}}></div>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3 pt-6">
                             <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <Share2 className="w-3.5 h-3.5" /> 推送至新账号
                             </button>
                             <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                查看授权报告
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* 右侧：监控与隐私保护 (Security + Monitoring) */}
        <div className="xl:col-span-4 space-y-10">
           
           {/* 1. 隐私安全门 (Privacy Guard) */}
           <div className={`glass-panel p-8 rounded-[3rem] border transition-all duration-700 relative overflow-hidden ${privacyLocked ? 'border-rose-500/30' : 'border-emerald-500/30'}`}>
              {/* 背景动态 */}
              <div className={`absolute -top-20 -right-20 w-48 h-48 blur-[80px] rounded-full transition-colors duration-700 ${privacyLocked ? 'bg-rose-600/10' : 'bg-emerald-600/10'}`}></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                 <h3 className="text-sm font-black text-white font-orbitron tracking-widest uppercase flex items-center gap-3">
                    {privacyLocked ? <Lock className="w-5 h-5 text-rose-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    Security_Guard
                 </h3>
                 <button 
                  onClick={() => setPrivacyLocked(!privacyLocked)}
                  className={`p-2 rounded-xl transition-all ${privacyLocked ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                 >
                    {privacyLocked ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className={`p-6 rounded-2xl border transition-all ${privacyLocked ? 'bg-black/60 border-rose-500/20 grayscale' : 'bg-slate-900 border-white/5'}`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">创作者档案 (Autism Artist)</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
                          {privacyLocked ? <User className="w-6 h-6 text-slate-600" /> : <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" className="w-full h-full object-cover" />}
                       </div>
                       <div>
                          <p className={`text-sm font-bold ${privacyLocked ? 'blur-sm select-none' : 'text-white'}`}>张小宇 (11岁, 杭州)</p>
                          <p className="text-[10px] text-slate-500 font-medium">签约律师：王律师 (指挥官本人)</p>
                       </div>
                    </div>
                 </div>

                 {privacyLocked && (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                       <p className="text-[9px] text-rose-400 font-medium italic leading-relaxed text-center">
                          “当前处于律师级加密保护环境，敏感生物信息已自动模糊处理。请通过指纹或动态令牌解锁。”
                       </p>
                    </div>
                 )}

                 {!privacyLocked && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                       <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                          <span>授权合同签署日期</span>
                          <span className="text-white">2024-03-12</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                          <span>紧急联络授权人</span>
                          <span className="text-white">陈女士 (母亲)</span>
                       </div>
                       <button className="w-full py-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all">
                          更新法律监护书
                       </button>
                    </div>
                 )}
              </div>
           </div>

           {/* 2. 商会资源同步管道 */}
           <div className="glass-panel p-8 rounded-[3rem] border-slate-800/50 bg-slate-900/20">
              <h3 className="text-sm font-black text-slate-500 font-orbitron tracking-widest uppercase flex items-center gap-3 mb-8">
                 <Zap className="w-5 h-5 text-amber-400" />
                 CHAMBER_SYNC_LIVE
              </h3>
              <div className="space-y-6">
                 {[
                    { org: '温州商会 - 陶瓷分会', action: '风格授权合同已下达', time: '12m ago', color: 'bg-emerald-500' },
                    { org: 'XX 制造集团', action: '3D 拓扑结构导出申请', time: '2h ago', color: 'bg-blue-500' },
                    { org: '华东电商联盟', action: '矩阵分发脚本同步完成', time: '5h ago', color: 'bg-cyan-500' },
                 ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="flex flex-col items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></div>
                          {i < 2 && <div className="w-px flex-1 bg-slate-800"></div>}
                       </div>
                       <div className="pb-6">
                          <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{item.org}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{item.action}</p>
                          <span className="text-[8px] font-mono text-slate-600 uppercase mt-2 inline-block">{item.time}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-4 mt-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                 进入全量商会管理面板 <ArrowUpRight className="w-4 h-4" />
              </button>
           </div>

           {/* 3. 系统资源与 Agent 状态 */}
           <div className="glass-panel p-8 rounded-[3rem] border-slate-800/50">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System_Vitals</span>
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400">92% HEALTH</span>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Gemini Agent 推理负载</span>
                    <span className="text-xs font-bold text-white">LOW (12%)</span>
                 </div>
                 <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500/50" style={{width: '12%'}}></div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default CommanderDashboard;
