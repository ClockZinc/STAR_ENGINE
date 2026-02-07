
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Quote, 
  Loader2, 
  BookOpen, 
  Award,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { generateArtStory } from '../services/geminiService.ts';
import { assetsApi } from '../services/api.ts';
import { ArtStoryResult } from '../types.ts';

const CharityGallery: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [story, setStory] = useState<ArtStoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [assetsLoading, setAssetsLoading] = useState(true);

  // 加载资产数据
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await assetsApi.getAssets({ limit: '10' });
        const data = response.data || [];
        // 格式化资产数据
        let formattedAssets = data.map((asset: any) => ({
          id: asset.id,
          title: asset.name || asset.title || '未命名作品',
          artist: asset.childName || asset.creator?.nickname || '未知艺术家',
          image: asset.thumbnailUrl || asset.originalUrl || 'https://via.placeholder.com/800x500?text=No+Image',
          description: asset.description || asset.artStory || '暂无描述',
          emotionTags: asset.emotionTags || [],
        }));
        
        // 如果没有数据，使用默认测试数据
        if (formattedAssets.length === 0) {
          formattedAssets = [
            {
              id: 'test-1',
              title: '星空之梦',
              artist: '小宇',
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop',
              description: '这幅画描绘了孩子眼中的星空，充满了对宇宙的好奇与向往。蓝色和紫色的渐变代表着无限的想象空间。',
              emotionTags: ['星空', '梦想', '宁静']
            },
            {
              id: 'test-2',
              title: '彩虹森林',
              artist: '晨晨',
              image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=500&fit=crop',
              description: '色彩斑斓的森林，代表着生命的活力与希望。每一笔都充满了对自然的热爱。',
              emotionTags: ['森林', '生命', '希望']
            },
            {
              id: 'test-3',
              title: '海洋之心',
              artist: '悦悦',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
              description: '深蓝色的海洋，深藏着孩子内心的世界。波浪的起伏象征着情感的流动。',
              emotionTags: ['海洋', '深邃', '宁静']
            }
          ];
        }
        
        setAssets(formattedAssets);
        if (formattedAssets.length > 0) {
          setSelectedWork(formattedAssets[0]);
        }
      } catch (error) {
        console.error('加载资产失败:', error);
        // 使用默认测试数据
        setAssets([
          {
            id: 'test-1',
            title: '星空之梦',
            artist: '小宇',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop',
            description: '这幅画描绘了孩子眼中的星空，充满了对宇宙的好奇与向往。蓝色和紫色的渐变代表着无限的想象空间。',
            emotionTags: ['星空', '梦想', '宁静']
          },
          {
            id: 'test-2',
            title: '彩虹森林',
            artist: '晨晨',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=500&fit=crop',
            description: '色彩斑斓的森林，代表着生命的活力与希望。每一笔都充满了对自然的热爱。',
            emotionTags: ['森林', '生命', '希望']
          },
          {
            id: 'test-3',
            title: '海洋之心',
            artist: '悦悦',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
            description: '深蓝色的海洋，深藏着孩子内心的世界。波浪的起伏象征着情感的流动。',
            emotionTags: ['海洋', '深邃', '宁静']
          }
        ]);
      } finally {
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const handleInterpret = async () => {
    if (!selectedWork) return;
    setLoading(true);
    try {
      const data = await generateArtStory(selectedWork.description);
      setStory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-rose-600/10 rounded-2xl flex items-center justify-center border border-rose-600/20 mb-2 shadow-[0_0_20px_rgba(225,29,72,0.15)]">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
        </div>
        <h2 className="text-3xl font-bold font-orbitron text-white">星光公益画廊</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base italic">
          "星星的孩子"虽然沉默，但他们的画笔是通向宇宙的语言。让我们用心聆听每一份色彩。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：画作展示与选择 */}
        <div className="lg:col-span-7 space-y-4">
          {selectedWork ? (
          <div className="glass-panel rounded-[2.5rem] overflow-hidden border-rose-500/20 shadow-xl group relative">
            <div className="aspect-[16/10] relative">
              <img 
                src={selectedWork.image} 
                alt={selectedWork.title} 
                className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-8">
                <h3 className="text-2xl font-bold text-white mb-1">{selectedWork.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-0.5 bg-rose-600/20 border border-rose-500/30 rounded-full text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                    艺术家: {selectedWork.artist}
                  </div>
                  <span className="text-slate-400 text-[10px] font-medium">编号: {selectedWork.id}</span>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border-rose-500/20 shadow-xl p-16 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">暂无作品展示</p>
              </div>
            </div>
          )}

          {assetsLoading ? (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              加载作品...
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              暂无作品数据
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-4">
            {assets.map((work) => (
              <button
                key={work.id}
                onClick={() => {
                  setSelectedWork(work);
                  setStory(null);
                }}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all aspect-video ${
                  selectedWork?.id === work.id 
                    ? 'border-rose-500 scale-95 shadow-[0_0_20px_rgba(225,29,72,0.3)]' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={work.image} className="w-full h-full object-cover" alt={work.title} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <BookOpen className="w-5 h-5 text-white" />
                </div>
              </button>
            ))}
          </div>
          )}
        </div>

        {/* 右侧：AI 情感解读 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {!story ? (
            <div className="glass-panel p-8 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center space-y-5 border-dashed border-2 border-slate-800">
               <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
               </div>
               <div>
                  <h4 className="text-lg font-bold text-white">解读画笔下的"星语"</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    调用 Gemini 策展人引擎，通过艺术感知力重构画作背后的情感叙事，并挖掘其潜在的商业 IP 价值。
                  </p>
               </div>
               <button 
                onClick={handleInterpret}
                disabled={loading || !selectedWork}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-900/40 active:scale-95 disabled:opacity-50 text-sm"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                 启动情感共鸣引擎
               </button>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-[2.5rem] space-y-6 animate-in slide-in-from-right-8 border-l-4 border-rose-500 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-rose-600/5 blur-[80px] rounded-full -z-10"></div>
               
               <div className="space-y-1.5">
                 <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">
                   <Quote className="w-3 h-3 fill-rose-500" />
                   星语策展报告
                 </div>
                 <h3 className="text-xl font-bold text-white leading-tight">{story.title}</h3>
               </div>

               <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-serif italic">
                 {story.narrative.split('\n').map((para, i) => (
                   <p key={i}>{para}</p>
                 ))}
               </div>

               <div className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                 <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">商业化与公益价值</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">{story.commercialPotential}</p>
               </div>

               <div className="flex flex-wrap gap-2">
                 {story.tags.map((tag, i) => (
                   <span key={i} className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20">#{tag}</span>
                 ))}
               </div>

               <div className="pt-5 border-t border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                     <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> 此内容已同步至营销中心</span>
                     <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[10px]">查看授权协议 <ExternalLink className="w-3 h-3" /></button>
                  </div>
                  <button className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group text-sm">
                    推送到创意重构引擎
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharityGallery;
