
// 星光引擎 API 服务层
// 对接后端 NestJS API

const API_BASE_URL = 'http://43.143.239.236/api/v1';

// 获取存储的token
const getToken = () => localStorage.getItem('starlight_token');

// 通用请求封装
const request = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== 认证 API ====================
export const authApi = {
  // 登录
  login: async (email: string, password: string) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 注册
  register: async (email: string, password: string, nickname: string, role: string) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, role }),
    });
  },

  // 获取当前用户信息
  getProfile: async () => {
    return request('/auth/profile');
  },
};

// ==================== 资产 API ====================
export const assetsApi = {
  // 获取资产列表
  getAssets: async (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/assets?${query}`);
  },

  // 获取资产详情
  getAsset: async (id: string) => {
    return request(`/assets/${id}`);
  },

  // 获取资产统计
  getStats: async () => {
    return request('/assets/stats');
  },

  // 创建资产
  createAsset: async (data: any) => {
    return request('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新资产
  updateAsset: async (id: string, data: any) => {
    return request(`/assets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // 更新资产状态
  updateStatus: async (id: string, status: string) => {
    return request(`/assets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== 授权合同 API ====================
export const licensesApi = {
  // 获取授权列表
  getLicenses: async (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/licenses?${query}`);
  },

  // 获取授权详情
  getLicense: async (id: string) => {
    return request(`/licenses/${id}`);
  },

  // 获取授权统计
  getStats: async () => {
    return request('/licenses/stats');
  },

  // 创建授权
  createLicense: async (data: any) => {
    return request('/licenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 签署授权
  signLicense: async (id: string) => {
    return request(`/licenses/${id}/sign`, {
      method: 'POST',
    });
  },
};

// ==================== 交易 API ====================
export const transactionsApi = {
  // 获取交易列表
  getTransactions: async (params?: { status?: string; type?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/transactions?${query}`);
  },

  // 获取交易统计
  getStats: async () => {
    return request('/transactions/stats');
  },
};

// ==================== 工作流 API ====================
export const workflowApi = {
  // 获取资产状态
  getAssetStatus: async (assetId: string) => {
    return request(`/workflow/assets/${assetId}/status`);
  },

  // 执行状态流转
  transition: async (assetId: string, targetStatus: string, reason?: string) => {
    return request(`/workflow/assets/${assetId}/transition`, {
      method: 'POST',
      body: JSON.stringify({ targetStatus, reason }),
    });
  },

  // 熔断资产
  freezeAsset: async (assetId: string, reason: string) => {
    return request(`/workflow/assets/${assetId}/freeze`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // 获取工作流统计
  getStats: async () => {
    return request('/workflow/stats');
  },
};

// ==================== 数据分析 API ====================
export const analyticsApi = {
  // 获取仪表盘数据
  getDashboard: async () => {
    return request('/analytics/dashboard');
  },

  // 获取全量报表
  getFullReport: async () => {
    return request('/analytics/full-report');
  },

  // 获取资产分布
  getAssetDistribution: async () => {
    return request('/analytics/assets/distribution');
  },

  // 获取收益统计
  getRevenue: async () => {
    return request('/analytics/revenue');
  },

  // 获取社会影响指标
  getSocialImpact: async () => {
    return request('/analytics/social-impact');
  },
};

// ==================== 通知 API ====================
export const notificationsApi = {
  // 获取通知列表
  getNotifications: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return request(`/notifications${query}`);
  },

  // 获取未读数量
  getUnreadCount: async () => {
    return request('/notifications/unread-count');
  },

  // 标记已读
  markAsRead: async (id: string) => {
    return request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  // 全部已读
  markAllAsRead: async () => {
    return request('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

// 保存token到本地存储
export const setToken = (token: string) => {
  localStorage.setItem('starlight_token', token);
};

// 清除token
export const clearToken = () => {
  localStorage.removeItem('starlight_token');
};
