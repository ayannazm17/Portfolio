/* main.js — behaviour extracted from index.html (Phase 13).
   Each block below is an independent IIFE; load order does not matter. */

  // Phase 6 — case-study modal. Native <dialog> gives focus-trap, Escape and
  // focus-restore for free. Content is structured Question / Method / Result /
  // Caveat from each card's existing claims only, with a TODO where more detail
  // is needed — no new claims invented.
  (function () {
    const modal = document.getElementById('caseModal');
    if (!modal || typeof modal.showModal !== 'function') return;
    const titleEl = document.getElementById('csTitle');
    const bodyEl = document.getElementById('csBody');
    const closeBtn = document.getElementById('csClose');

    const CASES = {
      credit: {
        title: "Credit risk: lending policy A/B test",
        q: "Does an aggressive lending policy out-earn a conservative one, and where does the extra profit come from?",
        method: [
          "Simulated both policies on LendingClub loan data and tested the profit gap with a Welch t-test (p < 0.001).",
          "Segmented borrowers with K-Means on 11 features (k = 3) to see where the gap came from.",
          "Built a neural-network default model and compared it against a cluster-average baseline on 8,417 unseen loans."
        ],
        result: [
          "The aggressive policy earned £298 more profit per application despite a 3.3-point higher default rate (16.05% vs 12.79%).",
          "It won in every cluster — by £521.60 per application in the highest-risk one.",
          "The model reached ROC-AUC 0.68 where the baseline had no within-segment discrimination (AUC 0.50)."
        ],
        caveat: "Results are correlational because the data holds approved loans only. I recommended reject inference and a live pilot before rollout.",
        todo: "Add the full per-cluster profit table and the exact Policy A / Policy B rule definitions."
      },
      internship: {
        title: "Internship platform: Project Manager Dashboard",
        q: "Can an email-driven internship recruitment process be replaced with a managed pipeline on existing Microsoft 365 licences?",
        method: [
          "Built the manager side in Power Apps: post and activate listings, review applicants, move them through five status stages, email candidates and view the audit history.",
          "Modelled the data across five SharePoint lists and automated the flow with two Power Automate flows.",
          "Added role-based access that checks the signed-in Warwick account against a staff list."
        ],
        result: [
          "Replaced the email process with a five-stage pipeline and a full, timestamped audit trail, inside existing licences at no extra cost.",
          "A teammate built the student dashboard and public portal; both sides connect through shared SharePoint data."
        ],
        caveat: "Automated status emails, Power BI funnel reporting and AI-based candidate matching were proposed but not built.",
        todo: "Add dashboard screenshots and the SharePoint list schema."
      },
      universal: {
        title: "Predicting business credit applicants for Universal Plus",
        q: "Which of 100,000 customers are likely to apply for business credit, from 200 anonymised features?",
        method: [
          "Benchmarked six classifiers in a CRISP-DM workflow.",
          "Tested two preprocessing pipelines — with and without one feature that was 40% missing.",
          "Handled a 10/90 class imbalance with class weights rather than synthetic data."
        ],
        result: [
          "Logistic regression identified 77% of likely applicants (AUC 0.854), flagging 1,549 of 2,008 actual applicants on the test set.",
          "Chosen over XGBoost (AUC 0.861) because XGBoost found only half of applicants (recall 0.50 vs 0.77) and is harder to explain to regulators.",
          "Random Forest scored 90% accuracy but found no applicants at all."
        ],
        caveat: "A relationship-manager dashboard pilot was proposed before wider rollout.",
        todo: "Add the cost-of-missed-applicant assumptions behind the recall-over-precision choice."
      },
      powerlease: {
        title: "PowerLease: revenue management model",
        q: "Can reallocating a fixed generator fleet across rental lengths raise revenue with no price changes?",
        method: [
          "Built a linear programme in Python over a 300-generator fleet across 1, 4, 8 and 16-week rentals.",
          "Proposed the model's shadow prices (up to £672.70 per generator in week 37) as booking bid prices."
        ],
        result: [
          "Modelled revenue rose £466,430 (+10%) with no price changes.",
          "Load factor rose 73.4% to 79.1%, ROI 5.17 to 5.69, and idle-capacity weeks fell from 39 to 11 of 52.",
          "A 16-week rental starting in week 24 earns £5,734 against £4,780 of opportunity cost, so it would be accepted."
        ],
        caveat: "One branch, a model-based projection, and no customer data to confirm the price-sensitivity assumptions.",
        todo: "Add the price-sensitivity analysis."
      },
      emirates: {
        title: "Runway to Rewards: WBS x Emirates Group challenge",
        q: "How do you re-engage Gen Z Skywards members during the roughly 360-day gap between flights?",
        method: [
          "Led a four-person team and framed the engagement gap.",
          "Designed Runway to Rewards, a gamified micro-engagement concept built on the Hook Model, with a phased commercial rollout.",
          "Entries were judged on how practically the concept could be implemented in Emirates' existing app."
        ],
        result: [
          "First place among nine teams in a live Emirates Group challenge.",
          "Won a funded trip to Emirates HQ in Dubai."
        ],
        caveat: "Concept stage — not built or piloted.",
        todo: "Add the rollout phases and the engagement metrics the concept would be measured on."
      },
      wealth: {
        title: "Wealth management database",
        q: "Can a normalised database and synthetic dataset support a wealth-management analysis of AUM and advisor performance?",
        method: [
          "Built a 14-table MySQL schema with primary and foreign keys, CHECK and UNIQUE constraints and a status-to-closure rule, normalised to 3NF.",
          "Wrote generation specs for 1,000 clients, 25 advisors and a year of daily account snapshots, with asset prices simulated by geometric Brownian motion."
        ],
        result: [
          "Supported a team analysis of £967M AUM, up from £452M.",
          "Found every advisor with a £100M target missed it, and that 2025 added 46 net clients but lost £572K of AUM through churn."
        ],
        caveat: "Synthetic data, so the findings are illustrative.",
        todo: "Add the ER diagram and the full data-generation parameters."
      },
      rag: {
        title: "Hybrid RAG for World Bank reports",
        q: "Does hybrid retrieval with reranking and query rewriting beat a baseline RAG on the World Development Reports?",
        method: [
          "Indexed 4,589 chunks from 2,854 pages across ten reports (2016 to 2025).",
          "Fused FAISS and BM25 with Reciprocal Rank Fusion, reranked the top 20 with a cross-encoder to a top 5, and rewrote queries with HyDE.",
          "Tested both pipelines on 10 queries of four types and scored answers with an LLM judge."
        ],
        result: [
          "Retrieval relevance rose 0.70 to 0.84; for a 2016-report question the baseline returned no 2016 chunks while the enhanced pipeline returned four of five.",
          "Judge scores: correctness 4.5 for both, completeness 4.9 vs 4.8."
        ],
        caveat: "Grounding fell 3.8 to 3.1, but the judge saw only a truncated context excerpt, so I treat that as unreliable. Relevance is a keyword-overlap heuristic.",
        todo: "Rerun the judge with the full context and re-measure grounding."
      },
      worldcup: {
        title: "2026 World Cup scheduling",
        q: "Can an integer-programming model draw more balanced World Cup groups than the official draw?",
        method: [
          "Adapted the Ghoniem et al. (2017) model from 32 to 48 teams in Pyomo: 12 groups under a max-min objective, with confederation caps and three co-hosts in Pot 1, solved to a 0.8% optimality gap.",
          "Assigned groups to letters and stadiums with two further models and host-pinning rules."
        ],
        result: [
          "Cut the strength gap between groups to 87 FIFA points, against 500 in the confirmed groups of the official draw.",
          "Sent the most popular fixture set (score 20.0) to the 72,766-seat New York New Jersey stadium."
        ],
        caveat: "Only six of the twelve official groups were confirmed when the comparison was made.",
        todo: "Refresh the comparison once the full official draw is final."
      }
    };

    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const list = items => '<ul>' + items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>';
    const sec = (q, inner) => '<div class="cs-sec"><div class="cs-q">' + q + '</div>' + inner + '</div>';

    function open(key) {
      const c = CASES[key];
      if (!c) return;
      titleEl.textContent = c.title;
      bodyEl.innerHTML =
        sec('Question', '<p>' + esc(c.q) + '</p>') +
        sec('Method', list(c.method)) +
        sec('Result', list(c.result)) +
        sec('Caveat', '<p>' + esc(c.caveat) + '</p>') +
        '<div class="cs-todo"><strong>TODO</strong> — ' + esc(c.todo) + '</div>';
      modal.showModal();
      bodyEl.scrollTop = 0;
    }

    document.querySelectorAll('.cs-btn[data-case]').forEach(b =>
      b.addEventListener('click', () => open(b.dataset.case)));
    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  })();

  // Phase 7 — scroll-progress bar, copy-to-clipboard email, and a command
  // palette (Cmd/Ctrl-K). The palette is a native <dialog> (focus-trap +
  // Escape for free) with a listbox the arrow keys drive.
  (function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll-progress bar
    const bar = document.getElementById('scrollProgress');
    if (bar) {
      const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }

    // Copy-to-clipboard email
    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(btn.dataset.copy); }
        catch (e) { return; }
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1500);
      });
    });

    // Command palette
    const dlg = document.getElementById('cmdk');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const input = document.getElementById('cmdkInput');
    const listEl = document.getElementById('cmdkList');
    const scrollTo = id => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    const COMMANDS = [
      { label: 'Summary', hint: 'Go', ico: '01', run: () => scrollTo('summary') },
      { label: 'Education', hint: 'Go', ico: '02', run: () => scrollTo('education') },
      { label: 'Skills', hint: 'Go', ico: '03', run: () => scrollTo('skills') },
      { label: 'Experience', hint: 'Go', ico: '04', run: () => scrollTo('experience') },
      { label: 'Projects', hint: 'Go', ico: '05', run: () => scrollTo('projects') },
      { label: 'Contact', hint: 'Go', ico: '06', run: () => scrollTo('contact') },
      { label: 'Toggle theme', hint: 'Action', ico: '◐', run: () => document.getElementById('themeToggle').click() },
      { label: 'Open GitHub', hint: 'Link', ico: '↗', run: () => window.open('https://github.com/ayannazm17', '_blank', 'noopener') },
      { label: 'Email Ayan', hint: 'Link', ico: '✉', run: () => { window.location.href = 'mailto:ayannazm2712@gmail.com'; } }
    ];
    let filtered = COMMANDS.slice(), active = 0;

    function render() {
      listEl.innerHTML = filtered.length
        ? filtered.map((c, i) =>
            '<li class="cmdk-opt" role="option" id="cmdk-opt-' + i + '" aria-selected="' + (i === active) + '">' +
            '<span class="cmdk-ico" aria-hidden="true">' + c.ico + '</span>' + c.label +
            '<span class="cmdk-hint">' + c.hint + '</span></li>').join('')
        : '<li class="cmdk-empty">No matches</li>';
      input.setAttribute('aria-activedescendant', filtered.length ? 'cmdk-opt-' + active : '');
      [...listEl.querySelectorAll('.cmdk-opt')].forEach((li, i) => {
        li.addEventListener('mousemove', () => { if (active !== i) { active = i; paint(); } });
        li.addEventListener('click', () => choose(i));
      });
    }
    function paint() {
      [...listEl.querySelectorAll('.cmdk-opt')].forEach((li, i) => {
        li.setAttribute('aria-selected', i === active);
        if (i === active) { input.setAttribute('aria-activedescendant', 'cmdk-opt-' + i); li.scrollIntoView({ block: 'nearest' }); }
      });
    }
    function filter() {
      const q = input.value.trim().toLowerCase();
      filtered = q ? COMMANDS.filter(c => c.label.toLowerCase().includes(q)) : COMMANDS.slice();
      active = 0;
      render();
    }
    function choose(i) {
      const c = filtered[i];
      if (!c) return;
      dlg.close();
      c.run();
    }
    function openPalette() {
      input.value = '';
      filtered = COMMANDS.slice();
      active = 0;
      render();
      dlg.showModal();
      input.focus();
    }

    input.addEventListener('input', filter);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { active = (active + 1) % filtered.length; paint(); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { active = (active - 1 + filtered.length) % filtered.length; paint(); } }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    });
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); }
    });
  })();

  // Theme toggle with persistence and dynamic SVG icon switching
  (function () {
    const btn = document.getElementById('themeToggle');
    const sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
    const moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

    const getPreferredTheme = () => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
      } catch (e) {}
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const updateThemeUI = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        btn.innerHTML = sunIcon;
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        btn.innerHTML = moonIcon;
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    };

    const initialTheme = getPreferredTheme();
    updateThemeUI(initialTheme);

    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || initialTheme;
      const next = cur === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateThemeUI(next);
    });

    // Section-aware nav highlighting and scroll-reveal
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.rail-nav a[href^="#"]');
    const setCurrent = (id) => {
      links.forEach(l => l.setAttribute('aria-current', l.getAttribute('href') === '#' + id ? 'true' : 'false'));
    };
    if ('IntersectionObserver' in window) {
      // Setup nav highlighting
      const navObs = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setCurrent(visible.target.id);
      }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

      // Setup scroll reveal logic
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealObs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-init');
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

      sections.forEach((s, idx) => {
        navObs.observe(s);
        if (!prefersReducedMotion && idx > 0) {
          s.classList.add('reveal-init');
          revealObs.observe(s);
        }
      });
    }

    // Project filter chips (all cards shown; no fold)
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('#projects .project-card');
    const groups = document.querySelectorAll('#projects [data-group]');
    const filterStatus = document.getElementById('filterStatus');

    const applyFilter = (f) => {
      let matches = 0;
      cards.forEach(c => {
        c.hidden = f !== 'all' && !c.dataset.roles.split(' ').includes(f);
        if (!c.hidden) matches++;
      });
      groups.forEach(g => g.classList.toggle('is-empty', !g.querySelector('.project-card:not([hidden])')));
      filterStatus.textContent = f === 'all' ? '' : matches + ' of ' + cards.length + ' projects';
    };

    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      applyFilter(chip.dataset.filter);
    }));

    applyFilter('all');
  })();

  // Project mini-charts — hand-rolled inline SVG, themed entirely via CSS
  // custom properties, so a dark/light toggle recolours them with no JS.
  // Rendered lazily (only when a card scrolls near the viewport); bars grow
  // in on reveal unless prefers-reduced-motion is set, in which case they
  // appear at full height immediately.
  (function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CHARTS = {
      credit: {
        series: ['Policy A · Conservative', 'Policy B · Aggressive'],
        max: 100,
        metrics: [
          { name: 'Approval rate', a: { v: 65.74, t: '65.7%' }, b: { v: 95.36, t: '95.4%' } },
          { name: 'Default rate',  a: { v: 12.79, t: '12.8%' }, b: { v: 16.05, t: '16.1%' } }
        ],
        delta: 'Profit / application: <strong>+£298</strong> (Policy B vs A)',
        caption: 'Model ROC-AUC 0.68 vs cluster-average baseline 0.50.',
        aria: 'Grouped bar chart. Approval rate: Policy A 65.7 percent, Policy B 95.4 percent. Default rate: Policy A 12.8 percent, Policy B 16.1 percent.'
      },
      powerlease: {
        series: ['Actual', 'Optimised'],
        max: null,
        metrics: [
          { name: 'Revenue',     a: { v: 4650479, t: '£4.65M' }, b: { v: 5116909, t: '£5.12M' } },
          { name: 'Load factor', a: { v: 73.38, t: '73.4%' },   b: { v: 79.12, t: '79.1%' } },
          { name: 'ROI',         a: { v: 5.17, t: '5.17' },     b: { v: 5.69, t: '5.69' } },
          { name: 'Idle wks',    a: { v: 39, t: '39' },         b: { v: 11, t: '11' } }
        ],
        delta: 'Revenue <strong>+£466,430 (+10%)</strong> · idle weeks 39 → 11 of 52 (fewer is better)',
        caption: 'Model-based projection, one branch, no price changes. Bars scaled per metric.',
        aria: 'Grouped bar chart, Actual versus Optimised. Revenue 4.65 million to 5.12 million pounds. Load factor 73.4 to 79.1 percent. ROI 5.17 to 5.69. Idle weeks 39 to 11 of 52.'
      },
      wealth: {
        series: ['Jan 2025', 'Dec 2025'],
        max: null,
        metrics: [
          { name: 'AUM', a: { v: 452, t: '£452M' }, b: { v: 967, t: '£967M' } }
        ],
        delta: 'Assets under management <strong>+113.7%</strong> year on year · synthetic data',
        caption: 'Synthetic data, illustrative. Only the two endpoints are reliable.',
        aria: 'Bar chart. Assets under management 452 million pounds in January 2025, 967 million in December 2025, up 113.7 percent.'
      },
      rag: {
        series: ['Baseline', 'Enhanced'],
        max: null,
        metrics: [
          { name: 'Relevance',    a: { v: 0.70, t: '0.70' }, b: { v: 0.84, t: '0.84' } },
          { name: 'Correctness',  a: { v: 4.5, t: '4.5' },   b: { v: 4.5, t: '4.5' } },
          { name: 'Completeness', a: { v: 4.9, t: '4.9' },   b: { v: 4.8, t: '4.8' } },
          { name: 'Grounding',    a: { v: 3.8, t: '3.8' },   b: { v: 3.1, t: '3.1' } }
        ],
        caption: 'Judge scores are 1–5; relevance is 0–1 (keyword-overlap heuristic). Grounding fell because the judge saw only a truncated context excerpt.',
        aria: 'Grouped bar chart, Baseline versus Enhanced. Retrieval relevance 0.70 to 0.84. Correctness 4.5 and 4.5. Completeness 4.9 to 4.8. Grounding 3.8 to 3.1.'
      }
    };

    function render(container, cfg) {
      const W = 320, H = 180, padT = 22, padB = 30, padL = 6, padR = 6;
      const plotW = W - padL - padR, plotH = H - padT - padB, baseY = padT + plotH;
      const groupW = plotW / cfg.metrics.length;
      const barW = Math.min(34, groupW * 0.3);
      const gap = Math.max(4, barW * 0.3);
      let bars = '', labels = '', i = 0;
      cfg.metrics.forEach((m, gi) => {
        const mMax = cfg.max != null ? cfg.max : Math.max(m.a.v, m.b ? m.b.v : 0);
        const cx = padL + groupW * gi + groupW / 2;
        [['a', 'c-s1', cx - gap / 2 - barW], ['b', 'c-s2', cx + gap / 2]].forEach(([k, cls, x]) => {
          const d = m[k];
          if (!d) return;
          const h = mMax ? (d.v / mMax) * plotH : 0;
          const y = baseY - h;
          bars += '<rect class="bar ' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
            '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) +
            '" rx="1.5" style="transition-delay:' + (i * 90) + 'ms"/>';
          labels += '<text class="c-val" x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) +
            '" text-anchor="middle">' + d.t + '</text>';
          i++;
        });
        labels += '<text class="c-metric" x="' + cx.toFixed(1) + '" y="' + (baseY + 14).toFixed(1) +
          '" text-anchor="middle">' + m.name + '</text>';
      });
      const svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + cfg.aria +
        '" preserveAspectRatio="xMidYMid meet"><line class="c-axis" x1="' + padL + '" y1="' + baseY +
        '" x2="' + (W - padR) + '" y2="' + baseY + '"/>' + bars + labels + '</svg>';
      const legend = '<div class="c-legend">' + cfg.series.map((s, idx) =>
        '<span class="key"><span class="sw c-s' + (idx + 1) + '"></span>' + s + '</span>').join('') + '</div>';
      const delta = cfg.delta ? '<div class="c-delta">' + cfg.delta + '</div>' : '';
      const cap = cfg.caption ? '<figcaption>' + cfg.caption + '</figcaption>' : '';
      container.innerHTML = '<figure>' + legend + svg + delta + cap + '</figure>';
    }

    const draw = (el) => {
      const cfg = CHARTS[el.dataset.chart];
      if (!cfg) return;
      render(el, cfg);
      if (!reduce) {
        el.classList.add('anim');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
      }
    };

    const containers = document.querySelectorAll('[data-chart]');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => { if (e.isIntersecting) { draw(e.target); o.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
      containers.forEach(el => obs.observe(el));
    } else {
      containers.forEach(draw);
    }
  })();

  // Phase 2 — credit-risk policy explorer (radio-group so keyboard works
  // natively); Phase 3 — impact-ribbon count-up on scroll. Both honour
  // prefers-reduced-motion by jumping straight to final values.
  (function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const easeOut = p => 1 - Math.pow(1 - p, 3);

    // ---- Phase 2: policy explorer ----
    const pt = document.querySelector('.policy-toggle');
    if (pt) {
      const DATA = {
        a: { approval: 65.74, def: 12.79, profit: null },   // only the +£298 delta is known
        b: { approval: 95.36, def: 16.05, profit: 298 }
      };
      const approvalEl = pt.querySelector('[data-stat="approval"]');
      const defaultEl  = pt.querySelector('[data-stat="default"]');
      const profitEl   = pt.querySelector('[data-stat="profit"]');
      const clusters   = pt.querySelector('[data-clusters]');
      const labels     = pt.querySelectorAll('.pt-opt');
      const radios     = pt.querySelectorAll('input[name="creditPolicy"]');
      const pct = v => v.toFixed(1) + '%';
      const gbp = v => '+£' + Math.round(v);
      const anim = new Map();

      function animate(el, to, fmt) {
        const prev = anim.get(el);
        if (prev && prev.raf) cancelAnimationFrame(prev.raf);
        const from = prev ? prev.cur : to;
        if (reduce) { el.textContent = fmt(to); anim.set(el, { cur: to, raf: 0 }); return; }
        const t0 = performance.now(), dur = 600, state = { cur: from, raf: 0 };
        anim.set(el, state);
        (function frame(now) {
          const p = Math.min(1, (now - t0) / dur), v = from + (to - from) * easeOut(p);
          state.cur = v; el.textContent = fmt(v);
          if (p < 1) state.raf = requestAnimationFrame(frame);
          else { state.cur = to; el.textContent = fmt(to); }
        })(t0);
      }

      function setPolicy(p) {
        const d = DATA[p];
        animate(approvalEl, d.approval, pct);
        animate(defaultEl, d.def, pct);
        if (d.profit == null) {
          const prev = anim.get(profitEl);
          if (prev && prev.raf) cancelAnimationFrame(prev.raf);
          anim.delete(profitEl);
          profitEl.textContent = 'Baseline';
        } else {
          anim.set(profitEl, { cur: 0, raf: 0 }); // count up from zero to the delta
          animate(profitEl, d.profit, gbp);
        }
        clusters.hidden = (p !== 'b');
        labels.forEach(l => l.classList.toggle('is-on', l.querySelector('input').value === p));
      }

      radios.forEach(r => r.addEventListener('change', () => { if (r.checked) setPolicy(r.value); }));

      // Initial state — reflect the checked radio with no animation.
      const init = [...radios].find(r => r.checked) || radios[0];
      const d0 = DATA[init.value];
      approvalEl.textContent = pct(d0.approval); anim.set(approvalEl, { cur: d0.approval, raf: 0 });
      defaultEl.textContent = pct(d0.def);       anim.set(defaultEl, { cur: d0.def, raf: 0 });
      profitEl.textContent = d0.profit == null ? 'Baseline' : gbp(d0.profit);
      clusters.hidden = (init.value !== 'b');
      labels.forEach(l => l.classList.toggle('is-on', l.querySelector('input').value === init.value));
    }

    // ---- Phase 3: impact-ribbon count-up ----
    const vals = document.querySelectorAll('.impact-ribbon .metric .val');
    const numeric = [...vals].map(el => {
      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      return m ? { el, target: parseInt(m[1], 10), suffix: m[2] } : null;
    }).filter(Boolean);

    if (numeric.length && !reduce && 'IntersectionObserver' in window) {
      const ribbon = document.querySelector('.impact-ribbon');
      const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          o.unobserve(e.target);
          numeric.forEach(n => {
            const t0 = performance.now(), dur = 900;
            (function frame(now) {
              const p = Math.min(1, (now - t0) / dur);
              n.el.textContent = Math.round(n.target * easeOut(p)) + n.suffix;
              if (p < 1) requestAnimationFrame(frame);
              else n.el.textContent = n.target + n.suffix;
            })(t0);
          });
        });
      }, { threshold: 0.4 });
      obs.observe(ribbon);
    }
  })();

  // Phase 9 — live GitHub repo stats on each project that links to a repo.
  // Unauthenticated REST API, cached in localStorage for 3 hours to respect
  // the 60/hr rate limit. Fails silently (element stays hidden) on any error.
  (function () {
    const links = document.querySelectorAll('#projects .proj-links a.proj-btn[href*="github.com/"]');
    if (!links.length) return;
    const TTL = 3 * 60 * 60 * 1000;
    const fmtDate = iso => {
      try { return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); }
      catch (e) { return ''; }
    };
    links.forEach(a => {
      const m = a.getAttribute('href').match(/github\.com\/([^/]+)\/([^/?#]+)/);
      if (!m) return;
      const owner = m[1], repo = m[2], key = 'gh:' + owner + '/' + repo;
      const span = document.createElement('span');
      span.className = 'gh-stats';
      span.hidden = true;
      a.parentNode.appendChild(span);

      const paint = d => {
        if (!d) return;
        const parts = ['<span class="gh-item" title="Stars">★ ' + (d.stargazers_count || 0) + '</span>'];
        if (d.language) parts.push('<span class="gh-item"><span class="gh-dot" aria-hidden="true"></span>' + d.language + '</span>');
        if (d.pushed_at) parts.push('<span class="gh-item">Updated ' + fmtDate(d.pushed_at) + '</span>');
        span.innerHTML = parts.join('');
        span.hidden = false;
      };

      let cached = null;
      try {
        const raw = localStorage.getItem(key);
        if (raw) { const o = JSON.parse(raw); if (Date.now() - o.t < TTL) cached = o.d; }
      } catch (e) {}
      if (cached) { paint(cached); return; }

      fetch('https://api.github.com/repos/' + owner + '/' + repo, { headers: { 'Accept': 'application/vnd.github+json' } })
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(d => {
          const slim = { stargazers_count: d.stargazers_count, language: d.language, pushed_at: d.pushed_at };
          try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) {}
          paint(slim);
        })
        .catch(() => { /* unreachable or rate-limited: leave hidden */ });
    });
  })();
