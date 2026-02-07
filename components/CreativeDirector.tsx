import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Image as ImageIcon, Copy, Check, Loader2, Wand2, Eye, LayoutGrid, Zap, Heart, Box, Rotate3d, Database, FileCode } from 'lucide-react';
import { generateCreativePrompt, generateVisualAsset } from '../services/geminiService.ts';
import { imageTo3D, check3DTaskStatus } from '../services/hunyuan3dService.ts';
import { CreativePromptResult } from '../types.ts';
import { assetsApi } from '../services/api.ts';

interface Asset {
  id: string;
  name: string;
  thumbnailUrl: string;
  childName: string;
  visualDNA: string;
}

const CreativeDirector: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedInspiration, setSelectedInspiration] = useState<string | null>(null);
  const [result, setResult] = useState<CreativePromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [threeDLoading, setThreeDLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [threeDMode, setThreeDMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Real assets from backend
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);

  // Fetch real assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetsApi.getAssets({ status: 'PUBLISHED', limit: '6' });
        const formattedAssets = response.data?.map((asset: any) => ({
          id: asset.id,
          name: asset.name,
          thumbnailUrl: asset.thumbnailUrl || 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=80',
          childName: asset.childName || '星星的孩子',
          visualDNA: asset.visualDNA || '梦幻、艺术、独特',
        })) || [];
        setAssets(formattedAssets);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        // Fallback to mock data
        setAssets([
          { id: 'insp-1', name: '梦幻极光', thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=80', childName: '小宇', visualDNA: '深邃蓝、流动金' },
          { id: 'insp-2', name: '森林之眼', thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80', childName: '晨晨', visualDNA: '自然、生命、绿色' },
          { id: 'insp-3', name: '孤独宇航员', thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?w=200&q=80', childName: '悦悦', visualDNA: '太空、梦想、蓝色' },
        ]);
      } finally {
        setAssetsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setGeneratedImage(null);
    setThreeDMode(false);
    try {
      const data = await generateCreativePrompt(`${selectedInspiration ? `参考${selectedInspiration}的艺术风格：` : ''}${description}`);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisual = async (prompt: string) => {
    setVisualLoading(true);
    setThreeDMode(false);
    try {
      const imageUrl = await generateVisualAsset(prompt);
      if (imageUrl) setGeneratedImage(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setVisualLoading(false);
    }
  };

  const [model3DUrl, setModel3DUrl] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleTrigger3D = async () => {
    if (!generatedImage) return;
    setThreeDLoading(true);
    try {
      // 使用腾讯混元3D生成3D模型
      const result = await imageTo3D(generatedImage, {
        prompt: '保持艺术风格，生成精致的3D模型，适合商业展示',
        style: 'realistic',
      });
      
      if (result.success && result.taskId) {
        setTaskId(result.taskId);
        // 轮询检查任务状态
        const checkStatus = setInterval(async () => {
          const status = await check3DTaskStatus(result.taskId!);
          if (status.status === 'completed' && status.modelUrl) {
            clearInterval(checkStatus);
            setModel3DUrl(status.modelUrl);
            setThreeDMode(true);
            setThreeDLoading(false);
          } else if (status.status === 'failed') {
            clearInterval(checkStatus);
            console.error('3D生成失败:', status.message);
            setThreeDLoading(false);
          }
        }, 5000); // 每5秒检查一次
        
        // 60秒后自动停止轮询
        setTimeout(() => {
          clearInterval(checkStatus);
          if (!model3DUrl) {
            setThreeDLoading(false);
          }
        }, 60000);
      } else {
        console.error('3D生成失败:', result.message);
        setThreeDLoading(false);
      }
    } catch (error) {
      console.error('3D生成错误:', error);
      setThreeDLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-600/20 mb-2 shadow-xl">
          <Palette className="w-7 h-7 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-white font-orbitron tracking-tight">创意导演 · 3D 拓扑重构</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          将"星星的孩子"的视觉 DNA 从 2D 画作重构为 3D 商业资产。让灵感立体化。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-[2rem] space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-400" />
                灵感源选择
                {assetsLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {assets.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedInspiration(item.name)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedInspiration === item.name ? 'border-purple-500 scale-95 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.name} />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-0.5">
                      <p className="text-[8px] text-white text-center truncate">{item.childName}</p>
                    </div>
                  </button>
                ))}
              </div>
              {assets.length === 0 && !assetsLoading && (
                <p className="text-xs text-slate-500 text-center">暂无已发布作品</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                艺术叙事定义
              </h3>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述想要赋予的 3D 质感、材质（如磨砂、流动金属）..."
                className="w-full h-32 bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl p-3 text-sm text-slate-200 outline-none transition-all resize-none custom-scrollbar"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !description}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              开始视觉语义提取
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-purple-500 bg-purple-500/5">
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1.5">Gemini 视觉解构</h4>
                  <p className="text-base font-bold text-white mb-1 leading-tight">{result.visualStyle}</p>
                  <p className="text-xs text-slate-400 italic">"{result.storyAngle}"</p>
                </div>

                <div className="space-y-2">
                   {result.prompts.slice(0, 2).map((prompt, i) => (
                    <div key={i} className="group relative bg-slate-900/50 border border-slate-800 p-3 rounded-xl hover:border-purple-500/30 transition-all flex flex-col gap-2">
                      <p className="text-[10px] text-slate-400 leading-relaxed pr-8 line-clamp-2">{prompt}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleGenerateVisual(prompt)}
                          disabled={visualLoading}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Wand2 className="w-3 h-3" />
                          重构 2D 资产
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {generatedImage && (
                  <div className="space-y-2 pt-2">
                     <button 
                      onClick={handleTrigger3D}
                      disabled={threeDLoading || threeDMode}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-900/20 text-sm"
                     >
                       {threeDLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Box className="w-4 h-4" />}
                       {threeDMode ? '3D 拓扑重构已完成' : '启动 3D 拓扑重构'}
                     </button>
                     <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                        <FileCode className="w-3 h-3" />
                        Starlight_3D_Engine 驱动
                     </p>
                  </div>
                )}
              </div>

              {/* 渲染预览区 */}
              <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col relative min-h-[420px] group shadow-xl bg-slate-950">
                <div className="absolute top-5 left-5 z-20">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${threeDLoading ? 'bg-amber-500 animate-pulse' : (threeDMode ? 'bg-indigo-500' : (generatedImage ? 'bg-emerald-500' : 'bg-slate-700'))}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {threeDLoading ? '3D 重构中...' : (threeDMode ? '3D 预览' : (generatedImage ? '2D 资产' : '等待指令'))}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                   {threeDLoading ? (
                     <div className="flex flex-col items-center gap-4 animate-pulse">
                        <Rotate3d className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">拓扑分析中...</span>
                     </div>
                   ) : threeDMode ? (
                     <div className="w-full h-full relative group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-500/5">
                           <Box className="w-24 h-24 text-indigo-400 opacity-20 animate-bounce" />
                           <p className="text-sm font-bold text-indigo-300 mt-3 font-orbitron">3D_VIEWPORT</p>
                           <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">鼠标旋转 360° 预览</p>
                        </div>
                        <div className="absolute bottom-5 right-5 flex gap-2">
                           <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"><Rotate3d className="w-4 h-4 text-white" /></button>
                           <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"><Eye className="w-4 h-4 text-white" /></button>
                        </div>
                     </div>
                   ) : generatedImage ? (
                     <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                   ) : (
                     <LayoutGrid className="w-16 h-16 text-slate-800" />
                   )}
                </div>

                {threeDMode && (
                  <div className="p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">文件: GLB (3D)</span>
                           <h5 className="text-white font-bold text-sm">星星的脉动 - 拓扑 #01</h5>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase">
                           <Database className="w-3 h-3" /> 已存证
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                           生成合作书
                        </button>
                        {model3DUrl ? (
                          <a 
                            href={model3DUrl} 
                            download 
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-black uppercase flex items-center gap-2"
                          >
                            下载 .glb
                          </a>
                        ) : (
                          <button className="px-4 py-2.5 bg-slate-800 text-slate-500 rounded-lg text-xs font-black uppercase cursor-not-allowed">
                            生成中...
                          </button>
                        )}
                     </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] glass-panel rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center border-dashed border-2 border-slate-800">
              <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="text-lg font-bold text-slate-400">创意引擎已就绪</h4>
              <p className="text-sm text-slate-600 mt-2 max-w-xs mx-auto">
                输入公益画作背景，实现从 2D 到 3D 的 IP 进化。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeDirector;
