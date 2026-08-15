"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal primitive. Sets data-reveal="in" once the element
 * crosses the viewport threshold; CSS in globals.css handles the transition.
 * Falls back to always-visible for prefers-reduced-motion (handled in CSS).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as "div";

  return (
    <Component
      ref={ref}
      data-reveal={visible ? "in" : ""}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}
