'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { isMobile } from 'react-device-detect';

type ConfettiProps = {
  playOnce?: boolean;
};

export function Confetti(props: ConfettiProps) {
  const { resolvedTheme } = useTheme();
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);
  const getRefConfettiInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);
  const confettiColors: string[] =
    resolvedTheme === 'dark'
      ? ['#ee2255', '#ffffff', '#23c9cf']
      : ['#bb0000', '#000000', '#1686c7'];

  const fire = useCallback(() => {
    const startVelocity = isMobile ? 30 : 70;
    const y = isMobile ? 0.3 : 0.8;
    const leftDrift = isMobile ? 0 : 1;
    const rightDrift = isMobile ? 0 : -1;
    const particleCount = isMobile ? 50 : 100;
    const spread = 80;
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
    let interval: NodeJS.Timeout;
    if (props.playOnce) {
      fire();
    } else {
      interval = setInterval(() => {
        fire();
      }, 5000);
    }
    return () => interval && clearInterval(interval);
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
        zIndex: 9999,
      }}
    />
  );
}
