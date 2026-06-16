import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import './CreativeParallax.css';

const images = [
  // 1. Vibe and Ease (Top Left)
  { src: "https://picsum.photos/350/250?random=1", scatterX: -700, scatterY: -200, width: 350, height: 250, startScale: 0.1, scatterScale: 1.0, scatterRotate: -2, zIndex: 13 },
  // 2. Blue Book (Left)
  { src: "https://picsum.photos/200/280?random=2", scatterX: -550, scatterY: 50, width: 200, height: 280, startScale: 0.1, scatterScale: 1.0, scatterRotate: -8, zIndex: 12 },
  // 3. Undivided Contact (Bottom Left)
  { src: "https://picsum.photos/350/250?random=3", scatterX: -750, scatterY: 300, width: 350, height: 250, startScale: 0.1, scatterScale: 1.0, scatterRotate: 0, zIndex: 11 },
  // 4. Blue Trifold 1 (Bottom Left Low)
  { src: "https://picsum.photos/220/320?random=4", scatterX: -350, scatterY: 450, width: 220, height: 320, startScale: 0.1, scatterScale: 1.0, scatterRotate: -15, zIndex: 10 },
  // 5. Cosmopolitan (Center Left - THIS IS THE MAIN GATHERED CARD)
  { src: "https://picsum.photos/350/400?random=5", scatterX: -150, scatterY: 80, width: 350, height: 400, startScale: 1.2, scatterScale: 1.0, scatterRotate: -5, zIndex: 50, isMain: true },
  // 6. Bug Brigade (Bottom Center)
  { src: "https://picsum.photos/220/220?random=6", scatterX: 0, scatterY: 300, width: 220, height: 220, startScale: 0.1, scatterScale: 1.0, scatterRotate: 0, zIndex: 8 },
  // 7. Champions Phone (Top Center)
  { src: "https://picsum.photos/220/280?random=7", scatterX: -50, scatterY: -250, width: 220, height: 280, startScale: 0.1, scatterScale: 1.0, scatterRotate: 15, zIndex: 7 },
  // 8. Partners Tablet (Top Center Right)
  { src: "https://picsum.photos/300/220?random=8", scatterX: 200, scatterY: -200, width: 300, height: 220, startScale: 0.1, scatterScale: 1.0, scatterRotate: 0, zIndex: 6 },
  // 9. Next Brand Book (Center Right Bottom)
  { src: "https://picsum.photos/280/200?random=9", scatterX: 300, scatterY: 280, width: 280, height: 200, startScale: 0.1, scatterScale: 1.0, scatterRotate: -5, zIndex: 5 },
  // 10. Follow Science (Top Right)
  { src: "https://picsum.photos/250/250?random=10", scatterX: 550, scatterY: -220, width: 250, height: 250, startScale: 0.1, scatterScale: 1.0, scatterRotate: 0, zIndex: 4 },
  // 11. Foxbrim (Top Far Right)
  { src: "https://picsum.photos/250/250?random=11", scatterX: 850, scatterY: -220, width: 250, height: 250, startScale: 0.1, scatterScale: 1.0, scatterRotate: 0, zIndex: 3 },
  // 12. Bright & Bold (Center Right)
  { src: "https://picsum.photos/280/220?random=12", scatterX: 700, scatterY: 50, width: 280, height: 220, startScale: 0.1, scatterScale: 1.0, scatterRotate: -12, zIndex: 2 },
  // 13. Blue Trifold 2 (Bottom Far Right)
  { src: "https://picsum.photos/250/320?random=13", scatterX: 800, scatterY: 350, width: 250, height: 320, startScale: 0.1, scatterScale: 1.0, scatterRotate: -5, zIndex: 1 },
];

const services = [
  {
    title: "Brand",
    subtext: "Brands that stick and businesses grow on",
    img: "https://picsum.photos/600/800?random=11",
    activeRange: [0.30, 0.44]
  },
  {
    title: "UX/Web",
    subtext: "Sites that convert, not just impress",
    img: "https://framerusercontent.com/images/NEjSXt72eGn4K0mGS9abXjqYsI.png?width=1091&height=1122",
    activeRange: [0.44, 0.58]
  },
  {
    title: "Campaign",
    subtext: "Multi-channel campaigns that turn attention into growth",
    img: "https://framerusercontent.com/images/q1hHHopbCYRY0B2ueenE6Tak0k.png?width=1502&height=1500",
    activeRange: [0.58, 0.72]
  },
  {
    title: "Motion",
    subtext: "Video that explains, persuades, and spreads.",
    img: "https://framerusercontent.com/images/wH368nwkwYi9U6QS6N6a6RA2hy0.png?width=1500&height=1500",
    activeRange: [0.75, 0.90]
  }
];

function CustomCursor({ containerRef, mouseX, mouseY }) {
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const section = containerRef.current;
    if (section) {
      section.addEventListener('mouseenter', handleMouseEnter);
      section.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        section.removeEventListener('mouseenter', handleMouseEnter);
        section.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [containerRef]);

  // Adjust cursor offset so it centers on the mouse
  const x = useTransform(cursorX, v => v - 70);
  const y = useTransform(cursorY, v => v - 70);

  return (
    <motion.div className="cp-custom-cursor" style={{ x, y, opacity: isVisible ? 1 : 0 }}>
      <div className="cp-scroll-bubble">
        <span>Scroll</span>
      </div>
    </motion.div>
  );
}

function ParallaxCard({ img, scrollYProgress, mouseX, mouseY }) {
  // 1. SCATTER TO CONVERGE (0.0 to 0.20)
  const x = useTransform(scrollYProgress, [0, 0.20, 0.25, 0.35], [img.scatterX, 0, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 0.20, 0.25, 0.35], [img.scatterY, 0, 0, -1000]);
  const scale = useTransform(scrollYProgress, [0, 0.20, 0.25, 0.35], [img.scatterScale, img.startScale, img.startScale, img.startScale * 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.20, 0.25, 0.35], [img.scatterRotate, 0, 0, 0]);
  
  // If this is the main card, it stays visible until the next phase (0.25). 
  // If it's a secondary card, it fades out right before perfectly stacking (0.18) so it hides behind the main card.
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.18, 0.20, 0.25, 0.30], 
    img.isMain ? [1, 1, 1, 1, 0] : [1, 0, 0, 0, 0]
  );

  // Mouse Hover Parallax (3D Tilt) - Just for the 3D effect, independent of scatter
  const springConfig = { damping: 50, stiffness: 400 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const normalizedMouseX = useTransform(smoothMouseX, v => (v / window.innerWidth) * 2 - 1 || 0);
  const normalizedMouseY = useTransform(smoothMouseY, v => (v / window.innerHeight) * 2 - 1 || 0);

  const intensity = img.zIndex * 2;
  const rotateX = useTransform(normalizedMouseY, [-1, 1], [intensity, -intensity]);
  const rotateY = useTransform(normalizedMouseX, [-1, 1], [-intensity, intensity]);
  const hoverX = useTransform(normalizedMouseX, [-1, 1], [-intensity * 2, intensity * 2]);
  const hoverY = useTransform(normalizedMouseY, [-1, 1], [-intensity * 2, intensity * 2]);

  const w = img.width || img.size;
  const h = img.height || img.size;

  return (
    <motion.div style={{ y, opacity, position: 'absolute', inset: 0, zIndex: img.zIndex, pointerEvents: 'none' }}>
      <motion.div
        style={{ 
          x, scale, rotate, 
          width: w, height: h, 
          position: 'absolute',
          top: '50%', left: '50%',
          marginTop: -h / 2, marginLeft: -w / 2,
        }}
      >
        <motion.div 
          style={{ 
            width: '100%', height: '100%', 
            rotateX, rotateY, x: hoverX, y: hoverY,
            perspective: 1000 
          }}
          className={img.zIndex % 2 === 0 ? "float-animation-1" : "float-animation-2"}
        >
          <img src={img.src} alt="" className="parallax-card-img" style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)' }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ServiceItem({ svc, scrollYProgress }) {
  const [start, end] = svc.activeRange;
  
  // Opacity transitions from 0.2 -> 1 -> 1 -> 0.2
  const opacity = useTransform(scrollYProgress, 
    [start - 0.05, start, end, end + 0.05], 
    [0.2, 1, 1, 0.2]
  );
  
  // Subtext fades in when active and shifts up
  const subtextOpacity = useTransform(scrollYProgress, 
    [start, start + 0.02, end - 0.02, end], 
    [0, 1, 1, 0]
  );
  const subtextY = useTransform(scrollYProgress, 
    [start, start + 0.02], 
    [12, 0]
  );

  return (
    <div className="ccs-svc-item">
      <motion.div className="ccs-svc-title" style={{ opacity }}>
        {svc.title}
      </motion.div>
      <motion.div className="ccs-svc-subtext" style={{ opacity: subtextOpacity, y: subtextY }}>
        {svc.subtext}
      </motion.div>
    </div>
  );
}

function ServiceImage({ svc, scrollYProgress }) {
  const [start, end] = svc.activeRange;
  const opacity = useTransform(scrollYProgress, 
    [start - 0.02, start, end, end + 0.02], 
    [0, 1, 1, 0]
  );
  
  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity }}>
      <img src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </motion.div>
  );
}

export default function CreativeParallax() {
  const containerRef = useRef(null);
  
  // Track hover for explosion scatter
  const [isHovered, setIsHovered] = useState(false);

  // Track mouse for 3D parallax and custom cursor
  const mouseX = useMotionValue(-140);
  const mouseY = useMotionValue(-140);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply a spring physics smoothing to the scroll progress to make it buttery smooth
  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Phase 1: Intro Text - Fades IN as cards gather (0.0 to 0.20), stays, then fades out (0.25 to 0.30)
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.20, 0.25, 0.30], [0, 0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.20, 0.25, 0.30], [0.8, 1, 1, 1.2]);

  // Phase 2: Services List Container
  const servicesListOpacity = useTransform(scrollYProgress, [0.25, 0.30, 0.85, 0.88], [0, 1, 1, 0]);

  // Phase 3 & 4: Skull Layer & CTA
  const skullLayerOpacity = useTransform(scrollYProgress, [0.85, 0.88], [0, 1]);
  const momentumOpacity = useTransform(scrollYProgress, [0.88, 0.90, 0.95, 0.98], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.95, 0.98], [0, 1]);

  return (
    <div className="cp-wrapper">
      <section className="cp-header-section">
        <div className="cp-header-content">
          <h2 className="cp-heading">
            The best creative work happens <br />
            when thinking and making stay connected.
          </h2>
          <p className="cp-subtext">
            Most teams don't struggle because they lack ideas, but because creative
            work gets slowed down by misalignment and too many people touching the work.
          </p>
        </div>
      </section>

      <section 
        ref={containerRef} 
        className="cp-scroll-section"
        onMouseMove={handleMouseMove}
      >
        <div className="cp-sticky-container">
          <motion.div 
            className="cp-progress-bar"
            style={{ scaleX: scrollYProgress }} 
          />

          <svg className="cp-bg-line" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 160 C 400 320, 1000 0, 1440 160" stroke="white" strokeWidth="1.5" />
          </svg>

          <CustomCursor containerRef={containerRef} mouseX={mouseX} mouseY={mouseY} />

          {/* Phase 1: Intro Text */}
          <motion.div 
            style={{ 
              opacity: textOpacity, 
              scale: textScale,
              y: "-50%" // Framer motion handles transform translation here
            }} 
            className="cp-background-text"
          >
            what flows through?
          </motion.div>

          {/* Hover Hitbox for Cards */}
          <div 
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', zIndex: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

          {/* Phase 1: Exploding Cards */}
          <div className="parallax-card-container">
            {images.map((img, index) => (
              <ParallaxCard 
                key={index} 
                img={img} 
                scrollYProgress={scrollYProgress} 
                isHovered={isHovered}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            ))}
          </div>

          {/* Phase 2: Services List */}
          <motion.div style={{ opacity: servicesListOpacity }}>
            <div className="ccs-svc-list">
              {services.map((svc, index) => (
                <ServiceItem key={index} svc={svc} scrollYProgress={scrollYProgress} />
              ))}
            </div>
            
            <div className="ccs-svc-media">
              <div className="ccs-svc-media-inner">
                {services.map((svc, index) => (
                  <ServiceImage key={index} svc={svc} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Phase 3 & 4: Momentum & CTA */}
          <motion.div className="ccs-skull-layer" style={{ opacity: skullLayerOpacity }}>
            {/* Background 3D Skull Video (Replaced with direct video to prevent 403 Hotlink Error) */}
            <div className="ccs-skull-vid-wrap">
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-background-loop-21841-large.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ width: 'min(81vw, 1168px, 151.111vh)', aspectRatio: '1.77778 / 1', objectFit: 'cover', border: 'none', opacity: 0.15, pointerEvents: 'none' }}
              />
            </div>
            
            <motion.div className="ccs-skull-momentum" style={{ opacity: momentumOpacity }}>
              <p className="ccs-momentum-text">Built around <i style={{fontStyle: 'italic'}}>forward</i> momentum.</p>
            </motion.div>

            <motion.div className="ccs-final-cta" style={{ opacity: ctaOpacity }}>
              <p style={{ fontWeight: 300, fontSize: 'clamp(24px, 3.3vw, 48px)', marginBottom: '1.4vh' }}>
                Unlimited requests & revisions
              </p>
              <p style={{ fontWeight: 500, fontSize: 'clamp(20px, 2.5vw, 36px)', opacity: 0.9 }}>
                Creative + collaboration + strategic input + optional copywriting
              </p>
              <a href="#" className="ccs-btn">
                View the portfolio
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.69059 14.5904C3.79843 14.6465 3.91952 14.6721 4.04084 14.6646C4.16217 14.6571 4.27916 14.6167 4.37926 14.5477L13.0459 8.54769C13.1345 8.48634 13.2069 8.40443 13.2568 8.309C13.3068 8.21356 13.3329 8.10743 13.3329 7.99969C13.3329 7.89196 13.3068 7.78583 13.2568 7.69039C13.2069 7.59495 13.1345 7.51305 13.0459 7.45169L4.37926 1.45169C4.27935 1.382 4.16223 1.34106 4.04065 1.33336C3.91908 1.32566 3.79773 1.35148 3.68982 1.40801C3.58192 1.46454 3.49161 1.54961 3.42873 1.65395C3.36586 1.75828 3.33283 1.87788 3.33326 1.99969V13.9997C3.33324 14.1214 3.36652 14.5339 3.42951 14.3449C3.4925 14.449 3.58279 14.5339 3.69059 14.5904Z" fill="white"></path>
                </svg>
              </a>
            </motion.div>
          </motion.div>
          
          <div className="cp-nominee-badge">
            W. Nominee
          </div>
        </div>
      </section>
    </div>
  );
}
