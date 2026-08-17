import { useEffect, useRef } from "react";
import { ArrowRight, Heart, ShoppingCart, User } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fontsource/anton/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";

gsap.registerPlugin(ScrollTrigger);

const tickerItems = ["CRUNCH HAPPY ↗", "BREAK. BITE. SMILE. ↗", "CREAMY INSIDE ↗", "MADE FOR JOY ↗", "HAZELNUT HEART ↗"];

function App() {
  const hero = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".site-header", { y: -28, opacity: 0, duration: 0.55 })
        .from(".hero-heading span, .hero-description, .buy-button", { y: 25, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.2")
        .from(".hero-product", { y: 120, scale: 1.08, opacity: 0, duration: 0.95, ease: "power4.out" }, "-=0.35")
        .from(".ticker", { yPercent: 100, duration: 0.45 }, "-=0.3");

      gsap.to(".hero-product", {
        yPercent: -34,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".white-copy > *, .white-visual", {
        y: 70,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".white-section",
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".ritual-heading, .ritual-stage, .ritual-notes > *", {
        y: 75,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ritual-section",
          start: "top 72%",
          once: true,
        },
      });
    }, hero);
    return () => context.revert();
  }, []);

  return (
    <main ref={hero}>
      <section className="hero" id="top">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Kinder home">kinder</a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#shop">Shop</a><a href="#favorites">Favorites</a><a href="#story">Our Story</a><a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <a className="icon-action" href="#favorites" aria-label="Favorites"><Heart size={17} weight="bold" /></a>
            <a className="icon-action" href="#shop" aria-label="Shopping cart"><ShoppingCart size={17} weight="bold" /></a>
            <a className="shop-all" href="#shop">Shop All</a>
            <a className="icon-action" href="#contact" aria-label="Account and contact"><User size={17} weight="bold" /></a>
          </div>
        </header>

        <div className="paint-edge" aria-hidden="true" />

        <div className="hero-content">
          <h1 className="hero-heading"><span>Big Crunch.</span><span>Pure Kinder Joy.</span></h1>
          <p className="hero-description">Crisp wafer, creamy hazelnut filling, and smooth milk chocolate made for your favorite little break.</p>
          <a className="buy-button" href="#shop">Buy Now</a>
        </div>

        <img className="hero-product" src="/assets/bueno-break.png" alt="A Kinder-style chocolate wafer bar split open with creamy hazelnut filling" />

        <div className="ticker" aria-label="Kinder Bueno highlights">
          <div className="ticker-track">
            {[0, 1, 2, 3].map((group) => <div className="ticker-group" key={group}>{tickerItems.map((item) => <span key={`${group}-${item}`}>{item}</span>)}</div>)}
          </div>
        </div>
      </section>

      <section className="white-section" id="shop">
        <div className="white-copy">
          <p className="section-kicker">Kinder Bueno White</p>
          <h2 id="story">Meet the<br/><span>lighter side.</span></h2>
          <p>Delicate white chocolate, golden wafer, and a hazelnut center that keeps every bite impossibly light.</p>
          <div className="white-actions" id="favorites">
            <a className="discover-button" href="https://www.kinder.com" target="_blank" rel="noreferrer">Discover Bueno White <ArrowRight size={19} weight="bold" /></a>
            <a className="favorite-link" href="#top"><Heart size={18} weight="fill" /> Save this favorite</a>
          </div>
          <a className="contact-link" id="contact" href="mailto:hello@kinder-fan.example">Questions? Say hello</a>
        </div>
        <div className="white-visual">
          <img src="/assets/bueno-white.png" alt="White chocolate wafer pieces floating with hazelnuts and cream" />
          <span className="visual-stamp">NEW<br/>CRUNCH</span>
        </div>
      </section>

      <section className="ritual-section" aria-labelledby="ritual-title">
        <div className="ritual-heading">
          <p>Your everyday favorite</p>
          <h2 id="ritual-title">SNAP IT.<br/><span>SHARE IT.</span><br/>LOVE IT.</h2>
        </div>
        <div className="ritual-stage">
          <div className="sun-ring" aria-hidden="true" />
          <img src="/assets/bueno-break.png" alt="A milk chocolate wafer split open with creamy filling" />
        </div>
        <div className="ritual-notes">
          <p><b>01</b><span>Hear the crisp wafer snap.</span></p>
          <p><b>02</b><span>Find the creamy hazelnut center.</span></p>
          <p><b>03</b><span>Save the second piece. Maybe.</span></p>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">kinder</a>
        <p>A fan-made celebration of the crunch we love.</p>
        <nav aria-label="Footer navigation">
          <a href="#shop">Shop</a><a href="#favorites">Favorites</a><a href="#story">Our Story</a><a href="#contact">Contact</a>
        </nav>
        <p className="footer-note">Concept site. Not affiliated with Ferrero or Kinder.</p>
      </footer>
    </main>
  );
}

export default App;
