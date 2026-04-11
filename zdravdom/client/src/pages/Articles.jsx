import { useState, useEffect } from 'react';
import useReveal from '../hooks/useReveal';
import './Articles.css';

export default function Articles({ onBook }) {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useReveal();

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    const onKey = e => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <div ref={pageRef}>
      {/* HERO */}
      <section className="articles-hero">
        <div className="articles-hero-bg"/>
        <div className="container articles-hero-content">
          <div className="breadcrumb reveal-up">
            <a href="/">ЗдравДом</a><span>/</span><span>Статьи</span>
          </div>
          <span className="section-tag reveal-up">База знаний</span>
          <h1 className="articles-hero-title reveal-up delay-1">Статьи о <em>здоровье и восстановлении</em></h1>
          <p className="articles-hero-sub reveal-up delay-2">Авторские материалы от специалистов ЗдравДом — понятно о сложном.</p>
        </div>
      </section>

      {/* GRID */}
      <section className="articles-section">
        <div className="container">
          {loading ? (
            <div style={{textAlign:'center',padding:'4rem',color:'var(--c-text-lt)'}}>Загрузка...</div>
          ) : (
            <div className="articles-grid">
              {articles.map((a,i) => (
                <article className={`article-card reveal-up delay-${(i%3)+1}`} key={a.id}>
                  <div className="article-meta">
                    <span className="article-tag">{a.tag}</span>
                    <span className="article-date">{new Date(a.createdAt).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}</span>
                  </div>
                  <h2 className="article-title">{a.title}</h2>
                  <p className="article-excerpt">{a.excerpt}</p>
                  {a.sections?.length > 0 && (
                    <div className="article-toc">
                      <div className="toc-header">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h7M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        Содержание
                      </div>
                      <ol className="toc-list">
                        {a.sections.map((s,j) => <li key={j}><span className="toc-link">{s.heading}</span></li>)}
                      </ol>
                    </div>
                  )}
                  <button className="btn btn-outline article-btn" onClick={() => setSelected(a)}>Читать полностью</button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selected && (
        <div className="article-modal open">
          <div className="article-modal-overlay" onClick={() => setSelected(null)}/>
          <div className="article-modal-card">
            <button className="modal-close article-modal-close" onClick={() => setSelected(null)} aria-label="Закрыть">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <div className="article-modal-inner">
              <div className="article-modal-meta">
                <span className="article-tag">{selected.tag}</span>
                <span className="article-date">{new Date(selected.createdAt).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}</span>
              </div>
              <h2 className="article-modal-title">{selected.title}</h2>
              {selected.sections?.length > 0 && (
                <nav className="article-modal-toc">
                  <div className="toc-header">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h7M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    Содержание
                  </div>
                  <ol className="toc-list">
                    {selected.sections.map((s,i) => (
                      <li key={i}><a href={`#sec-${i}`} className="toc-link" onClick={e=>{e.preventDefault();document.getElementById(`sec-${i}`)?.scrollIntoView({behavior:'smooth'})}}>{s.heading}</a></li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="article-modal-body">
                {selected.sections?.map((s,i) => (
                  <div className="article-modal-section" id={`sec-${i}`} key={i}>
                    <h3>{s.heading}</h3>
                    <p>{s.content}</p>
                  </div>
                ))}
              </div>
              <div className="article-cta-inline">
                <p>Хотите разобраться с вашей ситуацией лично? Запишитесь на консультацию.</p>
                <button className="btn btn-cta" onClick={() => { setSelected(null); onBook(); }}>Записаться</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}