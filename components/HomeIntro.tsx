"use client";

import { useEffect, useState, type ReactNode } from "react";

const MIN_INTRO_MS = 1_150;
const MAX_LOAD_WAIT_MS = 1_800;

export default function HomeIntro({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(false);
      document.documentElement.classList.add("home-intro-ready");
      return;
    }

    document.documentElement.classList.add("home-intro-active");
    const startedAt = performance.now();
    let frame = 0;
    let finished = false;
    let loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad, { once: true });

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      document.documentElement.classList.add("home-intro-ready");
      window.setTimeout(() => setVisible(false), 720);
    };

    const animateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const next = Math.min(94, Math.round((elapsed / MIN_INTRO_MS) * 94));
      setProgress((current) => (next > current ? next : current));
      if ((elapsed >= MIN_INTRO_MS && loaded) || elapsed >= MAX_LOAD_WAIT_MS) {
        finish();
        return;
      }
      frame = window.requestAnimationFrame(animateProgress);
    };

    frame = window.requestAnimationFrame(animateProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      {children}
      {visible ? (
        <div
          className="home-preloader"
          role="progressbar"
          aria-label="Loading homepage"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="home-preloader__content">
            <span className="home-preloader__eyebrow">Smt. Champi Devi Inter College</span>
            <span className="home-preloader__number" aria-hidden="true">{progress}<span>%</span></span>
            <span className="home-preloader__track" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></span>
            <span className="home-preloader__caption">A brighter future starts here</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
