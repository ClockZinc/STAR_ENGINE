
import React, { useState } from 'react';
import { 
  LayoutDashboard, Heart, Workflow, Library, 
  Palette, Gavel, Megaphone, Cpu, FileCode,
  ShieldCheck, Menu, X, Bell, User as UserIcon, Zap, Terminal, Smartphone,
  Info, SearchCode, Radio, Briefcase, LogOut
} from 'lucide-react';
import Overview from './components/Overview.tsx';
import CharityGallery from './components/CharityGallery.tsx';
import StyleLicensingHub from './components/StyleLicensingHub.tsx';
import AssetLibrary from './components/AssetLibrary.tsx';
import CreativeDirector from './components/CreativeDirector.tsx';
import LegalArchitect from './components/LegalArchitect.tsx';
import MarketingStrategist from './components/MarketingStrategist.tsx';
import DistributionHub from './components/DistributionHub.tsx';
import SystemBlueprint from './components/SystemBlueprint.tsx';
import CommanderDashboard from './components/CommanderDashboard.tsx';
import PartnerSaaS from './components/PartnerSaaS.tsx'; 
import Login from './components/Login.tsx';

// Mobile Components
import MobileShell from './components/MobileShell.tsx';
import VolunteerCamera from './components/VolunteerCamera.tsx';
import MerchantARPreview from './components/MerchantARPreview.tsx';
import LawyerQuickAudit from './components/LawyerQuickAudit.tsx';
import TraceabilityPage from './components/TraceabilityPage.tsx';

import { User, SystemRole } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMode, setMobileMode] = useState<'none' | 'volunteer' | 'merchant' | 'lawyer' | 'trace'>('none');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100); // 缩放百分比

  const tabs = [
    { id: 'commander', name: '指挥官座舱', icon: Terminal, color: 'text-cyan-400', roles: [SystemRole.ADMIN] },
    { id: 'overview', name: '数据总览', icon: LayoutDashboard, roles: [SystemRole.ADMIN, SystemRole.LAWYER] },
    { id: 'partner', name: '星光合伙人', icon: Briefcase, color: 'text-indigo-400', roles: [SystemRole.ADMIN, SystemRole.MERCHANT] }, 
    { id: 'charity', name: '星光公益', icon: Heart, color: 'text-rose-400', roles: [SystemRole.ADMIN, SystemRole.VOLUNTEER] },
    { id: 'style', name: '授权引擎', icon: Workflow, color: 'text-blue-400', roles: [SystemRole.ADMIN, SystemRole.MERCHANT] },
    { id: 'creative', name: '创意工作流', icon: Palette, roles: [SystemRole.ADMIN, SystemRole.VOLUNTEER] },
    { id: 'legal', name: '法务护城河', icon: Gavel, roles: [SystemRole.ADMIN, SystemRole.LAWYER] },
    { id: 'marketing', name: '全案营销', icon: Megaphone, roles: [SystemRole.ADMIN, SystemRole.MERCHANT] },
    { id: 'distribution', name: '矩阵集群', icon: Cpu, roles: [SystemRole.ADMIN] },
    { id: 'library', name: '数字资产库', icon: Library, roles: [SystemRole.ADMIN, SystemRole.LAWYER, SystemRole.MERCHANT] },
    { id: 'blueprint', name: '系统架构', icon: FileCode, roles: [SystemRole.ADMIN] },
  ];

  // Filter tabs based on role
  const filteredTabs = tabs.filter(tab => currentUser && tab.roles.includes(currentUser.role));

  const handleLogout = () => {
    setCurrentUser(null);
    setMobileMode('none');
    setActiveTab('overview');
  };

  const renderContent = () => {
    if (!currentUser) return null;

    if (mobileMode !== 'none') {
        let title = "星光引擎小程序";
        let content = null;
        if (mobileMode === 'volunteer') { title = "志愿者端 · 灵感采集"; content = <VolunteerCamera />; }
        if (mobileMode === 'merchant') { title = "商会端 · AR 展厅"; content = <MerchantARPreview />; }
        if (mobileMode === 'lawyer') { title = "律师端 · 移动审计"; content = <LawyerQuickAudit />; }
        if (mobileMode === 'trace') { title = "NFC 数字孪生溯源"; content = <TraceabilityPage />; }
        
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 animate-in fade-in duration-700 bg-[#020617]/50 backdrop-blur-sm h-full overflow-hidden">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-2">
                       <Smartphone className="w-8 h-8 text-indigo-400" />
                       <h2 className="text-2xl font-black font-orbitron text-white uppercase tracking-tighter">Mobile_Simulator</h2>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">模拟真实微信小程序运行环境与交互逻辑</p>
                </div>
                <MobileShell title={title}>{content}</MobileShell>
                <button 
                  onClick={() => setMobileMode('none')}
                  className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  退出模拟器
                </button>
            </div>
        );
    }

    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'charity': return <CharityGallery />;
      case 'style': return <StyleLicensingHub />;
      case 'library': return <AssetLibrary />;
      case 'creative': return <CreativeDirector />;
      case 'legal': return <LegalArchitect />;
      case 'marketing': return <MarketingStrategist />;
      case 'distribution': return <DistributionHub />;
      case 'blueprint': return <SystemBlueprint />;
      case 'commander': return <CommanderDashboard />;
      case 'partner': return <PartnerSaaS />;
      default: return <Overview />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Dynamic Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-24'} glass-panel border-r border-slate-800 transition-all duration-500 flex flex-col z-40 relative`}
      >
        <div className="p-6 flex items-center gap-4 border-b border-slate-800/50 h-20">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden">
              <h1 className="text-xl font-black font-orbitron tracking-tighter text-white uppercase leading-none">Star<br/><span className="text-indigo-400">Engine</span></h1>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Ecosystem Matrix</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileMode('none'); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : (tab.color || 'text-slate-500')}`} />
              {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">{tab.name}</span>}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-slate-800/50 space-y-2">
            <p className={`text-[8px] font-black text-slate-600 uppercase tracking-widest px-5 mb-4 ${!isSidebarOpen && 'hidden'}`}>Simulator_Shortcuts</p>
            {[
              { id: 'volunteer', label: '采集端 (NFC/Cam)', icon: Zap, mode: 'volunteer' },
              { id: 'merchant', label: '商会端 (AR/SaaS)', icon: Briefcase, mode: 'merchant' },
              { id: 'lawyer', label: '律师端 (DCI/Sign)', icon: ShieldCheck, mode: 'lawyer' },
              { id: 'trace', label: '溯源页 (Physical)', icon: Smartphone, mode: 'trace' }
            ].map((sim) => (
              <button
                key={sim.id}
                onClick={() => setMobileMode(sim.mode as any)}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all group border border-dashed ${
                  mobileMode === sim.mode 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                    : 'border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                }`}
              >
                <sim.icon className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">{sim.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-950/40">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
               <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{currentUser.nickname}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all ${!isSidebarOpen && 'px-0'}`}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Logout_System</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 transition-all active:scale-95"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
               <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                 {mobileMode !== 'none' ? 'Simulator_Mode' : (filteredTabs.find(t => t.id === activeTab)?.name || 'Dashboard')}
               </h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Blockchain_Node: OK</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-3 bg-slate-900/60 px-5 py-2.5 rounded-2xl border border-slate-800">
                <SearchCode className="w-4 h-4 text-slate-600" />
                <input type="text" placeholder="全局搜索存证资产..." className="bg-transparent border-none outline-none text-[10px] w-48 text-slate-300 placeholder:text-slate-600 font-bold uppercase tracking-widest" />
             </div>
             <button className="relative p-3 hover:bg-white/5 rounded-2xl text-slate-500 transition-all group">
                <Bell className="w-6 h-6 group-hover:animate-bounce" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
             </button>
             <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                <Zap className="w-6 h-6 fill-white" />
             </button>
          </div>
        </header>

        {/* Scrollable Body with Zoom */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.05),transparent_70%)]">
           <div className="p-6 min-h-full" style={{ zoom: `${zoomLevel}%` }}>
              {renderContent()}
           </div>
        </div>

        {/* Global Footer Status */}
        <footer className="h-10 border-t border-slate-800/50 bg-slate-950 px-8 flex items-center justify-between shrink-0">
           <div className="flex gap-6 items-center">
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">© 2026 Starlight_Engine</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">AI Core: Gemini 3.0 Pro</span>
              </div>
           </div>
           
           {/* Zoom Controls */}
           <div className="flex items-center gap-3">
              <span className="text-[8px] font-black text-slate-600 uppercase">缩放</span>
              <button 
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs transition-all"
              >-</button>
              <span className="text-[10px] font-mono text-slate-400 w-12 text-center">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs transition-all"
              >+</button>
              <button 
                onClick={() => setZoomLevel(100)}
                className="text-[8px] font-black text-slate-600 hover:text-slate-400 uppercase transition-all"
              >重置</button>
           </div>
           
           <div className="flex gap-4">
              <span className="text-[8px] font-black text-slate-800 uppercase">Privacy_Locked</span>
              <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest">v1.4.2_LATEST</span>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
