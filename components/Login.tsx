
import React, { useState } from 'react';
import { ShieldCheck, Heart, Briefcase, Gavel, Loader2, Fingerprint, Zap, Smartphone, Globe, AlertCircle } from 'lucide-react';
import { SystemRole, User } from '../types.ts';
import { authApi, setToken } from '../services/api.ts';

interface LoginProps {
  onLogin: (user: User) => void;
}

// 角色对应的测试账号
const ROLE_ACCOUNTS: Record<SystemRole, { email: string; password: string; name: string }> = {
  [SystemRole.ADMIN]: { email: 'admin@starlight.engine', password: 'Starlight2025', name: '系统管理员' },
  [SystemRole.LAWYER]: { email: 'lawyer@starlight.engine', password: 'Legal2025', name: '法务律师' },
  [SystemRole.MERCHANT]: { email: 'merchant@starlight.engine', password: 'Trade2025', name: '商业商户' },
  [SystemRole.VOLUNTEER]: { email: 'volunteer@starlight.engine', password: 'Love2025', name: '志愿者' },
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<SystemRole>(SystemRole.ADMIN);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const roles = [
    { id: SystemRole.ADMIN, name: '指挥官 (Owner)', desc: '全量矩阵管理与分账中心', icon: Zap, color: 'text-cyan-400', border: 'hover:border-cyan-500/50' },
    { id: SystemRole.LAWYER, name: '法务官 (Lawyer)', desc: '主权确权与红线词库审计', icon: Gavel, color: 'text-blue-400', border: 'hover:border-blue-500/50' },
    { id: SystemRole.MERCHANT, name: '合伙人 (Merchant)', desc: '商会联名与3D资产认养', icon: Briefcase, color: 'text-amber-400', border: 'hover:border-amber-500/50' },
    { id: SystemRole.VOLUNTEER, name: '志愿者 (Volunteer)', desc: '灵感感知与画作DNA采集', icon: Heart, color: 'text-rose-400', border: 'hover:border-rose-500/50' },
  ];

  // 点击角色：显示账号密码并自动登录
  const handleRoleClick = (roleId: SystemRole) => {
    if (isAuthenticating) return;
    
    setSelectedRole(roleId);
    const account = ROLE_ACCOUNTS[roleId];
    
    // 显示提示框
    const confirmed = window.confirm(
      `【测试模式 - 快速登录】\n\n` +
      `角色：${account.name}\n` +
      `账号：${account.email}\n` +
      `密码：${account.password}\n\n` +
      `点击"确定"直接登录，点击"取消"手动输入`
    );
    
    if (confirmed) {
      // 自动填充并登录
      setEmail(account.email);
      setPassword(account.password);
      // 延迟执行登录，等待状态更新
      setTimeout(() => {
        performLogin(account.email, account.password, roleId);
      }, 100);
    }
  };

  // 执行登录
  const performLogin = async (loginEmail: string, loginPassword: string, role: SystemRole) => {
    setIsAuthenticating(true);
    setError('');
    
    try {
      const response = await authApi.login(loginEmail, loginPassword);
      
      // 保存token
      setToken(response.access_token);
      
      // 登录成功
      onLogin({
        id: response.user.id,
        nickname: response.user.nickname,
        avatar: response.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + response.user.id,
        role: role,
        isVerified: true,
      });
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogin = async () => {
    const loginEmail = email.trim() || ROLE_ACCOUNTS[selectedRole].email;
    const loginPassword = password || ROLE_ACCOUNTS[selectedRole].password;
    await performLogin(loginEmail, loginPassword, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <div className="w-full max-w-5xl px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Brand Identity */}
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-white/10">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black font-orbitron tracking-tighter text-white uppercase leading-none">
                Starlight<br/><span className="text-cyan-400">Engine</span>
              </h1>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Matrix Ecosystem v1.4</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight leading-snug">
              让灵感拥有主权，<br/>为每一份沉默赋予声音。
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              星光引擎是一个集公益、法律、商业与科技于一体的四位一体化矩阵系统。通过 DCI 数字存证与星之声算法，重塑社会公益价值。
            </p>
          </div>

          <div className="flex gap-8 items-center pt-4 opacity-50">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Mobile Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Web3 Provenance</span>
            </div>
          </div>
        </div>

        {/* Right: Role Selection & Auth */}
        <div className="glass-panel p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10 relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight font-orbitron">Identify_Terminal</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">请选择您的系统预设角色</p>
            <p className="text-[10px] text-amber-400/80 font-medium">💡 点击任意角色查看测试账号并快速登录</p>
          </div>

          <div className="grid grid-cols-1 gap-3 relative z-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                className={`flex items-center gap-6 p-5 rounded-3xl border transition-all text-left group ${
                  selectedRole === role.id 
                    ? 'bg-white/10 border-white/20 shadow-xl' 
                    : 'bg-white/5 border-transparent hover:bg-white/10 ' + role.border
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 ${role.color}`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold uppercase tracking-tight ${selectedRole === role.id ? 'text-white' : 'text-slate-400'}`}>
                    {role.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                </div>
                {selectedRole === role.id && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Account Input */}
          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">邮箱 / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ROLE_ACCOUNTS[selectedRole].email}
                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">密码 / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4 relative z-10">
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating_DNA...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Connect_To_Starlight
                </>
              )}
            </button>
          </div>
          
          <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest relative z-10 font-bold">
            Securely encrypted by Starlight_Shield_Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
