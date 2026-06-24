import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImobHunterLogo, ImobHunterLogoSquare } from './ImobHunterLogo';

/**
 * 🎨 Página para download do logo ImobHunter em PNG
 * Com fundo transparente, otimizado para LinkedIn e redes sociais
 */

export const LogoDownloader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadLogo = async (
    type: 'square' | 'horizontal',
    size: number,
    variant: 'default' | 'white' | 'dark' = 'default'
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas com alta resolução
    const scale = 2; // Para qualidade retina
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    // Limpar canvas (fundo transparente)
    ctx.clearRect(0, 0, size, size);

    // Criar SVG temporário
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.left = '-9999px';
    document.body.appendChild(svgContainer);

    // Renderizar SVG
    if (type === 'square') {
      svgContainer.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          ${getSquareLogoSVG(variant)}
        </svg>
      `;
    } else {
      svgContainer.innerHTML = `
        <svg width="${size * 2}" height="${size}" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          ${getHorizontalLogoSVG(variant)}
        </svg>
      `;
    }

    const svgElement = svgContainer.querySelector('svg');
    if (!svgElement) return;

    // Converter SVG para PNG
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      // Download PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `imobhunter-logo-${type}-${size}px-${variant}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }, 'image/png');

      URL.revokeObjectURL(url);
      document.body.removeChild(svgContainer);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Download Logo ImobHunter
          </h1>
          <p className="text-slate-600">
            Logo em PNG com fundo transparente, otimizado para LinkedIn e redes sociais
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Logo Quadrado */}
          <Card className="p-8">
            <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-12 mb-6">
              <ImobHunterLogoSquare size={200} />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Logo Quadrado</h3>
            <p className="text-sm text-slate-600 mb-6 text-center">
              Ideal para perfil do LinkedIn, ícone de app, favicon
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => downloadLogo('square', 512, 'default')}
                className="w-full"
                variant="default"
              >
                <Download className="mr-2 h-4 w-4" />
                512x512px (LinkedIn Profile)
              </Button>
              <Button 
                onClick={() => downloadLogo('square', 1024, 'default')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                1024x1024px (Alta Resolução)
              </Button>
              <Button 
                onClick={() => downloadLogo('square', 256, 'default')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                256x256px (Ícone)
              </Button>
            </div>
          </Card>

          {/* Logo Horizontal */}
          <Card className="p-8">
            <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-12 mb-6">
              <ImobHunterLogo size={100} withText={true} />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Logo Horizontal</h3>
            <p className="text-sm text-slate-600 mb-6 text-center">
              Ideal para banner do LinkedIn, assinatura de email, website
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => downloadLogo('horizontal', 400, 'default')}
                className="w-full"
                variant="default"
              >
                <Download className="mr-2 h-4 w-4" />
                800x400px (LinkedIn Banner)
              </Button>
              <Button 
                onClick={() => downloadLogo('horizontal', 600, 'default')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                1200x600px (Alta Resolução)
              </Button>
              <Button 
                onClick={() => downloadLogo('horizontal', 200, 'default')}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                400x200px (Email)
              </Button>
            </div>
          </Card>
        </div>

        {/* Variantes de cor */}
        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Variantes de Cor</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Padrão */}
            <div>
              <div className="bg-white rounded-xl p-8 mb-3 border-2 border-slate-200">
                <ImobHunterLogo size={80} withText={false} variant="default" />
              </div>
              <Button 
                onClick={() => downloadLogo('square', 512, 'default')}
                className="w-full"
                variant="outline"
              >
                Padrão (Azul)
              </Button>
            </div>

            {/* Branco */}
            <div>
              <div className="bg-slate-900 rounded-xl p-8 mb-3">
                <ImobHunterLogo size={80} withText={false} variant="white" />
              </div>
              <Button 
                onClick={() => downloadLogo('square', 512, 'white')}
                className="w-full"
                variant="outline"
              >
                Branco (Fundo Escuro)
              </Button>
            </div>

            {/* Escuro */}
            <div>
              <div className="bg-white rounded-xl p-8 mb-3 border-2 border-slate-200">
                <ImobHunterLogo size={80} withText={false} variant="dark" />
              </div>
              <Button 
                onClick={() => downloadLogo('square', 512, 'dark')}
                className="w-full"
                variant="outline"
              >
                Escuro (Monocromático)
              </Button>
            </div>
          </div>
        </Card>

        {/* Especificações */}
        <Card className="p-8 mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">ℹ️ Especificações</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Fundo transparente (PNG com canal alpha)</li>
            <li>✅ Alta resolução (2x para displays Retina)</li>
            <li>✅ Otimizado para LinkedIn (512x512px recomendado)</li>
            <li>✅ Cores: Gradiente azul/índigo (#3B82F6 → #6366F1)</li>
            <li>✅ Design: Mira/alvo + "H" estilizado (Hunter)</li>
          </ul>
        </Card>

        {/* Canvas oculto para conversão */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

// Helper functions para gerar SVG strings
function getSquareLogoSVG(variant: string) {
  const gradientStart = variant === 'white' ? '#FFFFFF' : '#3B82F6';
  const gradientEnd = variant === 'white' ? '#E2E8F0' : '#6366F1';
  const textColor = variant === 'white' ? '#FFFFFF' : variant === 'dark' ? '#1E293B' : '#0F172A';

  return `
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
    <circle cx="256" cy="256" r="200" stroke="url(#grad)" stroke-width="12" fill="none" opacity="0.8"/>
    <circle cx="256" cy="256" r="140" stroke="url(#grad)" stroke-width="8" fill="none" opacity="0.6"/>
    <line x1="56" y1="256" x2="456" y2="256" stroke="url(#grad)" stroke-width="6" opacity="0.4"/>
    <line x1="256" y1="56" x2="256" y2="456" stroke="url(#grad)" stroke-width="6" opacity="0.4"/>
    <rect x="180" y="150" width="30" height="212" fill="url(#grad)" rx="6"/>
    <rect x="302" y="150" width="30" height="212" fill="url(#grad)" rx="6"/>
    <path d="M 210 240 L 302 240 L 302 272 L 210 272 Z M 302 256 L 332 256 L 317 240 L 317 272 Z" fill="url(#grad)"/>
    <circle cx="256" cy="256" r="20" fill="url(#grad)"/>
    <text x="256" y="440" font-family="system-ui" font-size="36" font-weight="600" fill="url(#grad)" text-anchor="middle" letter-spacing="2">IMOBHUNTER</text>
  `;
}

function getHorizontalLogoSVG(variant: string) {
  const gradientStart = variant === 'white' ? '#FFFFFF' : '#3B82F6';
  const gradientEnd = variant === 'white' ? '#E2E8F0' : '#6366F1';
  const textColor = variant === 'white' ? '#FFFFFF' : '#0F172A';

  return `
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="85" stroke="url(#grad)" stroke-width="4" fill="none" opacity="0.8"/>
    <circle cx="100" cy="100" r="60" stroke="url(#grad)" stroke-width="3" fill="none" opacity="0.6"/>
    <line x1="15" y1="100" x2="185" y2="100" stroke="url(#grad)" stroke-width="2" opacity="0.4"/>
    <line x1="100" y1="15" x2="100" y2="185" stroke="url(#grad)" stroke-width="2" opacity="0.4"/>
    <rect x="70" y="60" width="12" height="80" fill="url(#grad)" rx="2"/>
    <rect x="118" y="60" width="12" height="80" fill="url(#grad)" rx="2"/>
    <path d="M 82 95 L 118 95 L 118 105 L 82 105 Z M 118 100 L 128 100 L 123 95 L 123 105 Z" fill="url(#grad)"/>
    <circle cx="100" cy="100" r="8" fill="url(#grad)"/>
    <text x="220" y="90" font-family="system-ui" font-size="42" font-weight="700" fill="${textColor}" letter-spacing="-0.5">Imob</text>
    <text x="220" y="130" font-family="system-ui" font-size="42" font-weight="300" fill="url(#grad)" letter-spacing="-0.5">Hunter</text>
  `;
}

export default LogoDownloader;
