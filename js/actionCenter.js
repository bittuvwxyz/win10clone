/**
 * Windows 10 Action Center Engine
 * Notifications panel, dismissable cards, and 4x3 Quick Action toggles (Night Light, Wi-Fi, Brightness).
 */

class ActionCenterManager {
  constructor() {
    this.panelEl = null;
    this.isOpen = false;
    this.brightness = 100;
  }

  init(containerElement) {
    this.createPanel(containerElement);
    this.attachEvents();
  }

  createPanel(container) {
    this.panelEl = document.createElement('div');
    this.panelEl.className = 'win-action-center';
    this.panelEl.id = 'action-center-panel';

    this.panelEl.innerHTML = `
      <!-- Notifications Header -->
      <div class="ac-header">
        <span class="ac-title">Manage notifications</span>
        <button class="ac-clear-all" id="ac-clear-all-btn">Clear all</button>
      </div>

      <!-- Notifications List -->
      <div class="ac-notifications-list" id="ac-notifs-container">
        ${this.renderNotifications()}
      </div>

      <!-- Quick Actions Grid -->
      <div class="ac-quick-actions-section">
        <div class="ac-quick-grid">
          <div class="ac-tile ${WinState.theme.wifiEnabled ? 'active' : ''}" id="ac-toggle-wifi" data-action="wifi">
            <span class="ac-tile-icon">${WinIcons.wifi}</span>
            <span class="ac-tile-label">Wi-Fi</span>
          </div>

          <div class="ac-tile ${WinState.theme.bluetooth ? 'active' : ''}" id="ac-toggle-bt" data-action="bluetooth">
            <span class="ac-tile-icon">${WinIcons.bluetooth}</span>
            <span class="ac-tile-label">Bluetooth</span>
          </div>

          <div class="ac-tile ${WinState.theme.nightLight ? 'active' : ''}" id="ac-toggle-night" data-action="nightlight">
            <span class="ac-tile-icon">${WinIcons.nightLight}</span>
            <span class="ac-tile-label">Night light</span>
          </div>

          <div class="ac-tile" id="ac-toggle-focus" data-action="focus">
            <span class="ac-tile-icon">🌙</span>
            <span class="ac-tile-label">Focus assist</span>
          </div>

          <div class="ac-tile" id="ac-toggle-airplane" data-action="airplane">
            <span class="ac-tile-icon">${WinIcons.airplane}</span>
            <span class="ac-tile-label">Airplane mode</span>
          </div>

          <div class="ac-tile" id="ac-toggle-battery" data-action="battery">
            <span class="ac-tile-icon">${WinIcons.battery}</span>
            <span class="ac-tile-label">Battery saver</span>
          </div>

          <div class="ac-tile" id="ac-open-settings" data-action="settings">
            <span class="ac-tile-icon">${WinIcons.settings}</span>
            <span class="ac-tile-label">All settings</span>
          </div>

          <div class="ac-tile" id="ac-trigger-snip" data-action="snip">
            <span class="ac-tile-icon">${WinIcons.snip}</span>
            <span class="ac-tile-label">Screen snip</span>
          </div>
        </div>

        <!-- Brightness Slider -->
        <div class="ac-brightness-row">
          <span class="brightness-icon">${WinIcons.sun}</span>
          <input type="range" class="ac-slider" id="ac-brightness-slider" min="30" max="100" value="100" />
        </div>
      </div>
    `;

    container.appendChild(this.panelEl);
  }

  renderNotifications() {
    if (WinState.notifications.length === 0) {
      return `<div class="ac-no-notifs">No new notifications</div>`;
    }

    return WinState.notifications.map(n => `
      <div class="ac-notif-card" data-id="${n.id}">
        <div class="notif-header">
          <div class="notif-app-info">
            <span class="notif-icon">${WinIcons[n.icon] || WinIcons.startFlag}</span>
            <span class="notif-app-name">${n.app}</span>
          </div>
          <span class="notif-time">${n.time}</span>
          <button class="notif-dismiss" title="Dismiss">✕</button>
        </div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
      </div>
    `).join('');
  }

  attachEvents() {
    // Clear All
    const clearBtn = this.panelEl.querySelector('#ac-clear-all-btn');
    clearBtn.addEventListener('click', () => {
      WinState.notifications = [];
      const cont = this.panelEl.querySelector('#ac-notifs-container');
      cont.innerHTML = `<div class="ac-no-notifs">No new notifications</div>`;
      const badge = document.querySelector('#ac-unread-dot');
      if (badge) badge.style.display = 'none';
      if (window.WinAudio) window.WinAudio.playTrash();
    });

    // Dismiss individual notification
    this.panelEl.addEventListener('click', (e) => {
      const dismissBtn = e.target.closest('.notif-dismiss');
      if (dismissBtn) {
        const card = dismissBtn.closest('.ac-notif-card');
        const id = card.dataset.id;
        WinState.notifications = WinState.notifications.filter(n => n.id !== id);
        card.remove();
        if (WinState.notifications.length === 0) {
          const cont = this.panelEl.querySelector('#ac-notifs-container');
          cont.innerHTML = `<div class="ac-no-notifs">No new notifications</div>`;
          const badge = document.querySelector('#ac-unread-dot');
          if (badge) badge.style.display = 'none';
        }
      }
    });

    // Quick Action Toggles
    const wifiTile = this.panelEl.querySelector('#ac-toggle-wifi');
    wifiTile.addEventListener('click', () => {
      WinState.theme.wifiEnabled = !WinState.theme.wifiEnabled;
      wifiTile.classList.toggle('active', WinState.theme.wifiEnabled);
    });

    const btTile = this.panelEl.querySelector('#ac-toggle-bt');
    btTile.addEventListener('click', () => {
      WinState.theme.bluetooth = !WinState.theme.bluetooth;
      btTile.classList.toggle('active', WinState.theme.bluetooth);
    });

    const nightTile = this.panelEl.querySelector('#ac-toggle-night');
    nightTile.addEventListener('click', () => {
      WinState.theme.nightLight = !WinState.theme.nightLight;
      nightTile.classList.toggle('active', WinState.theme.nightLight);
      document.body.classList.toggle('night-light-active', WinState.theme.nightLight);
    });

    const settingsTile = this.panelEl.querySelector('#ac-open-settings');
    settingsTile.addEventListener('click', () => {
      this.close();
      SettingsApp.open();
    });

    const snipTile = this.panelEl.querySelector('#ac-trigger-snip');
    snipTile.addEventListener('click', () => {
      this.close();
      this.triggerScreenSnip();
    });

    // Brightness Slider
    const brightSlider = this.panelEl.querySelector('#ac-brightness-slider');
    brightSlider.addEventListener('input', () => {
      const val = brightSlider.value;
      document.documentElement.style.setProperty('--screen-brightness', `${val}%`);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.panelEl.contains(e.target) && !e.target.closest('#tray-action-center')) {
        this.close();
      }
    });
  }

  triggerScreenSnip() {
    const snipOverlay = document.createElement('div');
    snipOverlay.className = 'win-snip-overlay';
    snipOverlay.innerHTML = `<div class="snip-hint">Draw a shape to create a screen snip (Click to cancel)</div>`;
    document.body.appendChild(snipOverlay);
    snipOverlay.addEventListener('click', () => {
      snipOverlay.remove();
      if (window.WinAudio) window.WinAudio.playNotification();
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
    this.panelEl.classList.add('visible');
    this.isOpen = true;
    const acBtn = document.querySelector('#tray-action-center');
    if (acBtn) acBtn.classList.add('active');

    // Close other flyouts
    if (window.FlyoutManager) window.FlyoutManager.closeAll();
    if (window.StartMenuManager) window.StartMenuManager.close();
  }

  close() {
    this.panelEl.classList.remove('visible');
    this.isOpen = false;
    const acBtn = document.querySelector('#tray-action-center');
    if (acBtn) acBtn.classList.remove('active');
  }
}

window.ActionCenterManager = new ActionCenterManager();
