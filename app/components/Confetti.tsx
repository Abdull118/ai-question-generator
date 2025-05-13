'use client';

import React from 'react';
import { useEffect, useRef } from 'react';

const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];
    
    const confettiPieces: {
      x: number;
      y: number;
      color: string;
      radius: number;
      vx: number;
      vy: number;
    }[] = [];

    for (let i = 0; i < 150; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 5 + 3,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 5 + 3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiPieces.forEach(piece => {
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
        ctx.fillStyle = piece.color;
        ctx.fill();
        
        piece.x += piece.vx;
        piece.y += piece.vy;
        
        if (piece.y > canvas.height) {
          piece.y = -piece.radius;
          piece.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
};

export default Confetti;