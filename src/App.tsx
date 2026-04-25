import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Content from "./components/Content";
import { motion, useScroll, useSpring } from "motion/react";
import OpeningAnimation from "./components/OpeningAnimation";
import { useState, useEffect } from "react";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!appReady) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [appReady]);

  return (
    <>
      <OpeningAnimation onComplete={() => setAppReady(true)} />
      <main className={`relative selection:bg-white/20 selection:text-white bg-[#050505] min-h-screen ${!appReady ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`} id="main-layout">
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-white z-[60] origin-left"
          style={{ scaleX }}
        />
        
        <Navbar />
        
        <Hero appReady={appReady} />
        
        <Content />
        
        {/* Background Grids & Blobs */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" id="global-background">
          <div className="absolute inset-0 bg-grid-white opacity-20"></div>
          <div className="glow -top-40 -left-40 opacity-30 scale-150"></div>
          <div className="glow bottom-0 right-0 opacity-20 scale-150"></div>
        </div>

        <footer className="relative z-10 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-12 pb-20 mt-20" id="editorial-footer">
          <div className="flex space-x-12 mb-10 md:mb-0">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Location</span>
              <span className="text-xs">Remote First • Worldwide</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Contact</span>
              <span className="text-xs">upseramedia@gmail.com</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-[28px] md:text-[40px] font-bold tracking-tighter leading-none mb-2">
              We build. You rise<span className="text-white/20">.</span>
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/30">
              The UPSERA Framework © 2024
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
