
import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Briefcase, 
  FileVideo, 
  Share2, 
  Loader2, 
  Send, 
  UserSquare2, 
  Smartphone, 
  Layout, 
  Sparkles,
  PlayCircle,
  Heart,
  Link as LinkIcon,
  Tag,
  ArrowRight,
  Gavel,
  Coins,
  ShieldCheck,
  Zap,
  Workflow,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { generateMarketingScript, generateLicensingStrategy } from '../services/geminiService.ts';
import { MarketingScriptResult, LicensingStrategyResult } from '../types.ts';
import { assetsApi } from '../services/api.ts';

interface CharityIP {
  id: string;
  name: string;
  artist: string;
  tags: string[];
  thumbnailUrl?: string;
}

const MarketingStrategist: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [selectedIP, setSelectedIP] = useState<string | null>(null);
  const [licensingMode, setLicensingMode] = useState<'image' | 'style'>('image');
  const [result, setResult] = useState<MarketingScriptResult | null>(null);
  const [licensingResult, setLicensingResult] = useState<LicensingStrategyResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Real IPs from backend
  const [charityIPs, setCharityIPs] = useState<CharityIP[]>([]);
  const [ipsLoading, setIpsLoading] = useState(true);

  // Fetch real assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetsApi.getAssets({ status: 'PUBLISHED', limit: '6' });
        const formattedIPs = response.data?.map((asset: any) => ({
          id: asset.id,
          name: asset.name,
          artist: asset.childName || '星星的孩子',
          tags: asset.styleTags || ['艺术', '公益', '温暖'],
          thumbnailUrl: asset.thumbnailUrl,
        })) || [];
        setCharityIPs(formattedIPs);
      } catch (error) {
        console.error('Failed to fetch IPs:', error);
        // Fallback to mock data
        setCharityIPs([
          { id: 'ip-1', name: '午夜星系', artist: '小宇', tags: ['星空', '宁静', '深邃'] },
          { id: 'ip-2', name: '彩虹森林', artist: '晨晨', tags: ['色彩', '希望', '生命'] },
          { id: 'ip-3', name: '不说话的朋友', artist: '悦悦', tags: ['温暖', '治愈', '陪伴'] },
        ]);
      } finally {
        setIpsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleGenerate = async () => {
    if (!productInfo || !selectedIP) return;
    setLoading(true);
    const ipDetail = charityIPs.find(ip => ip.id === selectedIP);
    
    try {
      const strat = await generateLicensingStrategy(ipDetail?.name || '', productInfo, licensingMode);
      setLicensingResult(strat);
      const context = `创作者：${ipDetail?.artist} 作品：《${ipDetail?.name}》。`;
      const data = await generateMarketingScript(productInfo, context, JSON.stringify(strat));
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-600/20 mb-2 shadow-xl">
          <Megaphone className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-white font-orbitron tracking-tight uppercase">Marketing_Strategist</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          拒绝怜悯，拥抱欣赏：将艺术灵魂注入商业联名全案脚本。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-[2rem] space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Workflow className="w-4 h-4 text-blue-400" />
                第一步：授权模式
              </h3>
              <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => setLicensingMode('image')}
                    className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-1.5 ${licensingMode === 'image' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                 >
                    <Tag className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">形象授权</span>
                 </button>
                 <button 
                    onClick={() => setLicensingMode('style')}
                    className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-1.5 ${licensingMode === 'style' ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                 >
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">算法风格授权</span>
                 </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                第二步：核心 IP
                {ipsLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {charityIPs.map((ip) => (
                  <button
                    key={ip.id}
                    onClick={() => setSelectedIP(ip.id)}
                    className={`p-3 rounded-lg border transition-all text-left flex justify-between items-center ${selectedIP === ip.id ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">{ip.name}</p>
                      <p className="text-[9px] mt-0.5">Artist: {ip.artist}</p>
                      <div className="flex gap-1 mt-0.5">
                        {ip.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 bg-slate-800 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {charityIPs.length === 0 && !ipsLoading && (
                <p className="text-xs text-slate-500 text-center">暂无可用IP</p>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                第三步：商业信息
              </h3>
              <textarea 
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                placeholder="输入商会产品或企业信息..."
                className="w-full h-28 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl p-4 text-sm text-slate-200 outline-none transition-all resize-none custom-scrollbar"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !productInfo || !selectedIP}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              启动尊严营销演算
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
              
              {/* 红线警告 */}
              {!result.redLineCheck.passed && (
                <div className="p-5 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl flex items-start gap-3">
                   <ShieldAlert className="w-5 h-5 text-rose-500 mt-0.5" />
                   <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">检测到红线词汇 (Red Line Alert)</h4>
                      <p className="text-xs text-slate-300">系统拦截了以下可能损害创作者尊严的词语：{result.redLineCheck.detectedWords.join('、')}</p>
                      <p className="text-[10px] text-rose-400/80 italic">修改建议：{result.redLineCheck.fixSuggestion}</p>
                   </div>
                </div>
              )}

              <div className={`glass-panel p-6 rounded-[2.5rem] border-l-4 transition-all ${result.redLineCheck.passed ? 'border-emerald-500' : 'border-rose-500 opacity-60'}`}>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       {result.redLineCheck.passed ? '全网矩阵分发脚本 (已过审)' : '待修正脚本 (审核未通过)'}
                    </p>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{result.platform}</span>
                  </div>
                  <h4 className="text-lg font-black text-white leading-tight italic">"{result.hook}"</h4>
                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {result.body}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <div className="flex gap-2">
                       {result.hashtags.map((tag, i) => (
                         <span key={i} className="text-[10px] font-bold text-emerald-500/80">#{tag}</span>
                       ))}
                    </div>
                    {result.redLineCheck.passed && (
                      <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40">
                         推送至矩阵 <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {licensingResult && (
                 <div className="glass-panel p-6 rounded-[2.5rem] border-l-4 border-indigo-500 animate-in fade-in duration-700">
                    <div className="flex justify-between items-center mb-4">
                       <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> 算法授权方案建议
                       </h5>
                       <span className="text-[10px] font-bold text-slate-500 uppercase">IP 主权锁已激活</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase">预估 IP 溢价</p>
                          <p className="text-lg font-black text-white">{licensingResult.royaltyRate}</p>
                       </div>
                       <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase">建议入场费</p>
                          <p className="text-lg font-black text-white">{licensingResult.entryFeeSuggestion}</p>
                       </div>
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[420px] glass-panel rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center border-dashed border-2 border-slate-800">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                <Workflow className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="text-xl font-bold text-slate-400 font-orbitron uppercase">Waiting_For_Strategy</h4>
              <p className="text-sm text-slate-600 mt-3 max-w-sm mx-auto leading-relaxed">
                每一个联名方案都应基于'对等欣赏'。系统将自动拦截带有卖惨色彩的内容。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingStrategist;
