
/**
 * AUDIO UTILITIES for Gemini TTS (PCM 24000Hz)
 */

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class StarAudioPlayer {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  async play(base64Pcm: string) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    this.stop();
    
    const pcmData = decodeBase64(base64Pcm);
    const audioBuffer = await decodeAudioData(pcmData, this.ctx);
    
    this.source = this.ctx.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.ctx.destination);
    this.source.start();
    
    return new Promise((resolve) => {
      if (this.source) {
        this.source.onended = () => {
          this.source = null;
          resolve(true);
        };
      }
    });
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
      } catch (e) {}
      this.source = null;
    }
  }
}

export const starAudioPlayer = new StarAudioPlayer();
