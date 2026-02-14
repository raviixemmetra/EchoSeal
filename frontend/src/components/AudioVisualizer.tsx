import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}

const AudioVisualizer = ({ stream, isActive }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();

  useEffect(() => {
    if (!stream || !isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      animationRef.current = requestAnimationFrame(draw);

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Dark background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArrayRef.current[i] / 255) * canvas.height;

        // Create vibrant gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#22d3ee'); // Cyan
        gradient.addColorStop(0.3, '#3b82f6'); // Blue
        gradient.addColorStop(0.6, '#8b5cf6'); // Purple
        gradient.addColorStop(1, '#ec4899'); // Pink

        ctx.fillStyle = gradient;
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#3b82f6';
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Reset shadow for next bar
        ctx.shadowBlur = 0;

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [stream, isActive]);

  return (
    <div className="w-full h-28 bg-slate-900/70 rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-xl backdrop-blur-sm animate-scale-in">
      <canvas
        ref={canvasRef}
        width={600}
        height={112}
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
