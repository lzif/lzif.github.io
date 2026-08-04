export function reveal(element: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  element.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          element.classList.add("reveal-done");
          observer.disconnect();
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
