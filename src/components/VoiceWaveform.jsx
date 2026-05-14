import { useRef, useEffect, useCallback } from 'react';

const VoiceWaveform = ({ isActive = false, analyserNode = null }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    if (!isActive || !analyserNode) {
      // Draw idle state - flat line with subtle pulse
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      const time = Date.now() / 1000;
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.02 + time * 2) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
      return;
    }

    // Active waveform from audio data
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteTimeDomainData(dataArray);

    // Draw waveform
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw frequency bars at bottom
    const freqData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(freqData);
    const barCount = 64;
    const barWidth = width / barCount;
    const step = Math.floor(freqData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = freqData[i * step];
      const barHeight = (value / 255) * (height * 0.3);
      const hue = 180 + (i / barCount) * 60;
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.4)`;
      ctx.fillRect(
        i * barWidth + 1,
        height - barHeight,
        barWidth - 2,
        barHeight
      );
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isActive, analyserNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <div className="w-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded-xl bg-slate-900/50 border border-slate-700/50"
        style={{ width: '100%', height: '128px' }}
      />
      {isActive && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-400 font-medium">Recording</span>
        </div>
      )}
    </div>
  );
};

export default VoiceWaveform;
