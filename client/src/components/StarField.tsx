import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const stars: Star[] = [];
    const isMobile = width < 768;
    const numStars = isMobile ? 40 : 75;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        speed: Math.random() * 0.4 + 0.1,
      });
    }

    let animationId: number;
    let lastDrawTime = 0;
    const fpsInterval = 1000 / 30; // Cap to 30 FPS for silky battery-saving background

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const elapsed = currentTime - lastDrawTime;
      if (elapsed < fpsInterval) return;

      lastDrawTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#faf0dc';

      const t = currentTime * 0.001;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.opacity += Math.sin(t * star.speed) * 0.015;
        if (star.opacity < 0.1) star.opacity = 0.1;
        else if (star.opacity > 0.65) star.opacity = 0.65;

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Ambient Cosmic Aura Glows (Apple visionOS / liquid glass backdrop) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div 
          className="absolute -top-[15%] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/15 via-amber-600/8 to-transparent blur-[130px] transform-gpu will-change-transform"
        />
        <div 
          className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-purple-600/10 via-indigo-600/6 to-transparent blur-[140px] transform-gpu will-change-transform"
        />
        <div 
          className="absolute -bottom-[10%] left-[25%] w-[650px] h-[650px] rounded-full bg-gradient-to-t from-amber-500/10 via-teal-500/5 to-transparent blur-[150px] transform-gpu will-change-transform"
        />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 will-change-transform"
        style={{ opacity: 0.55 }}
      />
    </>
  );
}
