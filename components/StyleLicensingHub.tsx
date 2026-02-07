
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Boxes, 
  Palette, 
  Check, 
  Factory,
  MousePointer2,
  Workflow
} from 'lucide-react';
import { generateStyleAlgorithm, generateVisualAsset } from '../services/geminiService.ts';
import { StyleAlgorithmResult } from '../types.ts';
import { assetsApi, licensesApi } from '../services/api.ts';

interface StyleSource {
  id: string;
  name: string;
  dna: string;
  artist: string;
}

const StyleLicensingHub: React.FC = () => {
  const [productDesc, setProductDesc] = useState('');
  const [selectedStyleSource, setSelectedStyleSource] = useState('');
  const [algorithmResult, setAlgorithmResult] = useState<StyleAlgorithmResult | null>(null);
  const [visualResult, setVisualResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  
  // Real style sources from backend
  const [styleSources, setStyleSources] = useState<StyleSource[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);

  // Fetch real assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetsApi.getAssets({ status: 'PUBLISHED', limit: '6' });
        const formattedSources = response.data?.map((asset: any, index: number) => ({
          id: asset.id,
          name: asset.name,
          dna: asset.visualDNA || asset.styleTags?.join('、') || '独特艺术风格',
          artist: asset.childName || '星星的孩子',
        })) || [];
        setStyleSources(formattedSources);
        if (formattedSources.length > 0) {
          setSelectedStyleSource(formattedSources[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch style sources:', error);
        // Fallback to mock data
        const fallback = [
          { id: 'midnight_galaxy', name: '午夜星系', dna: '深邃蓝、流动金、颗粒感质向', artist: '小宇' },
          { id: 'rainbow_forest', name: '彩虹森林', dna: '高饱和对比、有序线条、生命张力', artist: '晨晨' },
          { id: 'silent_companion', name: '静默陪伴', dna: '莫兰迪灰调、柔边轮廓、温馨颗粒', artist: '悦悦' },
        ];
        setStyleSources(fallback);
        setSelectedStyleSource(fallback[0].id);
      } finally {
        setSourcesLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleInfuse = async () => {
    if (!productDesc) return;
    setLoading(true);
    setAlgorithmResult(null);
    setVisualResult(null);
    try {
      const source = styleSources.find(s => s.id === selectedStyleSource);
      const algo = await generateStyleAlgorithm(`IP源: ${source?.name}, DNA: ${source?.dna}`);
      setAlgorithmResult(algo);
      
      setRendering(true);
      const visualPrompt = `A high-end commercial product shot of a ${productDesc}, but infused with the ${algo.algorithmName} artistic style: ${algo.visualDNA}. Surreal, cinematic lighting, 8k resolution, artistic flair.`;
      const imageUrl = await generateVisualAsset(visualPrompt);
      if (imageUrl) setVisualResult(imageUrl);
      setRendering(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-600/20 mb-2 shadow-xl">
          <Workflow className="w-7 h-7 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold font-orbitron text-white">风格授权枢纽</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          超越形象贴牌。我们将"星星的孩子"的视觉 DNA 转化为商业算法，为传统制造注入艺术灵魂。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 配置区 */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-6 rounded-[2rem] space-y-6 relative overflow-hidden">
             <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Palette className="w-4 h-4 text-blue-400" />
                   1. 选择艺术 DNA 源
                   {sourcesLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                </h3>
                <div className="space-y-2">
                   {styleSources.map((s) => (
                     <button
                        key={s.id}
                        onClick={() => setSelectedStyleSource(s.id)}
                        className={`w-full p-3 rounded-xl border transition-all text-left flex justify-between items-center ${
                           selectedStyleSource === s.id 
                           ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' 
                           : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                     >
                        <div>
                           <p className="text-xs font-bold">{s.name}</p>
                           <p className="text-[10px] opacity-60">{s.dna}</p>
                           <p className="text-[9px] mt-0.5 text-slate-600">by {s.artist}</p>
                        </div>
                        {selectedStyleSource === s.id && <Check className="w-4 h-4" />}
                     </button>
                   ))}
                </div>
                {styleSources.length === 0 && !sourcesLoading && (
                  <p className="text-xs text-slate-500 text-center">暂无可用风格源</p>
                )}
             </div>

             <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Factory className="w-4 h-4 text-blue-400" />
                   2. 注入传统产品描述
                </h3>
                <textarea 
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="例如：一家拥有 20 年历史的陶瓷厂生产的高端茶具..."
                  className="w-full h-28 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl p-4 text-sm text-slate-200 outline-none transition-all resize-none custom-scrollbar"
                />
             </div>

             <button 
                onClick={handleInfuse}
                disabled={loading || !productDesc}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/40 group active:scale-95 text-sm"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                启动算法风格缝合
             </button>
          </div>
        </div>

        {/* 结果展示区 */}
        <div className="lg:col-span-8 space-y-6">
           {algorithmResult ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-4">
                   <div className="glass-panel p-6 rounded-[2rem] border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">授权算法定义 (v1.0)</span>
                         <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{algorithmResult.algorithmName}</h3>
                      <p className="text-xs text-slate-400 italic mb-4">"{algorithmResult.philosophy}"</p>
                      
                      <div className="space-y-3">
                         <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">视觉 DNA 编码</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{algorithmResult.visualDNA}</p>
                         </div>
                         <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">生产线实施指南</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{algorithmResult.implementationGuide}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-800 transition-all flex items-center justify-center gap-2">
                         <Boxes className="w-4 h-4" />
                         导出算法模型
                      </button>
                      <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                         <ShieldCheck className="w-4 h-4" />
                         生成授权合约
                      </button>
                   </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative group min-h-[420px]">
                   <div className="absolute top-5 left-5 z-20">
                      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            算法渲染结果预览
                         </span>
                      </div>
                   </div>

                   <div className="flex-1 bg-slate-950 flex items-center justify-center relative">
                      {rendering ? (
                        <div className="flex flex-col items-center gap-3 text-center">
                           <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                           <p className="text-[10px] text-slate-500 uppercase font-black">正在映射视觉 DNA...</p>
                        </div>
                      ) : visualResult ? (
                        <>
                           <img src={visualResult} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" alt="Infused Asset" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                           <div className="absolute bottom-6 left-6 right-6 text-center p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">风格溢价评估: +45%</p>
                              <p className="text-[8px] text-slate-400">基于"星星的孩子"情感加权算法</p>
                           </div>
                        </>
                      ) : null}
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[500px] glass-panel rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center border-dashed border-2 border-slate-800">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                   <Cpu className="w-10 h-10 text-slate-700" />
                </div>
                <h4 className="text-xl font-bold text-slate-400 font-orbitron">等待引擎注入</h4>
                <p className="text-sm text-slate-600 mt-3 max-w-sm mx-auto leading-relaxed">
                   在这里，我们不只是授权一个图形。我们授权一种美学算法，让传统制造业的产品带上"星星的质感"。
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StyleLicensingHub;
