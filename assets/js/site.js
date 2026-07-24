/* ========================================================
   Home Pest Safe — site.js
   Handles: navbar toggle, lead-form modal, cookie consent,
   contact form, scroll reveal, stat counters, blog renderer.
   ======================================================== */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks  = document.querySelector('[data-nav-links]');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Lead-form modal ---------- */
  const modal = document.querySelector('[data-modal]');
  let lastFocused = null;

  function openModal(prefill) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (prefill && prefill.service) {
      const sel = modal.querySelector('select[name="service"]');
      if (sel) sel.value = prefill.service;
    }
    setTimeout(() => {
      const first = modal.querySelector('input, select, textarea, button');
      if (first) first.focus();
    }, 150);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-modal-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const service = el.getAttribute('data-service') || '';
      openModal({ service });
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------- Lead-form submission ---------- */
  const leadForm = modal ? modal.querySelector('form') : null;
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = leadForm.querySelector('.form-status');
      const consent = leadForm.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = 'Please accept the privacy policy & terms to proceed.';
          status.className = 'form-status is-error';
        }
        return;
      }
      /* Lead-form modal — replace this with your real backend or form provider */
      if (status) {
        status.textContent = 'Request received. Our scheduler will call within one business hour.';
        status.className = 'form-status is-success';
      }
      leadForm.reset();
      setTimeout(closeModal, 1800);
    });
  }

  /* ---------- Inline contact form ---------- */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      const consent = contactForm.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = 'Please accept the privacy policy & terms to send this message.';
          status.className = 'form-status is-error';
        }
        return;
      }
      /* Inline contact form — replace this with your real backend or form provider */
      if (status) {
        status.textContent = 'Thank you. Your message has been logged. We respond within one business day.';
        status.className = 'form-status is-success';
      }
      contactForm.reset();
    });
  }

  /* ---------- Cookie consent ---------- */
  const cookieBanner    = document.querySelector('[data-cookies]');
  const cookieAccept    = document.querySelector('[data-cookies-accept]');
  const cookieDecline   = document.querySelector('[data-cookies-decline]');
  const cookiePrefsBtns = document.querySelectorAll('[data-cookies-open]');

  function showCookies()  { if (cookieBanner) cookieBanner.classList.add('is-open'); }
  function hideCookies()  { if (cookieBanner) cookieBanner.classList.remove('is-open'); }

  function readChoice() {
    try { return localStorage.getItem('axis_cookie_choice'); } catch (e) { return null; }
  }
  function writeChoice(v) {
    try { localStorage.setItem('axis_cookie_choice', v); } catch (e) {}
  }

  if (cookieBanner) {
    if (!readChoice()) {
      setTimeout(showCookies, 600);
    }
    if (cookieAccept) cookieAccept.addEventListener('click', () => { writeChoice('accepted'); hideCookies(); });
    if (cookieDecline) cookieDecline.addEventListener('click', () => { writeChoice('declined'); hideCookies(); });
    cookiePrefsBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); showCookies(); }));
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    const target  = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1400;
    const start = performance.now();
    function tick(t) {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io2.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Year stamp ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ============================================================
     Blog renderer — pulls data from window.HOMEPEST_BLOG_POSTS
     ============================================================ */
  const POSTS = (typeof window !== 'undefined' && Array.isArray(window.HOMEPEST_BLOG_POSTS))
    ? window.HOMEPEST_BLOG_POSTS.slice()
    : [];

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
  }
  function tagClass(i) { return ['', 'is-red', 'is-blue'][i % 3]; }

  /* ---- Blog index page ---- */
  const blogList = document.querySelector('[data-blog-list]');
  if (blogList) {
    const sorted = POSTS.slice().sort((a, b) =>
      new Date(b.date || 0) - new Date(a.date || 0)
    );
    if (!sorted.length) {
      blogList.innerHTML = '<div class="empty">No articles published yet — check back soon.</div>';
    } else {
      blogList.innerHTML = sorted.map((p, i) => `
        <a class="blog-card" href="blog-detail.html?slug=${encodeURIComponent(p.slug)}" aria-label="${escapeHTML(p.title)}">
          <div class="blog-card__cover"><img src="${escapeHTML(p.cover)}" alt="${escapeHTML(p.coverAlt || p.title)}" loading="lazy"></div>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <span class="tag ${tagClass(i)}">${escapeHTML(p.category || 'Article')}</span>
              <span>by ${escapeHTML(p.author || 'Editorial')}</span>
              <span class="meta-dot"></span>
              <span>${fmtDate(p.date)}</span>
              <span class="meta-dot"></span>
              <span>${escapeHTML(p.readTime || '')}</span>
            </div>
            <h3>${escapeHTML(p.title)}</h3>
            <p>${escapeHTML(p.excerpt || '')}</p>
          </div>
        </a>
      `).join('');
    }
  }

  /* ---- Blog detail page ---- */
  const blogDetail = document.querySelector('[data-blog-detail]');
  if (blogDetail) {
    const params = new URLSearchParams(location.search);
    let slug = params.get('slug');
    let post = POSTS.find(p => p.slug === slug);
    if (!post && POSTS.length) post = POSTS[0];

    if (!post) {
      blogDetail.innerHTML = `
        <div class="empty">
          <h2>Article not found</h2>
          <p>This article may have been removed. <a href="blog.html" style="color:var(--yellow);text-decoration:underline">Back to blog</a></p>
        </div>`;
    } else {
      document.title = post.title + ' — Home Pest Safe Blog';

      /* Build TOC from h2 headings */
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.bodyHTML || '';
      const headings = tempDiv.querySelectorAll('h2');
      let tocHTML = '';
      headings.forEach((h, idx) => {
        const id = 'section-' + idx;
        h.setAttribute('id', id);
        tocHTML += `<a href="#${id}">${h.textContent}</a>`;
      });
      const processedBody = tempDiv.innerHTML;

      /* Related posts */
      const related = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
      let relatedHTML = related.map(r => `
        <a href="blog-detail.html?slug=${encodeURIComponent(r.slug)}">
          <div class="sidebar-related__thumb"><img src="${escapeHTML(r.cover)}" alt="${escapeHTML(r.title)}" loading="lazy"></div>
          <div class="sidebar-related__info">
            <h5>${escapeHTML(r.title)}</h5>
            <span>${escapeHTML(r.readTime || '')}</span>
          </div>
        </a>
      `).join('');

      blogDetail.innerHTML = `
        <div class="article-layout">
          <article class="article">
            <div class="article__hero"><img src="${escapeHTML(post.cover)}" alt="${escapeHTML(post.coverAlt || post.title)}"></div>
            <span class="article__category-tag">${escapeHTML(post.category || 'Article')}</span>
            <div class="article__meta">
              <span>By ${escapeHTML(post.author || 'Home Pest Safe Editorial')}</span>
              <span class="meta-dot"></span>
              <span>${fmtDate(post.date)}</span>
              <span class="meta-dot"></span>
              <span>${escapeHTML(post.readTime || '')}</span>
            </div>
            <h1>${escapeHTML(post.title)}</h1>
            <p class="article__excerpt">${escapeHTML(post.excerpt || '')}</p>
            <div class="article__body">${processedBody}</div>
            <div class="article__share">
              <span>Share</span>
              <button class="share-btn" title="Copy link" onclick="navigator.clipboard.writeText(location.href)">
                <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              </button>
              <a class="share-btn" title="Share on Twitter" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a class="share-btn" title="Share on Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </article>
          <aside class="article-sidebar">
            ${tocHTML ? `<div class="sidebar-card"><h4>In this article</h4><nav class="sidebar-toc">${tocHTML}</nav></div>` : ''}
            ${relatedHTML ? `<div class="sidebar-card"><h4>Related Articles</h4><div class="sidebar-related">${relatedHTML}</div></div>` : ''}
          </aside>
        </div>
      `;

      /* TOC scroll spy */
      if (tocHTML) {
        const tocLinks = blogDetail.querySelectorAll('.sidebar-toc a');
        const sectionEls = blogDetail.querySelectorAll('.article__body h2[id]');
        if (sectionEls.length && 'IntersectionObserver' in window) {
          const tocObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                tocLinks.forEach(l => l.classList.remove('is-active'));
                const active = blogDetail.querySelector('.sidebar-toc a[href="#' + entry.target.id + '"]');
                if (active) active.classList.add('is-active');
              }
            });
          }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
          sectionEls.forEach(el => tocObserver.observe(el));
        }
      }
    }
  }

  /* ---- Latest-posts strip on home ---- */
  const blogLatest = document.querySelector('[data-blog-latest]');
  if (blogLatest && POSTS.length) {
    const top = POSTS.slice().sort((a, b) =>
      new Date(b.date || 0) - new Date(a.date || 0)
    ).slice(0, 3);
    blogLatest.innerHTML = top.map((p, i) => `
      <a class="blog-card" href="blog-detail.html?slug=${encodeURIComponent(p.slug)}">
        <div class="blog-card__cover"><img src="${escapeHTML(p.cover)}" alt="${escapeHTML(p.coverAlt || p.title)}" loading="lazy"></div>
        <div class="blog-card__body">
          <div class="blog-card__meta">
            <span class="tag ${tagClass(i)}">${escapeHTML(p.category || 'Article')}</span>
            <span>by ${escapeHTML(p.author || 'Editorial')}</span>
            <span class="meta-dot"></span>
            <span>${fmtDate(p.date)}</span>
          </div>
          <h3>${escapeHTML(p.title)}</h3>
          <p>${escapeHTML(p.excerpt || '')}</p>
        </div>
      </a>
    `).join('');
  }

})();
