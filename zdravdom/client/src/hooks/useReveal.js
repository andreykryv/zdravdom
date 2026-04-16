import { useEffect, useRef } from 'react';

export default function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    const observeElements = () => {
      const els = ref.current.querySelectorAll('.reveal-up, .reveal-right');
      els.forEach(el => observer.observe(el));
    };

    // Наблюдаем за элементами сразу
    observeElements();

    // Создаём MutationObserver для отслеживания динамических изменений
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(ref.current, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
  return ref;
}