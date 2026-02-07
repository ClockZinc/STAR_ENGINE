// 腾讯混元3D API 服务
// 使用 OpenAI 兼容方式接入

const HUNYUAN_API_KEY = 'sk-LuuHWt0E6iQH6IRlLh5hxLL0ZJBhSDm2Q8IOcdSUHgGPWvtD';
const HUNYUAN_BASE_URL = 'https://api.hunyuan.tencentcloud.com/v1';

/**
 * 3D 模型生成结果
 */
interface Model3DResult {
  success: boolean;
  modelUrl?: string;
  taskId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

/**
 * 图片转3D模型
 * @param imageUrl 图片URL
 * @param options 生成选项
 */
export const imageTo3D = async (
  imageUrl: string,
  options: {
    prompt?: string;
    negativePrompt?: string;
    style?: 'realistic' | 'cartoon' | 'abstract';
  } = {}
): Promise<Model3DResult> => {
  try {
    const response = await fetch(`${HUNYUAN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUNYUAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'hunyuan-3d',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请将这张图片转换为3D模型。${options.prompt || '保持原始风格，细节丰富。'}`,
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        extra_body: {
          task_type: 'image_to_3d',
          style: options.style || 'realistic',
          negative_prompt: options.negativePrompt || '低质量,模糊,变形',
          output_format: 'glb',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('混元3D API 错误:', error);
      return {
        success: false,
        status: 'failed',
        message: `API请求失败: ${response.status}`,
      };
    }

    const data = await response.json();
    
    // 解析响应
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const result = JSON.parse(content);
        return {
          success: true,
          taskId: result.task_id,
          status: result.status || 'pending',
          modelUrl: result.model_url,
          message: result.message,
        };
      } catch {
        return {
          success: true,
          status: 'pending',
          message: content,
        };
      }
    }

    return {
      success: false,
      status: 'failed',
      message: '无法解析API响应',
    };
  } catch (error: any) {
    console.error('图片转3D失败:', error);
    return {
      success: false,
      status: 'failed',
      message: error.message || '网络错误',
    };
  }
};

/**
 * 文本生成3D模型
 * @param prompt 文本描述
 */
export const textTo3D = async (
  prompt: string,
  options: {
    negativePrompt?: string;
    style?: 'realistic' | 'cartoon' | 'abstract';
  } = {}
): Promise<Model3DResult> => {
  try {
    const response = await fetch(`${HUNYUAN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUNYUAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'hunyuan-3d',
        messages: [
          {
            role: 'user',
            content: `请根据以下描述生成3D模型：${prompt}`,
          },
        ],
        extra_body: {
          task_type: 'text_to_3d',
          style: options.style || 'realistic',
          negative_prompt: options.negativePrompt || '低质量,模糊,变形',
          output_format: 'glb',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('混元3D API 错误:', error);
      return {
        success: false,
        status: 'failed',
        message: `API请求失败: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        const result = JSON.parse(content);
        return {
          success: true,
          taskId: result.task_id,
          status: result.status || 'pending',
          modelUrl: result.model_url,
          message: result.message,
        };
      } catch {
        return {
          success: true,
          status: 'pending',
          message: content,
        };
      }
    }

    return {
      success: false,
      status: 'failed',
      message: '无法解析API响应',
    };
  } catch (error: any) {
    console.error('文本生成3D失败:', error);
    return {
      success: false,
      status: 'failed',
      message: error.message || '网络错误',
    };
  }
};

/**
 * 查询3D生成任务状态
 * @param taskId 任务ID
 */
export const check3DTaskStatus = async (taskId: string): Promise<Model3DResult> => {
  try {
    const response = await fetch(`${HUNYUAN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUNYUAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'hunyuan-3d',
        messages: [
          {
            role: 'user',
            content: `查询任务状态: ${taskId}`,
          },
        ],
        extra_body: {
          task_type: 'query_task',
          task_id: taskId,
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        status: 'failed',
        message: `查询失败: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        const result = JSON.parse(content);
        return {
          success: result.status === 'completed',
          taskId,
          status: result.status,
          modelUrl: result.model_url,
          message: result.message,
        };
      } catch {
        return {
          success: false,
          status: 'failed',
          message: content,
        };
      }
    }

    return {
      success: false,
      status: 'failed',
      message: '无法解析响应',
    };
  } catch (error: any) {
    return {
      success: false,
      status: 'failed',
      message: error.message,
    };
  }
};

// 导出服务
export const hunyuan3dService = {
  imageTo3D,
  textTo3D,
  check3DTaskStatus,
};

export default hunyuan3dService;
