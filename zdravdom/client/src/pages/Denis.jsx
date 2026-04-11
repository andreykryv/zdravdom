import { useEffect, useRef } from 'react';
import useReveal from '../hooks/useReveal';
import './Specialist.css';

export default function Denis({ onBook }) {
  const ref = useReveal();

  // Sound waves animation
  const waveRef = useRef(null);
  useEffect(() => {
    const el = waveRef.current; if (!el) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 1200 600');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.15;';
    for (let i = 0; i < 6; i++) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', '600'); c.setAttribute('cy', '300');
      c.setAttribute('r', String(80 + i * 100));
      c.setAttribute('fill', 'none'); c.setAttribute('stroke', 'rgba(100,180,140,0.6)'); c.setAttribute('stroke-width', '1');
      svg.appendChild(c);
    }
    el.appendChild(svg);
    const rings = svg.querySelectorAll('circle');
    let t = 0, raf;
    const animate = () => {
      t += 0.008;
      rings.forEach((r, i) => {
        const ph = (t + i * 0.7) % 4;
        r.setAttribute('r', String(80 + (ph / 4) * 700));
        r.setAttribute('opacity', String((1 - ph / 4) * 0.5));
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); el.removeChild(svg); };
  }, []);

  return (
    <div ref={ref}>
      <section className="specialist-hero sound-hero">
        <div className="specialist-hero-bg sound-bg"/>
        <div ref={waveRef} className="sound-waves"/>
        <div className="specialist-hero-overlay"/>
        <div className="container specialist-hero-content">
          <div className="breadcrumb reveal-up"><a href="/">ЗдравДом</a><span>/</span><span>Денис · Саунд-хилинг</span></div>
          <div className="specialist-hero-grid">
            <div className="specialist-hero-photo reveal-up delay-1">
              <img src="/images/denis.jpg" alt="Денис" onError={e=>{e.target.style.display='none';e.target.nextElementSibling.style.display='flex'}}/>
              <div className="photo-placeholder-lg sound-placeholder"><span>Д</span></div>
              <div className="hero-photo-accent sound-accent"/>
            </div>
            <div className="specialist-hero-text">
              <span className="section-tag reveal-up">Саунд-хилер</span>
              <h1 className="reveal-up delay-1">Саунд-хилинг: <em>глубокое восстановление</em> через вибрацию и звук</h1>
              <p className="hero-sub reveal-up delay-2">Практики звуковой медитации, которые мягко возвращают тело в ресурсное состояние, успокаивают ум и наполняют внутренней энергией.</p>
              <div className="hero-actions reveal-up delay-3">
                <button className="btn btn-cta btn-lg" onClick={onBook}>Записаться на сессию</button>
                <a href="#about-sound" className="btn btn-ghost btn-lg" onClick={e=>{e.preventDefault();document.getElementById('about-sound')?.scrollIntoView({behavior:'smooth'})}}>Узнать о практике</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="about-sound">
        <div className="container">
          <div className="two-col-grid">
            <div className="reveal-up">
              <span className="section-tag">О практике</span>
              <h2 className="section-title">Что такое <em>саунд-хилинг</em></h2>
              <p className="body-text">Саунд-хилинг — это древняя практика восстановления целостности человека через звуковую вибрацию. Звуковые волны проходят сквозь тело, синхронизируя работу нервной системы.</p>
              <p className="body-text">Звук здесь не просто фон, а инструмент, который помогает телу отпустить зажимы, а сознанию — погрузиться в целительную тишину.</p>
              <p className="body-text">Вибрации тибетских чаш проникают примерно на 15 сантиметров вглубь тела, способствуя глубокому расслаблению и снятию психосоматических мышечных блоков.</p>
            </div>
            <div className="instruments-block reveal-up delay-2">
              <h3>Инструменты</h3>
              {[
                ['◎','Тибетские поющие чаши','Мягкая, обволакивающая вибрация для снятия блоков и гармонизации пространства'],
                ['◉','Гонги','Мощный омывающий звук, стирающий ментальный шум'],
                ['○','Плоские колокола','Вибрации проникают через кожу, вызывают резонанс в тканях мышц'],
                ['◌','Резонансные инструменты','Колокольчики, шум дождя и океана — тонкие звуки для внутренней структуры'],
              ].map(([icon,t,d]) => (
                <div className="instrument-item" key={t}>
                  <div className="instrument-icon">{icon}</div>
                  <div><strong>{t}</strong><span>{d}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="for-whom-section alt-bg">
        <div className="container">
          <div className="two-col-grid">
            <div className="reveal-up">
              <span className="section-tag">Для кого</span>
              <h2 className="section-title">Саунд-хилинг <em>подойдёт вам</em>, если…</h2>
              <div className="problems-list">
                {['Вы испытываете хронический стресс и внутреннее напряжение','Бессонница или прерывистый сон','Усталость, апатия и энергетическая перегрузка','Хотите научиться глубже чувствовать своё тело','Практикуете медитацию или находитесь на пути саморазвития','Ищете мягкий, но глубокий способ восстановить баланс'].map(p => (
                  <div className="problem-item" key={p}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-up delay-2">
              <span className="section-tag">Результаты</span>
              <h2 className="section-title">После практики <em>вы почувствуете</em></h2>
              <div className="results-list">
                {['Глубокое расслабление — тело словно «тает», отпуская напряжение','Ясность ума — поток мыслей замедляется, приходит внутренняя тишина','Прилив энергии — восстанавливается естественная жизненная сила','Качественный сон — практика помогает наладить режим отдыха','Эмоциональная разгрузка — уходят тревожность и зажимы'].map(r => (
                  <div className="result-item" key={r}><div className="result-icon">✓</div><span>{r}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="session-section">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Как проходит</span>
            <h2 className="section-title">Структура <em>сессии</em></h2>
            <p className="section-sub">Длительность: 60–90 минут</p>
          </div>
          <div className="session-steps reveal-up delay-1">
            {[['01','Введение и настройка','Знакомство, обсуждение текущего состояния, комфортное размещение'],['02','Расслабление и дыхание','Мягкие техники для снятия первичного напряжения'],['03','Погружение в звук','Основная часть — звук ведёт вас в глубокое состояние покоя'],['04','Интеграция и завершение','Мягкий выход из практики, время «приземлиться»']].map(([n,t,d],i,arr) => (
              <>
                <div className="session-step" key={n}>
                  <div className="step-num">{n}</div>
                  <div className="step-content"><h4>{t}</h4><p>{d}</p></div>
                </div>
                {i < arr.length-1 && <div className="step-arrow" key={`a${n}`}>→</div>}
              </>
            ))}
          </div>
        </div>
      </section>

      <section className="formats-section alt-bg">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">Форматы</span>
            <h2 className="section-title">Выберите <em>свой формат</em></h2>
          </div>
          <div className="formats-grid">
            {[['◎','Индивидуальные сессии','Глубокое личное погружение. Практика адаптируется под ваш запрос.'],['◉◉','Групповые практики','Возможность разделить опыт с единомышленниками.'],['⟐','Ретриты','Полное погружение в звуковую среду на несколько дней на природе.']].map(([icon,t,d]) => (
              <div className="format-card reveal-up" key={t}>
                <div className="format-icon" style={{fontSize:'1.4rem',alignItems:'center',display:'flex',justifyContent:'center'}}>{icon}</div>
                <h4>{t}</h4><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card sound-cta reveal-up">
            <h2>Готовы погрузиться в мир <em>звука и вибрации?</em></h2>
            <p>Оставьте свои контакты — Денис свяжется с вами, чтобы согласовать удобное время</p>
            <button className="btn btn-cta btn-lg" onClick={onBook}>Записаться к Денису</button>
          </div>
        </div>
      </section>
    </div>
  );
}