/**
 * Windows 10 Desktop Engine
 * Icons, Marquee drag selection, Context Menus, and Wallpaper Management.
 */

class DesktopManager {
  constructor() {
    this.desktopEl = null;
    this.iconsContainer = null;
    this.contextMenuEl = null;
    this.selectionBox = null;
    this.selectedIcons = new Set();
    this.isSelecting = false;
    this.startX = 0;
    this.startY = 0;

    this.defaultIcons = [
      { id: 'mypc', title: 'This PC', icon: 'thisPC', action: () => FileExplorerApp.open('This PC') },
      { id: 'recycle', title: 'Recycle Bin', icon: 'recycleBinEmpty', action: () => this.openRecycleBin() },
      { id: 'explorer', title: 'File Explorer', icon: 'fileExplorer', action: () => FileExplorerApp.open('This PC') },
      { id: 'edge', title: 'Microsoft Edge', icon: 'edge', action: () => EdgeBrowserApp.open() },
      { id: 'settings', title: 'Settings', icon: 'settings', action: () => SettingsApp.open() },
      { id: 'notepad', title: 'Notepad', icon: 'notepad', action: () => NotepadApp.open() },
      { id: 'calc', title: 'Calculator', icon: 'calculator', action: () => CalculatorApp.open() },
      { id: 'cmd', title: 'Command Prompt', icon: 'cmd', action: () => CmdApp.open() },
      { id: 'paint', title: 'Paint', icon: 'paint', action: () => PaintApp.open() },
      { id: 'groove', title: 'Groove Music', icon: 'groove', action: () => GrooveMusicApp.open() },
      {
        id: 'welcome_file',
        title: 'Welcome.txt',
        icon: 'textFile',
        action: () => {
          const desk = WinState.resolvePath('C:/Users/User/Desktop');
          const file = desk && desk.children ? desk.children['Welcome to Windows 10.txt'] : null;
          NotepadApp.open('Welcome to Windows 10.txt', file ? file.content : '', 'C:/Users/User/Desktop/Welcome to Windows 10.txt');
        }
      }
    ];
  }

  init(desktopElement) {
    this.desktopEl = desktopElement;
    this.createMarqueeBox();
    this.createContextMenu();
    this.renderIcons();
    this.attachEvents();
    this.applyWallpaper(WinState.theme.wallpaper);
  }

  createMarqueeBox() {
    this.selectionBox = document.createElement('div');
    this.selectionBox.className = 'win-marquee-box';
    this.desktopEl.appendChild(this.selectionBox);
  }

  createContextMenu() {
    this.contextMenuEl = document.createElement('div');
    this.contextMenuEl.className = 'win-context-menu';
    this.contextMenuEl.innerHTML = `
      <div class="menu-item menu-parent" data-action="view">
        <span>View</span> <span class="arrow">▸</span>
        <div class="sub-context-menu">
          <div class="menu-item" data-action="view-large">Large icons</div>
          <div class="menu-item active" data-action="view-med">Medium icons</div>
          <div class="menu-item" data-action="view-small">Small icons</div>
        </div>
      </div>
      <div class="menu-item menu-parent" data-action="sort">
        <span>Sort by</span> <span class="arrow">▸</span>
        <div class="sub-context-menu">
          <div class="menu-item" data-action="sort-name">Name</div>
          <div class="menu-item" data-action="sort-size">Size</div>
          <div class="menu-item" data-action="sort-type">Item type</div>
          <div class="menu-item" data-action="sort-date">Date modified</div>
        </div>
      </div>
      <div class="menu-item" data-action="refresh">
        <span>Refresh</span>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item menu-parent" data-action="new">
        <span>New</span> <span class="arrow">▸</span>
        <div class="sub-context-menu">
          <div class="menu-item" data-action="new-folder"><span class="sub-icon">${WinIcons.folder}</span> Folder</div>
          <div class="menu-item" data-action="new-text"><span class="sub-icon">${WinIcons.textFile}</span> Text Document</div>
        </div>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" data-action="display">
        <span>Display settings</span>
      </div>
      <div class="menu-item" data-action="personalize">
        <span>Personalize</span>
      </div>
    `;
    document.body.appendChild(this.contextMenuEl);

    this.contextMenuEl.addEventListener('click', (e) => {
      const item = e.target.closest('.menu-item');
      if (!item || item.classList.contains('menu-parent')) return;
      this.handleContextAction(item.dataset.action);
      this.hideContextMenu();
    });

    document.addEventListener('click', () => {
      this.hideContextMenu();
    });
  }

  handleContextAction(action) {
    switch (action) {
      case 'refresh':
        this.desktopEl.style.opacity = '0.9';
        setTimeout(() => this.desktopEl.style.opacity = '1', 120);
        break;
      case 'new-folder': {
        const desk = WinState.resolvePath('C:/Users/User/Desktop');
        if (desk && desk.children) {
          const name = 'New folder ' + Math.floor(Math.random() * 100);
          desk.children[name] = { type: 'folder', name, children: {} };
          this.defaultIcons.push({
            id: 'folder_' + Date.now(),
            title: name,
            icon: 'folder',
            action: () => FileExplorerApp.open(`C:/Users/User/Desktop/${name}`)
          });
          this.renderIcons();
        }
        break;
      }
      case 'new-text': {
        const desk = WinState.resolvePath('C:/Users/User/Desktop');
        if (desk && desk.children) {
          const name = 'New Text Document ' + Math.floor(Math.random() * 100) + '.txt';
          desk.children[name] = { type: 'file', name, ext: 'txt', size: '0 bytes', date: '10/22/2026', content: '' };
          this.defaultIcons.push({
            id: 'file_' + Date.now(),
            title: name,
            icon: 'textFile',
            action: () => NotepadApp.open(name, '', `C:/Users/User/Desktop/${name}`)
          });
          this.renderIcons();
        }
        break;
      }
      case 'personalize':
      case 'display':
        SettingsApp.open('personalization');
        break;
    }
  }

  showContextMenu(x, y) {
    const menuWidth = 240;
    const menuHeight = 220;
    const maxX = window.innerWidth - menuWidth;
    const maxY = window.innerHeight - menuHeight - 40;

    this.contextMenuEl.style.left = `${Math.min(x, maxX)}px`;
    this.contextMenuEl.style.top = `${Math.min(y, maxY)}px`;
    this.contextMenuEl.classList.add('visible');
  }

  hideContextMenu() {
    this.contextMenuEl.classList.remove('visible');
  }

  renderIcons() {
    if (!this.iconsContainer) {
      this.iconsContainer = document.createElement('div');
      this.iconsContainer.className = 'desktop-icons-grid';
      this.desktopEl.appendChild(this.iconsContainer);
    }

    this.iconsContainer.innerHTML = '';

    this.defaultIcons.forEach(item => {
      const iconEl = document.createElement('div');
      iconEl.className = 'desktop-icon-item';
      iconEl.id = `d-icon-${item.id}`;
      iconEl.dataset.id = item.id;

      const iconSvg = WinIcons[item.icon] || WinIcons.startFlag;
      iconEl.innerHTML = `
        <div class="d-icon-graphic">${iconSvg}</div>
        <div class="d-icon-label">${item.title}</div>
      `;

      // Single click selects
      iconEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!e.ctrlKey) {
          this.clearSelection();
        }
        this.selectIcon(iconEl);
      });

      // Double click launches
      iconEl.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.clearSelection();
        item.action();
      });

      this.iconsContainer.appendChild(iconEl);
    });
  }

  selectIcon(iconEl) {
    iconEl.classList.add('selected');
    this.selectedIcons.add(iconEl);
  }

  clearSelection() {
    this.selectedIcons.forEach(icon => icon.classList.remove('selected'));
    this.selectedIcons.clear();
  }

  attachEvents() {
    // Desktop Right-Click Context Menu
    this.desktopEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });

    // Desktop Click Deselect
    this.desktopEl.addEventListener('mousedown', (e) => {
      if (e.target === this.desktopEl || e.target === this.iconsContainer) {
        this.clearSelection();
        this.hideContextMenu();

        // Start marquee drag selection
        if (e.button === 0) {
          this.isSelecting = true;
          this.startX = e.clientX;
          this.startY = e.clientY;
          this.selectionBox.style.left = `${this.startX}px`;
          this.selectionBox.style.top = `${this.startY}px`;
          this.selectionBox.style.width = '0px';
          this.selectionBox.style.height = '0px';
          this.selectionBox.classList.add('active');
        }
      }
    });

    // Marquee Mouse Move
    window.addEventListener('mousemove', (e) => {
      if (!this.isSelecting) return;

      const curX = e.clientX;
      const curY = e.clientY;

      const boxX = Math.min(this.startX, curX);
      const boxY = Math.min(this.startY, curY);
      const boxW = Math.abs(curX - this.startX);
      const boxH = Math.abs(curY - this.startY);

      this.selectionBox.style.left = `${boxX}px`;
      this.selectionBox.style.top = `${boxY}px`;
      this.selectionBox.style.width = `${boxW}px`;
      this.selectionBox.style.height = `${boxH}px`;

      // Check intersections with desktop icons
      const boxRect = { left: boxX, top: boxY, right: boxX + boxW, bottom: boxY + boxH };
      const icons = this.iconsContainer.querySelectorAll('.desktop-icon-item');

      icons.forEach(iconEl => {
        const iconRect = iconEl.getBoundingClientRect();
        const intersects = !(
          iconRect.right < boxRect.left ||
          iconRect.left > boxRect.right ||
          iconRect.bottom < boxRect.top ||
          iconRect.top > boxRect.bottom
        );

        if (intersects) {
          this.selectIcon(iconEl);
        } else if (!e.ctrlKey) {
          iconEl.classList.remove('selected');
          this.selectedIcons.delete(iconEl);
        }
      });
    });

    // Marquee Mouse Up
    window.addEventListener('mouseup', () => {
      if (this.isSelecting) {
        this.isSelecting = false;
        this.selectionBox.classList.remove('active');
      }
    });
  }

  applyWallpaper(theme) {
    this.desktopEl.className = 'win-desktop theme-' + theme;
  }

  openRecycleBin() {
    FileExplorerApp.open('This PC');
  }
}

window.DesktopManager = new DesktopManager();
