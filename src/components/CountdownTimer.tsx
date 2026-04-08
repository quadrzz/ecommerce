import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  hours?: number;
  minutes?: number;
  onComplete?: () => void;
}

export const CountdownTimer = ({ hours = 2, minutes = 0, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState((hours * 60 + minutes) * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: h.toString().padStart(2, "0"),
      minutes: m.toString().padStart(2, "0"),
      seconds: s.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(timeLeft);

  if (timeLeft <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 px-4 py-2"
    >
      <Clock size={14} className="text-red-600" />
      <span className="text-xs text-muted-foreground font-body">Oferta expira em:</span>
      <span className="text-sm font-bold text-red-600 font-display tabular-nums">
        {time.hours}:{time.minutes}:{time.seconds}
      </span>
    </motion.div>
  );
};

export const useCountdown = (key: string, defaultHours: number = 2) => {
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const key2 = `@quadrzz:promo_${key}`;
    const stored = localStorage.getItem(key2);
    
    if (!stored) {
      const endTime = Date.now() + defaultHours * 60 * 60 * 1000;
      localStorage.setItem(key2, endTime.toString());
      setShowTimer(true);
    } else {
      const endTime = parseInt(stored);
      if (Date.now() < endTime) {
        setShowTimer(true);
      } else {
        localStorage.removeItem(key2);
      }
    }
  }, [key, defaultHours]);

  return showTimer;
};

export default CountdownTimer;