/**
 * Windows 10 Taskbar Engine
 * Handles Start button, Search input, Running apps, Tray icons, Clock, and Show Desktop sliver.
 */

class TaskbarManager {
  constructor() {
    this.taskbarEl = null;
    this.appsListEl = null;
    this.trayEl = null;
    this.clockEl = null;
    this.clockTimer = null;
    this.pinnedApps = [
      { id: 'app_explorer', title: 'File Explorer', icon: 'fileExplorer', launch: () => FileExplorerApp.open('This PC') },
      { id: 'app_edge', title: 'Microsoft Edge', icon: 'edge', launch: () => EdgeBrowserApp.open() },
      { id: 'app_calc', title: 'Calculator', icon: 'calculator', launch: () => CalculatorApp.open() },
      { id: 'app_notepad', title: 'Notepad', icon: 'notepad', launch: () => NotepadApp.open() },
      { id: 'app_settings', title: 'Settings', icon: 'settings', launch: () => SettingsApp.open() },
      { id: 'app_groove', title: 'Groove Music', icon: 'groove', launch: () => GrooveMusicApp.open() },
      { id: 'app_paint', title: 'Paint', icon: 'paint', launch: () => PaintApp.open() },
      { id: 'app_cmd', title: 'Command Prompt', icon: 'cmd', launch: () => CmdApp.open() }
    ];
  }

  init(taskbarElement) {
    this.taskbarEl = taskbarElement;
    this.render();
    this.startClock();
    this.attachEvents();
  }

  render() {
    this.taskbarEl.innerHTML = `
      <div class="taskbar-left">
        <!-- Start Button -->
        <button class="taskbar-btn start-button" id="tb-start-btn" title="Start">
          <div class="btn-icon">${WinIcons.startFlag}</div>
        </button>

        <!-- Search Box -->
        <div class="taskbar-search-box" id="tb-search-box">
          <span class="search-box-icon">${WinIcons.search}</span>
          <span class="search-box-placeholder">Type here to search</span>
        </div>

        <!-- Task View Button -->
        <button class="taskbar-btn task-view-btn" id="tb-task-view-btn" title="Task View">
          <div class="btn-icon">${WinIcons.taskView}</div>
        </button>

        <!-- Pinned & Running Apps Container -->
        <div class="taskbar-apps-container" id="tb-apps-list"></div>
      </div>

      <div class="taskbar-right">
        <!-- Hidden Icons Chevron -->
        <button class="tray-btn chevron-btn" id="tray-chevron" title="Show hidden icons">
          ${WinIcons.chevronUp}
        </button>

        <!-- Wi-Fi -->
        <button class="tray-btn wifi-btn" id="tray-wifi" title="Home_WiFi_5G (Internet Access)">
          ${WinIcons.wifi}
        </button>

        <!-- Sound / Volume -->
        <button class="tray-btn volume-btn" id="tray-volume" title="Speakers: 75%">
          ${WinIcons.volumeHigh}
        </button>

        <!-- Battery -->
        <button class="tray-btn battery-btn" id="tray-battery" title="Battery status: 94% available (plugged in)">
          ${WinIcons.battery}
        </button>

        <!-- Language ENG -->
        <button class="tray-btn lang-btn" title="English (United States)">
          ENG
        </button>

        <!-- Date & Clock -->
        <button class="tray-btn clock-btn" id="tray-clock" title="Click to view calendar">
          <div class="clock-time" id="clock-time-val">11:00 PM</div>
          <div class="clock-date" id="clock-date-val">10/22/2026</div>
        </button>

        <!-- Action Center Icon -->
        <button class="tray-btn action-center-btn" id="tray-action-center" title="No new notifications">
          <div class="ac-icon-wrapper">
            ${WinIcons.actionCenter}
            <span class="ac-badge" id="ac-unread-dot"></span>
          </div>
        </button>

        <!-- Show Desktop Slice -->
        <div class="show-desktop-slice" id="tb-show-desktop" title="Show desktop"></div>
      </div>
    `;

    this.appsListEl = this.taskbarEl.querySelector('#tb-apps-list');
    this.renderApps();
  }

  renderApps() {
    this.appsListEl.innerHTML = '';

    // Render pinned apps
    this.pinnedApps.forEach(app => {
      const appBtn = document.createElement('div');
      appBtn.className = 'taskbar-app-icon pinned';
      appBtn.id = `tb-app-${app.id}`;
      appBtn.title = app.title;
      appBtn.innerHTML = `
        <div class="app-icon-inner">${WinIcons[app.icon] || WinIcons.startFlag}</div>
        <div class="app-running-indicator"></div>
      `;

      appBtn.addEventListener('click', () => {
        // Find if this app currently has open windows
        let matchedWin = null;
        for (const [id, win] of window.WinWindowManager.windows) {
          if (win.icon === app.icon) {
            matchedWin = win;
            break;
          }
        }

        if (!matchedWin) {
          app.launch();
        } else {
          this.handleTaskbarIconClick(matchedWin.id);
        }
      });

      this.appsListEl.appendChild(appBtn);
    });

    this.updateAppStates();
  }

  handleTaskbarIconClick(winId) {
    const win = window.WinWindowManager.getWindow(winId);
    if (!win) return;

    if (win.isMinimized) {
      window.WinWindowManager.restoreWindow(winId);
    } else if (window.WinWindowManager.activeWindowId === winId) {
      window.WinWindowManager.minimizeWindow(winId);
    } else {
      window.WinWindowManager.focusWindow(winId);
    }
  }

  updateAppStates() {
    const windows = window.WinWindowManager.windows;
    const activeId = window.WinWindowManager.activeWindowId;

    // Check each pinned app
    this.pinnedApps.forEach(app => {
      const btn = this.appsListEl.querySelector(`#tb-app-${app.id}`);
      if (!btn) return;

      let hasRunning = false;
      let isActive = false;

      for (const [winId, win] of windows) {
        if (win.icon === app.icon) {
          hasRunning = true;
          if (winId === activeId && !win.isMinimized) {
            isActive = true;
          }
        }
      }

      btn.classList.toggle('running', hasRunning);
      btn.classList.toggle('active', isActive);
    });

    // Handle open unpinned windows
    windows.forEach(win => {
      const isPinned = this.pinnedApps.some(p => p.icon === win.icon);
      if (!isPinned) {
        let unpinnedBtn = this.appsListEl.querySelector(`#tb-unpinned-${win.id}`);
        if (!unpinnedBtn) {
          unpinnedBtn = document.createElement('div');
          unpinnedBtn.className = 'taskbar-app-icon running';
          unpinnedBtn.id = `tb-unpinned-${win.id}`;
          unpinnedBtn.title = win.title;
          unpinnedBtn.innerHTML = `
            <div class="app-icon-inner">${WinIcons[win.icon] || WinIcons.startFlag}</div>
            <div class="app-running-indicator"></div>
          `;
          unpinnedBtn.addEventListener('click', () => this.handleTaskbarIconClick(win.id));
          this.appsListEl.appendChild(unpinnedBtn);
        }
        unpinnedBtn.classList.toggle('active', win.id === activeId && !win.isMinimized);
      }
    });

    // Remove closed unpinned windows
    const unpinnedElements = this.appsListEl.querySelectorAll('[id^="tb-unpinned-"]');
    unpinnedElements.forEach(el => {
      const winId = el.id.replace('tb-unpinned-', '');
      if (!windows.has(winId)) {
        el.remove();
      }
    });
  }

  onWindowOpened() {
    this.updateAppStates();
  }

  onWindowClosed() {
    this.updateAppStates();
  }

  onWindowFocused() {
    this.updateAppStates();
  }

  onWindowMinimized() {
    this.updateAppStates();
  }

  onWindowRestored() {
    this.updateAppStates();
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;

      const timeStr = `${hours}:${minutes} ${ampm}`;
      const month = (now.getMonth() + 1).toString();
      const day = now.getDate().toString();
      const year = now.getFullYear();
      const dateStr = `${month}/${day}/${year}`;

      const timeEl = document.querySelector('#clock-time-val');
      const dateEl = document.querySelector('#clock-date-val');

      if (timeEl) timeEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };

    updateTime();
    this.clockTimer = setInterval(updateTime, 1000);
  }

  attachEvents() {
    // Start Menu Toggle
    const startBtn = this.taskbarEl.querySelector('#tb-start-btn');
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.StartMenuManager) {
        window.StartMenuManager.toggle();
      }
    });

    // Search Flyout Toggle
    const searchBox = this.taskbarEl.querySelector('#tb-search-box');
    searchBox.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.FlyoutManager) {
        window.FlyoutManager.toggleSearch();
      }
    });

    // Clock / Calendar Toggle
    const clockBtn = this.taskbarEl.querySelector('#tray-clock');
    clockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.FlyoutManager) {
        window.FlyoutManager.toggleCalendar();
      }
    });

    // Volume Flyout Toggle
    const volumeBtn = this.taskbarEl.querySelector('#tray-volume');
    volumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.FlyoutManager) {
        window.FlyoutManager.toggleVolume();
      }
    });

    // Wi-Fi Flyout Toggle
    const wifiBtn = this.taskbarEl.querySelector('#tray-wifi');
    wifiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.FlyoutManager) {
        window.FlyoutManager.toggleWifi();
      }
    });

    // Action Center Toggle
    const acBtn = this.taskbarEl.querySelector('#tray-action-center');
    acBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.ActionCenterManager) {
        window.ActionCenterManager.toggle();
      }
    });

    // Show Desktop Slice
    const showDesktopBtn = this.taskbarEl.querySelector('#tb-show-desktop');
    showDesktopBtn.addEventListener('click', () => {
      const windows = window.WinWindowManager.windows;
      let allMinimized = true;

      windows.forEach(w => {
        if (!w.isMinimized) allMinimized = false;
      });

      windows.forEach(w => {
        if (allMinimized) {
          window.WinWindowManager.restoreWindow(w.id);
        } else {
          window.WinWindowManager.minimizeWindow(w.id);
        }
      });
    });

    // Task View button
    const taskViewBtn = this.taskbarEl.querySelector('#tb-task-view-btn');
    taskViewBtn.addEventListener('click', () => {
      alert('Task View: Windows are organized across virtual desktops.');
    });
  }
}

window.TaskbarManager = new TaskbarManager();
