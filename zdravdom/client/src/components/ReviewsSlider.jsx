import { useState, useRef, useCallback, useEffect } from 'react';
import './ReviewsSlider.css';

export default function ReviewsSlider({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const startX = useRef(0);
  const dragging = useRef(false);
  const trackRef = useRef(null);
  const cardRef = useRef(null);

  // Вычисляем количество карточек, видимых на экране
  useEffect(() => {
    const updateCardsPerView = () => {
      if (trackRef.current && cardRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const cardWidth = cardRef.current.offsetWidth;
        const gap = 24; // 1.5rem gap
        const visible = Math.floor(trackWidth / (cardWidth + gap));
        setCardsPerView(Math.max(1, visible));
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [reviews.length]);

  const go = useCallback((idx) => {
    const maxIndex = Math.max(0, reviews.length - cardsPerView);
    setCurrent(((idx % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1));
  }, [reviews.length, cardsPerView]);

  const onPointerDown = e => { startX.current = e.clientX || e.touches?.[0]?.clientX; dragging.current = true; };
  const onPointerUp = e => {
    if (!dragging.current) return;
    dragging.current = false;
    const x = e.clientX || e.changedTouches?.[0]?.clientX;
    const delta = x - startX.current;
    if (Math.abs(delta) > 50) go(current + (delta > 0 ? -1 : 1));
  };

  return (
    <div className="reviews-slider">
      <div className="reviews-track" ref={trackRef} onMouseDown={onPointerDown} onMouseUp={onPointerUp} onTouchStart={onPointerDown} onTouchEnd={onPointerUp}>
        <div className="reviews-inner" style={{ transform:`translateX(calc(-${current * 100}% / ${cardsPerView} - ${current * 1.5}rem))` }}>
          {reviews.map((r, i) => (
            <div className="review-card" key={i} ref={i === 0 ? cardRef : null}>
              <div className="review-stars">★★★★★</div>
              <blockquote>{r.text}</blockquote>
              <div className="review-author">
                <span className="review-name">{r.name}</span>
                <span className="review-meta">{r.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="reviews-nav">
        <button className="reviews-btn" onClick={() => go(current - 1)} aria-label="Назад">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="reviews-dots">
          {Array.from({ length: Math.max(1, reviews.length - cardsPerView + 1) }, (_, i) => (
            <button key={i} className={`reviews-dot${i === current ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Отзыв ${i + 1}`}/>
          ))}
        </div>
        <button className="reviews-btn" onClick={() => go(current + 1)} aria-label="Вперёд">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}