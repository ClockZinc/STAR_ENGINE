import React, { useRef, useEffect } from 'react';

interface StarVisualizerProps {
  isPlaying: boolean;
  assetName: string;
}

const StarVisualizer: React.FC<StarVisualizerProps> = ({ isPlaying, assetName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dpr = window.devicePixelRatio || 1;
    
    // Core Pulsing Orbit
    const baseRadius = (70 + Math.sin(Date.now() / 400) * 10) * dpr;
    const pulse = isPlaying ? (Math.sin(Date.now() / 50) * 12 + Math.random() * 10) * dpr : 0;
    
    // Draw the main glowing ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius + pulse, 0, Math.PI * 2);
    ctx.strokeStyle = isPlaying ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.1)';
    ctx.lineWidth = 4 * dpr;
    ctx.shadowBlur = isPlaying ? 25 * dpr : 0;
    ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Frequency Spikes
    if (isPlaying) {
      for (let i = 0; i < 72; i++) {
        const angle = (i * 5 * Math.PI) / 180;
        const lineLen = (20 + Math.random() * 50) * dpr;
        const startX = centerX + Math.cos(angle) * (baseRadius + 5 * dpr);
        const startY = centerY + Math.sin(angle) * (baseRadius + 5 * dpr);
        const endX = centerX + Math.cos(angle) * (baseRadius + 5 * dpr + lineLen);
        const endY = centerY + Math.sin(angle) * (baseRadius + 5 * dpr + lineLen);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 + Math.random() * 0.8})`;
        ctx.lineWidth = 2 * dpr;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Floating Particles
      for (let i = 0; i < 12; i++) {
         const angle = (Math.random() * 360 * Math.PI) / 180;
         const dist = baseRadius + (Math.random() * 120) * dpr;
         const size = Math.random() * 3 * dpr;
         const x = centerX + Math.cos(angle) * dist;
         const y = centerY + Math.sin(angle) * dist;
         
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(212, 175, 55, ${Math.random() * 0.7})`; // Rose Gold
         ctx.fill();
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth * dpr;
          canvas.height = parent.clientHeight * dpr;
          canvas.style.width = `${parent.clientWidth}px`;
          canvas.style.height = `${parent.clientHeight}px`;
        }
      };
      resize();
      window.addEventListener('resize', resize);
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default StarVisualizer;