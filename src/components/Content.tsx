import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState ,useEffect} from "react";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section = ({ children, className = "", id }: ScrollSectionProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className={`py-32 px-6 md:px-16 flex flex-col justify-center relative scroll-mt-24 ${className}`}
      id={id}
    >
      {children}
    </motion.section>
  );
};

function ContactForm() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', company: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="space-y-6 md:space-y-8 glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/5"
    >
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/30">Your Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors text-white placeholder:text-white/20"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/30">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors text-white placeholder:text-white/20"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-white/30">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors text-white placeholder:text-white/20"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-white/30">Project Details *</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors resize-none text-white placeholder:text-white/20"
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === 'loading' || status === 'success'}
        className="w-full py-4 md:py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent ✓' : 'Send Message'}
      </button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-white/60 text-sm"
          >
            We got your message! We'll get back to you within 24 hours.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-400 text-sm"
          >
            Something went wrong. Please try again or email us directly.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// Add this component above Content()
function LazyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="none"
      className="w-full h-full object-cover"
    >
      <source src="/assets/handanimation.mp4" type="video/mp4" />
    </video>
  );
}
// Add this component above Content()
function ProjectScrollArrows({ targetId }: { targetId: string }) {
  const scrollBy = (direction: "left" | "right") => {
    const track = document.getElementById(targetId);
    if (!track) return;
    const card = track.querySelector("a");
    const cardWidth = card ? card.getBoundingClientRect().width + 32 : 360; // + gap-8 (32px)
    track.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  const baseClasses =
    "flex absolute top-0 bottom-6 z-20 items-center justify-center pointer-events-none";
  const buttonClasses =
    "pointer-events-auto w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#050505]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-[#050505] transition-all text-sm md:text-base";

  return (
    <>
      <div className={`${baseClasses} -left-4 sm:-left-5 md:-left-14 lg:-left-16 w-10 sm:w-12 md:w-16 justify-start bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent`}>
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Scroll projects left"
          className={buttonClasses}
        >
          ←
        </button>
      </div>
      <div className={`${baseClasses} -right-4 sm:-right-5 md:-right-14 lg:-right-16 w-10 sm:w-12 md:w-16 justify-end bg-gradient-to-l from-[#050505] via-[#050505]/70 to-transparent`}>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Scroll projects right"
          className={buttonClasses}
        >
          →
        </button>
      </div>
    </>
  );
}

export default function Content() {
  return (
    <div className="relative z-10" id="page-content">
      {/* What We Do */}
      <Section id="what-we-do">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="display-title mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            DIGITAL <span className="serif-italic text-white/90">SOLUTIONS</span><br />
            FOR <span className="text-white/40">BUSINESS.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/60 leading-relaxed font-light mb-16"
          >
            Kochi's web design company for businesses that want more than just a website — we build complete digital solutions that drive real growth.
          </motion.p>

          <div className="max-w-4xl mx-auto text-left space-y-4">
            {(() => {
              const [openIndex, setOpenIndex] = useState(0);

              return [
                {
                  title: "Web Development",
                  desc: "High-performance websites built by the best web design company in Kochi to convert visitors into clients. We focus on speed, accessibility, and conversion-centered design to ensure your digital presence is more than just a brochure — it's a growth engine.",
                  status: "Web Development",
                  count: "01"
                },
                {
                  title: "AI Business Solutions",
                  desc: "Tailored AI solutions for business built around your specific workflow. From custom CRM integrations to intelligent automation portals, we engineer the invisible infrastructure that powers your success in Cochin and beyond.",
                  status: "Custom Software",
                  count: "02"
                },
                {
                  title: "Digital Solutions",
                  desc: "Smart digital solutions for business that save time and eliminate manual work. We leverage AI and modern logic to simplify your operations in Kerala, letting you focus on scaling while the systems handle the routine.",
                  status: "Automation & AI",
                  count: "03"
                }
              ].map((item, i) => {
                const [isHovered, setIsHovered] = useState(false);
                const isOpen = openIndex === i;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="relative overflow-hidden group cursor-pointer border-b border-white/10 last:border-0 rounded-xl"
                  >
                    <div className={`absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-500 z-0`}></div>

                    <div className="px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isHovered ? 'border-white/40' : 'border-white/0'}`}>
                          <span className={`text-[10px] font-mono tracking-tighter transition-colors duration-500 ${isHovered ? 'text-white' : 'text-white/30'}`}>
                            {item.count}
                          </span>
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight transition-all duration-500 ${isHovered || isOpen ? 'text-white' : 'text-white/40'}`}>
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`text-[9px] uppercase tracking-[0.2em] transition-colors duration-500 hidden md:block ${isHovered ? 'text-white/50' : 'text-white/20'}`}>
                          {item.status}
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          className={`w-10 h-10 rounded-full border transition-colors duration-500 flex items-center justify-center text-xl font-light ${isHovered || isOpen ? 'border-white/30' : 'border-white/10'}`}
                        >
                          +
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-20 pb-8 max-w-2xl relative z-10">
                            <div className="text-base md:text-lg text-white/50 font-light leading-relaxed">
                              {item.desc}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>
      </Section>

      {/* Why UPSERA */}
      <Section id="why-upsera" className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
          <LazyVideo />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 md:px-16 relative z-10">
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="display-title mb-8 text-[40px] md:text-[60px]"
            >
              WEB DESIGNERS <br />
              <span className="serif-italic">IN KOCHI,</span><br />
              <span className="text-white/40">YOU CAN TRUST.</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 text-white/60 text-xl font-light leading-relaxed max-w-2xl"
            >
              <p>
                We build web design and AI solutions for businesses in Cochin that are serious about their online growth. Every project is crafted with one goal — results that matter to your business.
              </p>
              <p>
                No templates. No shortcuts. Just clean web development and smart AI business solutions delivered with full transparency from day one.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-4 md:gap-8"
          >
            <h2 className="display-title text-[36px] sm:text-[56px] md:text-[90px] leading-none">
              Selected <span className="serif-italic">Work.</span>
            </h2>
            <p className="text-white/40 text-[10px] md:text-sm max-w-xs uppercase tracking-widest leading-loose">
              06 Projects Delivered • 2024–25 Showcase
            </p>
          </motion.div>

          {/* Arrow wrapper extends beyond the card track on larger screens */}
          <div className="relative px-5 sm:px-6 md:px-16 lg:px-20">
            <ProjectScrollArrows targetId="projects-scroll-track" />

            <div
              id="projects-scroll-track"
              className="flex gap-5 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth scrollbar-none"
            >
            {[
              { name: "Laege Mathru Clinic", category: "Cosmetic & Wellness", image: "/assets/projects/laege-mathru-clinic.webp", url: "https://laegemathrru.vercel.app/" },
              { name: "Shreshta Interiors", category: "Architecture & Interiors", image: "/assets/projects/shreshta.webp", url: "https://shreshtademo.vercel.app/" },
              { name: "Edusity", category: "Education Platform", image: "/assets/projects/edusity.webp", url: "https://edusitylanding.vercel.app/" },
              { name: "Heavy Duty Hub", category: "Equipment Rental", image: "/assets/projects/heavydutyhub.webp", url: "https://heavydutyhub.vercel.app/" },
              { name: "CineMatch", category: "Movie Recommendation Platform", image: "/assets/projects/cinematch.webp", url: "https://cinematch-1.vercel.app/" },
              { name: "Route Care", category: "Property Management", image: "/assets/projects/routecare.webp", url: "https://routecare.netlify.app/" }
            ].map((project, i) => (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer shrink-0 w-[72vw] sm:w-[300px] md:w-[320px] lg:w-[340px] snap-start"
              >
                <div className="aspect-[4/5] rounded-2xl md:rounded-3xl mb-4 md:mb-6 overflow-hidden relative border border-white/5 bg-black">
                  <img
                    src={project.image}
                    alt={`${project.name} — ${project.category}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500"></div>
                </div>
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h4 className="font-bold text-sm md:text-base">{project.name}</h4>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-1">{project.category}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shrink-0 text-sm">
                    →
                  </div>
                </div>
              </motion.a>
            ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Approach */}
      <Section id="our-approach" className="bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <blockquote className="text-3xl md:text-5xl font-light leading-tight text-white mb-12">
              "We don't just write code.<br />
              <span className="serif-italic font-bold">We solve problems that actually matter to your business.</span>"
            </blockquote>
          </motion.div>

          <div className="h-[1px] w-24 bg-white/10 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">The Logic</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Every project starts with understanding your business first. We identify the gaps, define the solution, and build with precision — no guesswork.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">The Growth</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                We build with scale in mind from day one. What starts as a website today is architected to grow into a full digital product tomorrow.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-title mb-8">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  LET'S
                </motion.span>{" "}
                <span className="serif-italic inline-flex items-center">
                  {(() => {
                    const text = "Build.";
                    return (
                      <>
                        {text.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{
                              duration: 0.1,
                              delay: 0.5 + (i * 0.1),
                              ease: "linear"
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.2
                          }}
                          className="inline-block w-[3px] h-[0.8em] bg-white/40 ml-2"
                        />
                      </>
                    );
                  })()}
                </span>
              </h2>
              <p className="text-white/60 mb-2 max-w-sm">
                Every great rise starts with a single conversation. Tell us your story — we'll help you write the next chapter.
              </p>
              <p className="text-white/30 text-xs mb-12 max-w-sm">
                Remote-first. Working with businesses worldwide. We respond within 24 hours.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">Email</label>
                  <a href="mailto:upseramedia@gmail.com" className="text-xl hover:text-white/60 transition-colors">upseramedia@gmail.com</a>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-2">Phone</label>
                  <a href="tel:+918714731305" className="text-xl hover:text-white/60 transition-colors">+91 8714731305</a>
                </div>
              </div>
            </motion.div>

            <ContactForm />
          </div>
        </div>
      </Section>
    </div>
  );
}