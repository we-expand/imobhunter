import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef, MouseEvent } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton = ({ children, className = "", onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth return to center
  const xSpring = useSpring(x, { mass: 0.1, stiffness: 150, damping: 15 });
  const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 15 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 30); // Movement intensity
    y.set(yPct * 30);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:bg-white/10 ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-shine" />
    </motion.button>
  );
};
