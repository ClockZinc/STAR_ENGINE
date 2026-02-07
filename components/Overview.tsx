
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ComposedChart,
  Line,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  Award, 
  Heart, 
  Gavel, 
  TrendingUp, 
  Workflow,
  Boxes,
  ScrollText,
  Clock,
  UserCheck,
  Zap,
  ShieldAlert,
  ShieldEllipsis,
  Loader2,
  FileText,
  Briefcase,
  Users,
  ZapOff
} from 'lucide-react';
import { generateImpactReport } from '../services/geminiService.ts';
import { analyticsApi, licensesApi, assetsApi } from '../services/api.ts';
import { ImpactReportResult, PartnerSubscription } from '../types.ts';

const dualImpactData = [
  { time: 'Q1', donationImpact: 200, commercialROI: 120 },
  { time: 'Q2', donationImpact: 450, commercialROI: 380 },
  { time: 'Q3', donationImpact: 780, commercialROI: 920 },
  { time: 'Q4', donationImpact: 1200, commercialROI: 2450 },
];

const mockSubscriptions: PartnerSubscription[] = [
  { id: 'sub-1', companyName: '温州瓷器协会', artistId: '小宇', status: 'active', planType: 'Enterprise', mrr: 15000, nextBillingDate: '2024-06-12' },
  { id: 'sub-2', companyName: '上海丝绸贸易', artistId: '晨晨', status: 'active', planType: 'Pro', mrr: 8000, nextBillingDate: '2024-06-15' },
  { id: 'sub-3', companyName: '悦丰文创集团', artistId: '悦悦', status: 'paused', planType: 'Pro', mrr: 5000, nextBillingDate: '2024-05-10' },
];

const Overview: React.FC = () => {
  const [report, setReport] = useState<ImpactReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // 加载仪表盘数据
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboard, licenseStats, assetStats] = await Promise.all([
          analyticsApi.getDashboard(),
          licensesApi.getStats(),
          assetsApi.getStats(),
        ]);
        
        setDashboardData({
          ...dashboard,
          licenseStats,
          assetStats,
        });
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 动态生成指标数据
  const metrics = dashboardData ? [
    { 
      label: '活跃 IP 授权数', 
      value: String(dashboardData.licenseStats?.byStatus?.active || 0), 
      change: '+5', 
      icon: Gavel, 
      color: 'text-blue-500' 
    },
    { 
      label: '家庭辅助就业时长', 
      value: '1,250h', 
      change: '+12%', 
      icon: Clock, 
      color: 'text-purple-500' 
    },
    { 
      label: '社会认知改善度', 
      value: '82%', 
      change: '+15.1%', 
      icon: UserCheck, 
      color: 'text-emerald-500' 
    },
    { 
      label: '订阅月流水 (MRR)', 
      value: `¥${Math.round((dashboardData.licenseStats?.totalRevenue || 0) / 1000)}k`, 
      change: '+18%', 
      icon: Briefcase, 
      color: 'text-indigo-400' 
    },
  ] : [
    { label: '活跃 IP 授权数', value: '--', change: '+5', icon: Gavel, color: 'text-blue-500' },
    { label: '家庭辅助就业时长', value: '--', change: '+12%', icon: Clock, color: 'text-purple-500' },
    { label: '社会认知改善度', value: '--', change: '+15.1%', icon: UserCheck, color: 'text-emerald-500' },
    { label: '订阅月流水 (MRR)', value: '--', change: '+18%', icon: Briefcase, color: 'text-indigo-400' },
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const data = await generateImpactReport("当前 Q4 运营数据：家庭辅助就业 1250 小时，认知改善 15.2%，版权收益归集 100%。");
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative">
          <div className="absolute -left-3 top-0 w-1 h-10 bg-blue-600 rounded-full blur-sm opacity-50"></div>
          <h2 className="text-3xl font-bold font-orbitron tracking-tighter text-white uppercase">Engine_Status: Live</h2>
          <p className="text-slate-400 mt-1 text-base font-medium italic">拒卖惨、重主权、强共鸣：致力于社会价值与商业利益的真实合龙。</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold flex items-center gap-2 active:scale-95 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScrollText className="w-4 h-4" />}
            社会价值报告
          </button>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-2xl transition-all flex items-center gap-2 active:scale-95 text-sm">
            <TrendingUp className="w-4 h-4" />
            运行价值审计
          </button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass-panel p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group overflow-hidden relative shadow-xl">
            <div className="absolute -bottom-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <m.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${m.color} shadow-inner`}>
                <m.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${m.change.includes('+') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                {m.change}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{m.label}</p>
            <h3 className="text-2xl font-black text-white mt-1 font-orbitron">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-[2.5rem] border-slate-800/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                 <Workflow className="w-5 h-5 text-indigo-400" />
                 双轴价值演进图
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">公益势能与商业回报的同步增益轨迹。</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dualImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.1} />
                <XAxis dataKey="time" stroke="#475569" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis yAxisId="left" stroke="#475569" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid #1e293b', borderRadius: '1.5rem' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Bar yAxisId="left" dataKey="donationImpact" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="commercialROI" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Partner List */}
        <div className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] border-slate-800/50 flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                 <Briefcase className="w-5 h-5 text-indigo-400" />
                 星光合伙人 (SaaS)
              </h3>
              <Users className="w-5 h-5 text-slate-700" />
           </div>
           
           <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {mockSubscriptions.map((sub) => (
                 <div key={sub.id} className="p-5 bg-slate-950/60 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{sub.companyName}</h4>
                          <p className="text-[10px] text-slate-500 mt-1">专属艺术家：{sub.artistId}</p>
                       </div>
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                          {sub.status}
                       </span>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-600 uppercase">月费 (MRR)</p>
                          <p className="text-sm font-black text-white">¥ {sub.mrr.toLocaleString()}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[8px] font-black text-slate-600 uppercase">续费周期</p>
                          <p className="text-[10px] font-bold text-slate-400">{sub.nextBillingDate}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           <button className="w-full mt-8 py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 transition-all active:scale-95">
              进入财务分账控制台
           </button>
        </div>
      </div>

      {/* Security Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800/50">
            <h3 className="text-lg font-bold text-white font-orbitron mb-6 tracking-tight flex items-center gap-3">
               <ShieldEllipsis className="w-5 h-5 text-indigo-400" />
               主权隔离与熔断响应
            </h3>
            <div className="space-y-4">
               {[
                  { label: '版权上链成功率', value: 100, color: 'bg-emerald-500' },
                  { label: '文案红线过滤拦截', value: 98, color: 'bg-blue-500' },
                  { label: '危机公关响应金池', value: 100, color: 'bg-indigo-500' },
                  { label: '品牌隔离墙响应', value: 100, color: 'bg-rose-500' },
               ].map((step, i) => (
                  <div key={i} className="space-y-1.5">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>{step.label}</span>
                        <span className="text-white">Active</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
                        <div className={`h-full ${step.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.2)]`} style={{width: `${step.value}%`}}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800/50 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-rose-600/10 rounded-[2rem] flex items-center justify-center border border-rose-500/20 shadow-inner group-hover:scale-110 transition-transform">
               <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
            <div>
               <h4 className="text-white font-bold text-base uppercase tracking-tight">CRISIS_RESPONSE_FUND</h4>
               <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">危机响应金余额: ¥ 50,000</p>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed italic">
               “该资金库已由区块链 DCI 系统锁定，优先用于突发版权纠纷维权或未成年人隐私紧急保护。”
            </p>
            <button className="text-[10px] font-black text-rose-400 hover:underline uppercase tracking-widest">查看流水证明</button>
         </div>
      </div>

      {/* Impact Report Modal */}
      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-2xl glass-panel p-10 rounded-[3.5rem] border-2 border-indigo-500/30 relative shadow-[0_0_100px_rgba(79,70,229,0.2)]">
              <button onClick={() => setReport(null)} className="absolute top-8 right-10 text-slate-500 hover:text-white font-bold">✕</button>
              <div className="space-y-8">
                 <div className="text-center space-y-2">
                    <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                    <h3 className="text-2xl font-bold font-orbitron text-white uppercase tracking-tight">Social_Impact_Report</h3>
                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">发布日期: {report.reportDate}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-950/80 rounded-3xl border border-white/5 space-y-2">
                       <p className="text-[9px] font-black text-slate-500 uppercase">家庭辅助就业</p>
                       <p className="text-2xl font-black text-white font-orbitron">{report.metrics.familySupportHours}h</p>
                    </div>
                    <div className="p-6 bg-slate-950/80 rounded-3xl border border-white/5 space-y-2">
                       <p className="text-[9px] font-black text-slate-500 uppercase">认知改善度</p>
                       <p className="text-2xl font-black text-emerald-400 font-orbitron">+{report.metrics.socialPerceptionShift}%</p>
                    </div>
                 </div>

                 <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 font-medium text-sm text-slate-300 leading-relaxed italic">
                    “{report.narrativeSummary}”
                 </div>

                 <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-900/40">导出 DCI 加密影响力报告</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
