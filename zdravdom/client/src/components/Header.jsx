import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ onBook, onPhone }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyPhone = async (num) => {
    try { await navigator.clipboard.writeText(num); } catch {}
    setToast(`📞 ${num} скопирован`);
    setTimeout(() => setToast(''), 1800);
  };

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id) => {
    closeMenu();
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300); }
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
        <div className="header-inner">
          {/* LOGO */}
        <a href="/" className="logo redesign-logo-v5">
  <div className="logo-icon">
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20" stroke="var(--c-copper)" strokeWidth="1.2" fill="none"/>
      <path d="M10 24 L22 12 L34 24" stroke="var(--c-copper-lt)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="14" y="24" width="16" height="12" stroke="var(--c-copper-lt)" strokeWidth="1.3" fill="none"/>
      <circle cx="22" cy="28" r="4.5" stroke="var(--c-copper)" strokeWidth="1.2" fill="none"/>
      <path d="M19.5 28 C20.5 26.5, 23.5 26.5, 24.5 28" stroke="var(--c-copper)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    </svg>
  </div>
  <div className="logo-text-block">
    <span className="logo-main">ЗдравДом</span>
    <span className="logo-sub">центр здоровья</span>
  </div>
</a>

          {/* DESKTOP NAV */}
          <nav className="main-nav">
            {[['services','Услуги'],['specialists','Специалисты']].map(([id,label]) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            <Link to="/articles" className="nav-link">Статьи</Link>
            {[['reviews','Отзывы'],['contact','Контакты']].map(([id,label]) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="header-actions">
            <div className="desktop-phones">
              {['+79965357073','+79952236999'].map(n => (
                <button key={n} className="phone-copy-item" onClick={() => copyPhone(n)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{n.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5')}</span>
                </button>
              ))}
            </div>
            <a href="https://t.me/tochkasborkiborea" className="tg-btn header-icon-btn" target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /> <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              <span className="btn-label">Telegram</span>
            </a>
            <button className="btn btn-cta header-cta" onClick={onBook}>Записаться</button>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="header-mobile-actions">
            <button className="header-icon-btn" onClick={onPhone} aria-label="Телефоны">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
            <a href="https://t.me/tochkasborkiborea" className="header-icon-btn" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /> <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </a>
            <button className={`burger${menuOpen ? ' open' : ''}`} id="burgerBtn" onClick={() => setMenuOpen(o => !o)} aria-label="Меню">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && <div className="mobile-menu-overlay open" onClick={closeMenu} />}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav>
          {[['services','Услуги'],['specialists','Специалисты']].map(([id,label]) => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <Link to="/articles" className="nav-link" onClick={closeMenu}>Статьи</Link>
          {[['reviews','Отзывы'],['contact','Контакты']].map(([id,label]) => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <button className="btn btn-cta" style={{marginTop:'1rem',width:'100%'}} onClick={() => { closeMenu(); onBook(); }}>
            Записаться на приём
          </button>
        </nav>
      </div>

      {/* COPY TOAST */}
      <div className={`copy-toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}