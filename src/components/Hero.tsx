import { motion, useScroll, useTransform } from "motion/react";
import UpseraScene from "./UpseraScene";

export default function Hero({ appReady = true }: { appReady?: boolean }) {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 500], [0.7, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-32 pb-16 overflow-hidden" id="hero">

      {/* Set UpseraScene z-index higher than background */}
      <div className="relative z-[1] w-full absolute inset-0">
        <UpseraScene />
      </div>

      {/* Blended Background Image */}
      <motion.div
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          opacity: bgOpacity
        }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <img
          src="/assets/hero_bg.jpg"
          alt=""
          className="w-full h-full object-cover mix-blend-screen"
        />
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={appReady ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center max-w-4xl"
          id="hero-content"
        >
          <div className="mb-6 inline-flex items-center space-x-3 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/50" id="hero-tagline-container">
            <span className="w-4 md:w-8 h-[1px] bg-white/30"></span>
            <span id="hero-tagline" className="px-2">EVERY GREAT BUSINESS HAS A STORY. LET'S WRITE YOURS.</span>
            <span className="w-4 md:w-8 h-[1px] bg-white/30"></span>
          </div>

          <h1 className="display-title mb-8 px-4" id="hero-headline">
            <span className="block md:whitespace-nowrap">WEB DESIGN</span>
            <span className="block md:whitespace-nowrap"><span className="serif-italic text-white/90">& AI SOLUTIONS</span></span>
            <span className="block md:whitespace-nowrap">IN <span className="text-white/40">COCHIN.</span></span>
          </h1>
          <p className="max-w-2xl text-base md:text-xl text-white/60 leading-relaxed font-light mb-12 px-6" id="hero-description">
            UPSERA delivers web design, AI business solutions, and digital solutions for businesses in Cochin ready to grow online.
          </p>
          <div className="flex items-center justify-center gap-8 mb-16" id="hero-actions">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 md:px-10 py-4 md:py-5 bg-white text-black font-semibold uppercase tracking-widest text-[10px] rounded-sm overflow-hidden border border-white inline-block"
              id="btn-lets-talk"
            >
              <span className="relative z-10 text-black">Let's Talk</span>
              <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
