import { useEffect, useRef } from 'react';

// Animação neural 3D inspirada na referência com partículas coloridas orbitando
export function Neural3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajusta canvas ao tamanho da tela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partícula 3D com cor e movimento orbital
    class Particle3D {
      // Posição em coordenadas esféricas (simulando 3D)
      theta: number; // Ângulo horizontal
      phi: number; // Ângulo vertical
      radius: number; // Distância do centro
      speed: number;
      orbitSpeed: number;
      
      // Cor
      hue: number;
      saturation: number;
      lightness: number;
      
      // Tamanho e profundidade
      baseSize: number;
      size: number;
      z: number;
      
      // Trail (rastro)
      trail: { x: number; y: number; opacity: number }[];
      maxTrailLength: number;

      constructor(centerX: number, centerY: number) {
        // Posição inicial aleatória em esfera
        this.theta = Math.random() * Math.PI * 2;
        this.phi = Math.random() * Math.PI;
        this.radius = 150 + Math.random() * 250; // Entre 150px e 400px do centro
        
        // Velocidades MUITO MAIS LENTAS (reduzidas em 80%)
        this.speed = 0.0003 + Math.random() * 0.0005; // Era 0.002-0.005, agora 0.0003-0.0008
        this.orbitSpeed = 0.0001 + Math.random() * 0.0003; // Era 0.001-0.003, agora 0.0001-0.0004
        
        // Cores azul/roxo/ciano (baseado na referência)
        const colorType = Math.random();
        if (colorType < 0.4) {
          // Azul brilhante
          this.hue = 200 + Math.random() * 40;
          this.saturation = 80 + Math.random() * 20;
          this.lightness = 50 + Math.random() * 30;
        } else if (colorType < 0.7) {
          // Ciano
          this.hue = 180 + Math.random() * 20;
          this.saturation = 70 + Math.random() * 30;
          this.lightness = 60 + Math.random() * 20;
        } else {
          // Roxo
          this.hue = 260 + Math.random() * 30;
          this.saturation = 60 + Math.random() * 40;
          this.lightness = 50 + Math.random() * 30;
        }
        
        // Tamanho
        this.baseSize = 2 + Math.random() * 4;
        this.size = this.baseSize;
        this.z = 0;
        
        // Trail
        this.trail = [];
        this.maxTrailLength = 8 + Math.floor(Math.random() * 12);
      }

      update(centerX: number, centerY: number) {
        // Atualiza ângulos (movimento orbital)
        this.theta += this.orbitSpeed;
        this.phi += this.speed;
        
        // Mantém phi entre 0 e PI
        if (this.phi > Math.PI) this.phi = 0;
        if (this.phi < 0) this.phi = Math.PI;
        
        // Pulsação sutil do raio
        const radiusPulse = Math.sin(Date.now() * 0.001) * 10;
        const currentRadius = this.radius + radiusPulse;
        
        // Converte coordenadas esféricas para cartesianas
        const x = currentRadius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = currentRadius * Math.sin(this.phi) * Math.sin(this.theta);
        this.z = currentRadius * Math.cos(this.phi);
        
        // Perspectiva (quanto mais longe no Z, menor)
        const perspective = 600;
        const scale = perspective / (perspective + this.z);
        
        // Posição final na tela
        const screenX = centerX + x * scale;
        const screenY = centerY + y * scale;
        
        // Atualiza tamanho baseado na profundidade
        this.size = this.baseSize * scale;
        
        // Adiciona ao trail
        this.trail.push({ 
          x: screenX, 
          y: screenY, 
          opacity: 1 
        });
        
        // Limita tamanho do trail
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
        
        // Reduz opacidade do trail
        this.trail.forEach((point, index) => {
          point.opacity = index / this.trail.length;
        });
        
        return { x: screenX, y: screenY, scale };
      }

      draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
        const pos = this.update(centerX, centerY);
        
        // Desenha trail (rastro)
        if (this.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y);
          
          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          
          const gradient = ctx.createLinearGradient(
            this.trail[0].x, 
            this.trail[0].y,
            pos.x,
            pos.y
          );
          gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
          gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.3)`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = this.size * 0.5;
          ctx.stroke();
        }
        
        // Desenha partícula principal com glow
        const opacity = 0.6 + (pos.scale * 0.4); // Mais brilhante quando mais próximo
        
        // Glow externo
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.size * 3);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${opacity})`);
        gradient.addColorStop(0.4, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo brilhante
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness + 20}%, ${opacity + 0.3})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Configurações
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particleCount = 120; // Mais partículas para efeito denso
    const particles: Particle3D[] = [];

    // Cria partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle3D(centerX, centerY));
    }

    // Desenha círculo central (simulando o "cérebro")
    const drawCentralSphere = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;
      const time = Date.now() * 0.001;
      
      // Glow pulsante
      const pulseRadius = radius + Math.sin(time * 2) * 5;
      
      // Gradiente radial com múltiplas camadas
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, pulseRadius * 1.8
      );
      gradient.addColorStop(0, 'hsla(220, 80%, 60%, 0.15)');
      gradient.addColorStop(0.3, 'hsla(240, 70%, 50%, 0.1)');
      gradient.addColorStop(0.6, 'hsla(260, 60%, 40%, 0.05)');
      gradient.addColorStop(1, 'hsla(280, 50%, 30%, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Círculo central com borda
      const borderGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.7,
        centerX, centerY, radius
      );
      borderGradient.addColorStop(0, 'hsla(240, 80%, 50%, 0.05)');
      borderGradient.addColorStop(1, 'hsla(240, 90%, 60%, 0.2)');
      
      ctx.fillStyle = borderGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Borda brilhante
      ctx.strokeStyle = `hsla(220, 100%, 60%, ${0.3 + Math.sin(time * 3) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Desenha conexões entre partículas próximas
    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1Trail = particles[i].trail;
          const p2Trail = particles[j].trail;
          
          if (p1Trail.length === 0 || p2Trail.length === 0) continue;
          
          const p1 = p1Trail[p1Trail.length - 1];
          const p2 = p2Trail[p2Trail.length - 1];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            
            ctx.strokeStyle = `hsla(200, 80%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Loop de animação
    let animationFrameId: number;
    
    const animate = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Limpa canvas com fade suave
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Desenha conexões primeiro (atrás das partículas)
      drawConnections();
      
      // Desenha esfera central
      drawCentralSphere();
      
      // Desenha e atualiza partículas
      particles.forEach(particle => {
        particle.draw(ctx, centerX, centerY);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #000000 100%)',
        opacity: 0.2 
      }}
    />
  );
}