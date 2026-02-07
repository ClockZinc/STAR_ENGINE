
import React, { useState, useEffect } from 'react';
import { 
  Library, Plus, MoreVertical, ShieldCheck, CheckCircle2, Clock, Sparkles, Award, Heart, 
  Workflow, Box, Zap, Gavel, Megaphone, Loader2, X, Smartphone,
  Cpu, Activity, Radio, Music, Volume2, Play, Info, Fingerprint
} from 'lucide-react';
import { AssetWorkflowStatus, IPAsset } from '../types.ts';
import { wechatService } from '../services/wechatService.ts';
import { generateAudioParameters, generateStarVoiceTTS } from '../services/geminiService.ts';
import { starAudioPlayer } from '../services/audioUtils.ts';

const mockAssets: IPAsset[] = [
  { id: '1', title: '午夜星系', creator: '小宇', type: 'image', status: AssetWorkflowStatus.DISTRIBUTING, date: '2024-05-12', preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80', royaltySplit: '10%', legalHash: '0x88ea...f21', copyrightOwner: 'Creator/Guardian' },
  { id: '2', title: '不说话的朋友', creator: '悦悦', type: 'image', status: AssetWorkflowStatus.ENHANCED, date: '2024-05-14', preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', royaltySplit: '15%', copyrightOwner: 'Creator/Guardian' },
  { id: '3', title: '彩虹森林', creator: '晨晨', type: 'image', status: AssetWorkflowStatus.RAW, date: '2024-05-15', preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80', royaltySplit: '12%', copyrightOwner: 'Creator/Guardian' },
];

const AssetLibrary: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<IPAsset | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // NFC States
  const [isNfcWriting, setIsNfcWriting] = useState(false);
  const [nfcStep, setNfcStep] = useState<'idle' | 'sensing' | 'writing' | 'success'>('idle');
  const [lastBoundTag, setLastBoundTag] = useState<string | null>(null);

  const getStatusConfig = (status: AssetWorkflowStatus) => {
    switch (status) {
      case AssetWorkflowStatus.RAW: return { label: '灵感注入', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case AssetWorkflowStatus.ENHANCED: return { label: 'AI重构中', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case AssetWorkflowStatus.THREE_D_GEN: return { label: '3D拓扑', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case AssetWorkflowStatus.DISTRIBUTING: return { label: '矩阵分发', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      default: return { label: '审核中', color: 'text-slate-500 bg-slate-500/10' };
    }
  };

  const workflowSteps = [
    { name: '灵感感知', icon: Heart, desc: 'Gemini Vision 语义分析' },
    { name: '拓扑重构', icon: Box, desc: 'Image-to-3D 空间建模' },
    { name: '星之声映射', icon: Music, desc: '情绪 DNA 音频合成' },
    { name: '数字孪生绑定', icon: Smartphone, desc: 'NFC 物理权属锁定' }
  ];

  const handleProcess = (asset: IPAsset) => {
    setSelectedAsset(asset);
    setIsDrawerOpen(true);
    const statusIndex = Object.values(AssetWorkflowStatus).indexOf(asset.status);
    setActiveStep(Math.max(0, Math.min(statusIndex, 3)));
    setAudioReady(false);
    setAudioData(null);
    setNfcStep('idle');
  };

  const handleGenerateVoice = async () => {
    if (!selectedAsset) return;
    setAudioGenerating(true);
    try {
      // 1. Get Narrative from Gemini
      const params = await generateAudioParameters(`画作标题: ${selectedAsset.title}, 创作者: ${selectedAsset.creator}`);
      // 2. Convert Narrative to Audio using TTS
      const base64Audio = await generateStarVoiceTTS(params.narrativeDescription);
      if (base64Audio) {
        setAudioData(base64Audio);
        setAudioReady(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAudioGenerating(false);
    }
  };

  const togglePlayAudio = async () => {
    if (!audioData) return;
    if (isPlaying) {
      starAudioPlayer.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await starAudioPlayer.play(audioData);
      setIsPlaying(false);
    }
  };

  const handleStartNfcWrite = async () => {
    if (!selectedAsset) return;
    setIsNfcWriting(true);
    setNfcStep('sensing');
    
    try {
      const result = await wechatService.writeNfcTag(`https://star-engine.com/trace/${selectedAsset.id}`);
      setNfcStep('writing');
      await new Promise(r => setTimeout(r, 1000));
      setNfcStep('success');
      setLastBoundTag(result.tagId);
      setTimeout(() => {
        setIsNfcWriting(false);
        setNfcStep('idle');
      }, 3000);
    } catch (e) {
      console.error('NFC Write Error:', e);
      setIsNfcWriting(false);
    }
  };

  const runStepAction = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    if (activeStep < 3) setActiveStep(prev => prev + 1);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-indigo-500 rounded-full blur-sm"></div>
          <h2 className="text-4xl font-black font-orbitron tracking-tight text-white flex items-center gap-4 uppercase">
            <Library className="w-10 h-10 text-indigo-500" />
            Revenue_Vault
          </h2>
          <p className="text-slate-400 mt-2 text-lg font-medium italic font-serif">让每一比特的灵感，都转化为有尊严的商业主权。</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-3 active:scale-95 group">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          注入灵感原件
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockAssets.map((asset) => {
          const statusConfig = getStatusConfig(asset.status);
          return (
            <div key={asset.id} className="glass-panel group rounded-[3rem] overflow-hidden flex flex-col border border-slate-800/50 hover:border-indigo-500/40 transition-all shadow-2xl relative">
              <div className="aspect-[4/5] bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <img src={asset.preview} alt={asset.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6 z-10">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border backdrop-blur-md uppercase tracking-widest ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                {asset.status === AssetWorkflowStatus.DISTRIBUTING && (
                   <div className="absolute top-6 right-6 z-10">
                      <div className="w-8 h-8 bg-cyan-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-cyan-500/40 shadow-lg">
                         <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                      </div>
                   </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-all duration-500 z-20">
                   <button 
                    onClick={() => handleProcess(asset)}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40"
                   >
                      <Zap className="w-4 h-4 fill-white" />
                      管理进化流
                   </button>
                </div>
              </div>
              <div className="p-8 space-y-4">
                 <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white line-clamp-1 font-orbitron tracking-tight uppercase">{asset.title}</h3>
                    <button className="text-slate-600 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                 </div>
                 <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <span className="text-xs font-bold text-slate-500">创作者：{asset.creator}</span>
                 </div>
                 <div className="pt-6 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {asset.date}</span>
                    <span className="text-indigo-400">Equity: {asset.royaltySplit}</span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {isDrawerOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
           <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-[-20px_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-500 relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center border border-indigo-400 shadow-xl">
                       <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white font-orbitron uppercase tracking-tight">Evo_Controller</h3>
                       <p className="text-xs text-slate-500 font-black mt-1 tracking-widest uppercase">ID: {selectedAsset.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDrawerOpen(false)} className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                 {/* Voice Generator Section */}
                 <div className="p-8 bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/20 space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="text-white font-bold flex items-center gap-2">
                          <Music className="w-5 h-5 text-indigo-400" />
                          星之声 (Voice of Star)
                       </h4>
                       {audioReady && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    
                    {!audioReady ? (
                      <div className="space-y-4">
                         <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            基于 AI 分析画作的情绪与色彩 DNA，自动生成专属氛围 BGM。
                         </p>
                         <button 
                           onClick={handleGenerateVoice}
                           disabled={audioGenerating}
                           className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                         >
                            {audioGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            生成灵感旋律
                         </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-5 bg-slate-950 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95">
                         <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <Volume2 className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Star_Melody_Final.mp3</p>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                               <div className={`h-full bg-indigo-500 transition-all ${isPlaying ? 'w-full duration-[5s]' : 'w-2/3'}`}></div>
                            </div>
                         </div>
                         <button 
                          onClick={togglePlayAudio}
                          className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
                         >
                            {isPlaying ? <X className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                         </button>
                      </div>
                    )}
                 </div>

                 {/* Digital Twin Lock Section */}
                 <div className="p-8 bg-slate-900/60 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                       <h4 className="text-white font-bold flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-indigo-400" />
                          数字孪生锁 (Digital Twin)
                       </h4>
                       <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">Ready to bind</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">物理联名库存</p>
                          <p className="text-lg font-black text-white font-orbitron tracking-tighter">150 PCS</p>
                       </div>
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">已写入 NFC</p>
                          <p className="text-lg font-black text-indigo-400 font-orbitron tracking-tighter">42 PCS</p>
                       </div>
                    </div>
                    <button 
                      onClick={handleStartNfcWrite}
                      className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                       <Radio className="w-4 h-4" /> 启动 NFC 批量写入模式
                    </button>

                    {/* NFC Writing Simulation Overlay */}
                    {isNfcWriting && (
                      <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col items-center justify-center p-8 text-center space-y-6">
                        {nfcStep === 'sensing' && (
                          <>
                            <div className="relative">
                               <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-ping"></div>
                               <div className="w-24 h-24 bg-indigo-600/10 rounded-[2rem] border-2 border-indigo-500/40 flex items-center justify-center relative z-10">
                                  <Radio className="w-10 h-10 text-indigo-400 animate-pulse" />
                               </div>
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-black text-white uppercase tracking-widest">等待感应 NFC 贴纸</p>
                               <p className="text-[10px] text-slate-500 font-medium">请将手机背部贴近 NTAG213/215 芯片</p>
                            </div>
                          </>
                        )}
                        {nfcStep === 'writing' && (
                          <>
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                            <div className="space-y-1">
                               <p className="text-sm font-black text-white uppercase tracking-widest">正在注入数字主权</p>
                               <p className="text-[10px] text-slate-500 font-mono italic">NDEF_URI: https://star-engine.com/trace/...</p>
                            </div>
                          </>
                        )}
                        {nfcStep === 'success' && (
                          <>
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                               <ShieldCheck className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">绑定成功！</p>
                               <p className="text-[10px] text-slate-300 font-mono">TAG_ID: {lastBoundTag}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                 </div>

                 {/* Evolutionary Workflow */}
                 <div className="relative space-y-8">
                    {workflowSteps.map((step, idx) => {
                       const isCurrent = idx === activeStep;
                       const isDone = idx < activeStep;
                       return (
                         <div key={idx} className={`relative flex gap-6 transition-all duration-500 ${isCurrent ? 'opacity-100' : isDone ? 'opacity-70 scale-95' : 'opacity-20'}`}>
                            {idx < workflowSteps.length - 1 && (
                               <div className="absolute left-[23px] top-12 bottom-[-32px] w-0.5 bg-slate-800">
                                  {isDone && <div className="h-full bg-indigo-500 transition-all duration-700 shadow-lg" />}
                               </div>
                            )}
                            <div className={`w-12 h-12 min-w-[48px] rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-110' : isDone ? 'bg-slate-950 border-emerald-500' : 'bg-slate-950 border-slate-800'}`}>
                               {isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <step.icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-600'}`} />}
                            </div>
                            <div className="space-y-1 pt-1">
                               <h4 className={`font-bold uppercase tracking-tight ${isCurrent ? 'text-white text-lg' : 'text-slate-400'}`}>{step.name}</h4>
                               <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                            </div>
                         </div>
                       );
                    })}
                 </div>
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl relative z-20">
                 <button 
                  onClick={runStepAction}
                  disabled={isProcessing}
                  className="group w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95"
                 >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Workflow className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                    {activeStep === 3 ? '资产进化完成' : `执行: ${workflowSteps[activeStep+1]?.name || '完成'}`}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;
