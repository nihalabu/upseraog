import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 0.7s entry + 0.8s hold = 1.5s total before triggering exit
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(); // trigger main content slide up simultaneously
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent pointer-events-none"
          exit={{ opacity: 0, y: "-120vh", transition: { duration: 0.6, ease: "easeIn" } }}
        >
          <motion.img
            src="/public/removedbg.webp"
            alt="UPSERA Logo"
            width="140"
            height="140"
            fetchPriority="high"
            className="w-[140px] h-[140px] object-contain"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
