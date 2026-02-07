import React from 'react';
import { 
  Briefcase, Users, TrendingUp, Calendar, 
  ArrowUpRight, ShieldCheck, Heart, Zap, 
  MessageSquare, DollarSign, BarChart3, Star,
  Target, Rocket, Crown
} from 'lucide-react';
import { PartnerSubscription } from '../types.ts';

const mockSubs: PartnerSubscription[] = [
  { id: 'sub-1', companyName: '温州瓷器协会', artistId: '小宇', status: 'active', planType: 'Enterprise', mrr: 15000, nextBillingDate: '2024-06-12' },
  { id: 'sub-2', companyName: '上海丝绸贸易', artistId: '晨晨', status: 'active', planType: 'Pro', mrr: 8000, nextBillingDate: '2024-06-15' },
  { id: 'sub-3', companyName: '悦丰文创集团', artistId: '悦悦', status: 'paused', planType: 'Pro', mrr: 5000, nextBillingDate: '2024-05-10' },
];

const PartnerSaaS: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 shadow-xl">
                <Briefcase className="w-6 h-6 text-indigo-400" />
             </div>
             <h2 className="text-3xl font-black font-orbitron text-white tracking-tighter uppercase">Partner_SaaS</h2>
          </div>
          <p className="text-slate-400 font-medium">由“单次购买”升级为“长期契约”，让企业与艺术建立共生连接。</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:border-indigo-500/40 transition-all">账单管理</button>
           <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2">
              <Zap className="w-4 h-4 fill-white" />
              邀请新合伙人
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: '月经常性收入 (MRR)', value: '¥ 28,000', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
           { label: '合伙人续费率', value: '98.2%', change: '+0.5%', icon: Target, color: 'text-blue-400' },
           { label: '平均合同生命周期', value: '14.5 月', change: '+2.1', icon: BarChart3, color: 'text-indigo-400' },
         ].map((m, i) => (
           <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-4 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <m.icon className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start relative z-10">
                 <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    {m.change}
                 </span>
              </div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                 <h3 className="text-2xl font-black text-white font-orbitron">{m.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 glass-panel rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl bg-slate-900/40">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  活跃合伙人契约 (Active Partners)
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <tr>
                        <th className="px-8 py-5 tracking-[0.2em]">合伙企业</th>
                        <th className="px-8 py-5 tracking-[0.2em]">订阅方案</th>
                        <th className="px-8 py-5 tracking-[0.2em]">月费</th>
                        <th className="px-8 py-5 tracking-[0.2em] text-right">操作</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {mockSubs.map(sub => (
                        <tr key={sub.id} className="group hover:bg-white/5 transition-all">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                    <Users className="w-5 h-5 text-slate-500" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{sub.companyName}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase">守护对象: {sub.artistId}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 {sub.planType === 'Enterprise' ? <Crown className="w-3 h-3 text-amber-400" /> : <Rocket className="w-3 h-3 text-blue-400" />}
                                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${sub.planType === 'Enterprise' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20'}`}>
                                    {sub.planType}
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-6 font-mono text-sm text-slate-200">
                              ¥ {sub.mrr.toLocaleString()}
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2.5 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-colors border border-white/5">
                                 <MessageSquare className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-indigo-600/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="w-24 h-24 text-indigo-400" />
               </div>
               <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">合伙人价值回馈逻辑</h3>
               <div className="space-y-4">
                  {[
                     { label: '数字资产全库调用', status: 'UNLIMITED', icon: ShieldCheck },
                     { label: '联名产品优先生产权', status: 'ACTIVE', icon: Zap },
                     { label: '品牌尊严金公示系统', status: 'PUBLIC', icon: Heart },
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5">
                           <item.icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-200">{item.label}</p>
                           <p className="text-[8px] text-emerald-500 font-black tracking-widest uppercase">{item.status}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all active:scale-95">
                  生成季度影响力报告
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PartnerSaaS;