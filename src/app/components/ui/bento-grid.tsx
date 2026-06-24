import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

// Local utility to ensure stability
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1800px] mx-auto auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  children,
  delay = 0
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 p-6 flex flex-col",
        className
      )}
    >
      {/* Delicate Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
