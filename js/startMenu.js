/**
 * Windows 10 Start Menu Engine
 * Left navigation rail, Alphabetical apps list, Live Tiles with flip animations, and Power actions.
 */

class StartMenuManager {
  constructor() {
    this.startMenuEl = null;
    this.isOpen = false;
    this.isRailExpanded = false;
    this.powerModalEl = null;

    this.allApps = [
      { name: 'Calculator', icon: 'calculator', group: 'C', action: () => CalculatorApp.open() },
      { name: 'Calendar', icon: 'startFlag', group: 'C', action: () => FlyoutManager.toggleCalendar() },
      { name: 'Command Prompt', icon: 'cmd', group: 'C', action: () => CmdApp.open() },
      { name: 'File Explorer', icon: 'fileExplorer', group: 'F', action: () => FileExplorerApp.open('This PC') },
      { name: 'Groove Music', icon: 'groove', group: 'G', action: () => GrooveMusicApp.open() },
      { name: 'Microsoft Edge', icon: 'edge', group: 'M', action: () => EdgeBrowserApp.open() },
      { name: 'Notepad', icon: 'notepad', group: 'N', action: () => NotepadApp.open() },
      { name: 'Paint', icon: 'paint', group: 'P', action: () => PaintApp.open() },
      { name: 'Photos', icon: 'photos', group: 'P', action: () => alert('Photos: Launching photo gallery viewer.') },
      { name: 'Settings', icon: 'settings', group: 'S', action: () => SettingsApp.open() },
      { name: 'Task Manager', icon: 'taskmgr', group: 'T', action: () => TaskManagerApp.open() },
      { name: 'This PC', icon: 'thisPC', group: 'T', action: () => FileExplorerApp.open('This PC') }
    ];
  }

  init(containerElement) {
    this.createStartMenu(containerElement);
    this.attachEvents();
  }

  createStartMenu(container) {
    this.startMenuEl = document.createElement('div');
    this.startMenuEl.className = 'win-start-menu';
    this.startMenuEl.id = 'start-menu-panel';

    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = now.getDate();

    this.startMenuEl.innerHTML = `
      <!-- Left Rail -->
      <div class="sm-left-rail" id="sm-left-rail">
        <div class="sm-rail-top">
          <button class="sm-rail-btn" id="sm-hamburger" title="START">
            <span class="sm-rail-icon">${WinIcons.hamburger}</span>
            <span class="sm-rail-label">START</span>
          </button>
        </div>
        <div class="sm-rail-bottom">
          <button class="sm-rail-btn" id="sm-user-btn" title="Windows User">
            <span class="sm-rail-icon user-avatar">${WinIcons.user}</span>
            <span class="sm-rail-label">Windows User</span>
          </button>
          <button class="sm-rail-btn" id="sm-doc-btn" title="Documents">
            <span class="sm-rail-icon">${WinIcons.documentsFolder}</span>
            <span class="sm-rail-label">Documents</span>
          </button>
          <button class="sm-rail-btn" id="sm-pic-btn" title="Pictures">
            <span class="sm-rail-icon">${WinIcons.picturesFolder}</span>
            <span class="sm-rail-label">Pictures</span>
          </button>
          <button class="sm-rail-btn" id="sm-set-btn" title="Settings">
            <span class="sm-rail-icon">${WinIcons.settings}</span>
            <span class="sm-rail-label">Settings</span>
          </button>
          <div class="sm-power-wrapper">
            <button class="sm-rail-btn" id="sm-power-btn" title="Power">
              <span class="sm-rail-icon">${WinIcons.power}</span>
              <span class="sm-rail-label">Power</span>
            </button>
            <div class="sm-power-menu" id="sm-power-menu">
              <div class="sm-power-item" id="pwr-sleep">Sleep</div>
              <div class="sm-power-item" id="pwr-shutdown">Shut down</div>
              <div class="sm-power-item" id="pwr-restart">Restart</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Apps List -->
      <div class="sm-apps-column">
        <div class="sm-apps-list-scroll" id="sm-apps-scroll">
          ${this.renderAppsList()}
        </div>
      </div>

      <!-- Right Live Tiles Section -->
      <div class="sm-tiles-column">
        <!-- Productivity Group -->
        <div class="sm-tile-group-header">Productivity</div>
        <div class="sm-tiles-grid">
          <!-- Edge Wide Tile -->
          <div class="sm-tile tile-wide tile-edge" data-action="edge">
            <div class="tile-content">
              <div class="tile-icon-large">${WinIcons.edge}</div>
              <span class="tile-caption">Microsoft Edge</span>
            </div>
          </div>

          <!-- Mail Live Flip Tile -->
          <div class="sm-tile tile-medium tile-mail tile-flip" data-action="mail">
            <div class="tile-flip-inner">
              <div class="tile-flip-front">
                <div class="tile-icon-large">✉️</div>
                <span class="tile-caption">Mail</span>
              </div>
              <div class="tile-flip-back">
                <div class="mail-sender">Microsoft Outlook</div>
                <div class="mail-subject">Welcome to Windows 10!</div>
                <span class="tile-caption">2 unread</span>
              </div>
            </div>
          </div>

          <!-- Calendar Live Tile -->
          <div class="sm-tile tile-medium tile-calendar" data-action="calendar">
            <div class="tile-content">
              <div class="cal-tile-day">${dayName}</div>
              <div class="cal-tile-date">${dayNum}</div>
              <span class="tile-caption">Calendar</span>
            </div>
          </div>

          <!-- This PC Tile -->
          <div class="sm-tile tile-medium tile-mypc" data-action="thispc">
            <div class="tile-content">
              <div class="tile-icon-large">${WinIcons.thisPC}</div>
              <span class="tile-caption">This PC</span>
            </div>
          </div>

          <!-- Store Tile -->
          <div class="sm-tile tile-medium tile-store">
            <div class="tile-content">
              <div class="tile-icon-large">🛍️</div>
              <span class="tile-caption">Microsoft Store</span>
            </div>
          </div>
        </div>

        <!-- Explore Group -->
        <div class="sm-tile-group-header">Explore</div>
        <div class="sm-tiles-grid">
          <!-- Weather Live Tile -->
          <div class="sm-tile tile-wide tile-weather" data-action="weather">
            <div class="tile-content weather-content">
              <div class="weather-left">
                <div class="weather-city">New York</div>
                <div class="weather-temp">72°</div>
                <div class="weather-desc">Sunny & Pleasant</div>
              </div>
              <div class="weather-right-icon">☀️</div>
              <span class="tile-caption">Weather</span>
            </div>
          </div>

          <!-- Calculator Tile -->
          <div class="sm-tile tile-medium tile-calc" data-action="calc">
            <div class="tile-content">
              <div class="tile-icon-large">${WinIcons.calculator}</div>
              <span class="tile-caption">Calculator</span>
            </div>
          </div>

          <!-- Settings Tile -->
          <div class="sm-tile tile-medium tile-settings" data-action="settings">
            <div class="tile-content">
              <div class="tile-icon-large">${WinIcons.settings}</div>
              <span class="tile-caption">Settings</span>
            </div>
          </div>

          <!-- Photos Tile -->
          <div class="sm-tile tile-wide tile-photos" data-action="photos">
            <div class="tile-content">
              <div class="tile-icon-large">${WinIcons.photos}</div>
              <span class="tile-caption">Photos</span>
            </div>
          </div>

          <!-- Groove Music Live Tile -->
          <div class="sm-tile tile-wide tile-groove" data-action="groove">
            <div class="tile-content groove-tile-content">
              <div class="groove-tile-left">
                <div class="tile-icon-large">${WinIcons.groove}</div>
                <div class="groove-tile-meta">
                  <div class="groove-tile-title">Groove Music</div>
                  <div class="groove-tile-sub">Neon Horizon - Kavinsky</div>
                </div>
              </div>
              <span class="tile-caption">Groove Music</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(this.startMenuEl);
  }

  renderAppsList() {
    const groups = {};
    this.allApps.forEach(app => {
      if (!groups[app.group]) groups[app.group] = [];
      groups[app.group].push(app);
    });

    let html = '';
    Object.keys(groups).sort().forEach(letter => {
      html += `<div class="sm-group-letter">${letter}</div>`;
      groups[letter].forEach(app => {
        html += `
          <div class="sm-app-entry" data-app-name="${app.name}">
            <span class="sm-app-icon">${WinIcons[app.icon] || WinIcons.startFlag}</span>
            <span class="sm-app-name">${app.name}</span>
          </div>
        `;
      });
    });
    return html;
  }

  attachEvents() {
    // Hamburger Expand / Collapse
    const hamburger = this.startMenuEl.querySelector('#sm-hamburger');
    const rail = this.startMenuEl.querySelector('#sm-left-rail');
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isRailExpanded = !this.isRailExpanded;
      rail.classList.toggle('expanded', this.isRailExpanded);
    });

    // Left Rail Shortcuts
    this.startMenuEl.querySelector('#sm-user-btn').addEventListener('click', () => {
      this.close();
      SettingsApp.open('accounts');
    });
    this.startMenuEl.querySelector('#sm-doc-btn').addEventListener('click', () => {
      this.close();
      FileExplorerApp.open('C:/Users/User/Documents');
    });
    this.startMenuEl.querySelector('#sm-pic-btn').addEventListener('click', () => {
      this.close();
      FileExplorerApp.open('C:/Users/User/Pictures');
    });
    this.startMenuEl.querySelector('#sm-set-btn').addEventListener('click', () => {
      this.close();
      SettingsApp.open();
    });

    // Power Menu
    const powerBtn = this.startMenuEl.querySelector('#sm-power-btn');
    const powerMenu = this.startMenuEl.querySelector('#sm-power-menu');
    powerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      powerMenu.classList.toggle('visible');
    });

    this.startMenuEl.querySelector('#pwr-sleep').addEventListener('click', () => {
      this.close();
      this.triggerSleep();
    });
    this.startMenuEl.querySelector('#pwr-shutdown').addEventListener('click', () => {
      this.close();
      this.triggerShutdown();
    });
    this.startMenuEl.querySelector('#pwr-restart').addEventListener('click', () => {
      this.close();
      this.triggerRestart();
    });

    // App Entries Click
    this.startMenuEl.querySelectorAll('.sm-app-entry').forEach(entry => {
      entry.addEventListener('click', () => {
        const name = entry.dataset.appName;
        const app = this.allApps.find(a => a.name === name);
        if (app) {
          this.close();
          app.action();
        }
      });
    });

    // Tiles Click
    this.startMenuEl.querySelectorAll('.sm-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const action = tile.dataset.action;
        this.close();
        if (action === 'edge') EdgeBrowserApp.open();
        else if (action === 'calc') CalculatorApp.open();
        else if (action === 'settings') SettingsApp.open();
        else if (action === 'thispc') FileExplorerApp.open('This PC');
        else if (action === 'groove') GrooveMusicApp.open();
        else if (action === 'calendar') FlyoutManager.toggleCalendar();
        else if (action === 'weather') alert('Weather: New York, NY 72° Sunny');
        else if (action === 'mail') alert('Windows Mail: 2 unread emails.');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.startMenuEl.contains(e.target) && !e.target.closest('#tb-start-btn')) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.startMenuEl.classList.add('visible');
    this.isOpen = true;
    const startBtn = document.querySelector('#tb-start-btn');
    if (startBtn) startBtn.classList.add('active');

    // Close flyouts
    if (window.FlyoutManager) window.FlyoutManager.closeAll();
    if (window.ActionCenterManager) window.ActionCenterManager.close();
  }

  close() {
    this.startMenuEl.classList.remove('visible');
    this.isOpen = false;
    const startBtn = document.querySelector('#tb-start-btn');
    if (startBtn) startBtn.classList.remove('active');

    const powerMenu = this.startMenuEl.querySelector('#sm-power-menu');
    if (powerMenu) powerMenu.classList.remove('visible');
  }

  triggerSleep() {
    const screen = document.createElement('div');
    screen.className = 'win-sleep-screen';
    screen.innerHTML = `<div class="sleep-hint">Click anywhere to wake PC</div>`;
    document.body.appendChild(screen);
    screen.addEventListener('click', () => {
      screen.remove();
      if (window.WinAudio) window.WinAudio.playDeviceConnect();
    });
  }

  triggerShutdown() {
    const overlay = document.createElement('div');
    overlay.className = 'win-shutdown-overlay';
    overlay.innerHTML = `
      <div class="shutdown-spinner"></div>
      <div class="shutdown-text">Shutting down</div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.innerHTML = `<div class="shutdown-text" style="cursor:pointer;" onclick="location.reload();">PC is turned off.<br/><span style="font-size:14px; color:#aaa;">Click to power on</span></div>`;
    }, 2500);
  }

  triggerRestart() {
    const overlay = document.createElement('div');
    overlay.className = 'win-shutdown-overlay';
    overlay.innerHTML = `
      <div class="shutdown-spinner"></div>
      <div class="shutdown-text">Restarting</div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

window.StartMenuManager = new StartMenuManager();
