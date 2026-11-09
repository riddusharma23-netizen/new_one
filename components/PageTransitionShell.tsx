"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PageTransitionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [leavingPathname, setLeavingPathname] = useState<string | null>(null);
  const navigationTimer = useRef<number | null>(null);
  const isLeaving = leavingPathname === pathname;

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLElement>(".btn-animate, .motion-cta");
      if (button && !button.matches(":disabled")) {
        const bounds = button.getBoundingClientRect();
        const strength = button.matches("[data-magnetic='off']") ? 0 : 0.16;
        button.style.setProperty("--mag-x", `${(event.clientX - bounds.left - bounds.width / 2) * strength}px`);
        button.style.setProperty("--mag-y", `${(event.clientY - bounds.top - bounds.height / 2) * strength}px`);
      }

      const card = target.closest<HTMLElement>(".card-animate, [data-card-animate]");
      if (card) {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.rotate = `${-y * 2.5} ${x * 2.5} 0deg`;
      }
    };

    const resetMotion = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLElement>(".btn-animate, .motion-cta");
      button?.style.setProperty("--mag-x", "0px");
      button?.style.setProperty("--mag-y", "0px");
      const card = target.closest<HTMLElement>(".card-animate, [data-card-animate]");
      if (card) card.style.rotate = "0deg";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest<HTMLElement>(".btn-animate, .motion-cta, .card-animate, [data-card-animate]");
      if (interactive && !interactive.matches(":disabled")) {
        interactive.animate(
          [{ scale: "1" }, { scale: ".975", offset: 0.45 }, { scale: "1" }],
          { duration: 360, easing: "cubic-bezier(.2, .9, .25, 1.3)" },
        );
      }

      const burst = document.createElement("span");
      burst.className = "click-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      burst.innerHTML = "<i></i><i></i><i></i>";
      document.body.append(burst);
      burst.addEventListener("animationend", () => burst.remove(), { once: true });

      if (interactive?.matches(".btn-animate, .motion-cta")) {
        const bounds = interactive.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "button-ripple";
        ripple.style.left = `${event.clientX - bounds.left}px`;
        ripple.style.top = `${event.clientY - bounds.top}px`;
        interactive.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", resetMotion, true);
    document.addEventListener("pointerdown", onPointerDown);

    if (navigationTimer.current !== null) {
      window.clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", resetMotion, true);
      document.removeEventListener("pointerdown", onPointerDown);
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, [pathname]);

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self") ||
      anchor.relList.contains("external") ||
      anchor.hasAttribute("data-no-page-transition")
    ) {
      return;
    }

    const destination = new URL(anchor.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === window.location.pathname
    ) {
      return;
    }

    event.preventDefault();
    if (isLeaving) return;

    setLeavingPathname(pathname);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    navigationTimer.current = window.setTimeout(() => {
      navigationTimer.current = null;
      router.push(
        `${destination.pathname}${destination.search}${destination.hash}`,
      );
    }, prefersReducedMotion ? 0 : 150);
  };

  return (
    <div
      className={`site-shell${isLeaving ? " site-shell--leaving" : ""}`}
      onClickCapture={handleClickCapture}
      aria-busy={isLeaving}
    >
      {children}
    </div>
  );
}
