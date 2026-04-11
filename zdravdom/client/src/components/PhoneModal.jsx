import { useEffect } from 'react';
import './Modal.css';

export default function PhoneModal({ open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-backdrop open">
      <div className="modal-overlay" onClick={onClose}/>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div className="modal-header">
          <div className="modal-icon" style={{background:'var(--c-forest)'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--c-copper-lt)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h3>Свяжитесь с нами</h3>
          <p className="modal-sub">Позвоните или напишите — мы рядом</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem',margin:'1rem 0'}}>
          {['+7 (996) 535-70-73','+7 (995) 223-69-99'].map(n => (
            <a key={n} href={`tel:${n.replace(/\D/g,'').replace(/^/,'+')}`} className="phone-item-link">
              <span>📞</span><span>{n}</span>
            </a>
          ))}
        </div>
        <p className="modal-note">Нажмите на номер, чтобы позвонить</p>
      </div>
    </div>
  );
}