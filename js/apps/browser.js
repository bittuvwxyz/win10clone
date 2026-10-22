/**
 * Windows 10 Microsoft Edge Browser Application
 */

class EdgeBrowserApp {
  static open(initialUrl = 'https://www.bing.com') {
    const winId = 'edge_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Microsoft Edge',
      icon: 'edge',
      width: 900,
      height: 580,
      minWidth: 480,
      minHeight: 340,
      content: ''
    });

    const instance = new EdgeBrowserApp(win, initialUrl);
    instance.render();
    return instance;
  }

  constructor(winData, initialUrl) {
    this.winData = winData;
    this.currentUrl = initialUrl;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="edge-container">
        <!-- Tabs Bar -->
        <div class="edge-tabs-bar">
          <div class="edge-tab active">
            <span class="tab-icon">${WinIcons.edge}</span>
            <span class="tab-title">New Tab</span>
            <span class="tab-close">✕</span>
          </div>
          <button class="edge-new-tab-btn" title="New Tab">+</button>
        </div>

        <!-- Navigation Bar -->
        <div class="edge-nav-bar">
          <button class="edge-nav-btn" id="edge-back" title="Back">${WinIcons.navBack}</button>
          <button class="edge-nav-btn" id="edge-fwd" title="Forward">${WinIcons.navForward}</button>
          <button class="edge-nav-btn" id="edge-refresh" title="Refresh">${WinIcons.refresh}</button>
          <div class="edge-address-box">
            <span class="address-lock">🔒</span>
            <input type="text" class="edge-url-input" id="edge-url" value="${this.currentUrl}" spellcheck="false" />
          </div>
          <button class="edge-nav-btn" id="edge-favorites" title="Favorites">★</button>
        </div>

        <!-- Favorites Bar -->
        <div class="edge-favorites-bar">
          <div class="fav-item" data-url="https://www.google.com"><span class="fav-icon">🌐</span> Google</div>
          <div class="fav-item" data-url="https://www.wikipedia.org"><span class="fav-icon">📖</span> Wikipedia</div>
          <div class="fav-item" data-url="https://github.com"><span class="fav-icon">🐙</span> GitHub</div>
          <div class="fav-item" data-url="https://developer.mozilla.org"><span class="fav-icon">📑</span> MDN Web</div>
        </div>

        <!-- Page View -->
        <div class="edge-viewport" id="edge-viewport">
          ${this.renderStartPage()}
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  renderStartPage() {
    return `
      <div class="edge-start-page">
        <div class="edge-logo-hero">
          <div class="edge-hero-icon">${WinIcons.edge}</div>
          <h1 class="edge-hero-title">Microsoft Edge</h1>
        </div>

        <div class="edge-search-center">
          <input type="text" class="edge-search-input" id="edge-bing-search" placeholder="Search the web or type a URL" />
          <button class="edge-search-submit" id="edge-search-go">${WinIcons.search}</button>
        </div>

        <!-- Quick Links -->
        <div class="edge-quick-links">
          <div class="quick-link-tile" data-url="https://www.wikipedia.org">
            <div class="link-tile-badge">W</div>
            <div class="link-tile-name">Wikipedia</div>
          </div>
          <div class="quick-link-tile" data-url="https://github.com">
            <div class="link-tile-badge">GH</div>
            <div class="link-tile-name">GitHub</div>
          </div>
          <div class="quick-link-tile" data-url="https://news.ycombinator.com">
            <div class="link-tile-badge">Y</div>
            <div class="link-tile-name">Hacker News</div>
          </div>
          <div class="quick-link-tile" data-url="https://developer.mozilla.org">
            <div class="link-tile-badge">MDN</div>
            <div class="link-tile-name">MDN Docs</div>
          </div>
        </div>

        <!-- Simulated News Cards -->
        <div class="edge-news-feed">
          <div class="news-card">
            <div class="news-category">TECHNOLOGY</div>
            <div class="news-title">Next-Generation Web Interfaces Bring Authentic Desktop Feel to Browsers</div>
            <div class="news-meta">TechWire • 20m ago</div>
          </div>
          <div class="news-card">
            <div class="news-category">SCIENCE</div>
            <div class="news-title">James Webb Telescope Discovers Atmospheric Water Vapor on Distant Exoplanet</div>
            <div class="news-meta">Space Daily • 1h ago</div>
          </div>
          <div class="news-card">
            <div class="news-category">WEATHER</div>
            <div class="news-title">Clear skies and pleasant breeze expected throughout the weekend</div>
            <div class="news-meta">Weather Hub • 2h ago</div>
          </div>
        </div>
      </div>
    `;
  }

  renderSearchResultPage(query) {
    return `
      <div class="edge-search-results">
        <div class="results-header">Search results for: <strong>${this.escapeHtml(query)}</strong></div>
        <div class="result-entry">
          <a class="result-title" href="#">${this.escapeHtml(query)} - Official Overview</a>
          <div class="result-cite">https://en.wikipedia.org/wiki/${encodeURIComponent(query)}</div>
          <div class="result-snippet">Comprehensive encyclopedia article, specifications, history, technical background, and related documentation on ${this.escapeHtml(query)}.</div>
        </div>
        <div class="result-entry">
          <a class="result-title" href="#">Getting Started with ${this.escapeHtml(query)}</a>
          <div class="result-cite">https://developer.example.com/docs/${encodeURIComponent(query)}</div>
          <div class="result-snippet">A complete developer guide, APIs, design patterns, and interactive examples to build next-generation applications.</div>
        </div>
        <div class="result-entry">
          <a class="result-title" href="#">Latest News and Updates on ${this.escapeHtml(query)}</a>
          <div class="result-cite">https://news.example.com/topic/${encodeURIComponent(query)}</div>
          <div class="result-snippet">Read the breaking news, community discussions, release notes, and future roadmap updates.</div>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  attachEvents(body) {
    const urlInput = body.querySelector('#edge-url');
    const viewport = body.querySelector('#edge-viewport');
    const searchInput = body.querySelector('#edge-bing-search');
    const searchGo = body.querySelector('#edge-search-go');

    const handleSearch = (q) => {
      if (!q) return;
      if (q.startsWith('http://') || q.startsWith('https://')) {
        urlInput.value = q;
        viewport.innerHTML = `<div class="edge-simulated-webpage"><h2>Visiting: ${this.escapeHtml(q)}</h2><p>Simulated web environment for secure browsing.</p></div>`;
      } else {
        urlInput.value = `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
        viewport.innerHTML = this.renderSearchResultPage(q);
      }
    };

    if (searchGo && searchInput) {
      searchGo.addEventListener('click', () => handleSearch(searchInput.value.trim()));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch(searchInput.value.trim());
      });
    }

    if (urlInput) {
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch(urlInput.value.trim());
        }
      });
    }

    body.querySelectorAll('.fav-item, .quick-link-tile').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) {
          urlInput.value = url;
          const query = item.textContent.trim();
          viewport.innerHTML = this.renderSearchResultPage(query);
        }
      });
    });

    const refreshBtn = body.querySelector('#edge-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        viewport.innerHTML = this.renderStartPage();
        this.attachEvents(body);
      });
    }
  }
}

window.EdgeBrowserApp = EdgeBrowserApp;
