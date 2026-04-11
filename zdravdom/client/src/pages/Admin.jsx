import { useState, useEffect } from 'react';
import './Admin.css';

const API = '/api';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('zd_admin_token'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | article
  const [form, setForm] = useState({ tag:'', title:'', excerpt:'', sections:[] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

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
              <button className="btn btn-cta" onClick={openNew}>+ Новая статья</button>
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
          </>
        ) : (
          <div className="admin-editor">
            <div className="admin-editor-head">
              <button className="btn btn-outline btn-sm" onClick={()=>setEditing(null)}>← Назад</button>
              <h2>{editing === 'new' ? 'Новая статья' : 'Редактирование'}</h2>
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