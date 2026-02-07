
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AIRole, LegalAnalysisResult, CreativePromptResult, MarketingScriptResult, ArtStoryResult, LicensingStrategyResult, StyleAlgorithmResult, ImpactReportResult, AudioGenerationResult } from "../types.ts";

const GEMINI_API_KEY = 'AIzaSyDX0nudYBH6Vrx2JOi5mnSuDKMVogligTY';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * VOICE OF STAR: Generate Real Audio (TTS)
 * Uses the specialized TTS model to convert artistic descriptions into emotive speech.
 */
export const generateStarVoiceTTS = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: `请用温柔、纯净且富有尊严的语气朗读以下关于艺术作品的描述，不要带有任何哀求或卖惨：\n\n${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a pure, calm quality
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Generation Failed:", error);
    return undefined;
  }
};

/**
 * VOICE OF STAR: Generate BGM Parameters from Visuals
 */
export const generateAudioParameters = async (imageContext: string): Promise<AudioGenerationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `分析以下画作的色彩、构图与情感，生成用于 AI 音乐引擎的参数: \n\n${imageContext}`,
    config: {
      systemInstruction: "你现在是‘星光引擎’的多模态音乐总监。请基于视觉 DNA 生成听觉 DNA。严禁任何带有同情或悲伤色彩的音色建议，应侧重于‘纯粹、宇宙、律动、尊严’。输出 JSON 格式。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          audioParameters: {
            type: Type.OBJECT,
            properties: {
              mood: { type: Type.STRING },
              tempo: { type: Type.STRING },
              instruments: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          narrativeDescription: { type: Type.STRING }
        },
        required: ["audioParameters", "narrativeDescription"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * LEGAL ARCHITECT: Red Line Lexicon Audit
 */
export const analyzeLegalContent = async (text: string): Promise<LegalAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `请对以下协议或营销文案进行严格的法律与红线词库审计。重点拦截：‘可怜’、‘施舍’、‘残疾人’、‘帮助弱小’等贬低创作者尊严的词汇: \n\n${text}`,
    config: {
      systemInstruction: "你现在是‘星光引擎’的法律架构师。你的目标是确保所有内容均基于‘对等欣赏’。严禁任何带有怜悯色彩的表达。如果发现‘红线’词汇，必须在 redLineViolations 中列出并给出修正建议。请始终使用中文回答。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          complianceScore: { type: Type.NUMBER },
          keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.STRING },
          redLineViolations: { type: Type.ARRAY, items: { type: Type.STRING } },
          isSafeForVulnerableGroups: { type: Type.BOOLEAN }
        },
        required: ["complianceScore", "keyTerms", "risks", "suggestions", "redLineViolations", "isSafeForVulnerableGroups"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * IMPACT REPORT ENGINE
 */
export const generateImpactReport = async (dataContext: string): Promise<ImpactReportResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: `基于运营数据生成报告: ${dataContext}`,
    config: {
      systemInstruction: "你现在是‘星光引擎’社会价值观察员。生成一份非煽情的《影响力报告》。维度包括：家庭辅助就业时长、版权收益归集率、社会认知改善度。请始终使用中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reportDate: { type: Type.STRING },
          metrics: {
            type: Type.OBJECT,
            properties: {
              familySupportHours: { type: Type.NUMBER },
              royaltyCollectionRate: { type: Type.NUMBER },
              socialPerceptionShift: { type: Type.NUMBER },
              exposureQualityScore: { type: Type.NUMBER }
            },
            required: ["familySupportHours", "royaltyCollectionRate", "socialPerceptionShift", "exposureQualityScore"]
          },
          narrativeSummary: { type: Type.STRING },
          crisisFundStatus: { type: Type.STRING }
        },
        required: ["reportDate", "metrics", "narrativeSummary", "crisisFundStatus"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * MARKETING STRATEGIST: Red Line Filtered Scripts
 */
export const generateMarketingScript = async (productInfo: string, creativeContext: string, licensingInfo?: string): Promise<MarketingScriptResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `产品信息: ${productInfo}\n创意背景: ${creativeContext}\n授权详情: ${licensingInfo || ''}`,
    config: {
      systemInstruction: "你现在是‘星光引擎’的营销专家。严禁使用任何带有怜悯、施舍或弱化创作者尊严的内容。通过‘视觉算法’和‘艺术力量’来赢得市场。如果检测到文案中有‘卖惨’词汇，必须标记 passed 为 false。请始终使用中文回答。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          redLineCheck: {
            type: Type.OBJECT,
            properties: {
              passed: { type: Type.BOOLEAN },
              detectedWords: { type: Type.ARRAY, items: { type: Type.STRING } },
              fixSuggestion: { type: Type.STRING }
            },
            required: ["passed", "detectedWords", "fixSuggestion"]
          }
        },
        required: ["platform", "hook", "body", "hashtags", "redLineCheck"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateCreativePrompt = async (description: string): Promise<CreativePromptResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `灵感描述: ${description}`,
    config: {
      systemInstruction: "创意导演模式。提取艺术 DNA。请始终使用中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualStyle: { type: Type.STRING },
          storyAngle: { type: Type.STRING },
          prompts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["visualStyle", "storyAngle", "prompts"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateArtStory = async (artDescription: string): Promise<ArtStoryResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `艺术描述: ${artDescription}`,
    config: {
      systemInstruction: "首席策展人模式。赋予尊严，编写希望。请始终使用中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          narrative: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          commercialPotential: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateStyleAlgorithm = async (ipContext: string): Promise<StyleAlgorithmResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: `IP背景: ${ipContext}`,
    config: {
      systemInstruction: "算法美学专家。定义可授权 DNA。请始终使用中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          algorithmName: { type: Type.STRING },
          visualDNA: { type: Type.STRING },
          philosophy: { type: Type.STRING },
          implementationGuide: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateLicensingStrategy = async (ipName: string, productCategory: string, mode: 'image' | 'style' = 'image'): Promise<LicensingStrategyResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: `IP: ${ipName}, 联名类别: ${productCategory}, 模式: ${mode}`,
    config: {
      systemInstruction: "IP 商业授权官。设计公平、尊严、主权明确的授权方案。请始终使用中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          modelName: { type: Type.STRING },
          entryFeeSuggestion: { type: Type.STRING },
          royaltyRate: { type: Type.STRING },
          legalProtectionFocus: { type: Type.STRING },
          marketingHook: { type: Type.STRING }
        }
      }
    }
  });
  return { ...JSON.parse(response.text || '{}'), isStyleLicensing: mode === 'style' };
};

export const generateVisualAsset = async (prompt: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};
