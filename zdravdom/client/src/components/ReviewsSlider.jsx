import { useState, useRef, useCallback } from 'react';
import './ReviewsSlider.css';

export default function ReviewsSlider({ reviews }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);
  const trackRef = useRef(null);

  const go = useCallback((idx) => {
    setCurrent(((idx % reviews.length) + reviews.length) % reviews.length);
  }, [reviews.length]);

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
        <div className="reviews-inner" style={{ transform:`translateX(calc(-${current * 100}% - ${current * 1.5}rem))` }}>
          {reviews.map((r, i) => (
            <div className="review-card" key={i}>
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
          {reviews.map((_, i) => <button key={i} className={`reviews-dot${i === current ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Отзыв ${i + 1}`}/>)}
        </div>
        <button className="reviews-btn" onClick={() => go(current + 1)} aria-label="Вперёд">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}