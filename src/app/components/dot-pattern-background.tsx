/**
 * Padrão de pontos minimalista para backgrounds
 * Versão ultra-otimizada com CSS puro - garantia de funcionamento
 */
export function DotPatternBackground() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, #5a5a5a 1px, transparent 1px)`,
        backgroundSize: '4px 4px',
        opacity: 0.15,
      }}
    />
  );
}
