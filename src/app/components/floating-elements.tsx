import { motion } from 'motion/react';

export function FloatingElements() {
  // Configurações para diferentes elementos flutuantes
  const floatingShapes = [
    // Círculos grandes transparentes
    {
      type: 'circle',
      size: 'w-64 h-64',
      gradient: 'bg-transparent border-2 border-gray-200/35',
      blur: '',
      position: 'top-20 left-10',
      duration: 20,
      delay: 0,
      x: [0, 100, -50, 80, -30, 0],
      y: [0, -80, 60, -40, 90, 0],
      scale: [1, 1.15, 0.9, 1.1, 0.95, 1],
    },
    {
      type: 'circle',
      size: 'w-96 h-96',
      gradient: 'bg-transparent border border-gray-200/25',
      blur: '',
      position: 'top-40 right-20',
      duration: 25,
      delay: 2,
      x: [0, -120, 80, -60, 100, 0],
      y: [0, 100, -60, 80, -90, 0],
      scale: [1, 0.85, 1.2, 0.95, 1.1, 1],
    },
    {
      type: 'circle',
      size: 'w-72 h-72',
      gradient: 'bg-transparent border-2 border-gray-200/30',
      blur: '',
      position: 'bottom-40 left-1/4',
      duration: 22,
      delay: 4,
      x: [0, 60, -80, 70, -50, 0],
      y: [0, -70, 50, -60, 80, 0],
      scale: [1, 1.1, 0.88, 1.15, 0.92, 1],
    },
    
    // Círculos médios
    {
      type: 'circle',
      size: 'w-48 h-48',
      gradient: 'bg-transparent border border-gray-300/25',
      blur: '',
      position: 'top-1/3 right-1/3',
      duration: 18,
      delay: 1,
      x: [0, -60, 40, -50, 70, 0],
      y: [0, 80, -40, 60, -70, 0],
      scale: [1, 0.9, 1.18, 0.95, 1.08, 1],
    },
    {
      type: 'circle',
      size: 'w-56 h-56',
      gradient: 'bg-transparent border-2 border-gray-200/35',
      blur: '',
      position: 'bottom-20 right-1/4',
      duration: 23,
      delay: 3,
      x: [0, 90, -70, 60, -80, 0],
      y: [0, -60, 80, -70, 50, 0],
      scale: [1, 1.12, 0.93, 1.05, 0.88, 1],
    },
    
    // Círculos pequenos
    {
      type: 'circle',
      size: 'w-32 h-32',
      gradient: 'bg-transparent border border-gray-300/30',
      blur: '',
      position: 'top-1/2 left-1/4',
      duration: 15,
      delay: 2.5,
      x: [0, 50, -30, 60, -40, 0],
      y: [0, -50, 30, -40, 60, 0],
      scale: [1, 1.2, 0.85, 1.15, 0.9, 1],
    },
    {
      type: 'circle',
      size: 'w-40 h-40',
      gradient: 'bg-transparent border-2 border-gray-200/25',
      blur: '',
      position: 'top-2/3 right-1/3',
      duration: 17,
      delay: 1.5,
      x: [0, -40, 60, -50, 70, 0],
      y: [0, 70, -50, 60, -80, 0],
      scale: [1, 0.92, 1.16, 0.88, 1.1, 1],
    },
    {
      type: 'circle',
      size: 'w-36 h-36',
      gradient: 'bg-transparent border border-gray-300/35',
      blur: '',
      position: 'bottom-1/3 left-1/3',
      duration: 19,
      delay: 3.5,
      x: [0, 70, -50, 80, -60, 0],
      y: [0, -40, 60, -70, 50, 0],
      scale: [1, 1.14, 0.9, 1.08, 0.94, 1],
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.position} ${shape.size} ${shape.gradient} ${shape.blur} rounded-full`}
          animate={{
            x: shape.x,
            y: shape.y,
            scale: shape.scale,
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Elementos geométricos adicionais - quadrados rotacionando */}
      <motion.div
        className="absolute top-1/4 left-1/2 w-24 h-24 border-2 border-gray-200/35 rounded-lg"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          x: [0, 50, -30, 60, -40, 0],
          y: [0, -40, 50, -60, 70, 0],
          scale: [1, 1.15, 0.88, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-gray-200/30 rounded-lg"
        animate={{
          rotate: [360, 270, 180, 90, 0],
          x: [0, -60, 40, -50, 70, 0],
          y: [0, 60, -30, 80, -50, 0],
          scale: [1, 0.9, 1.2, 0.85, 1.12, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Linhas decorativas flutuantes */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-32 h-1 bg-gray-200/25 rounded-full"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          x: [0, 80, -60, 90, -70, 0],
          y: [0, -50, 70, -60, 80, 0],
          scaleX: [1, 1.5, 0.8, 1.6, 0.9, 1],
          scaleY: [1, 1.2, 0.9, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-40 h-1 bg-gray-200/25 rounded-full"
        animate={{
          rotate: [360, 270, 180, 90, 0],
          x: [0, -70, 50, -80, 60, 0],
          y: [0, 60, -40, 70, -50, 0],
          scaleX: [1, 1.8, 0.7, 1.7, 0.85, 1],
          scaleY: [1, 1.3, 0.88, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 22,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Pontos pequenos */}
      {Array.from({ length: 12 }).map((_, i) => {
        const randX1 = Math.random() * 120 - 60;
        const randX2 = Math.random() * 120 - 60;
        const randX3 = Math.random() * 120 - 60;
        const randY1 = Math.random() * 120 - 60;
        const randY2 = Math.random() * 120 - 60;
        const randY3 = Math.random() * 120 - 60;
        
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 bg-gray-300/35 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, randX1, randX2, randX3, 0],
              y: [0, randY1, randY2, randY3, 0],
              scale: [1, 1.5, 0.8, 1.6, 0.75, 1],
              opacity: [0.25, 0.55, 0.3, 0.6, 0.25],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}