import { useState, useEffect } from 'react';
import './Admin.css';

const API = '/api';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('zd_admin_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | article | 'content'
  const [form, setForm] = useState({ tag:'', title:'', excerpt:'', sections:[] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [siteContent, setSiteContent] = useState(null);
  const [contentForm, setContentForm] = useState(null);

  const login = async () => {
    setLoginError('');
    try {
      const res = await fetch(`${API}/admin/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password}) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Ошибка'); return; }
      localStorage.setItem('zd_admin_token', data.token);
      setToken(data.token);
    } catch { setLoginError('Нет соединения с сервером'); }
  };

  const logout = () => { localStorage.removeItem('zd_admin_token'); setToken(null); };

  const load = async () => {
    try {
      const res = await fetch(`${API}/articles`);
      setArticles(await res.json());
    } catch {}
  };
   const loadContent = async () => {
    try {
      const res = await fetch(`${API}/content`);
      const data = await res.json();
      setSiteContent(data);
    } catch {}
  };

  useEffect(() => {
    if (token) {
      load();
      loadContent();
    }
  }, [token]);

  const openContentEditor = () => {
    setContentForm(JSON.parse(JSON.stringify(siteContent || {})));
    setEditing('content');
  };

  const saveContentField = (section, field, value) => {
    setContentForm(f => {
      const updated = { ...f };
      if (updated[section]) {
        updated[section] = { ...updated[section], [field]: value };
      } else {
        updated[section] = { [field]: value };
      }
      return updated;
    });
  };

  const saveContentArrayField = (section, array, index, field, value) => {
    setContentForm(f => {
      const updated = { ...f };
      const arr = [...(updated[section]?.[array] || [])];
      arr[index] = { ...arr[index], [field]: value };
      updated[section] = { ...updated[section], [array]: arr };
      return updated;
    });
  };

  const saveContent = async () => {
    setSaving(true);
    setMsg('');
    const headers = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };
    try {
      const res = await fetch(`${API}/content`, { method: 'PUT', headers, body: JSON.stringify(contentForm) });
      if (res.status === 401) { logout(); return; }
      await loadContent();
      setEditing(null);
      setMsg('Контент сохранён ✓');
    } catch {
      setMsg('Ошибка сохранения контента');
    }
    setSaving(false);
  };


  useEffect(() => { if (token) load(); }, [token]);

  const openNew = () => { setForm({ tag:'', title:'', excerpt:'', sections:[{ heading:'', content:'' }] }); setEditing('new'); };
  const openEdit = a => { setForm({ tag:a.tag, title:a.title, excerpt:a.excerpt, sections:a.sections||[{heading:'',content:''}] }); setEditing(a); };

  const saveSection = (i, field, val) => {
    const s = [...form.sections]; s[i] = {...s[i],[field]:val}; setForm(f=>({...f,sections:s}));
  };
  const addSection = () => setForm(f=>({...f,sections:[...f.sections,{heading:'',content:''}]}));
  const removeSection = i => setForm(f=>({...f,sections:f.sections.filter((_,j)=>j!==i)}));

  const save = async () => {
    if (!form.title.trim() || !form.tag.trim()) { setMsg('Заполните тег и заголовок'); return; }
    setSaving(true); setMsg('');
    const headers = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };
    const body = JSON.stringify(form);
    try {
      const url = editing === 'new' ? `${API}/articles` : `${API}/articles/${editing.id}`;
      const method = editing === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers, body });
      if (res.status === 401) { logout(); return; }
      await load(); setEditing(null); setMsg('Сохранено ✓');
    } catch { setMsg('Ошибка сохранения'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Удалить статью?')) return;
    await fetch(`${API}/articles/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    load();
  };

  if (!token) return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-logo">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" stroke="var(--c-copper)" strokeWidth="1.2" fill="none"/><path d="M10 24 L22 12 L34 24" stroke="var(--c-copper-lt)" strokeWidth="1.5" strokeLinecap="round" fill="none"/><rect x="14" y="24" width="16" height="12" stroke="var(--c-copper-lt)" strokeWidth="1.3" fill="none"/></svg>
          <h1>ЗдравДом</h1>
          <p>Административная панель</p>
        </div>
        <div className="admin-form-group">
          <label>Пароль</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Введите пароль"/>
        </div>
        {loginError && <p className="admin-error">{loginError}</p>}
        <button className="btn btn-cta w-full" onClick={login}>Войти</button>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-header-inner">
          <span className="admin-brand">ЗдравДом <em>Admin</em></span>
          <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
            {msg && <span className="admin-msg">{msg}</span>}
            <button className="btn btn-outline btn-sm" onClick={logout}>Выйти</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {!editing ? (
          <>
            <div className="admin-section-head">
              <h2>Статьи <span className="count">{articles.length}</span></h2>
         <div style={{display:'flex',gap:'0.5rem'}}>
                <button className="btn btn-cta" onClick={openNew}>+ Новая статья</button>
                <button className="btn btn-outline" onClick={openContentEditor}>✏️ Текст на сайте</button>
              </div>        
            </div>
            <div className="admin-articles-list">
              {articles.map(a => (
                <div className="admin-article-row" key={a.id}>
                  <div className="admin-article-info">
                    <span className="article-tag">{a.tag}</span>
                    <h3>{a.title}</h3>
                    <span className="admin-article-date">{new Date(a.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="admin-article-actions">
                    <button className="btn btn-outline btn-sm" onClick={()=>openEdit(a)}>Редактировать</button>
                    <button className="btn btn-sm" style={{color:'#c0392b',border:'1px solid #c0392b',borderRadius:'var(--radius-md)'}} onClick={()=>del(a.id)}>Удалить</button>
                  </div>
                </div>
              ))}
              {articles.length === 0 && <p style={{color:'var(--c-text-lt)',textAlign:'center',padding:'3rem'}}>Статей пока нет. Добавьте первую!</p>}
            </div>
          </>  ) : editing === 'content' ? (
          <div className="admin-editor admin-content-editor">
            <div className="admin-editor-head">
              <button className="btn btn-outline btn-sm" onClick={()=>setEditing(null)}>← Назад</button>
              <h2>Редактирование текста на сайте</h2>
              <button className="btn btn-cta" onClick={saveContent} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>

            {contentForm && (
              <div className="content-editor-tabs">
                <details open className="content-section-group">
                  <summary>🏠 Главная страница — Hero</summary>
                  <div className="editor-grid">
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Заголовок</label>
                      <textarea rows={3} value={contentForm.hero?.title || ''} onChange={e=>saveContentField('hero','title',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Кнопка записи</label>
                      <input value={contentForm.hero?.ctaButton || ''} onChange={e=>saveContentField('hero','ctaButton',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Кнопка "Узнать больше"</label>
                      <input value={contentForm.hero?.learnMoreButton || ''} onChange={e=>saveContentField('hero','learnMoreButton',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>📖 О нас</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.about?.tag || ''} onChange={e=>saveContentField('about','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.about?.title || ''} onChange={e=>saveContentField('about','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 1</label>
                      <textarea rows={2} value={contentForm.about?.body1 || ''} onChange={e=>saveContentField('about','body1',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 2</label>
                      <textarea rows={2} value={contentForm.about?.body2 || ''} onChange={e=>saveContentField('about','body2',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Цитата</label>
                      <input value={contentForm.about?.quote || ''} onChange={e=>saveContentField('about','quote',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Автор цитаты</label>
                      <input value={contentForm.about?.quoteAuthor || ''} onChange={e=>saveContentField('about','quoteAuthor',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>⚕️ Услуги</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.services?.tag || ''} onChange={e=>saveContentField('services','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.services?.title || ''} onChange={e=>saveContentField('services','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Подзаголовок</label>
                      <textarea rows={2} value={contentForm.services?.subtitle || ''} onChange={e=>saveContentField('services','subtitle',e.target.value)} />
                    </div>
                  </div>
                  <div className="content-array-editor">
                    <h4>Карточки услуг</h4>
                    {contentForm.services?.cards?.map((card, i) => (
                      <div key={i} className="content-array-item">
                        <div className="array-item-header">Услуга {i + 1}</div>
                        <div className="editor-grid">
                          <div className="editor-field">
                            <label>Номер</label>
                            <input value={card.num || ''} onChange={e=>saveContentArrayField('services','cards',i,'num',e.target.value)} />
                          </div>
                          <div className="editor-field" style={{gridColumn:'span 2'}}>
                            <label>Название</label>
                            <input value={card.title || ''} onChange={e=>saveContentArrayField('services','cards',i,'title',e.target.value)} />
                          </div>
                          <div className="editor-field" style={{gridColumn:'span 3'}}>
                            <label>Описание</label>
                            <textarea rows={2} value={card.desc || ''} onChange={e=>saveContentArrayField('services','cards',i,'desc',e.target.value)} />
                          </div>
                          <div className="editor-field">
                            <label>Кнопка</label>
                            <input value={card.cta || ''} onChange={e=>saveContentArrayField('services','cards',i,'cta',e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>👥 Специалисты</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег раздела</label>
                      <input value={contentForm.specialists?.tag || ''} onChange={e=>saveContentField('specialists','tag',e.target.value)} />
                    </div>
                  </div>
                  <h4>Кирилл</h4>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Бейдж</label>
                      <input value={contentForm.specialists?.kirill?.badge || ''} onChange={e=>saveContentField('specialists','kirill.badge',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Роль</label>
                      <input value={contentForm.specialists?.kirill?.role || ''} onChange={e=>saveContentField('specialists','kirill.role',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Описание</label>
                      <textarea rows={2} value={contentForm.specialists?.kirill?.desc || ''} onChange={e=>saveContentField('specialists','kirill.desc',e.target.value)} />
                    </div>
                  </div>
                  <h4>Денис</h4>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Бейдж</label>
                      <input value={contentForm.specialists?.denis?.badge || ''} onChange={e=>saveContentField('specialists','denis.badge',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Роль</label>
                      <input value={contentForm.specialists?.denis?.role || ''} onChange={e=>saveContentField('specialists','denis.role',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Описание</label>
                      <textarea rows={2} value={contentForm.specialists?.denis?.desc || ''} onChange={e=>saveContentField('specialists','denis.desc',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>📚 Превью статей</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.articlesPreview?.tag || ''} onChange={e=>saveContentField('articlesPreview','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.articlesPreview?.title || ''} onChange={e=>saveContentField('articlesPreview','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Подзаголовок</label>
                      <textarea rows={2} value={contentForm.articlesPreview?.subtitle || ''} onChange={e=>saveContentField('articlesPreview','subtitle',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Кнопка "Все статьи"</label>
                      <input value={contentForm.articlesPreview?.allButton || ''} onChange={e=>saveContentField('articlesPreview','allButton',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>💬 Отзывы</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.reviews?.tag || ''} onChange={e=>saveContentField('reviews','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.reviews?.title || ''} onChange={e=>saveContentField('reviews','title',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>📍 Форматы приёма</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.formats?.tag || ''} onChange={e=>saveContentField('formats','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.formats?.title || ''} onChange={e=>saveContentField('formats','title',e.target.value)} />
                    </div>
                  </div>
                  <div className="content-array-editor">
                    <h4>Карточки форматов</h4>
                    {contentForm.formats?.cards?.map((card, i) => (
                      <div key={i} className="content-array-item">
                        <div className="array-item-header">Формат {i + 1}</div>
                        <div className="editor-grid">
                          <div className="editor-field" style={{gridColumn:'span 2'}}>
                            <label>Название</label>
                            <input value={card.title || ''} onChange={e=>saveContentArrayField('formats','cards',i,'title',e.target.value)} />
                          </div>
                          <div className="editor-field" style={{gridColumn:'span 3'}}>
                            <label>Описание</label>
                            <textarea rows={2} value={card.desc || ''} onChange={e=>saveContentArrayField('formats','cards',i,'desc',e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>👨‍⚕️ Страница Кирилла</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.kirillPage?.tag || ''} onChange={e=>saveContentField('kirillPage','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.kirillPage?.title || ''} onChange={e=>saveContentField('kirillPage','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Подзаголовок</label>
                      <textarea rows={2} value={contentForm.kirillPage?.subtitle || ''} onChange={e=>saveContentField('kirillPage','subtitle',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Заголовок "Обо мне"</label>
                      <input value={contentForm.kirillPage?.aboutTitle || ''} onChange={e=>saveContentField('kirillPage','aboutTitle',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 1</label>
                      <textarea rows={2} value={contentForm.kirillPage?.aboutBody1 || ''} onChange={e=>saveContentField('kirillPage','aboutBody1',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 2</label>
                      <textarea rows={2} value={contentForm.kirillPage?.aboutBody2 || ''} onChange={e=>saveContentField('kirillPage','aboutBody2',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 3</label>
                      <textarea rows={2} value={contentForm.kirillPage?.aboutBody3 || ''} onChange={e=>saveContentField('kirillPage','aboutBody3',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Цитата</label>
                      <textarea rows={2} value={contentForm.kirillPage?.quote || ''} onChange={e=>saveContentField('kirillPage','quote',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст цели</label>
                      <input value={contentForm.kirillPage?.goalText || ''} onChange={e=>saveContentField('kirillPage','goalText',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Кнопка CTA</label>
                      <input value={contentForm.kirillPage?.ctaButton || ''} onChange={e=>saveContentField('kirillPage','ctaButton',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>🧘 Страница Дениса</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.denisPage?.tag || ''} onChange={e=>saveContentField('denisPage','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.denisPage?.title || ''} onChange={e=>saveContentField('denisPage','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Подзаголовок</label>
                      <textarea rows={2} value={contentForm.denisPage?.subtitle || ''} onChange={e=>saveContentField('denisPage','subtitle',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Заголовок "О практике"</label>
                      <input value={contentForm.denisPage?.aboutTitle || ''} onChange={e=>saveContentField('denisPage','aboutTitle',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 1</label>
                      <textarea rows={2} value={contentForm.denisPage?.aboutBody1 || ''} onChange={e=>saveContentField('denisPage','aboutBody1',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 2</label>
                      <textarea rows={2} value={contentForm.denisPage?.aboutBody2 || ''} onChange={e=>saveContentField('denisPage','aboutBody2',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Текст 3</label>
                      <textarea rows={2} value={contentForm.denisPage?.aboutBody3 || ''} onChange={e=>saveContentField('denisPage','aboutBody3',e.target.value)} />
                    </div>
                    <div className="editor-field">
                      <label>Кнопка CTA</label>
                      <input value={contentForm.denisPage?.ctaButton || ''} onChange={e=>saveContentField('denisPage','ctaButton',e.target.value)} />
                    </div>
                  </div>
                </details>

                <details className="content-section-group">
                  <summary>📄 Страница статей</summary>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>Тег</label>
                      <input value={contentForm.articlesPage?.tag || ''} onChange={e=>saveContentField('articlesPage','tag',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 2'}}>
                      <label>Заголовок</label>
                      <input value={contentForm.articlesPage?.title || ''} onChange={e=>saveContentField('articlesPage','title',e.target.value)} />
                    </div>
                    <div className="editor-field" style={{gridColumn:'span 3'}}>
                      <label>Подзаголовок</label>
                      <textarea rows={2} value={contentForm.articlesPage?.subtitle || ''} onChange={e=>saveContentField('articlesPage','subtitle',e.target.value)} />
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        ) : (
          <div className="admin-editor">
            <div className="admin-editor-head">
              <button className="btn btn-outline btn-sm" onClick={()=>setEditing(null)}>← Назад</button>
           <h2>{editing === 'new' ? 'Новая статья' : 'Редактирование статьи'}</h2>
              <button className="btn btn-cta" onClick={save} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
            </div>

            <div className="editor-grid">
              <div className="editor-field">
                <label>Тег *</label>
                <input value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} placeholder="Хиропрактика, Саунд-хилинг..."/>
              </div>
              <div className="editor-field" style={{gridColumn:'span 2'}}>
                <label>Заголовок *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Заголовок статьи"/>
              </div>
              <div className="editor-field" style={{gridColumn:'span 3'}}>
                <label>Краткое описание (excerpt)</label>
                <textarea rows={3} value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))} placeholder="2–3 предложения для превью..."/>
              </div>
            </div>

            <div className="editor-sections">
              <div className="editor-sections-head">
                <h3>Разделы статьи</h3>
                <button className="btn btn-outline btn-sm" onClick={addSection}>+ Добавить раздел</button>
              </div>
              {form.sections.map((s,i) => (
                <div className="editor-section-block" key={i}>
                  <div className="section-block-head">
                    <span className="section-num">{String(i+1).padStart(2,'0')}</span>
                    <button className="section-remove" onClick={()=>removeSection(i)} aria-label="Удалить раздел">✕</button>
                  </div>
                  <div className="editor-field">
                    <label>Подзаголовок</label>
                    <input value={s.heading} onChange={e=>saveSection(i,'heading',e.target.value)} placeholder="Название раздела"/>
                  </div>
                  <div className="editor-field">
                    <label>Содержимое</label>
                    <textarea rows={6} value={s.content} onChange={e=>saveSection(i,'content',e.target.value)} placeholder="Текст раздела..."/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}