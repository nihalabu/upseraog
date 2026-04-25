import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the intro sequence after delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          exit={{ y: "-100%", opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Animated Background Gradients during opening */}
          <motion.div 
            className="absolute inset-0 bg-grid-white opacity-10"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          ></motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Core Text Reveal Sequence */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.h1 
                className="text-[4rem] md:text-[8rem] font-extrabold uppercase tracking-[-0.05em] leading-none"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              >
                UPSERA<span className="text-white/30 text-[2rem] md:text-[4rem]">©</span>
              </motion.h1>
            </div>
            
            <div className="overflow-hidden mt-4">
              <motion.div 
                className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-white/50"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              >
                The Framework for Scale
              </motion.div>
            </div>

            {/* Loading Bar */}
            <motion.div 
              className="mt-12 h-[1px] bg-white/20 w-48 relative overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "circInOut", delay: 0.8 }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
