import useReveal from '../hooks/useReveal';
import './Specialist.css';

export default function Kirill({ onBook }) {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <section className="specialist-hero">
        <div className="specialist-hero-bg"/>
        <div className="specialist-hero-overlay"/>
        <div className="container specialist-hero-content">
          <div className="breadcrumb reveal-up"><a href="/">ЗдравДом</a><span>/</span><span>Кирилл</span></div>
          <div className="specialist-hero-grid">
            <div className="specialist-hero-photo reveal-up delay-1">
              <img src="/images/kirill.jpg" alt="Кирилл" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
              <div className="photo-placeholder-lg"><span>К</span></div>
              <div className="hero-photo-accent"/>
            </div>
            <div className="specialist-hero-text">
              <span className="section-tag reveal-up">Хиропрактик</span>
              <h1 className="reveal-up delay-1">Хиропрактика по методике <em>Кирилла</em></h1>
              <p className="hero-sub reveal-up delay-2">Техники, которые работают по-настоящему. Реальная помощь при заболеваниях опорно-двигательного аппарата.</p>
              <div className="hero-actions reveal-up delay-3">
                <button className="btn btn-cta btn-lg" onClick={onBook}>Записаться на процедуру</button>
                <a href="#about-kirill" className="btn btn-ghost btn-lg" onClick={e=>{e.preventDefault();document.getElementById('about-kirill')?.scrollIntoView({behavior:'smooth'})}}>Узнать о методике</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="about-kirill">
        <div className="container">
          <div className="two-col-grid">
            <div className="reveal-up">
              <span className="section-tag">Методика</span>
              <h2 className="section-title">Привет! Меня зовут <em>Кирилл</em></h2>
              <p className="body-text">Мой метод включает многофункциональный подход в области оздоровления организма. Занимаюсь целительной практикой много лет и наработал богатый опыт работы в вопросах здоровья тела — особенно спины, шеи, суставов и внутренних органов.</p>
              <p className="body-text">Когда-то я и сам страдал от серьёзных проблем со спиной. К нормальной жизни меня вернули только руки мастера, использовавшего технику миопрессуры.</p>
              <p className="body-text">В основе метода лежит миопрессура по технике Д. Тревел и Д. Симонса. Дополненная акупрессурой, висцеральным массажем и лёгкими мануальными практиками.</p>
              <blockquote className="inline-quote">«Истинная причина болей в спине, ногах, шее и суставах — в более 75% случаев — кроется именно в мышцах.»</blockquote>
            </div>
            <div className="tools-block reveal-up delay-2">
              <h3>Во время процедуры используются</h3>
              {[
                ['Особые масла','с расслабляющим или согревающим эффектом'],
                ['Горячие камни','из природного места силы'],
                ['Акупрессурные инструменты','специализированные для точечного воздействия'],
              ].map(([t,d]) => (
                <div className="tool-item" key={t}>
                  <div className="tool-dot"/>
                  <div><strong>{t}</strong><span>{d}</span></div>
                </div>
              ))}
              <h3 style={{marginTop:'2rem'}}>Формат процедуры</h3>
              <ol className="procedure-steps">
                {['Разогрев мышц','Висцеральный массаж','Миопрессура или акупрессура','Вакуумотерапия','Лёгкие мануальные практики','Постизометрическая релаксация мышц'].map((s,i) => (
                  <li key={i}><span>{String(i+1).padStart(2,'0')}</span>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="problems-section alt-bg">
        <div className="container">
          <div className="two-col-grid">
            <div className="reveal-up">
              <span className="section-tag">С чем я работаю</span>
              <h2 className="section-title">Проблемы, <em>которые решаем</em></h2>
              <div className="problems-list">
                {['Боли в спине, шее, руках, ногах, голове','Межпозвоночная грыжа и протрузии','Артроз, коксартроз, спондилез','Спондилоартроз, фасеточный синдром','Сколиоз','Проблемы с ЖКТ: желчный пузырь, печень, желудок','Устранение триггерных точек'].map(p => (
                  <div className="problem-item" key={p}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-up delay-2">
              <span className="section-tag">Результаты</span>
              <h2 className="section-title">Что вы <em>получите</em></h2>
              <div className="results-list">
                {['Избавление от боли и расслабление мышечных тканей','Восстановление кровообращения и лимфодренажной системы','Нормализация работы внутренних органов','Уменьшение и рассасывание грыж и протрузий','Повышение качества жизни'].map(r => (
                  <div className="result-item" key={r}><div className="result-icon">✓</div><span>{r}</span></div>
                ))}
              </div>
              <p className="goal-text">«Моя цель — гармонизировать состояние человека, избавить от боли и страданий и вернуть к счастливой здоровой жизни.»</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contra-section">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Важно знать</span>
            <h2 className="section-title">Абсолютные <em>противопоказания</em></h2>
          </div>
          <div className="contra-grid reveal-up delay-1">
            {['Психические заболевания (повышенная возбудимость)','Злокачественные и доброкачественные образования','Кровотечения (внешние и внутренние)','Гнойные абсцессы','Инфекционные заболевания крови','Кожные заболевания невыясненной этиологии','Тромбозы и значительное варикозное расширение вен','Острые воспалительные состояния','Рассеянный склероз','Лихорадочные состояния'].map(c => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card reveal-up">
            <h2>Готовы вернуть себе <em>здоровье и свободу движения?</em></h2>
            <p>Запишитесь на первичный приём и получите профессиональную оценку вашей ситуации</p>
            <button className="btn btn-cta btn-lg" onClick={onBook}>Записаться к Кириллу</button>
          </div>
        </div>
      </section>
    </div>
  );
}