
import React, { useState } from 'react';
import { Database, Server, Terminal, Code2, Layers, ShieldCheck, Zap, ScrollText, Compass, Heart, Gavel, Cpu, Share2, Workflow, Box, FileJson, FileCode } from 'lucide-react';

/**
 * BUSINESS INTENT: 
 * SystemBlueprint serves as the "source of truth" for investors, legal partners, and engineers.
 * It visualizes the invisible architecture that turns social empathy into commercial value.
 */

const SystemBlueprint: React.FC = () => {
  const [activeView, setActiveView] = useState<'manifesto' | 'sql' | 'api' | 'python'>('manifesto');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSchema = `-- STARLIGHT ENGINE CORE SCHEMA v2.0
-- BUSINESS INTENT: Support multi-party trust & automated profit distribution.

-- 1. Identity & Permissions
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT CHECK (role IN ('lawyer', 'chamber_member', 'admin', 'creative')),
    org_id UUID,
    metadata JSONB -- Linked account info for matrix platforms
);

-- 2. IP Asset Vault (The Soul of the System)
CREATE TABLE ip_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_name TEXT,
    status TEXT DEFAULT 'RAW', -- RAW -> ENHANCED -> 3D -> LEGAL -> CONTRACTED
    raw_source_url TEXT,
    enhanced_media_url TEXT,
    three_d_model_url TEXT, -- Path to .glb or .obj
    visual_dna_vector VECTOR(1536), -- Vector embeddings for similarity search
    legal_certification_hash TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);`;

  const pythonCode = `import asyncio
import httpx
from uuid import UUID

class Starlight3DEngine:
    """
    星光引擎 - 3D 拓扑重构模块 (Python Backend Implementation)
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.meshy_api = "https://api.meshy.ai/v1/image-to-3d"

    async def generate_3d_asset(self, asset_id: UUID, image_url: str):
        """
        核心异步流程：提交图片 -> 神经网络分析 -> 生成 GLB -> 同步数据库
        """
        async with httpx.AsyncClient() as client:
            # 1. 提交 3D 重构请求
            resp = await client.post(self.meshy_api, json={"image_url": image_url})
            task_id = resp.json().get("result")

            # 2. 轮询状态直至 SUCCEEDED
            while True:
                status_resp = await client.get(f"{self.meshy_api}/{task_id}")
                if status_resp.json().get("status") == "SUCCEEDED":
                    model_url = status_resp.json().get("model_urls").get("glb")
                    break
                await asyncio.sleep(10)

            # 3. 更新资产库数据库
            await self.db.update("ip_assets", {"three_d_model_url": model_url}, asset_id)
            return model_url`;

  const apiLogic = [
    {
      endpoint: "POST /api/v1/creative/reconstruct-3d",
      desc: "3D Reconstruction: Converting 2D inspiration to 3D commercial assets.",
      logic: "Input Enhanced Image -> Topology Analysis -> Generate Mesh (.glb) -> Sync to Cloud."
    },
    {
      endpoint: "POST /api/v1/legal/mint-hash",
      desc: "Copyright Minting: Generate legal proof for the AI-enhanced asset.",
      logic: "Collect Asset Metadata -> Lawyer Agent Audit -> SHA-256 Hash Generation -> DB Storage."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-orbitron text-white tracking-tighter flex items-center gap-4">
            <Layers className="w-10 h-10 text-blue-500" />
            系统架构蓝图 (System Blueprint)
          </h2>
          <p className="text-slate-400 mt-2 text-lg font-medium">支撑“四位一体”业务闭环的数字化底层契约。</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl">
           {[
             { id: 'manifesto', label: '设计总纲', icon: Compass },
             { id: 'sql', label: 'SQL 建模', icon: Database },
             { id: 'api', label: 'API 接口', icon: Zap },
             { id: 'python', label: '后端逻辑', icon: FileCode }
           ].map(view => (
             <button 
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === view.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <view.icon className="w-3.5 h-3.5" /> {view.label}
             </button>
           ))}
        </div>
      </div>

      {activeView === 'manifesto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
           <div className="glass-panel p-10 rounded-[3rem] border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                 <Heart className="w-6 h-6 text-rose-500" />
                 社会价值回馈
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                每一个 3D 重构资产都关联原始创作者 ID。当商会成员通过 3D 预览生成订货单时，系统自动在智能合约中锁定公益分成比例。
              </p>
           </div>
           <div className="glass-panel p-10 rounded-[3rem] border-l-4 border-emerald-500">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                 <Box className="w-6 h-6 text-emerald-500" />
                 数字孪生生产
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                重构的 3D 模型不仅是展示，其拓扑结构经过算法优化，可直接作为 3D 打印或模具开发的原始输入文件。
              </p>
           </div>
        </div>
      )}

      {activeView === 'sql' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-4">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">PostgreSQL DB Schema v2.0</span>
            <button onClick={() => copyToClipboard(sqlSchema)} className="text-[10px] text-blue-400 font-black hover:underline">{copied ? 'COPIED!' : 'COPY SQL'}</button>
          </div>
          <div className="glass-panel rounded-[2.5rem] overflow-hidden bg-black/40 border border-slate-800">
             <pre className="p-8 text-[11px] font-mono leading-relaxed text-blue-100/70 overflow-x-auto h-[500px] custom-scrollbar">
                <code>{sqlSchema}</code>
             </pre>
          </div>
        </div>
      )}

      {activeView === 'api' && (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
          {apiLogic.map((api, i) => (
            <div key={i} className="glass-panel p-8 rounded-[2rem] border border-slate-800 group hover:border-blue-500/30 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                 <div>
                    <code className="text-blue-400 font-bold text-sm">{api.endpoint}</code>
                    <p className="text-xs text-slate-400 mt-2 font-medium">{api.desc}</p>
                 </div>
                 <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 text-[10px] font-mono text-slate-500 italic">
                    {api.logic}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'python' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-4">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest text-indigo-400">Image2ThreeD Python Module (Core)</span>
            <button onClick={() => copyToClipboard(pythonCode)} className="text-[10px] text-indigo-400 font-black hover:underline">COPY MODULE CODE</button>
          </div>
          <div className="glass-panel rounded-[2.5rem] overflow-hidden bg-black/40 border border-slate-800">
             <pre className="p-8 text-[11px] font-mono leading-relaxed text-indigo-100/70 overflow-x-auto h-[500px] custom-scrollbar">
                <code>{pythonCode}</code>
             </pre>
          </div>
          <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex items-start gap-4">
             <Terminal className="w-5 h-5 text-indigo-500 mt-0.5" />
             <p className="text-xs text-slate-500 leading-relaxed italic">
                “该模块被部署在 Celery 异步工作流中，确保大批量 3D 生成任务不会阻塞主系统的营销与法律审计进程。”
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemBlueprint;
