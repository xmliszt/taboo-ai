'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { isMobile } from 'react-device-detect';

export function Confetti() {
  const { resolvedTheme } = useTheme();
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);
  const getRefConfettiInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);
  const confettiColors: string[] =
    resolvedTheme === 'dark' ? ['#ee2255', '#ffffff'] : ['#bb0000', '#000000'];

  const fire = useCallback(() => {
    const startVelocity = isMobile ? 30 : 80;
    const y = isMobile ? 0.3 : 0.8;
    const leftDrift = isMobile ? 0 : 1;
    const rightDrift = isMobile ? 0 : -1;
    const particleCount = isMobile ? 30 : 50;
    const spread = isMobile ? 60 : 80;
    if (refAnimationInstance.current) {
      // Left side confetti
      refAnimationInstance.current({
        particleCount: particleCount,
        angle: 45,
        spread: spread,
        startVelocity: startVelocity,
        gravity: 2,
        origin: { x: -0.1, y: y },
        drift: leftDrift,
        colors: confettiColors,
      });
      // Right side confetti
      refAnimationInstance.current({
        particleCount: particleCount,
        angle: 135,
        spread: spread,
        startVelocity: startVelocity,
        gravity: 2,
        origin: { x: 1.1, y: y },
        drift: rightDrift,
        colors: confettiColors,
      });
    }
  }, [resolvedTheme, isMobile]);

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
