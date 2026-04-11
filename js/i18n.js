// i18n module — loads content.json and manages language switching

let content = null;
let currentLang = localStorage.getItem('lang') || 'es';

async function loadContent() {
  const res = await fetch('data/content.json');
  content = await res.json();
  return content;
}

function getLang() {
  return currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
}

function toggleLang() {
  setLang(currentLang === 'es' ? 'en' : 'es');
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = currentLang === 'es' ? 'EN' : 'ES';
}

function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj['es'] || '';
}

function applyTranslations() {
  if (!content) return;
  renderAll();
}

function renderAll() {
  renderNav();
  renderHero();
  renderAbout();
  renderSkills();
  renderExperience();
  renderEducation();
  renderProjects();
  renderContact();
  renderFooter();
}

function renderNav() {
  const nav = content.nav;
  document.querySelectorAll('[data-nav]').forEach(el => {
    const key = el.dataset.nav;
    if (nav[key]) el.textContent = t(nav[key]);
  });
}

function renderHero() {
  const h = content.hero;
  setText('#heroBadge', t(h.badge));
  setText('#heroSub', t(h.subtitle));
  setText('#heroCtaProjects', t(h.cta_projects));
  setText('#heroCtaContact', t(h.cta_contact));
}

function renderAbout() {
  const a = content.about;
  setText('#aboutTag', t(a.tag));
  setText('#aboutTitle', t(a.title));
  setText('#aboutDesc', t(a.description));

  const pContainer = document.getElementById('aboutParagraphs');
  if (pContainer) {
    pContainer.innerHTML = a.paragraphs.map(p => `<p>${t(p)}</p>`).join('');
  }

  const langContainer = document.getElementById('aboutLangs');
  if (langContainer) {
    langContainer.innerHTML = a.languages.map(l =>
      `<div class="lang-badge"><span class="flag">${l.flag}</span> <span>${t(l.label)}</span></div>`
    ).join('');
  }

  const statsContainer = document.getElementById('aboutStats');
  if (statsContainer) {
    statsContainer.innerHTML = a.stats.map(s =>
      `<div class="stat-card glass">
        <div class="stat-num">${s.value}</div>
        <div class="stat-label">${t(s.label)}</div>
      </div>`
    ).join('');
  }
}

function renderSkills() {
  const s = content.skills;
  setText('#skillsTag', t(s.tag));
  setHTML('#skillsTitle', `${t(s.title_pre)}<span class="grad">${t(s.title_grad)}</span>`);
  setText('#skillsDesc', t(s.description));

  const grid = document.getElementById('skillsGrid');
  if (grid) {
    grid.innerHTML = s.categories.map(cat =>
      `<div class="skill-card glass fade-up">
        <div class="skill-icon ${cat.color}"><i class="${cat.icon}"></i></div>
        <h3>${t(cat.title)}</h3>
        <div class="skill-tags">
          ${cat.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>`
    ).join('');
    observeFadeUps(grid);
  }
}

function renderExperience() {
  const e = content.experience;
  setText('#expTag', t(e.tag));
  setHTML('#expTitle', `${t(e.title_pre)}<span class="grad">${t(e.title_grad)}</span>`);

  const timeline = document.getElementById('expTimeline');
  if (timeline) {
    timeline.innerHTML = e.items.map(item =>
      `<div class="tl-item fade-up">
        <div class="tl-card glass">
          <div class="tl-meta">
            <span class="tl-company">${item.company}</span>
            <span class="tl-date"><i class="fas fa-calendar-alt"></i> ${item.date}</span>
          </div>
          <div class="tl-role">${t(item.role)}</div>
          <ul class="tl-desc">
            ${item.bullets.map(b => `<li>${t(b)}</li>`).join('')}
          </ul>
        </div>
      </div>`
    ).join('');
    observeFadeUps(timeline);
  }
}

function renderEducation() {
  const e = content.education;
  setText('#eduTag', t(e.tag));
  setHTML('#eduTitle', `${t(e.title_pre)}<span class="grad">${t(e.title_grad)}</span>`);

  const grid = document.getElementById('eduGrid');
  if (grid) {
    grid.innerHTML = e.items.map(item =>
      `<div class="edu-card glass fade-up">
        <div class="edu-year">${item.year}</div>
        <div class="edu-degree">${t(item.degree)}</div>
        <div class="edu-school">${t(item.school)}</div>
        <div class="edu-icon"><i class="${item.icon}"></i></div>
      </div>`
    ).join('');
    observeFadeUps(grid);
  }
}

function renderProjects() {
  const p = content.projects;
  setText('#projTag', t(p.tag));
  setHTML('#projTitle', `${t(p.title_pre)}<span class="grad">${t(p.title_grad)}</span>`);
  setText('#projDesc', t(p.description));

  const grid = document.getElementById('projGrid');
  if (grid) {
    grid.innerHTML = p.items.map(item => {
      const linkHTML = item.link
        ? `<a href="${item.link.url}" target="_blank" rel="noopener noreferrer" class="proj-link" aria-label="${t(item.title)} - ${item.link.label}"><i class="${item.link.icon}"></i> ${item.link.label}</a>`
        : '';
      return `<div class="proj-card glass fade-up">
        <div class="proj-top">
          <div class="proj-icon ${item.color}"><i class="${item.icon}"></i></div>
          ${linkHTML}
        </div>
        <div class="proj-title">${t(item.title)}</div>
        <div class="proj-desc">${t(item.description)}</div>
        <div class="proj-stack">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>`;
    }).join('');
    observeFadeUps(grid);
  }
}

function renderContact() {
  const c = content.contact;
  setText('#contactTag', t(c.tag));
  setText('#contactTitle', t(c.title));
  setText('#contactDesc', t(c.description));
  setHTML('#contactHeading', t(c.heading).split(' ').slice(0, -1).join(' ') +
    ' <span class="grad">' + t(c.heading).split(' ').pop() + '</span>');
  setText('#contactText', t(c.text));

  const f = c.form;
  setText('label[for="formName"]', t(f.name));
  setAttr('#formName', 'placeholder', t(f.name_ph));
  setText('label[for="formEmail"]', t(f.email));
  setAttr('#formEmail', 'placeholder', t(f.email_ph));
  setText('label[for="formSubject"]', t(f.subject));
  setAttr('#formSubject', 'placeholder', t(f.subject_ph));
  setText('label[for="formMessage"]', t(f.message));
  setAttr('#formMessage', 'placeholder', t(f.message_ph));
  const submitBtn = document.querySelector('.form-submit');
  if (submitBtn && !submitBtn.disabled) {
    submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${t(f.submit)}`;
  }
}

function renderFooter() {
  const f = content.footer;
  const footerEl = document.getElementById('footerText');
  if (footerEl) {
    footerEl.innerHTML = `&copy; ${new Date().getFullYear()} <span class="grad">${content.meta.name}</span> &middot; ${t(f.text)} ✨`;
  }
}

// Helpers
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

function setAttr(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function observeFadeUps(container) {
  if (typeof window._fadeObserver !== 'undefined') {
    container.querySelectorAll('.fade-up').forEach(el => window._fadeObserver.observe(el));
  }
}

export { loadContent, getLang, setLang, toggleLang, t, renderAll };
