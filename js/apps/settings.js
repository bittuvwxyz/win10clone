/**
 * Windows 10 Settings Application
 */

class SettingsApp {
  static open(initialCategory = 'home') {
    const winId = 'settings_main';
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Settings',
      icon: 'settings',
      width: 860,
      height: 560,
      minWidth: 500,
      minHeight: 380,
      content: ''
    });

    const instance = new SettingsApp(win, initialCategory);
    instance.render();
    return instance;
  }

  constructor(winData, currentCategory) {
    this.winData = winData;
    this.currentCategory = currentCategory;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');

    if (this.currentCategory === 'home') {
      this.renderHome(body);
    } else if (this.currentCategory === 'personalization') {
      this.renderPersonalization(body);
    } else if (this.currentCategory === 'system') {
      this.renderSystem(body);
    } else if (this.currentCategory === 'network') {
      this.renderNetwork(body);
    }
  }

  renderHome(body) {
    body.innerHTML = `
      <div class="settings-home">
        <!-- User Header Banner -->
        <div class="settings-header-banner">
          <div class="settings-user-info">
            <div class="settings-avatar">${WinIcons.user}</div>
            <div class="settings-user-meta">
              <div class="user-name">Windows User</div>
              <div class="user-badge">Local Account, Administrator</div>
            </div>
          </div>
          <div class="settings-top-status">
            <div class="top-status-pill">
              <span class="pill-icon">${WinIcons.refresh}</span>
              <div class="pill-text">
                <div class="pill-title">Windows Update</div>
                <div class="pill-sub">You're up to date</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Box -->
        <div class="settings-search-wrapper">
          <input type="text" class="settings-search-input" placeholder="Find a setting" />
          <span class="settings-search-icon">${WinIcons.search}</span>
        </div>

        <!-- Categories Grid -->
        <div class="settings-grid">
          <div class="setting-tile" data-cat="system">
            <div class="tile-icon">${WinIcons.thisPC}</div>
            <div class="tile-title">System</div>
            <div class="tile-desc">Display, sound, notifications, power, about</div>
          </div>

          <div class="setting-tile" data-cat="devices">
            <div class="tile-icon">${WinIcons.bluetooth}</div>
            <div class="tile-title">Devices</div>
            <div class="tile-desc">Bluetooth, printers, mouse</div>
          </div>

          <div class="setting-tile" data-cat="network">
            <div class="tile-icon">${WinIcons.wifi}</div>
            <div class="tile-title">Network & Internet</div>
            <div class="tile-desc">Wi-Fi, airplane mode, VPN</div>
          </div>

          <div class="setting-tile" data-cat="personalization">
            <div class="tile-icon">${WinIcons.photos}</div>
            <div class="tile-title">Personalization</div>
            <div class="tile-desc">Background, lock screen, colors</div>
          </div>

          <div class="setting-tile" data-cat="apps">
            <div class="tile-icon">${WinIcons.startFlag}</div>
            <div class="tile-title">Apps</div>
            <div class="tile-desc">Uninstall, defaults, optional features</div>
          </div>

          <div class="setting-tile" data-cat="accounts">
            <div class="tile-icon">${WinIcons.user}</div>
            <div class="tile-title">Accounts</div>
            <div class="tile-desc">Your accounts, email, sync, work, other people</div>
          </div>

          <div class="setting-tile" data-cat="time">
            <div class="tile-icon">${WinIcons.sun}</div>
            <div class="tile-title">Time & Language</div>
            <div class="tile-desc">Speech, region, date</div>
          </div>

          <div class="setting-tile" data-cat="update">
            <div class="tile-icon">${WinIcons.settings}</div>
            <div class="tile-title">Update & Security</div>
            <div class="tile-desc">Windows Update, recovery, backup</div>
          </div>
        </div>
      </div>
    `;

    // Click handler for tiles
    body.querySelectorAll('.setting-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const cat = tile.dataset.cat;
        if (cat === 'personalization' || cat === 'system' || cat === 'network') {
          this.currentCategory = cat;
          this.render();
        }
      });
    });
  }

  renderPersonalization(body) {
    const curWall = WinState.theme.wallpaper;
    const curAccent = WinState.theme.accentColor;

    body.innerHTML = `
      <div class="settings-subpage">
        <!-- Sidebar Navigation -->
        <div class="subpage-sidebar">
          <button class="subpage-back-btn" id="set-back-home">${WinIcons.navBack} <span>Home</span></button>
          <div class="subpage-category-title">Personalization</div>
          <div class="subpage-nav-item active">Background</div>
          <div class="subpage-nav-item">Colors</div>
          <div class="subpage-nav-item">Lock screen</div>
          <div class="subpage-nav-item">Themes</div>
          <div class="subpage-nav-item">Taskbar</div>
        </div>

        <!-- Main Detail -->
        <div class="subpage-content">
          <h2 class="subpage-heading">Background</h2>

          <!-- Wallpaper Preview Box -->
          <div class="wallpaper-preview-box">
            <div class="wallpaper-preview-canvas" id="wp-preview-thumb" data-theme="${curWall}">
              <div class="preview-mock-window"></div>
              <div class="preview-mock-taskbar"></div>
            </div>
          </div>

          <div class="setting-section-label">Choose your picture</div>
          <div class="wallpaper-picker-grid">
            <div class="wall-choice-card ${curWall === 'hero' ? 'active' : ''}" data-wall="hero" title="Windows 10 Hero (Classic)">
              <div class="wall-choice-thumb wall-hero"></div>
              <div class="wall-choice-name">Windows 10 Hero</div>
            </div>
            <div class="wall-choice-card ${curWall === 'light' ? 'active' : ''}" data-wall="light" title="Windows Light Fluent">
              <div class="wall-choice-thumb wall-light"></div>
              <div class="wall-choice-name">Windows Light</div>
            </div>
            <div class="wall-choice-card ${curWall === 'scenic' ? 'active' : ''}" data-wall="scenic" title="Windows Spotlight Ocean">
              <div class="wall-choice-thumb wall-scenic"></div>
              <div class="wall-choice-name">Spotlight Beach</div>
            </div>
            <div class="wall-choice-card ${curWall === 'carbon' ? 'active' : ''}" data-wall="carbon" title="Dark Minimal Carbon">
              <div class="wall-choice-thumb wall-carbon"></div>
              <div class="wall-choice-name">Dark Minimal</div>
            </div>
          </div>

          <div class="setting-divider"></div>
          <div class="setting-section-label">Windows Accent Color</div>
          <div class="accent-color-picker">
            <button class="accent-swatch ${curAccent === '#0078D7' ? 'selected' : ''}" data-color="#0078D7" style="background:#0078D7;" title="Windows Blue"></button>
            <button class="accent-swatch ${curAccent === '#0063B1' ? 'selected' : ''}" data-color="#0063B1" style="background:#0063B1;" title="Cobalt"></button>
            <button class="accent-swatch ${curAccent === '#107C41' ? 'selected' : ''}" data-color="#107C41" style="background:#107C41;" title="Emerald"></button>
            <button class="accent-swatch ${curAccent === '#E81123' ? 'selected' : ''}" data-color="#E81123" style="background:#E81123;" title="Crimson"></button>
            <button class="accent-swatch ${curAccent === '#881798' ? 'selected' : ''}" data-color="#881798" style="background:#881798;" title="Violet"></button>
            <button class="accent-swatch ${curAccent === '#FF8C00' ? 'selected' : ''}" data-color="#FF8C00" style="background:#FF8C00;" title="Amber"></button>
          </div>
        </div>
      </div>
    `;

    // Back button
    body.querySelector('#set-back-home').addEventListener('click', () => {
      this.currentCategory = 'home';
      this.render();
    });

    // Wallpaper selection
    body.querySelectorAll('.wall-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const wall = card.dataset.wall;
        WinState.theme.wallpaper = wall;
        if (window.DesktopManager) window.DesktopManager.applyWallpaper(wall);

        body.querySelectorAll('.wall-choice-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const preview = body.querySelector('#wp-preview-thumb');
        if (preview) preview.dataset.theme = wall;
      });
    });

    // Accent color selection
    body.querySelectorAll('.accent-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        WinState.theme.accentColor = color;
        document.documentElement.style.setProperty('--win-accent', color);

        body.querySelectorAll('.accent-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
      });
    });
  }

  renderSystem(body) {
    body.innerHTML = `
      <div class="settings-subpage">
        <div class="subpage-sidebar">
          <button class="subpage-back-btn" id="set-back-home">${WinIcons.navBack} <span>Home</span></button>
          <div class="subpage-category-title">System</div>
          <div class="subpage-nav-item">Display</div>
          <div class="subpage-nav-item">Sound</div>
          <div class="subpage-nav-item">Notifications & actions</div>
          <div class="subpage-nav-item">Power & sleep</div>
          <div class="subpage-nav-item active">About</div>
        </div>

        <div class="subpage-content">
          <h2 class="subpage-heading">About your PC</h2>

          <div class="specs-card">
            <div class="specs-title">Device specifications</div>
            <div class="specs-row"><span class="spec-label">Device name:</span> <span class="spec-val">DESKTOP-WIN10-PRO</span></div>
            <div class="specs-row"><span class="spec-label">Processor:</span> <span class="spec-val">Intel(R) Core(TM) i9-13900K @ 3.00 GHz</span></div>
            <div class="specs-row"><span class="spec-label">Installed RAM:</span> <span class="spec-val">32.0 GB (31.8 GB usable)</span></div>
            <div class="specs-row"><span class="spec-label">System type:</span> <span class="spec-val">64-bit operating system, x64-based processor</span></div>
            <div class="specs-row"><span class="spec-label">Pen and touch:</span> <span class="spec-val">No pen or touch input is available</span></div>
          </div>

          <div class="specs-card" style="margin-top: 18px;">
            <div class="specs-title">Windows specifications</div>
            <div class="specs-row"><span class="spec-label">Edition:</span> <span class="spec-val">Windows 10 Pro</span></div>
            <div class="specs-row"><span class="spec-label">Version:</span> <span class="spec-val">22H2</span></div>
            <div class="specs-row"><span class="spec-label">OS build:</span> <span class="spec-val">19045.3803</span></div>
            <div class="specs-row"><span class="spec-label">Experience:</span> <span class="spec-val">Windows Feature Experience Pack 1000.19045.1000.0</span></div>
          </div>
        </div>
      </div>
    `;

    body.querySelector('#set-back-home').addEventListener('click', () => {
      this.currentCategory = 'home';
      this.render();
    });
  }

  renderNetwork(body) {
    body.innerHTML = `
      <div class="settings-subpage">
        <div class="subpage-sidebar">
          <button class="subpage-back-btn" id="set-back-home">${WinIcons.navBack} <span>Home</span></button>
          <div class="subpage-category-title">Network & Internet</div>
          <div class="subpage-nav-item active">Status</div>
          <div class="subpage-nav-item">Wi-Fi</div>
          <div class="subpage-nav-item">Ethernet</div>
          <div class="subpage-nav-item">Airplane mode</div>
        </div>

        <div class="subpage-content">
          <h2 class="subpage-heading">Network status</h2>
          <div class="network-status-box">
            <div class="net-icon">${WinIcons.wifi}</div>
            <div class="net-info">
              <div class="net-name">Home_WiFi_5G</div>
              <div class="net-desc">Connected, secured</div>
              <div class="net-meta">IPv4: 192.168.1.104 | Internet access</div>
            </div>
          </div>
        </div>
      </div>
    `;

    body.querySelector('#set-back-home').addEventListener('click', () => {
      this.currentCategory = 'home';
      this.render();
    });
  }
}

window.SettingsApp = SettingsApp;
