/**
 * Windows 10 Flyouts Engine
 * Calendar & Clock flyout, Volume slider flyout, Wi-Fi network flyout, Cortana/Search flyout, and Run dialog (Win+R).
 */

class FlyoutManager {
  constructor() {
    this.calendarFlyout = null;
    this.volumeFlyout = null;
    this.wifiFlyout = null;
    this.searchFlyout = null;
    this.runDialog = null;

    this.activeFlyout = null; // 'calendar', 'volume', 'wifi', 'search', or null
    this.calDate = new Date();
    this.calClockInterval = null;
  }

  init(containerElement) {
    this.createCalendarFlyout(containerElement);
    this.createVolumeFlyout(containerElement);
    this.createWifiFlyout(containerElement);
    this.createSearchFlyout(containerElement);
    this.createRunDialog(containerElement);
    this.attachEvents();
  }

  /* ---------------- Calendar Flyout ---------------- */
  createCalendarFlyout(container) {
    this.calendarFlyout = document.createElement('div');
    this.calendarFlyout.className = 'win-flyout win-calendar-flyout';
    this.calendarFlyout.id = 'flyout-calendar';

    this.renderCalendarContent();
    container.appendChild(this.calendarFlyout);
  }

  renderCalendarContent() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US');
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const year = this.calDate.getFullYear();
    const month = this.calDate.getMonth();
    const monthName = this.calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Calendar grid computation
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let daysHtml = '';
    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysHtml += `<div class="cal-day pad">${prevMonthDays - i}</div>`;
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      daysHtml += `<div class="cal-day ${isToday ? 'today' : ''}">${d}</div>`;
    }
    // Next month padding to fill 42 cells (6 rows)
    const totalCells = firstDayIndex + daysInMonth;
    const remaining = 42 - totalCells;
    for (let n = 1; n <= remaining; n++) {
      daysHtml += `<div class="cal-day pad">${n}</div>`;
    }

    this.calendarFlyout.innerHTML = `
      <div class="cal-flyout-header">
        <div class="cal-digital-clock" id="cal-flyout-clock">${timeStr}</div>
        <div class="cal-date-label">${dateStr}</div>
      </div>
      <div class="cal-divider"></div>
      <div class="cal-month-nav">
        <span class="cal-month-title">${monthName}</span>
        <div class="cal-nav-buttons">
          <button class="cal-nav-btn" id="cal-prev-month">${WinIcons.navUp}</button>
          <button class="cal-nav-btn" id="cal-next-month" style="transform: rotate(180deg);">${WinIcons.navUp}</button>
        </div>
      </div>
      <div class="cal-weekdays">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div class="cal-grid">
        ${daysHtml}
      </div>
      <div class="cal-events-section">
        <button class="cal-add-event-btn">+ Add an event or reminder</button>
      </div>
    `;

    // Month Navigation Listeners
    this.calendarFlyout.querySelector('#cal-prev-month').addEventListener('click', () => {
      this.calDate.setMonth(this.calDate.getMonth() - 1);
      this.renderCalendarContent();
    });

    this.calendarFlyout.querySelector('#cal-next-month').addEventListener('click', () => {
      this.calDate.setMonth(this.calDate.getMonth() + 1);
      this.renderCalendarContent();
    });

    this.calendarFlyout.querySelector('.cal-add-event-btn').addEventListener('click', () => {
      alert('Calendar: Event scheduler opened.');
    });
  }

  /* ---------------- Volume Flyout ---------------- */
  createVolumeFlyout(container) {
    this.volumeFlyout = document.createElement('div');
    this.volumeFlyout.className = 'win-flyout win-volume-flyout';
    this.volumeFlyout.id = 'flyout-volume';

    this.volumeFlyout.innerHTML = `
      <div class="vol-flyout-inner">
        <div class="vol-label-row">
          <span class="vol-device-name">Speakers (Realtek High Definition Audio)</span>
        </div>
        <div class="vol-control-row">
          <button class="vol-mute-btn" id="vol-mute-btn">${WinIcons.volumeHigh}</button>
          <input type="range" class="vol-slider" id="vol-slider" min="0" max="100" value="${WinState.theme.volume}" />
          <span class="vol-percent" id="vol-percent-txt">${WinState.theme.volume}</span>
        </div>
      </div>
    `;

    container.appendChild(this.volumeFlyout);

    const slider = this.volumeFlyout.querySelector('#vol-slider');
    const percentTxt = this.volumeFlyout.querySelector('#vol-percent-txt');
    const muteBtn = this.volumeFlyout.querySelector('#vol-mute-btn');

    slider.addEventListener('input', () => {
      const val = parseInt(slider.value, 10);
      WinState.theme.volume = val;
      percentTxt.textContent = val;
      if (window.WinAudio) {
        window.WinAudio.setVolume(val / 100);
        window.WinAudio.playVolumeTick(400 + val * 6);
      }
    });

    muteBtn.addEventListener('click', () => {
      if (window.WinAudio) {
        const isMuted = window.WinAudio.toggleMute();
        muteBtn.innerHTML = isMuted ? WinIcons.volumeMute : WinIcons.volumeHigh;
        percentTxt.textContent = isMuted ? '0' : WinState.theme.volume;
      }
    });
  }

  /* ---------------- Wi-Fi Flyout ---------------- */
  createWifiFlyout(container) {
    this.wifiFlyout = document.createElement('div');
    this.wifiFlyout.className = 'win-flyout win-wifi-flyout';
    this.wifiFlyout.id = 'flyout-wifi';

    this.wifiFlyout.innerHTML = `
      <div class="wifi-flyout-inner">
        <div class="wifi-list-header">Available Networks</div>
        <div class="wifi-network-item connected">
          <div class="wifi-item-left">
            <span class="wifi-icon">${WinIcons.wifi}</span>
            <div class="wifi-item-info">
              <div class="wifi-ssid">Home_WiFi_5G</div>
              <div class="wifi-status">Connected, secured</div>
            </div>
          </div>
          <button class="wifi-btn-action" id="wifi-disconnect-btn">Disconnect</button>
        </div>

        <div class="wifi-network-item">
          <div class="wifi-item-left">
            <span class="wifi-icon">${WinIcons.wifi}</span>
            <div class="wifi-item-info">
              <div class="wifi-ssid">Office_Workstation_Guest</div>
              <div class="wifi-status">Secured</div>
            </div>
          </div>
          <button class="wifi-btn-action">Connect</button>
        </div>

        <div class="wifi-network-item">
          <div class="wifi-item-left">
            <span class="wifi-icon">${WinIcons.wifi}</span>
            <div class="wifi-item-info">
              <div class="wifi-ssid">Starbucks_Free_WiFi</div>
              <div class="wifi-status">Open</div>
            </div>
          </div>
          <button class="wifi-btn-action">Connect</button>
        </div>

        <div class="wifi-footer-settings">
          <a href="#" id="wifi-open-net-settings">Network & Internet settings</a>
        </div>
      </div>
    `;

    container.appendChild(this.wifiFlyout);

    this.wifiFlyout.querySelector('#wifi-open-net-settings').addEventListener('click', (e) => {
      e.preventDefault();
      this.closeAll();
      SettingsApp.open('network');
    });

    const discBtn = this.wifiFlyout.querySelector('#wifi-disconnect-btn');
    discBtn.addEventListener('click', () => {
      if (discBtn.textContent === 'Disconnect') {
        discBtn.textContent = 'Connect';
        this.wifiFlyout.querySelector('.wifi-network-item.connected').classList.remove('connected');
      } else {
        discBtn.textContent = 'Disconnect';
        this.wifiFlyout.querySelector('.wifi-network-item').classList.add('connected');
      }
    });
  }

  /* ---------------- Search Flyout ---------------- */
  createSearchFlyout(container) {
    this.searchFlyout = document.createElement('div');
    this.searchFlyout.className = 'win-flyout win-search-flyout';
    this.searchFlyout.id = 'flyout-search';

    this.searchFlyout.innerHTML = `
      <div class="search-flyout-container">
        <!-- Top Search Box -->
        <div class="sf-input-row">
          <span class="sf-search-icon">${WinIcons.search}</span>
          <input type="text" class="sf-input" id="sf-input-field" placeholder="Type here to search..." />
        </div>

        <!-- Top Filters -->
        <div class="sf-filter-tabs">
          <button class="sf-tab active">All</button>
          <button class="sf-tab">Apps</button>
          <button class="sf-tab">Documents</button>
          <button class="sf-tab">Web</button>
        </div>

        <!-- Dynamic Results Area -->
        <div class="sf-results-area" id="sf-results-view">
          <div class="sf-section-title">Top apps</div>
          <div class="sf-top-apps-grid">
            <div class="sf-app-pill" data-app="edge">
              <span class="sf-pill-icon">${WinIcons.edge}</span>
              <span class="sf-pill-name">Microsoft Edge</span>
            </div>
            <div class="sf-app-pill" data-app="calc">
              <span class="sf-pill-icon">${WinIcons.calculator}</span>
              <span class="sf-pill-name">Calculator</span>
            </div>
            <div class="sf-app-pill" data-app="notepad">
              <span class="sf-pill-icon">${WinIcons.notepad}</span>
              <span class="sf-pill-name">Notepad</span>
            </div>
            <div class="sf-app-pill" data-app="cmd">
              <span class="sf-pill-icon">${WinIcons.cmd}</span>
              <span class="sf-pill-name">Command Prompt</span>
            </div>
          </div>

          <div class="sf-section-title" style="margin-top: 18px;">Quick searches</div>
          <div class="sf-quick-list">
            <div class="sf-quick-item" data-q="Weather today">🌤️ Weather today</div>
            <div class="sf-quick-item" data-q="Stock market updates">📈 Stock market updates</div>
            <div class="sf-quick-item" data-q="Latest world news">📰 Latest world news</div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(this.searchFlyout);

    // Search Input dynamic typing filter
    const input = this.searchFlyout.querySelector('#sf-input-field');
    const resultsView = this.searchFlyout.querySelector('#sf-results-view');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        resultsView.innerHTML = `
          <div class="sf-section-title">Top apps</div>
          <div class="sf-top-apps-grid">
            <div class="sf-app-pill" data-app="edge"><span class="sf-pill-icon">${WinIcons.edge}</span><span class="sf-pill-name">Microsoft Edge</span></div>
            <div class="sf-app-pill" data-app="calc"><span class="sf-pill-icon">${WinIcons.calculator}</span><span class="sf-pill-name">Calculator</span></div>
            <div class="sf-app-pill" data-app="notepad"><span class="sf-pill-icon">${WinIcons.notepad}</span><span class="sf-pill-name">Notepad</span></div>
            <div class="sf-app-pill" data-app="cmd"><span class="sf-pill-icon">${WinIcons.cmd}</span><span class="sf-pill-name">Command Prompt</span></div>
          </div>
        `;
        this.attachSearchAppClicks();
        return;
      }

      // Filter apps and files
      const matchedApps = [
        { name: 'Calculator', icon: 'calculator', action: () => CalculatorApp.open() },
        { name: 'Command Prompt', icon: 'cmd', action: () => CmdApp.open() },
        { name: 'File Explorer', icon: 'fileExplorer', action: () => FileExplorerApp.open('This PC') },
        { name: 'Groove Music', icon: 'groove', action: () => GrooveMusicApp.open() },
        { name: 'Microsoft Edge', icon: 'edge', action: () => EdgeBrowserApp.open() },
        { name: 'Notepad', icon: 'notepad', action: () => NotepadApp.open() },
        { name: 'Paint', icon: 'paint', action: () => PaintApp.open() },
        { name: 'Settings', icon: 'settings', action: () => SettingsApp.open() },
        { name: 'Task Manager', icon: 'taskmgr', action: () => TaskManagerApp.open() }
      ].filter(a => a.name.toLowerCase().includes(q));

      let resHtml = `<div class="sf-section-title">Best match</div>`;
      if (matchedApps.length > 0) {
        matchedApps.forEach(m => {
          resHtml += `
            <div class="sf-match-row" data-match="${m.name}">
              <span class="sf-match-icon">${WinIcons[m.icon]}</span>
              <div class="sf-match-info">
                <div class="sf-match-title">${m.name}</div>
                <div class="sf-match-desc">App</div>
              </div>
            </div>
          `;
        });
      } else {
        resHtml += `
          <div class="sf-match-row" data-search-web="${q}">
            <span class="sf-match-icon">${WinIcons.edge}</span>
            <div class="sf-match-info">
              <div class="sf-match-title">Search web for "${q}"</div>
              <div class="sf-match-desc">Microsoft Edge</div>
            </div>
          </div>
        `;
      }

      resultsView.innerHTML = resHtml;

      resultsView.querySelectorAll('.sf-match-row').forEach(row => {
        row.addEventListener('click', () => {
          const matchName = row.dataset.match;
          const webQ = row.dataset.searchWeb;
          this.closeAll();
          if (matchName) {
            const found = matchedApps.find(a => a.name === matchName);
            if (found) found.action();
          } else if (webQ) {
            EdgeBrowserApp.open(`https://www.bing.com/search?q=${encodeURIComponent(webQ)}`);
          }
        });
      });
    });

    this.attachSearchAppClicks();
  }

  attachSearchAppClicks() {
    this.searchFlyout.querySelectorAll('.sf-app-pill, .sf-quick-item').forEach(el => {
      el.addEventListener('click', () => {
        const app = el.dataset.app;
        const q = el.dataset.q;
        this.closeAll();
        if (app === 'edge') EdgeBrowserApp.open();
        else if (app === 'calc') CalculatorApp.open();
        else if (app === 'notepad') NotepadApp.open();
        else if (app === 'cmd') CmdApp.open();
        else if (q) EdgeBrowserApp.open(`https://www.bing.com/search?q=${encodeURIComponent(q)}`);
      });
    });
  }

  /* ---------------- Run Dialog (Win + R) ---------------- */
  createRunDialog(container) {
    this.runDialog = document.createElement('div');
    this.runDialog.className = 'win-run-modal';
    this.runDialog.id = 'modal-run';

    this.runDialog.innerHTML = `
      <div class="run-dialog-box">
        <div class="run-titlebar">
          <span class="run-title">Run</span>
          <button class="run-close-btn" id="run-close">✕</button>
        </div>
        <div class="run-body">
          <div class="run-row-top">
            <span class="run-icon-graphic">${WinIcons.runIcon}</span>
            <div class="run-desc">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</div>
          </div>
          <div class="run-input-row">
            <label class="run-open-label" for="run-cmd-input">Open:</label>
            <input type="text" class="run-input-field" id="run-cmd-input" placeholder="calc, notepad, cmd, explorer..." spellcheck="false" />
          </div>
          <div class="run-buttons-row">
            <button class="run-btn default" id="run-btn-ok">OK</button>
            <button class="run-btn" id="run-btn-cancel">Cancel</button>
            <button class="run-btn" id="run-btn-browse">Browse...</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(this.runDialog);

    const input = this.runDialog.querySelector('#run-cmd-input');
    const okBtn = this.runDialog.querySelector('#run-btn-ok');
    const cancelBtn = this.runDialog.querySelector('#run-btn-cancel');
    const closeBtn = this.runDialog.querySelector('#run-close');

    const handleRun = () => {
      const cmd = input.value.trim().toLowerCase();
      this.closeRun();
      if (!cmd) return;

      if (cmd === 'calc') CalculatorApp.open();
      else if (cmd === 'notepad') NotepadApp.open();
      else if (cmd === 'cmd') CmdApp.open();
      else if (cmd === 'explorer' || cmd === 'thispc') FileExplorerApp.open('This PC');
      else if (cmd === 'settings' || cmd === 'control') SettingsApp.open();
      else if (cmd === 'paint' || cmd === 'mspaint') PaintApp.open();
      else if (cmd === 'groove' || cmd === 'music' || cmd === 'wmplayer') GrooveMusicApp.open();
      else if (cmd === 'taskmgr') TaskManagerApp.open();
      else if (cmd === 'edge' || cmd.startsWith('http://') || cmd.startsWith('https://')) EdgeBrowserApp.open(cmd.startsWith('http') ? cmd : 'https://www.bing.com');
      else {
        alert(`Windows cannot find '${cmd}'. Make sure you typed the name correctly, and then try again.`);
      }
    };

    okBtn.addEventListener('click', handleRun);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleRun();
    });

    cancelBtn.addEventListener('click', () => this.closeRun());
    closeBtn.addEventListener('click', () => this.closeRun());
  }

  openRun() {
    this.runDialog.classList.add('visible');
    const input = this.runDialog.querySelector('#run-cmd-input');
    setTimeout(() => input.focus(), 50);
  }

  closeRun() {
    this.runDialog.classList.remove('visible');
  }

  /* ---------------- Toggles ---------------- */
  toggleCalendar() {
    if (this.activeFlyout === 'calendar') {
      this.closeAll();
    } else {
      this.closeAll();
      this.renderCalendarContent();
      this.calendarFlyout.classList.add('visible');
      this.activeFlyout = 'calendar';
      document.querySelector('#tray-clock').classList.add('active');

      if (!this.calClockInterval) {
        this.calClockInterval = setInterval(() => {
          const clock = document.querySelector('#cal-flyout-clock');
          if (clock) clock.textContent = new Date().toLocaleTimeString('en-US');
        }, 1000);
      }
    }
  }

  toggleVolume() {
    if (this.activeFlyout === 'volume') {
      this.closeAll();
    } else {
      this.closeAll();
      this.volumeFlyout.classList.add('visible');
      this.activeFlyout = 'volume';
      document.querySelector('#tray-volume').classList.add('active');
    }
  }

  toggleWifi() {
    if (this.activeFlyout === 'wifi') {
      this.closeAll();
    } else {
      this.closeAll();
      this.wifiFlyout.classList.add('visible');
      this.activeFlyout = 'wifi';
      document.querySelector('#tray-wifi').classList.add('active');
    }
  }

  toggleSearch() {
    if (this.activeFlyout === 'search') {
      this.closeAll();
    } else {
      this.closeAll();
      this.searchFlyout.classList.add('visible');
      this.activeFlyout = 'search';
      const input = this.searchFlyout.querySelector('#sf-input-field');
      setTimeout(() => input.focus(), 50);
    }
  }

  closeAll() {
    this.calendarFlyout.classList.remove('visible');
    this.volumeFlyout.classList.remove('visible');
    this.wifiFlyout.classList.remove('visible');
    this.searchFlyout.classList.remove('visible');

    const clockBtn = document.querySelector('#tray-clock');
    const volBtn = document.querySelector('#tray-volume');
    const wifiBtn = document.querySelector('#tray-wifi');

    if (clockBtn) clockBtn.classList.remove('active');
    if (volBtn) volBtn.classList.remove('active');
    if (wifiBtn) wifiBtn.classList.remove('active');

    this.activeFlyout = null;

    if (this.calClockInterval) {
      clearInterval(this.calClockInterval);
      this.calClockInterval = null;
    }
  }

  attachEvents() {
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.activeFlyout) {
        const isClickInside =
          this.calendarFlyout.contains(e.target) ||
          this.volumeFlyout.contains(e.target) ||
          this.wifiFlyout.contains(e.target) ||
          this.searchFlyout.contains(e.target) ||
          e.target.closest('#tray-clock') ||
          e.target.closest('#tray-volume') ||
          e.target.closest('#tray-wifi') ||
          e.target.closest('#tb-search-box');

        if (!isClickInside) {
          this.closeAll();
        }
      }
    });
  }
}

window.FlyoutManager = new FlyoutManager();
