import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Services", href: "#what-we-do" },
    { name: "Projects", href: "#projects" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white/[0.05] backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" 
            : "bg-transparent border-b border-transparent"
        }`}
        id="navbar"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-extrabold tracking-tighter" id="logo-text">
              UPSERA<span className="text-white/40">.</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium" id="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors"
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </a>
            ))}
            <div className="h-4 w-[1px] bg-white/20"></div>
            <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden sm:inline-block px-6 py-2 border border-white/20 rounded-full text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-semibold hover:bg-white hover:text-black transition-all"
              id="btn-call"
            >
              Let's Talk
            </a>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white relative z-[60]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[45] bg-[#050505] flex flex-col justify-center px-10"
          >
            <div className="flex flex-col gap-8">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-4">Navigation</span>
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  variants={itemVariants}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-bold tracking-tighter hover:text-white/60 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                variants={itemVariants}
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-bold tracking-tighter hover:text-white/60 transition-colors"
              >
                Contact
              </motion.a>
            </div>

            <motion.div 
              variants={itemVariants}
              className="mt-20 border-t border-white/10 pt-10"
            >
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Get in touch</p>
                  <a href="mailto:upseramedia@gmail.com" className="text-xl">upseramedia@gmail.com</a>
                </div>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs text-center rounded-sm"
                >
                  Let's Talk
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
