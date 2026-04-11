import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import ReviewsSlider from '../components/ReviewsSlider';
import './Home.css';

const REVIEWS = [
  { name:'Ратмир', meta:'28 лет · военный', text:'Пришёл больным, ушёл здоровым! Спасибо большое Кирилл за помощь, это самая лучшая работа в мире! Продолжайте заботиться о здоровье людей, у вас это круто получается!' },
  { name:'Надежда', meta:'52 года · домохозяйка', text:'Проходила курс массажа, обратилась с болями в поясничной области. Огромное спасибо! Прошло два месяца, выполняю рекомендации и чувствую себя намного лучше! Кирилл очень грамотный специалист.' },
  { name:'Альфия', meta:'44 года · бухгалтер', text:'После первого же сеанса перестала болеть спина, плечи, голова и прекратились панические атаки, даже настроение улучшилось. Всем рекомендую.' },
  { name:'Алексей', meta:'40 лет · предприниматель', text:'Обратился с болью в копчике — такой, что ни сидеть, ни ходить. Через 4 дня боль стала утихать, через неделю прошла. Кирилл очень крутой специалист!' },
  { name:'Александр', meta:'38 лет · программист', text:'После первой же процедуры я смог спокойно поспать ночью. Никогда не был так близок к тому, чтобы победить свои больные мышцы.' },
];

const ARTICLES_PREVIEW = [
  { tag:'Саунд-хилинг', title:'Тибетские поющие чаши: как звук лечит тело и психику', excerpt:'Звук действительно влияет на наше состояние. Но есть особая практика, которая работает гораздо глубже — саунд-хилинг с тибетскими поющими чашами.' },
  { tag:'Хиропрактика', title:'Почему болит спина у офисных работников и как это исправить без таблеток', excerpt:'К вечеру пятницы спина «деревенеет», шею не повернуть, а поясница ноет даже после выходных? Это сигнал. В большинстве случаев можно обойтись без таблеток.' },
  { tag:'Нервная система', title:'Как стресс вызывает боль в спине: связь нервов и мышц', excerpt:'Вы ложитесь спать с болью в спине. Часто ищем причину в нагрузке. Но настоящий виновник — хронический стресс.' },
];

export default function Home({ onBook }) {
  const pageRef = useReveal();

  // Particle canvas
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = window.innerWidth > 768 ? 50 : 20;
    const particles = Array.from({ length: COUNT }, () => {
      const p = { x:0,y:0,size:0,sx:0,sy:0,op:0,life:0,max:0 };
      const reset = () => { p.x=Math.random()*canvas.width; p.y=Math.random()*canvas.height; p.size=Math.random()*2+0.5; p.sx=(Math.random()-.5)*.3; p.sy=-Math.random()*.5-.1; p.op=Math.random()*.4+.05; p.life=0; p.max=Math.random()*300+200; };
      p.reset = reset; reset(); p.life=Math.random()*p.max;
      return p;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.sx; p.y += p.sy; p.life++;
        if (p.life > p.max || p.y < -10) p.reset();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(176,120,64,${p.op*(1-p.life/p.max)})`; ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div ref={pageRef}>
      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-overlay"/>
          <canvas ref={canvasRef} className="hero-particles"/>
        </div>
        <div className="container hero-content">
          
          <h1 className="hero-title reveal-up delay-1">
            Убираем боль в спине за <em>1–3 сеанса </em>
            и восстанавливаем нервную систему без таблеток —&nbsp;<em>авторский подход</em> двух специалистов в Краснодаре
          </h1>
          <ul className="hero-bullets reveal-up delay-2">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Гарантия результата</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>1500+ пациентов</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Многолетний опыт</span>
            </li>
            
          </ul>
         
         
          <div className="hero-actions reveal-up delay-3">
            <button className="btn btn-cta btn-lg" onClick={onBook}>Записаться на приём</button>
            <a href="#services" className="btn btn-ghost btn-lg" onClick={e=>{e.preventDefault();document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}}>
              Узнать больше
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="section-tag reveal-up">О нас</span>
              <h2 className="section-title reveal-up delay-1">Место, где работают <em>в команде</em> ради вашего здоровья</h2>
              <p className="body-text reveal-up delay-2">Мы занимаемся восстановлением опорно-двигательного аппарата. Наш комплексный подход и командная работа дают результаты, недостижимые для частных мастеров и обычных клиник.</p>
              <p className="body-text reveal-up delay-3">Мы успешно работаем с межпозвоночными грыжами и протрузиями, спондилезом, коксартрозом, сколиозом — и подавляющим большинством других проблем опорно-двигательного аппарата.</p>
              <div className="about-features reveal-up delay-4">
                {[
                  ['Командный подход','Разные специалисты — единый результат'],
                  ['Индивидуальный подбор','Программа под вашу ситуацию'],
                  ['Доказанные техники','Методики с подтверждённой эффективностью'],
                ].map(([t,d]) => (
                  <div className="feature-item" key={t}>
                    <div className="feature-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinejoin="round"/></svg>
                    </div>
                    <div><strong>{t}</strong><span>{d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-visual reveal-right">
              <div className="about-img-wrap">
                <img src="/images/about.jpg" alt="ЗдравДом практика" onError={e=>{e.target.style.display='none'}}/>
                <div className="placeholder-pattern"/>
                <span>Место практики · ЗдравДом</span>
              </div>
              <div className="about-quote">
                <blockquote>«Истинная причина боли в спине, суставах и шее — в мышцах. Мы освобождаем их от спазмов.»</blockquote>
                <cite>Кирилл, хиропрактик</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag" style={{borderColor:'rgba(176,120,64,.5)'}}>Что мы предлагаем</span>
            <h2 className="section-title" style={{color:'var(--c-cream)'}}>Четыре направления <em>для вашего здоровья</em></h2>
            <p className="section-sub" style={{color:'rgba(245,239,230,.75)'}}>Каждая практика — отдельная история исцеления. Вместе — полная программа восстановления.</p>
          </div>
          <div className="services-grid">
            <ServiceCard num="01" title="Хиропрактика" desc="Миопрессура, акупрессура, висцеральная терапия и мануальные практики — авторский метод Кирилла для устранения боли в спине, шее и суставах." tags={['Грыжи','Спондилез','Сколиоз','ЖКТ']} cta={<Link to="/kirill" className="btn btn-glow-outline w-full">Подробнее</Link>} delay="delay-1"/>
            <ServiceCard num="02" title="Саунд-хилинг" desc="Тибетские поющие чаши, гонги и колокола — звуковые вибрации снимают нервное напряжение и психосоматические мышечные блоки." tags={['Стресс','Бессонница','Апатия','Нервная система']} cta={<Link to="/denis" className="btn btn-glow-outline w-full">Подробнее</Link>} delay="delay-2"/>
            <ServiceCard num="03" title="Телесная терапия" desc="Комплекс упражнений, подобранный специально для вас. Специалист научит, проконтролирует и поможет восстановить двигательную активность." tags={['Реабилитация','Упражнения','Движение']} cta={<button className="btn btn-cta w-full" onClick={onBook}>Записаться</button>} delay="delay-3"/>
            <ServiceCard num="04" title="Групповые медитации" desc="Воскресные медитации под тибетские чаши и чайные церемонии. Социальная активность, принятие тела, тёплое общение с единомышленниками." tags={['По воскресениям','Чайная церемония','Сообщество']} cta={<button className="btn btn-cta w-full" onClick={onBook}>Записаться</button>} delay="delay-4"/>
          </div>
        </div>
      </section>

      {/* ── SPECIALISTS ── */}
      <section className="specialists-section" id="specialists">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Наши специалисты</span>
          </div>
          <div className="specialists-grid">
            <SpecialistCard name="Кирилл" role="Хиропрактик · Специалист по опорно-двигательному аппарату" img="/images/kirill.jpg" badge="Хиропрактик" skills={['Миопрессура','Акупрессура','Висцеральная терапия','Хиропрактика']} desc="Многолетний опыт работы с самыми сложными случаями. Автор метода, объединяющего миопрессуру, акупрессуру и висцеральную терапию." href="/kirill" delay="delay-1"/>
            <SpecialistCard name="Денис" role="Саунд-хилер · Практик звуковых медитаций" img="/images/denis.jpg" badge="Саунд-хилер" skills={['Тибетские чаши','Гонги','Медитации','Ретриты']} desc="Несколько лет исследует влияние звука и вибрации на состояние человека. Объединяет знания о дыхании, энергетике и глубоком расслаблении." href="/denis" delay="delay-2"/>
          </div>
        </div>
      </section>

      {/* ── ARTICLES PREVIEW ── */}
      <section className="articles-preview-section">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">База знаний</span>
            <h2 className="section-title">Полезные <em>статьи</em></h2>
            <p className="section-sub">Авторские материалы от специалистов ЗдравДом — понятно о сложном.</p>
          </div>
          <div className="articles-preview-grid">
            {ARTICLES_PREVIEW.map((a,i) => (
              <article className={`article-card reveal-up delay-${i+1}`} key={i}>
                <div className="article-meta"><span className="article-tag">{a.tag}</span></div>
                <h3 className="article-title">{a.title}</h3>
                <p className="article-excerpt">{a.excerpt}</p>
                <Link to="/articles" className="btn btn-outline article-btn">Читать полностью</Link>
              </article>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'1rem'}} className="reveal-up delay-4">
            <Link to="/articles" className="btn btn-outline btn-lg">Все статьи →</Link>
          </div>
        </div>
      </section>
  {/* ── DIVIDER ── */}
      <div className="section-divider"></div>
      {/* ── REVIEWS ── */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Отзывы</span>
            <h2 className="section-title">Они уже <em>вернулись к жизни</em></h2>
          </div>
          <ReviewsSlider reviews={REVIEWS}/>
        </div>
      </section>

    
      {/* ── FORMATS ── */}
      <section className="formats-section alt-bg" id="formats">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Форматы приёма</span>
            <h2 className="section-title">Здоровье там, где удобно <em>Вам</em></h2>
          </div>
          <div className="formats-grid">
            {[
              ['Приём в Краснодаре','Уютный кабинет в центре города с всем необходимым оборудованием'],
              ['Здравница Садовое','Приём на природе — особая атмосфера для глубокого восстановления'],
              ['Выездной формат','Специалист приедет к вам домой или в удобное место'],
            ].map(([t,d],i) => (
              <div className={`format-card reveal-up delay-${i+1}`} key={t}>
                <div className="format-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {i===0 && <><path d="M16 3C11.03 3 7 7.03 7 12c0 6 9 16 9 16s9-10 9-16c0-4.97-4.03-9-9-9z"/><circle cx="16" cy="12" r="3"/></>}
                    {i===1 && <><rect x="3" y="3" width="26" height="26" rx="3"/><path d="M3 13h26M10 8V5M22 8V5"/></>}
                    {i===2 && <><rect x="3" y="8" width="26" height="18" rx="2"/><path d="M3 13h26M10 8V5M22 8V5"/></>}
                  </svg>
                </div>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ num, title, desc, tags, cta, delay }) {
  return (
    <div className={`service-card reveal-up ${delay}`}>
      <div className="service-card-inner">
        <div className="service-num">{num}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="service-tags">{tags.map(t => <span key={t}>{t}</span>)}</div>
        {cta}
      </div>
    </div>
  );
}

function SpecialistCard({ name, role, img, badge, skills, desc, href, delay }) {
  return (
    <div className={`specialist-card reveal-up ${delay}`}>
      <div className="specialist-photo-wrap">
        <img src={img} alt={name} className="specialist-photo" onError={e=>{e.target.style.display='none';e.target.nextElementSibling.style.display='flex'}}/>
        <div className="specialist-photo-placeholder"><span>{name[0]}</span></div>
        <div className="specialist-badge">{badge}</div>
      </div>
      <div className="specialist-info">
        <h3>{name}</h3>
        <p className="specialist-role">{role}</p>
        <p>{desc}</p>
        <div className="specialist-skills">{skills.map(s => <span key={s}>{s}</span>)}</div>
        <Link to={href} className="btn btn-outline-glow">О специалисте</Link>
      </div>
    </div>
  );
}