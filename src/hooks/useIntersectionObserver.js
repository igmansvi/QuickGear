import { useEffect } from "react";

/**
 * Custom hook for intersection observer to handle lazy loading elements
 * @param {React.RefObject} targetRef - Reference to the target element to observe
 * @param {Object} options - Intersection observer options
 * @param {Function} onIntersect - Callback function when element is intersected
 */
export const useIntersectionObserver = (
  targetRef,
  options = { threshold: 0.1 },
  onIntersect = null
) => {
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const defaultOnIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".lazy-load").forEach((el) => {
            el.classList.add("is-visible");
          });
          if (entry.target.classList.contains("lazy-load")) {
            entry.target.classList.add("is-visible");
          }
          observer.unobserve(entry.target);
        }
      });
    };

    const handleIntersect = onIntersect || defaultOnIntersect;
    const observer = new IntersectionObserver(handleIntersect, options);

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [targetRef, options, onIntersect]);
};
