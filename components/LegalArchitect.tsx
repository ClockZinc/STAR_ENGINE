
import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, FileText, Search, Loader2, CheckCircle, FileSignature, Fingerprint, Database, Award, FileType, ScrollText, ShieldAlert, ZapOff, ShieldEllipsis, AlertCircle, Briefcase } from 'lucide-react';
import { analyzeLegalContent } from '../services/geminiService.ts';
import { LegalAnalysisResult } from '../types.ts';
import { licensesApi, workflowApi } from '../services/api.ts';

interface PendingLicense {
  id: string;
  title: string;
  licensorName: string;
  licenseType: string;
  status: string;
}

const LegalArchitect: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<LegalAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [firewallActive, setFirewallActive] = useState(false);
  
  // Real pending licenses from backend
  const [pendingLicenses, setPendingLicenses] = useState<PendingLicense[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(true);
  const [freezeLoading, setFreezeLoading] = useState(false);

  // Fetch pending licenses from backend
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await licensesApi.getLicenses({ status: 'PENDING', limit: '5' });
        const formattedLicenses = response.data?.map((license: any) => ({
          id: license.id,
          title: license.title || `授权合同 #${license.id.slice(0, 8)}`,
          licensorName: license.licensorName || '待填写',
          licenseType: license.licenseType || '形象授权',
          status: license.status,
        })) || [];
        setPendingLicenses(formattedLicenses);
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
        setPendingLicenses([]);
      } finally {
        setLicensesLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  const handleFreeze = async () => {
    setFreezeLoading(true);
    try {
      // In a real scenario, you would freeze specific assets
      // Here we simulate the firewall activation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFirewallActive(!firewallActive);
    } catch (error) {
      console.error('Failed to freeze:', error);
    } finally {
      setFreezeLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeLegalContent(inputText);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFirewall = () => {
    setFirewallActive(!firewallActive);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-600/20 mb-4 shadow-xl">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-white font-orbitron tracking-tight uppercase">Legal_Architect</h2>
        <p className="text-slate-400 max-w-lg mx-auto font-medium text-base">拒绝卖惨，捍卫主权：构建基于尊严的数字资产审计防线。</p>
      </div>

      {/* Brand Firewall & Crisis Fund Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col justify-between ${firewallActive ? 'bg-rose-500/10 border-rose-500/40' : 'bg-slate-900 border-slate-800'}`}>
           <div className="flex items-start justify-between">
              <div className="space-y-1">
                 <h4 className="text-white font-bold font-orbitron flex items-center gap-2 text-sm">
                    <ShieldAlert className={`w-4 h-4 ${firewallActive ? 'text-rose-500' : 'text-slate-500'}`} />
                    BRAND_FIREWALL
                 </h4>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest">品牌隔离墙 / 熔断机制</p>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${firewallActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
           </div>
           <p className="text-xs text-slate-400 mt-4 leading-relaxed">
             一旦合伙伙伴发生舆论危机，一键熔断即可下架所有关联 IP 授权，保护创作者隐私。
           </p>
           <button 
             onClick={handleFreeze}
             disabled={freezeLoading}
             className={`mt-6 w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${firewallActive ? 'bg-white text-rose-600' : 'bg-rose-600/20 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white'}`}
           >
              {freezeLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (firewallActive ? '解除熔断模式' : '启动应急熔断 (KILL_SWITCH)')}
           </button>
        </div>

        <div className="p-6 rounded-[2rem] border-2 bg-indigo-500/5 border-indigo-500/20 flex flex-col justify-between">
           <div className="flex items-start justify-between">
              <div className="space-y-1">
                 <h4 className="text-white font-bold font-orbitron flex items-center gap-2 text-indigo-400 text-sm">
                    <ZapOff className="w-4 h-4" />
                    CRISIS_FUND
                 </h4>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest">危机公关响应金</p>
              </div>
              <div className="text-base font-black text-indigo-400 font-orbitron tracking-widest">¥ 50,000</div>
           </div>
           <p className="text-xs text-slate-400 mt-4 leading-relaxed">
             预存在 DCI 存证系统的备选金，优先用于弱势群体维权与突发隐私公关响应。
           </p>
           <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
              <CheckCircle className="w-4 h-4" /> 账户状态：就绪 (Ready)
           </div>
        </div>
      </div>

      {/* Pending Licenses Section */}
      <div className="glass-panel p-5 rounded-[2rem] space-y-3">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-400" />
          待审核授权合同
          {licensesLoading && <Loader2 className="w-3 h-3 animate-spin" />}
        </h3>
        {pendingLicenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingLicenses.map((license) => (
              <div key={license.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase">{license.licenseType}</span>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] rounded-full">待审核</span>
                </div>
                <p className="text-xs font-bold text-white truncate">{license.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">授权方: {license.licensorName}</p>
                <button 
                  onClick={() => setInputText(`合同ID: ${license.id}\n类型: ${license.licenseType}\n授权方: ${license.licensorName}\n请审核此授权合同的合规性...`)}
                  className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all"
                >
                  加载审核
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-3">
            {licensesLoading ? '加载中...' : '暂无待审核合同'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-[2rem] space-y-5">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-blue-400" />
              审计源输入 (Red Line Audit)
            </h3>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="粘贴待审协议或文案，Gemini 将自动过滤怜悯、卖惨等违规表达..."
              className="w-full h-52 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl p-4 text-sm text-slate-200 outline-none transition-all resize-none custom-scrollbar"
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading || !inputText}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldEllipsis className="w-4 h-4" />}
              启动'对等尊重'全量审计
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
              
              {/* 红线警告 */}
              {result.redLineViolations.length > 0 && (
                <div className="p-5 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl">
                   <div className="flex items-center gap-2 text-rose-500 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">红线词库拦截 (Pity Detected)</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {result.redLineViolations.map((v, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20">{v}</span>
                      ))}
                   </div>
                   <p className="text-[11px] text-slate-400 mt-3 leading-relaxed font-medium">
                     检测到以上带有施舍/同情色彩的词汇。系统建议将其替换为'艺术力量'、'独特视角'或'主权创作'。
                   </p>
                </div>
              )}

              <div className="glass-panel p-6 rounded-[2.5rem] space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white uppercase tracking-tight flex items-center gap-2 text-sm">
                       <Award className="w-4 h-4 text-blue-400" />
                       审计深度分析
                    </h4>
                    <div className="text-2xl font-black text-white font-orbitron">{result.complianceScore}%</div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">主权确权关键词</p>
                       <div className="flex flex-wrap gap-2">
                          {result.keyTerms.map((term, i) => (
                             <span key={i} className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] font-bold rounded-lg border border-blue-500/20">{term}</span>
                          ))}
                       </div>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">合规优化建议</p>
                       <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"{result.suggestions}"</p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] glass-panel rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center border-dashed border-2 border-slate-800">
              <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-4">
                <FileType className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Audit_Engine_Ready</h4>
              <p className="text-sm text-slate-600 mt-3 max-w-xs mx-auto leading-relaxed">
                每一个伟大的 IP 背后都有其法律灵魂。系统已加载红线名单制词库。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalArchitect;
