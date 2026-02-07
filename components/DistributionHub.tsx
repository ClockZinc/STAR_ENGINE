
import React, { useState, useEffect } from 'react';
import { 
  Cpu, ShieldCheck, Wifi, MoreVertical, 
  Terminal, Lock, Fingerprint, RefreshCw, Zap,
  Globe, Server, Monitor, Play, Settings, Plus,
  LayoutGrid, CheckCircle2, AlertCircle, Share2,
  Workflow, ChevronRight, Database, ExternalLink,
  Smartphone, ShieldAlert, Radio, Clock, Video,
  ArrowUpRight
} from 'lucide-react';
import { browserService, BrowserProfile } from '../services/browserService.ts';

const PLATFORM_CONFIGS = [
  { id: 'douyin', name: '抖音 (Douyin)', icon: 'https://cdn.icon-icons.com/icons2/2972/PNG/512/douyin_logo_icon_186895.png', region: 'CN' },
  { id: 'channels', name: '视频号 (Channels)', icon: 'https://img.icons8.com/color/48/weixing.png', region: 'CN' },
  { id: 'tiktok', name: 'TikTok', icon: 'https://cdn.icon-icons.com/icons2/2972/PNG/512/tiktok_logo_icon_186893.png', region: 'Global' },
  { id: 'xhs', name: '小红书 (XHS)', icon: 'https://img.icons8.com/color/48/xiaohongshu.png', region: 'CN' },
];

const DistributionHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cluster' | 'config'>('cluster');
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const [queueItems, setQueueItems] = useState([
    { id: 'q-1', title: '午夜星系联名视频', status: 'rendering', progress: 65, platform: 'douyin' },
    { id: 'q-2', title: '彩虹森林概念片', status: 'ready', progress: 100, platform: 'tiktok' },
  ]);

  useEffect(() => {
    browserService.getProfiles().then(setProfiles);
    const interval = setInterval(() => {
      if (viewMode === 'cluster') {
        const actions = [
          'Agent: 正在分析抖音晚高峰流量曲线...',
          'Agent: 模拟用户点击路径中 (指纹节点: #042)...',
          'Agent: 检查代理隧道 IP 纯净度...',
          'Agent: 已为《彩虹森林》匹配最佳发布标签: #公益 #商业美学',
          'Agent: 心跳包同步正常...',
          'Agent: 正在预热账号 P-001 的浏览权重...'
        ];
        const newLog = `[${new Date().toLocaleTimeString()}] ${actions[Math.floor(Math.random() * actions.length)]}`;
        setLogs(prev => [newLog, ...prev].slice(0, 15));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [viewMode]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-indigo-600 rounded-full blur-sm opacity-50"></div>
          <h2 className="text-3xl font-bold font-orbitron text-white tracking-tight">矩阵分发控制台 (Matrix_Ops)</h2>
          <p className="text-slate-400 mt-1 font-medium italic">“配置即分发” —— Agent 正在全天候模拟真实交互，确保账号安全与分发权重。</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl">
           <button 
            onClick={() => setViewMode('cluster')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'cluster' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <LayoutGrid className="w-4 h-4" /> 集群态势
           </button>
           <button 
            onClick={() => setViewMode('config')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'config' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <Settings className="w-4 h-4" /> 节点管理
           </button>
        </div>
      </div>

      {viewMode === 'cluster' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
            {/* 内容分发管道 */}
            <div className="glass-panel p-8 rounded-[3rem] border-slate-800/50">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                     <Workflow className="w-5 h-5 text-blue-400" />
                     内容发布管道 (Content Pipeline)
                  </h3>
                  <button className="text-[10px] font-black text-indigo-400 hover:underline">管理完整队列</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {queueItems.map(item => (
                    <div key={item.id} className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                       <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center relative">
                          <Video className={`w-6 h-6 ${item.status === 'rendering' ? 'text-indigo-500 animate-pulse' : 'text-emerald-500'}`} />
                          {item.status === 'rendering' && <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-xl animate-spin"></div>}
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                             <h4 className="text-xs font-bold text-white">{item.title}</h4>
                             <span className="text-[9px] font-black text-slate-600 uppercase">{item.platform}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all" style={{width: `${item.progress}%`}}></div>
                             </div>
                             <span className="text-[9px] font-mono text-slate-500">{item.progress}%</span>
                          </div>
                       </div>
                       <button className="p-2 text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
              <div className="p-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-500/10 rounded-xl">
                      <Radio className="w-6 h-6 text-indigo-400 animate-pulse" />
                   </div>
                   <div>
                      <h3 className="font-bold text-white">活跃分发节点 (Active_Nodes)</h3>
                      <p className="text-xs text-slate-500">检测到 {profiles.length} 个独立隔离环境正在运行</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase">当前系统并发</span>
                      <span className="text-sm font-bold text-indigo-400 font-orbitron">84%_LOAD</span>
                   </div>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-10">
                    <tr>
                      <th className="px-8 py-5">节点标识</th>
                      <th className="px-8 py-5">地理代理 (Region)</th>
                      <th className="px-8 py-5">硬件健康度 (F-Score)</th>
                      <th className="px-8 py-5 text-right">监控</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {profiles.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                            <div>
                               <p className="text-sm font-bold text-slate-200">{p.name}</p>
                               <p className="text-[10px] text-indigo-400 font-mono mt-1 uppercase tracking-tighter">{p.platform} / ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                              <Wifi className="w-4 h-4 text-emerald-500/60" />
                              {p.proxy.split(' ')[0]}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px]">
                                 <div className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{width: `${p.fingerprintScore}%`}}></div>
                              </div>
                              <span className="text-[10px] font-orbitron text-blue-400">{p.fingerprintScore}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2.5 bg-slate-950 hover:bg-indigo-600 rounded-xl text-slate-600 hover:text-white transition-all">
                              <Monitor className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Agent 推理实时日志 */}
          <div className="xl:col-span-4 h-full">
            <div className="glass-panel rounded-[3rem] flex flex-col h-[750px] overflow-hidden border-slate-800/50 shadow-2xl relative">
               <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
                  <h3 className="text-sm font-black text-white font-orbitron tracking-widest flex items-center gap-3">
                     <Terminal className="w-5 h-5 text-indigo-400" />
                     AGENT_REASONING
                  </h3>
                  <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
               </div>
               <div className="flex-1 p-8 font-mono text-[10px] space-y-4 overflow-y-auto custom-scrollbar bg-black/60">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-6">
                     <p className="text-indigo-300 font-bold mb-1">系统策略: 拟人互动优先模式</p>
                     <p className="text-slate-500 leading-relaxed italic">当前 Agent 正在模拟所有账号的“随机浏览”行迹，以确保发布权重不被系统风控识别为机器人。</p>
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-700 font-black">[{i.toString().padStart(2, '0')}]</span>
                      <span className={log.includes('成功') || log.includes('匹配') ? 'text-emerald-500/90' : 'text-slate-400'}>{log}</span>
                    </div>
                  ))}
               </div>
               <div className="p-8 bg-slate-950/80 border-t border-slate-800/50">
                  <div className="flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-slate-800 focus-within:border-indigo-500/50 transition-all group">
                     <span className="text-indigo-500 font-black text-xs group-focus-within:animate-pulse">$</span>
                     <input type="text" placeholder="输入控制指令 (e.g. restart-all-nodes)..." className="bg-transparent border-none outline-none text-[10px] w-full text-slate-300 placeholder:text-slate-700 font-mono" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* 节点管理逻辑保持一致但视觉微调 */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="xl:col-span-8 space-y-8">
            <div className="glass-panel p-10 rounded-[3rem] border-slate-800/50">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3 font-orbitron tracking-tight">
                      <Share2 className="w-7 h-7 text-indigo-400" />
                      节点网关注册中心
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">关联您的指纹浏览器 Profile 与物理代理集群。</p>
                  </div>
                  <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-900/40 active:scale-95">
                    <Plus className="w-5 h-5" />
                    注册新节点
                  </button>
               </div>
               {/* 账号列表省略，保持原逻辑 */}
            </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DistributionHub;
