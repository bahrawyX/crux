import { useEffect, useRef, useState } from "react";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "@fontsource/anton/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";

gsap.registerPlugin(ScrollTrigger);

const navigationItems = [
  { href: "#inside", label: "Inside the bite" },
  { href: "#choose", label: "Choose your Bueno" },
  { href: "#ritual", label: "The ritual" },
];

const tickerItems = ["CRUNCH HAPPY ↗", "BREAK. BITE. SMILE. ↗", "CREAMY INSIDE ↗", "MADE FOR JOY ↗", "HAZELNUT HEART ↗"];

const insideLayers = [
  { id: "shell", number: "01", title: "Milk chocolate shell", note: "Thin and glossy—the first clean crack." },
  { id: "wafer", number: "02", title: "Crisp golden wafer", note: "Delicate layers with an audible crunch." },
  { id: "cream", number: "03", title: "Hazelnut cream", note: "Smooth, soft and waiting at the center." },
];

const buenoVariants = [
  {
    id: "classic",
    number: "01",
    name: "Bueno Classic",
    description: "Milk chocolate, crisp wafer, hazelnut cream.",
    image: "/assets/bueno-break.png",
    alt: "Milk-chocolate Bueno pieces pulled apart around a creamy hazelnut center",
    badge: <>MILK<br />SNAP</>,
  },
  {
    id: "white",
    number: "02",
    name: "Bueno White",
    description: "White chocolate, crisp wafer, hazelnut cream.",
    image: "/assets/bueno-white.png",
    alt: "White chocolate wafer pieces with hazelnuts, crumbs and hazelnut cream",
    badge: <>WHITE<br />CRUNCH</>,
  },
];

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuButton = useRef(null);

  useEffect(() => {
    const sections = navigationItems.map(({ href }) => document.querySelector(href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.2, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButton.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const closeAtDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  const renderLinks = (className) => (
    <nav className={className} aria-label={className === "main-nav" ? "Primary navigation" : "Mobile navigation"}>
      {navigationItems.map(({ href, label }) => (
        <a
          href={href}
          key={href}
          aria-current={activeSection === href.slice(1) ? "location" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          {label}
        </a>
      ))}
    </nav>
  );

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Back to the beginning">kinder</a>
      {renderLinks("main-nav")}
      <a className="header-cta" href="#find">Find the official Bueno</a>
      <button
        ref={menuButton}
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={23} weight="bold" /> : <List size={23} weight="bold" />}
      </button>
      {menuOpen && <div id="mobile-navigation">{renderLinks("mobile-menu")}</div>}
    </header>
  );
}

function App() {
  const page = useRef(null);
  const [activeLayer, setActiveLayer] = useState("cream");
  const [selectedFlavor, setSelectedFlavor] = useState("classic");
  const flavorButtons = useRef([]);
  const selectedFlavorData = buenoVariants.find(({ id }) => id === selectedFlavor);

  const handleFlavorKeyDown = (event, index) => {
    const keyDirections = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let nextIndex;

    if (event.key in keyDirections) nextIndex = (index + keyDirections[event.key] + buenoVariants.length) % buenoVariants.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = buenoVariants.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    setSelectedFlavor(buenoVariants[nextIndex].id);
    flavorButtons.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis({
      anchors: true,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      stopInertiaOnNavigate: true,
    });
    const updateLenis = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".site-header", { y: -28, opacity: 0, duration: 0.55 })
        .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.45 }, "-=0.2")
        .from(".hero-heading-line > span", { yPercent: 115, duration: 0.72, stagger: 0.08, ease: "power4.out" }, "-=0.25")
        .from(".hero-description, .hero-actions, .hero-spec", { y: 24, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.35")
        .from(".hero-cream-stretch", { scaleX: 0, opacity: 0, duration: 0.65, transformOrigin: "center", ease: "power3.inOut" }, "-=0.45")
        .from(".hero-product-half--left", { xPercent: -18, rotate: -3, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.52")
        .from(".hero-product-half--right", { xPercent: 18, rotate: 3, opacity: 0, duration: 1, ease: "power4.out" }, "<")
        .from(".ticker", { yPercent: 100, duration: 0.45 }, "-=0.3");

      gsap.to(".hero-product-stage", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });

      gsap.timeline({
        scrollTrigger: { trigger: ".inside-visual", start: "top 72%", once: true },
        defaults: { ease: "power3.out" },
      })
        .from(".inside-visual", { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" })
        .from(".anatomy-product", { scale: 0.9, rotate: -11, opacity: 0, duration: 0.8 }, "-=0.35")
        .from(".connector-path", { strokeDashoffset: 1, duration: 0.7, stagger: 0.12 }, "-=0.35")
        .from(".layer-callout", { x: (index) => index === 2 ? 28 : -28, opacity: 0, duration: 0.55, stagger: 0.12 }, "-=0.45")
        .from(".anatomy-index", { y: 12, opacity: 0, duration: 0.4 }, "-=0.4");

      gsap.timeline({
        scrollTrigger: { trigger: ".choose-section", start: "top 70%", once: true },
        defaults: { ease: "power3.out" },
      })
        .from(".flavor-stage", { xPercent: 8, opacity: 0, duration: 0.75 })
        .from(".variant-option", { opacity: 0, duration: 0.45, stagger: 0.1 }, "-=0.38");

      const ritualTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".ritual-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      gsap.set(".ritual-act", { opacity: 0.28 });
      gsap.set(".ritual-act--snap", { opacity: 1 });
      ritualTimeline
        .fromTo(".ritual-half--left", { xPercent: () => window.innerWidth <= 600 ? 6 : 10, rotate: 2 }, { xPercent: () => window.innerWidth <= 600 ? -3.5 : -7, rotate: -2.5, duration: 0.32, ease: "power2.inOut" }, 0)
        .fromTo(".ritual-half--right", { xPercent: () => window.innerWidth <= 600 ? -6 : -10, rotate: -2 }, { xPercent: () => window.innerWidth <= 600 ? 3.5 : 7, rotate: 2.5, duration: 0.32, ease: "power2.inOut" }, 0)
        .to(".ritual-act--snap", { opacity: 0.28, duration: 0.08 }, 0.3)
        .to(".ritual-act--reveal", { opacity: 1, duration: 0.1 }, 0.32)
        .to(".ritual-product", { scale: 1.055, duration: 0.28, ease: "power2.out" }, 0.4)
        .to(".ritual-stage-wipe", { scaleX: 1, duration: 0.24, ease: "power3.inOut" }, 0.3)
        .to(".ritual-act--reveal", { opacity: 0.28, duration: 0.08 }, 0.68)
        .to(".ritual-act--taste", { opacity: 1, duration: 0.1 }, 0.7)
        .to(".ritual-product", { yPercent: -3, scale: 1.09, duration: 0.25, ease: "power2.out" }, 0.72)
        .to(".ritual-resolve", { opacity: 1, y: 0, duration: 0.18 }, 0.8);

      gsap.utils.toArray(".section-reveal").forEach((section) => {
        const heading = section.querySelector("h2");
        const supportingElements = [...section.children].filter((child) => child !== heading);

        if (heading) {
          gsap.from(heading, {
            y: 32,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.82,
            ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 76%", once: true },
          });
        }

        gsap.from(supportingElements, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 76%", once: true },
        });
      });
    }, page);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      context.revert();
    };
  }, []);

  return (
    <div ref={page}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content" tabIndex="-1">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="paint-edge" aria-hidden="true" />
          <div className="hero-content">
            <p className="hero-kicker">The break with a soft center</p>
            <h1 className="hero-heading" id="hero-title">
              <span className="hero-heading-line"><span>The crisp break.</span></span>
              <span className="hero-heading-line hero-heading-line--cream"><span>With a soft center.</span></span>
            </h1>
            <p className="hero-description">Thin milk chocolate, delicate wafer and smooth hazelnut filling—layered for one satisfying snap.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#inside">Explore the layers <ArrowRight size={19} weight="bold" /></a>
              <a className="text-action" href="#choose">Choose your Bueno</a>
            </div>
            <p className="hero-spec"><span>Milk chocolate</span><span>Crisp wafer</span><span>Hazelnut center</span></p>
          </div>
          <div className="hero-product-stage" data-layout="vertical-break" role="img" aria-label="A chocolate wafer bar pulled apart to reveal crisp layers and a stretching hazelnut center">
            <div className="hero-product-tilt">
              <span className="hero-cream-stretch" aria-hidden="true" />
              <div className="hero-product-half hero-product-half--left" aria-hidden="true">
                <img src="/assets/bueno-break.png" alt="" />
              </div>
              <div className="hero-product-half hero-product-half--right" aria-hidden="true">
                <img src="/assets/bueno-break.png" alt="" />
              </div>
            </div>
          </div>
          <div className="ticker" aria-label="Kinder Bueno highlights">
            <div className="ticker-track">
              {[0, 1, 2, 3].map((group) => (
                <div className="ticker-group" aria-hidden={group === 0 ? undefined : "true"} key={group}>
                  {tickerItems.map((item) => <span key={`${group}-${item}`}>{item}</span>)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="inside-section" id="inside" aria-labelledby="inside-title">
          <div className="inside-copy section-reveal">
            <p className="section-kicker">Inside the bite</p>
            <h2 id="inside-title"><span>Good things</span><span>happen in layers.</span></h2>
            <p>A thin milk-chocolate shell gives way to crisp golden wafer and a smooth hazelnut center. Three textures, one unmistakable snap.</p>
          </div>
          <div className="inside-visual" data-active-layer={activeLayer}>
            <span className="anatomy-index" aria-hidden="true">ANATOMY / 001</span>
            <span className="anatomy-grid" aria-hidden="true" />
            <img className="anatomy-product" src="/assets/bueno-anatomy-v2.png" alt="Kinder Bueno pieces snapped open to expose crisp wafer and hazelnut filling" loading="lazy" decoding="async" />
            <svg className="anatomy-connectors" viewBox="0 0 100 100" aria-hidden="true">
              <path className="connector-path connector-path--shell" pathLength="1" d="M 27 21 H 38 L 48 31" />
              <circle className="connector-dot connector-dot--shell" cx="48" cy="31" r="1.15" />
              <path className="connector-path connector-path--wafer" pathLength="1" d="M 27 77 H 39 L 48 68" />
              <circle className="connector-dot connector-dot--wafer" cx="48" cy="68" r="1.15" />
              <path className="connector-path connector-path--cream" pathLength="1" d="M 75 25 H 66 L 53 50" />
              <circle className="connector-dot connector-dot--cream" cx="53" cy="50" r="1.15" />
            </svg>
            <ol className="layer-list" aria-label="Explore the three Bueno layers">
              {insideLayers.map((layer) => (
                <li className={`layer-callout layer-callout--${layer.id}`} key={layer.id}>
                  <button
                    type="button"
                    aria-pressed={activeLayer === layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    onFocus={() => setActiveLayer(layer.id)}
                    onPointerEnter={() => setActiveLayer(layer.id)}
                  >
                    <b>{layer.number}</b>
                    <span><strong>{layer.title}</strong><small>{layer.note}</small></span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="choose-section" id="choose" aria-labelledby="choose-title">
          <div className="choose-copy section-reveal">
            <p className="section-kicker">Choose your Bueno</p>
            <h2 id="choose-title">Same snap.<br/><span>Two finishes.</span></h2>
            <p>Classic wraps the light wafer in milk chocolate. White brings a brighter cocoa-speckled finish. Both keep the creamy hazelnut center.</p>
            <div className="variant-selector" role="radiogroup" aria-label="Choose a Bueno flavor">
              {buenoVariants.map((variant, index) => (
                <button
                  className="variant-option"
                  type="button"
                  role="radio"
                  aria-checked={selectedFlavor === variant.id}
                  tabIndex={selectedFlavor === variant.id ? 0 : -1}
                  ref={(button) => { flavorButtons.current[index] = button; }}
                  onClick={() => setSelectedFlavor(variant.id)}
                  onKeyDown={(event) => handleFlavorKeyDown(event, index)}
                  key={variant.id}
                >
                  <span className="variant-number">{variant.number}</span>
                  <span className="variant-label"><strong>{variant.name}</strong><small>{variant.description}</small></span>
                  <span className="variant-check" aria-hidden="true">SELECT</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flavor-stage" data-flavor={selectedFlavor} aria-label={`${selectedFlavorData.name} product view`}>
            <span className="flavor-stage-index" aria-hidden="true">FLAVOR / {selectedFlavorData.number}</span>
            <div className="flavor-images">
              {buenoVariants.map((variant) => (
                <div className={`flavor-image flavor-image--${variant.id}${selectedFlavor === variant.id ? " is-active" : ""}`} aria-hidden={selectedFlavor !== variant.id} key={variant.id}>
                  <img src={variant.image} alt={selectedFlavor === variant.id ? variant.alt : ""} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
            <span className="flavor-badge" key={selectedFlavor} aria-hidden="true">{selectedFlavorData.badge}</span>
            <p className="flavor-caption" aria-live="polite"><b>{selectedFlavorData.name}</b><span>{selectedFlavorData.description}</span></p>
          </div>
        </section>

        <section className="ritual-section" id="ritual" aria-labelledby="ritual-title">
          <div className="ritual-sticky">
            <div className="ritual-heading">
              <p>The Bueno ritual</p>
              <h2 id="ritual-title">BREAK IT.<br/><span>HEAR IT.</span><br/>TASTE IT.</h2>
              <p className="ritual-intro">One break. Three quick sensory beats.</p>
              <p className="ritual-scroll-note" aria-hidden="true">SCROLL / THREE ACTS</p>
            </div>
            <div className="ritual-stage" role="img" aria-label="Two snapped milk-chocolate wafer halves exposing crisp golden wafer and a hazelnut-cream center">
              <span className="ritual-stage-wipe" aria-hidden="true" />
              <div className="ritual-product">
                <div className="ritual-half ritual-half--left" aria-hidden="true">
                  <img src="/assets/bueno-break.png" alt="" loading="lazy" decoding="async" />
                </div>
                <div className="ritual-half ritual-half--right" aria-hidden="true">
                  <img src="/assets/bueno-break.png" alt="" loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="ritual-resolve">Crunch first. Cream next.</p>
            </div>
            <ol className="ritual-acts" aria-label="The three parts of the Bueno ritual">
              <li className="ritual-act ritual-act--snap"><b>01</b><span><strong>Snap</strong><small>A clean break opens the moment.</small></span></li>
              <li className="ritual-act ritual-act--reveal"><b>02</b><span><strong>Reveal</strong><small>Golden wafer gives way to the soft center.</small></span></li>
              <li className="ritual-act ritual-act--taste"><b>03</b><span><strong>Taste</strong><small>Crunch first. Cream next. Gone quickly.</small></span></li>
            </ol>
          </div>
        </section>

        <section className="find-section" id="find" aria-labelledby="find-title">
          <div className="section-reveal">
            <p className="section-kicker">Find your Bueno</p>
            <h2 id="find-title">Looking for the real thing?</h2>
          </div>
          <div className="find-copy section-reveal">
            <p>This is a fan-made campaign concept, not a store. Product availability, ingredients, and official information belong on Kinder’s website.</p>
            <a className="official-action" href="https://www.kinder.com/us/en/kinder-bueno" target="_blank" rel="noreferrer">Visit the official Kinder Bueno page <ArrowRight size={19} weight="bold" /></a>
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-title">
          <div className="section-reveal">
            <p className="section-kicker">Your break, your pick</p>
            <h2 id="final-title">Which Bueno is yours?</h2>
            <p className="final-cta-note">Choose the finish that fits your break, then make the moment yours.</p>
            <a className="primary-action" href="#choose">Choose your favorite <ArrowRight size={19} weight="bold" /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">kinder</a>
        <p>A fan-made campaign concept built around the snap, crunch, and creamy center of Kinder Bueno.</p>
        <nav aria-label="Footer navigation">
          <a href="#inside">Inside the bite</a>
          <a href="#choose">Choose your Bueno</a>
          <a href="#ritual">The ritual</a>
          <a href="#top">Back to top</a>
        </nav>
        <p className="footer-signoff" aria-hidden="true">BREAK. TASTE. REPEAT.</p>
        <p className="footer-note">Fan-made concept. Not affiliated with Ferrero or Kinder. Brand names and product references belong to their respective owners. Concept design and imagery are presented for non-commercial creative work.</p>
      </footer>
    </div>
  );
}

export default App;
