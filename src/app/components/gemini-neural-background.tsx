import { useEffect, useRef, useState } from 'react';

/**
 * Animação Neural inspirada no Gemini Google
 * - Partículas conectadas formando rede neural
 * - Interação com mouse (partículas fogem/se aproximam)
 * - Ondas de energia percorrendo as conexões
 * - Cores gradientes suaves (azul/roxo/ciano)
 * - Efeito de profundidade 3D
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  hue: number;
  connections: number[];
}

export function GeminiNeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log('🎨 NEURAL BACKGROUND: Canvas inicializado', {
      width: window.innerWidth,
      height: window.innerHeight,
      hasCanvas: !!canvas
    });

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    let time = 0;

    // Configuração
    const config = {
      particleCount: 80,
      maxDistance: 180,
      mouseRadius: 150,
      mouseForce: 0.01, // Reduzido de 0.03 para movimento mais suave
      returnForce: 0.003, // REDUZIDO de 0.008 para permitir mais flutuação livre
      velocity: 0.4, // AUMENTADO de 0.1 para movimento mais perceptível
      drift: 0.002, // NOVO: Movimento de drift contínuo
    };

    // Ajusta canvas ao tamanho da janela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Inicializa partículas em grid
    const initParticles = () => {
      particles.length = 0;
      const cols = Math.ceil(Math.sqrt(config.particleCount * (canvas.width / canvas.height)));
      const rows = Math.ceil(config.particleCount / cols);
      const cellWidth = canvas.width / (cols + 1);
      const cellHeight = canvas.height / (rows + 1);

      for (let i = 0; i < config.particleCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = cellWidth * (col + 1) + (Math.random() - 0.5) * cellWidth * 0.5;
        const y = cellHeight * (row + 1) + (Math.random() - 0.5) * cellHeight * 0.5;

        // Cores: azul (200-220), ciano (180-200), roxo (260-280)
        let hue: number;
        const colorType = Math.random();
        if (colorType < 0.4) {
          hue = 200 + Math.random() * 20; // Azul
        } else if (colorType < 0.7) {
          hue = 180 + Math.random() * 20; // Ciano
        } else {
          hue = 260 + Math.random() * 20; // Roxo
        }

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * config.velocity,
          vy: (Math.random() - 0.5) * config.velocity,
          radius: 3 + Math.random() * 3, // Aumentado de 2+2 para 3+3 (50% maior)
          hue,
          connections: [],
        });
      }
      
      console.log(`✨ ${particles.length} partículas criadas!`, {
        cols,
        rows,
        cellWidth,
        cellHeight,
        firstParticle: particles[0]
      });
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    // Update partículas
    const updateParticles = () => {
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        // Movimento de drift orgânico (flutuação contínua)
        const driftX = Math.sin(time * 0.01 + i * 0.5) * config.drift;
        const driftY = Math.cos(time * 0.01 + i * 0.3) * config.drift;
        particle.vx += driftX;
        particle.vy += driftY;

        // Força de atração para posição original (muito suave)
        const dx = particle.baseX - particle.x;
        const dy = particle.baseY - particle.y;
        particle.vx += dx * config.returnForce;
        particle.vy += dy * config.returnForce;

        // Interação com mouse
        if (mouse.isActive) {
          const mdx = mouse.x - particle.x;
          const mdy = mouse.y - particle.y;
          const distance = Math.sqrt(mdx * mdx + mdy * mdy);

          if (distance < config.mouseRadius) {
            const force = (1 - distance / config.mouseRadius) * config.mouseForce;
            particle.vx -= mdx * force;
            particle.vy -= mdy * force;
          }
        }

        // Atrito reduzido para permitir mais movimento
        particle.vx *= 0.98; // AUMENTADO de 0.95 para menos atrito
        particle.vy *= 0.98;

        // Atualiza posição
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mantém dentro da tela com margem
        const margin = 50;
        if (particle.x < margin) particle.x = margin;
        if (particle.x > canvas.width - margin) particle.x = canvas.width - margin;
        if (particle.y < margin) particle.y = margin;
        if (particle.y > canvas.height - margin) particle.y = canvas.height - margin;

        // Calcula conexões
        particle.connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.maxDistance) {
            particle.connections.push(j);
          }
        }
      });
    };

    // Desenha conexões com ondas de energia
    const drawConnections = () => {
      particles.forEach((particle, i) => {
        particle.connections.forEach((connectionIndex) => {
          const other = particles[connectionIndex];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = (1 - distance / config.maxDistance) * 0.6; // Aumentado de 0.3 para 0.6 (100% mais visível)

          // Linha base
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          
          // Gradiente de cor
          const gradient = ctx.createLinearGradient(
            particle.x,
            particle.y,
            other.x,
            other.y
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${opacity})`);
          gradient.addColorStop(1, `hsla(${other.hue}, 80%, 60%, ${opacity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2; // Aumentado de 1 para 2 (linhas mais grossas)
          ctx.stroke();

          // Onda de energia (partícula viajando na linha) - MAIS LENTA
          const waveSpeed = 0.0008; // Reduzido de 0.002 para movimento 60% mais lento
          const wavePosition = (time * waveSpeed + i * 0.1 + connectionIndex * 0.05) % 1;
          const waveX = particle.x + dx * wavePosition;
          const waveY = particle.y + dy * wavePosition;

          // Desenha onda
          const waveGradient = ctx.createRadialGradient(
            waveX, waveY, 0,
            waveX, waveY, 8
          );
          waveGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${opacity * 2})`);
          waveGradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 60%, ${opacity})`);
          waveGradient.addColorStop(1, `hsla(${particle.hue}, 80%, 50%, 0)`);

          ctx.fillStyle = waveGradient;
          ctx.beginPath();
          ctx.arc(waveX, waveY, 8, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    };

    // Desenha partículas
    const drawParticles = () => {
      particles.forEach((particle) => {
        // Valida valores antes de desenhar
        if (!isFinite(particle.x) || !isFinite(particle.y) || !isFinite(particle.radius)) {
          return; // Skip partícula inválida
        }

        // Glow externo
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        );
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0.8)`);
        glowGradient.addColorStop(0.5, `hsla(${particle.hue}, 80%, 60%, 0.3)`);
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 70%, 50%, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 80%, 1)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Desenha cursor glow
    const drawCursorGlow = () => {
      const mouse = mouseRef.current;
      if (!mouse.isActive) return;

      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, config.mouseRadius
      );
      gradient.addColorStop(0, 'hsla(220, 100%, 60%, 0.1)');
      gradient.addColorStop(0.5, 'hsla(240, 80%, 50%, 0.05)');
      gradient.addColorStop(1, 'hsla(260, 60%, 40%, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, config.mouseRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Loop de animação
    const animate = () => {
      // Limpa canvas com transparência
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualiza
      updateParticles();
      time++;

      // Desenha (ordem importa!)
      drawCursorGlow();
      drawConnections();
      drawParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Inicializa
    resizeCanvas();
    setIsReady(true);
    animate();

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[6]">
      {/* Canvas com 15% de opacidade - muito sutil e elegante */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isReady ? 0.15 : 0, // 15% OPACIDADE - extremamente discreto
          transition: 'opacity 2s ease-in-out',
          // Fade out MUITO MAIS SUAVE - começa cedo (25%) e termina tarde (100%)
          // 12 etapas para transição imperceptível
          maskImage: 'linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.8) 42%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.4) 66%, rgba(0,0,0,0.28) 74%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.1) 88%, rgba(0,0,0,0.04) 94%, rgba(0,0,0,0.01) 97%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 25%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.8) 42%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.4) 66%, rgba(0,0,0,0.28) 74%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.1) 88%, rgba(0,0,0,0.04) 94%, rgba(0,0,0,0.01) 97%, transparent 100%)',
        }}
      />
      
      {/* Camada adicional de fusão branca suave - apenas para ajudar na transição */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(255,255,255,0.05) 65%, rgba(255,255,255,0.15) 75%, rgba(255,255,255,0.3) 85%, rgba(255,255,255,0.5) 92%, rgba(255,255,255,0.8) 97%, white 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}