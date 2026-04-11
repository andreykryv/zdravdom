import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ onBook }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        {/* MAP */}
        <div className="footer-map-block">
          <div className="footer-map-title">Мы на карте</div>
          <div className="footer-map-address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            г. Краснодар, ул. Фрунзе, 161
          </div>
          <div className="footer-map-frame">
            <iframe
              title="ЗдравДом на карте"
              src="https://yandex.ru/map-widget/v1/?ll=38.966653%2C45.040617&z=17&l=map&pt=38.966653%2C45.040617%2Cpm2rdm"
              width="100%" height="100%" loading="lazy"
            />
          </div>
          <a href="https://yandex.ru/maps/?ll=38.966653%2C45.040617&z=17" target="_blank" rel="noreferrer" className="footer-map-link">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
            Открыть в Яндекс Картах
          </a>
        </div>

        {/* INNER */}
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{color:'var(--c-cream)'}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="16" cy="16" r="14"/>
                <path d="M16 6 C16 6,22 12,22 18 C22 21.3 19.3 24 16 24 C12.7 24 10 21.3 10 18 C10 12 16 6 16 6Z" fill="none"/>
                <path d="M10 14 Q16 11 22 14" fill="none"/>
              </svg>
              <span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:500}}>ЗдравДом</span>
            </Link>
            <p className="footer-tagline">Дом, где заботятся о вашем здоровье — от костей до нервной системы.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Услуги</h4>
              <Link to="/kirill">Хиропрактика</Link>
              <Link to="/denis">Саунд-хилинг</Link>
              <a href="#services">Телесная терапия</a>
              <a href="#services">Групповые медитации</a>
            </div>
            <div className="footer-col">
              <h4>Специалисты</h4>
              <Link to="/kirill">Кирилл</Link>
              <Link to="/denis">Денис</Link>
              <h4 style={{marginTop:'1.2rem'}}>Статьи</h4>
              <Link to="/articles">База знаний</Link>
            </div>
            <div className="footer-col">
              <h4>Контакты</h4>
              <a href="tel:+79965357073">+7 (996) 535-70-73</a>
              <a href="tel:+79952236999">+7 (995) 223-69-99</a>
              <a href="mailto:Kirill.borea@gmail.com">Kirill.borea@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} ЗдравДом. Все права защищены.</span>
          <span>Краснодар · Здравница Садовое</span>
        </div>
      </div>
    </footer>
  );
}