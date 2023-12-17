'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';
import ReactCanvasConfetti from 'react-canvas-confetti';

export function Confetti() {
  const { resolvedTheme } = useTheme();
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);
  const getRefConfettiInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);
  const confettiColors: string[] =
    resolvedTheme === 'dark' ? ['#fc6a89', '#ffffff'] : ['#bb0000', '#000000'];

  const fire = useCallback(() => {
    if (refAnimationInstance.current) {
      // Left side confetti
      refAnimationInstance.current({
        particleCount: 50,
        angle: 45,
        spread: 55,
        startVelocity: 80,
        gravity: 2,
        origin: { x: -0.1, y: 0.8 },
        drift: 2,
        colors: confettiColors,
        shapes: ['square', 'circle', 'star'],
      });
      // Right side confetti
      refAnimationInstance.current({
        particleCount: 50,
        angle: 135,
        spread: 55,
        startVelocity: 80,
        gravity: 2,
        origin: { x: 1.1, y: 0.8 },
        drift: -2,
        colors: confettiColors,
        shapes: ['square', 'circle', 'star'],
      });
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      fire();
    }, 5000);
    return () => clearInterval(interval);
  }, [fire]);

  return (
    <ReactCanvasConfetti
      refConfetti={getRefConfettiInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
}
