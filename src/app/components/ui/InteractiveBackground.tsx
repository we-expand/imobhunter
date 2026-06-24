import React, { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse state
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5; // Small, delicate
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        // Ethereal colors: silver, white, faint blue, faint gold
        const colors = ['rgba(255,255,255,0.8)', 'rgba(200,220,255,0.5)', 'rgba(255,245,220,0.4)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Smooth mouse following
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Delicate repulsion/attraction
        const maxDistance = 200;
        let force = 0;
        
        if (distance < maxDistance) {
          force = (maxDistance - distance) / maxDistance;
          // Gently push away
          const directionX = forceDirectionX * force * this.density * 0.6;
          const directionY = forceDirectionY * force * this.density * 0.6;
          this.vx -= directionX * 0.05;
          this.vy -= directionY * 0.05;
        }

        // Return to natural drift
        if (this.vx > 0.2) this.vx = 0.2;
        if (this.vx < -0.2) this.vx = -0.2;
        if (this.vy > 0.2) this.vy = 0.2;
        if (this.vy < -0.2) this.vy = -0.2;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust particle count for density
      const numberOfParticles = (width * height) / 15000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Draw subtle connections
      /* 
         We only draw connections if they are close, to create that "network" feel 
         but kept very light (low opacity)
      */
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 210, 230, ${0.15 - distance/800})`; // Very faint
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-slate-50 pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff, #fdfbf7)' 
        // Slate-50 to faint Blue to faint Gold/Paper
      }}
    />
  );
};
