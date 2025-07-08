import { useEffect } from 'react';

interface GameTimerProps {
  startTime: number;
  isComplete: boolean;
  onTimerUpdate: (elapsedTime: number) => void;
}

export const useGameTimer = ({ startTime, isComplete, onTimerUpdate }: GameTimerProps) => {
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      onTimerUpdate(elapsedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isComplete, onTimerUpdate]);
};
