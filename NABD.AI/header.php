<head>
  <meta charset="UTF-8" />
  <title>FASTWORKS.AI – Saudi-Born Sovereign AI & Digital Transformation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="FASTWORKS.AI is a Saudi-born AI and digital transformation company dedicated to accelerating Vision 2030 and building the Kingdom’s sovereign AI capabilities."
  />

  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <style>
    :root {
      --bg-main: #020617;          /* deep navy */
      --bg-elevated: #02081f;
      --bg-soft: #050b24;
      --accent-gold: #f7c65c;
      --accent-green: #00b894;
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --border-subtle: #1f2933;
      --pillars-card-bg: #050816;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.45);
      --max-width: 1200px;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at top left, #0b1220 0, #020617 55%, #010414 100%);
      color: var(--text-main);
      scroll-behavior: smooth;
    }

    body {
      line-height: 1.6;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      display: block;
    }

    /* Layout helpers */
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      width: 100%;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Header */
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(16px);
      background: linear-gradient(
        to bottom,
        rgba(2, 6, 23, 0.96),
        rgba(2, 6, 23, 0.8),
        transparent
      );
      border-bottom: 1px solid rgba(15, 23, 42, 0.9);
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 0;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: radial-gradient(circle at 25% 0, #22c55e, #0ea5e9, #1d2333);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px rgba(34, 197, 94, 0.45);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
    }

    .nav-title {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .nav-title-main {
      font-weight: 600;
      letter-spacing: 0.08em;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .nav-title-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.9rem;
    }

    .nav-links a {
      color: var(--text-muted);
      transition: color 0.2s ease, opacity 0.2s ease;
      opacity: 0.9;
    }

    .nav-links a:hover {
      color: var(--accent-gold);
      opacity: 1;
    }

    .nav-cta {
      padding: 0.45rem 0.95rem;
      border-radius: 999px;
      border: 1px solid rgba(248, 250, 252, 0.08);
      background: radial-gradient(circle at top left, rgba(250, 204, 21, 0.16), rgba(15,23,42,0.9));
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      white-space: nowrap;
    }

    .nav-cta span.dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
    }

    .nav-toggle {
      display: none;
      border: none;
      outline: none;
      background: none;
      color: var(--text-main);
      cursor: pointer;
    }

    /* Hero */
    .hero {
      padding: 3.5rem 0 4rem;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      gap: 2.5rem;
      align-items: center;
    }

    .hero-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-bottom: 1.6rem;
    }

    .hero-chip {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      font-size: 0.75rem;
      padding: 0.28rem 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-muted);
      background: radial-gradient(circle at top left, rgba(34,197,94,0.18), rgba(15,23,42,0.9));
    }

    .hero-chip span.pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--accent-gold);
    }

    .hero-heading {
      font-size: clamp(2.25rem, 3.6vw, 3rem);
      line-height: 1.1;
      font-weight: 700;
      margin-bottom: 0.85rem;
    }

    .hero-heading span.accent {
      background: linear-gradient(120deg, #fbbf24, #f97316, #22c55e);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-subtitle {
      font-size: 0.98rem;
      color: var(--text-muted);
      max-width: 32rem;
      margin-bottom: 1.8rem;
    }

    .hero-subtitle strong {
      color: #e5e7eb;
      font-weight: 500;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-bottom: 1.7rem;
    }

    .btn-primary {
      padding: 0.85rem 1.6rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #fbbf24, #f97316);
      color: #020617;
      font-weight: 600;
      font-size: 0.92rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 20px 40px rgba(248, 181, 8, 0.3);
    }

    .btn-outline {
      padding: 0.8rem 1.5rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.7);
      background: rgba(15, 23, 42, 0.8);
      color: #e5e7eb;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-primary:hover,
    .btn-outline:hover {
      filter: brightness(1.05);
    }

    .hero-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 1.7rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .hero-metric {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .hero-metric strong {
      font-size: 1.4rem;
      font-weight: 600;
      color: #e5e7eb;
    }

    /* Hero right panel */
    .hero-panel {
      background: radial-gradient(circle at 0 0, #0ea5e9, transparent),
                  radial-gradient(circle at 100% 100%, #22c55e, transparent),
                  var(--bg-elevated);
      border-radius: 28px;
      border: 1px solid rgba(148, 163, 184, 0.3);
      padding: 1.6rem 1.5rem 1.4rem;
      box-shadow: var(--shadow-soft);
      position: relative;
      overflow: hidden;
    }

    .hero-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .hero-panel-title {
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #e5e7eb;
    }

    .hero-panel-badge {
      font-size: 0.7rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      border: 1px solid rgba(248, 250, 252, 0.28);
      background: rgba(15, 23, 42, 0.75);
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: var(--text-muted);
    }

    .hero-panel-badge span-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #22c55e;
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
      font-size: 0.8rem;
    }

    .pillar-card {
      background: rgba(15, 23, 42, 0.94);
      border-radius: 16px;
      padding: 0.75rem 0.8rem;
      border: 1px solid rgba(55, 65, 81, 0.8);
    }

    .pillar-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.16em;
      margin-bottom: 0.25rem;
    }

    .pillar-title {
      font-size: 0.86rem;
      font-weight: 600;
      margin-bottom: 0.23rem;
    }

    .pillar-desc {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .hero-panel-footer {
      margin-top: 1rem;
      border-top: 1px dashed rgba(148, 163, 184, 0.4);
      padding-top: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .hero-panel-footer strong {
      color: #e5e7eb;
    }

    /* Section basics */
    section {
      padding: 3.5rem 0;
    }

    .section-header {
      max-width: 640px;
      margin-bottom: 2rem;
    }

    .section-kicker {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--accent-gold);
      margin-bottom: 0.3rem;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }

    .section-subtitle {
      font-size: 0.96rem;
      color: var(--text-muted);
    }

    /* About / Vision 2030 */
    .about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
      gap: 2.4rem;
    }

    .about-card {
      background: var(--bg-soft);
      border-radius: var(--radius-lg);
      padding: 1.6rem 1.5rem;
      border: 1px solid var(--border-subtle);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
    }

    .badge-inline {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .badge-inline span {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--accent-green);
    }

    .about-card h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }

    .about-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0.25rem 0;
    }

    .about-list {
      list-style: none;
      padding: 0;
      margin: 0.8rem 0 0;
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .about-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.45rem;
    }

    .about-list li::before {
      content: '';
      margin-top: 0.35rem;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--accent-gold);
      flex-shrink: 0;
    }

    /* Pillars section */
    .pillars-section {
      background: radial-gradient(circle at top, #02081f, #020617);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .pillars-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      gap: 2.2rem;
      align-items: flex-start;
    }

    .pillars-cards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .pillars-card {
      background: var(--pillars-card-bg);
      border-radius: var(--radius-lg);
      padding: 1rem;
      border: 1px solid var(--border-subtle);
      position: relative;
      overflow: hidden;
    }

    .pillars-card-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--text-muted);
      margin-bottom: 0.3rem;
    }

    .pillars-card h3 {
      margin: 0 0 0.3rem;
      font-size: 0.98rem;
    }

    .pillars-card p {
      margin: 0;
      font-size: 0.84rem;
      color: var(--text-muted);
    }

    .pillars-card-label {
      position: absolute;
      right: 0.8rem;
      bottom: 0.7rem;
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(148, 163, 184, 0.8);
    }

    .pillars-highlight {
      background: var(--bg-soft);
      border-radius: var(--radius-xl);
      padding: 1.5rem 1.4rem;
      border: 1px solid var(--border-subtle);
    }

    .pillars-highlight h3 {
      margin-top: 0;
      margin-bottom: 0.6rem;
      font-size: 1rem;
    }

    .pillars-highlight p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 0.8rem;
    }

    .pillars-highlight-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.7rem 1.1rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .pillars-highlight-item strong {
      display: block;
      font-size: 0.86rem;
      color: #e5e7eb;
      margin-bottom: 0.15rem;
    }

    /* Use-cases / audiences */
    .audiences-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .audience-card {
      background: var(--bg-soft);
      border-radius: var(--radius-lg);
      padding: 1rem;
      border: 1px solid var(--border-subtle);
      font-size: 0.85rem;
    }

    .audience-card h3 {
      margin: 0 0 0.45rem;
      font-size: 0.92rem;
    }

    .audience-card p {
      margin: 0 0 0.6rem;
      color: var(--text-muted);
    }

    .audience-list {
      list-style: none;
      padding: 0;
      margin: 0;
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .audience-list li {
      margin-bottom: 0.3rem;
    }

    /* Why section */
    .why-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 2.2rem;
      align-items: center;
    }

    .why-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .why-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.55rem;
      margin-bottom: 0.5rem;
    }

    .why-icon {
      margin-top: 0.19rem;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      border: 1px solid rgba(248, 250, 252, 0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: var(--accent-green);
    }

    .why-card {
      background: var(--bg-soft);
      border-radius: var(--radius-xl);
      padding: 1.5rem 1.4rem;
      border: 1px solid var(--border-subtle);
      font-size: 0.86rem;
      color: var(--text-muted);
    }

    .why-card-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.9rem;
      font-size: 0.8rem;
    }

    .why-card-col strong {
      display: block;
      color: #e5e7eb;
      margin-bottom: 0.1rem;
      font-size: 0.9rem;
    }

    /* Process / engagement */
    .process-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 2.1rem;
      align-items: flex-start;
    }

    .process-steps {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
      font-size: 0.84rem;
    }

    .process-step {
      background: var(--bg-soft);
      border-radius: var(--radius-lg);
      padding: 0.85rem 0.9rem;
      border: 1px solid var(--border-subtle);
    }

    .process-step-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--text-muted);
      margin-bottom: 0.2rem;
    }

    .process-step h3 {
      font-size: 0.9rem;
      margin: 0 0 0.2rem;
    }

    .process-step p {
      margin: 0;
      color: var(--text-muted);
    }

    .process-note {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.85rem;
    }

    .process-cta-box {
      background: var(--bg-soft);
      border-radius: var(--radius-xl);
      padding: 1.5rem 1.4rem;
      border: 1px solid var(--border-subtle);
    }

    .process-cta-box h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .process-cta-box p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 0.9rem;
    }

    /* Contact */
    .contact-section {
      border-top: 1px solid var(--border-subtle);
      background: radial-gradient(circle at bottom right, #0b1120, #020617);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 2.4rem;
      align-items: flex-start;
    }

    .contact-details {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .contact-details p {
      margin: 0 0 0.7rem;
    }

    .contact-list {
      list-style: none;
      padding: 0;
      margin: 0.6rem 0 0;
      font-size: 0.86rem;
      color: var(--text-muted);
    }

    .contact-list li {
      margin-bottom: 0.35rem;
    }

    .contact-form {
      background: var(--bg-soft);
      border-radius: var(--radius-xl);
      padding: 1.5rem 1.4rem;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-soft);
    }

    .contact-form h3 {
      margin-top: 0;
      margin-bottom: 0.7rem;
      font-size: 1rem;
    }

    .form-row {
      display: flex;
      gap: 0.8rem;
      margin-bottom: 0.7rem;
    }

    .form-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.82rem;
    }

    .form-field label {
      color: var(--text-muted);
    }

    .form-field input,
    .form-field textarea,
    .form-field select {
      background: #020617;
      border-radius: 10px;
      border: 1px solid var(--border-subtle);
      padding: 0.5rem 0.6rem;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.85rem;
      outline: none;
    }

    .form-field input:focus,
    .form-field textarea:focus,
    .form-field select:focus {
      border-color: var(--accent-gold);
      box-shadow: 0 0 0 1px rgba(248, 181, 8, 0.6);
    }

    .form-field textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-hint {
      font-size: 0.76rem;
      color: var(--text-muted);
      margin-bottom: 0.7rem;
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border-subtle);
      padding: 1.5rem 0 1.8rem;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .footer-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      justify-content: space-between;
      align-items: center;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-links a {
      color: var(--text-muted);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero-grid,
      .about-grid,
      .pillars-layout,
      .audiences-grid,
      .why-grid,
      .process-grid,
      .contact-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .audiences-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        position: fixed;
        inset: 56px 0 auto 0;
        padding: 0.9rem 1.5rem 1.1rem;
        background: rgba(2, 6, 23, 0.98);
        border-bottom: 1px solid rgba(15, 23, 42, 0.9);
        flex-direction: column;
        align-items: flex-start;
        transform: translateY(-120%);
        transition: transform 0.2s ease;
      }

      .nav-links.open {
        transform: translateY(0);
      }

      .nav-toggle {
        display: inline-flex;
      }

      .hero {
        padding-top: 2.3rem;
      }

      .hero-panel {
        order: -1;
      }

      .pillars-cards {
        grid-template-columns: minmax(0, 1fr);
      }

      .audiences-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .process-steps {
        grid-template-columns: minmax(0, 1fr);
      }

      .hero-metrics {
        gap: 1rem;
      }

      .footer-row {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 480px) {
      .hero-heading {
        font-size: 2rem;
      }
    }
  </style>
</head><header>
    <div class="container nav">
      <div class="nav-left">
        <div class="logo-mark">FW</div>
        <div class="nav-title">
          <div class="nav-title-main">FASTWORKS.AI</div>
          <div class="nav-title-sub">Saudi-Born Sovereign AI</div>
        </div>
      </div>

      <button class="nav-toggle" aria-label="Toggle navigation">
        ☰
      </button>

      <nav class="nav-links" id="nav-links">
        <a href="#about">About</a>
        <a href="#pillars">Five Pillars</a>
        <a href="#audiences">Who We Serve</a>
        <a href="#vision">Vision 2030</a>
        <a href="#contact">Contact</a>
        <button class="nav-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
          <span class="dot"></span>
          Book a strategy session
        </button>
      </nav>
    </div>
  </header><main>
