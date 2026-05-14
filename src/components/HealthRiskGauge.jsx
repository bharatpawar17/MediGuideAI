import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HealthRiskGauge = ({ score = 0, size = 200, strokeWidth = 16 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCirc = circumference * 0.75; // 270 degrees
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const progress = (animatedScore / 100) * halfCirc;
  const offset = halfCirc - progress;

  const getColor = (s) => {
    if (s <= 25) return { stroke: '#22c55e', label: 'Low Risk', bg: 'text-green-400' };
    if (s <= 50) return { stroke: '#eab308', label: 'Moderate', bg: 'text-yellow-400' };
    if (s <= 75) return { stroke: '#f97316', label: 'High Risk', bg: 'text-orange-400' };
    return { stroke: '#ef4444', label: 'Critical', bg: 'text-red-400' };
  };

  const colorInfo = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-[135deg]"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${halfCirc} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colorInfo.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${halfCirc} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: halfCirc }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 8px ${colorInfo.stroke}66)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs text-slate-400 -mt-1">out of 100</span>
        </div>
      </div>
      <motion.div 
        className={`mt-2 text-sm font-semibold ${colorInfo.bg}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {colorInfo.label}
      </motion.div>
    </div>
  );
};

export default HealthRiskGauge;
