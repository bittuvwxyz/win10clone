/**
 * Windows 10 File Explorer / This PC Application
 */

class FileExplorerApp {
  static open(initialPath = 'This PC') {
    const winId = 'explorer_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: initialPath === 'This PC' ? 'This PC' : initialPath,
      icon: 'fileExplorer',
      width: 820,
      height: 520,
      minWidth: 460,
      minHeight: 320,
      content: ''
    });

    const instance = new FileExplorerApp(win, initialPath);
    instance.render();
    return instance;
  }

  constructor(winData, initialPath) {
    this.winData = winData;
    this.currentPath = initialPath;
    this.history = [initialPath];
    this.historyIndex = 0;
    this.selectedItem = null;
  }

  navigateTo(newPath, recordHistory = true) {
    this.currentPath = newPath;
    if (recordHistory) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(newPath);
      this.historyIndex = this.history.length - 1;
    }
    this.selectedItem = null;
    this.render();

    // Update window title
    const titleEl = this.winData.element.querySelector('.win-title-text');
    if (titleEl) {
      titleEl.textContent = newPath === 'This PC' ? 'This PC' : newPath.split('/').pop() || newPath;
    }
  }

  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.navigateTo(this.history[this.historyIndex], false);
    }
  }

  goForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.navigateTo(this.history[this.historyIndex], false);
    }
  }

  goUp() {
    if (this.currentPath === 'This PC') return;
    const parts = this.currentPath.split('/').filter(p => p.length > 0);
    if (parts.length <= 1) {
      this.navigateTo('This PC');
    } else {
      parts.pop();
      this.navigateTo(parts.join('/'));
    }
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="explorer-container">
        <!-- Explorer Ribbon -->
        <div class="explorer-ribbon">
          <div class="ribbon-tabs">
            <button class="ribbon-tab active">File</button>
            <button class="ribbon-tab">Home</button>
            <button class="ribbon-tab">Share</button>
            <button class="ribbon-tab">View</button>
          </div>
          <div class="ribbon-action-bar">
            <button class="ribbon-btn" id="exp-new-folder" title="New Folder">
              <span class="ribbon-btn-icon">${WinIcons.folder}</span>
              <span>New folder</span>
            </button>
            <button class="ribbon-btn" id="exp-new-doc" title="New Text Document">
              <span class="ribbon-btn-icon">${WinIcons.textFile}</span>
              <span>New Doc</span>
            </button>
            <div class="ribbon-divider"></div>
            <button class="ribbon-btn" id="exp-delete" title="Delete selected">
              <span class="ribbon-btn-icon">${WinIcons.winClose}</span>
              <span>Delete</span>
            </button>
          </div>
        </div>

        <!-- Navigation Bar -->
        <div class="explorer-nav-bar">
          <div class="nav-controls">
            <button class="nav-btn ${this.historyIndex > 0 ? '' : 'disabled'}" id="exp-nav-back" title="Back">${WinIcons.navBack}</button>
            <button class="nav-btn ${this.historyIndex < this.history.length - 1 ? '' : 'disabled'}" id="exp-nav-forward" title="Forward">${WinIcons.navForward}</button>
            <button class="nav-btn ${this.currentPath !== 'This PC' ? '' : 'disabled'}" id="exp-nav-up" title="Up to parent">${WinIcons.navUp}</button>
          </div>
          <div class="address-bar">
            <span class="address-icon">${this.currentPath === 'This PC' ? WinIcons.thisPC : WinIcons.folder}</span>
            <input type="text" class="address-input" value="${this.currentPath}" spellcheck="false" />
            <button class="address-refresh" id="exp-nav-refresh" title="Refresh">${WinIcons.refresh}</button>
          </div>
          <div class="search-bar">
            <input type="text" class="search-input" placeholder="Search ${this.currentPath === 'This PC' ? 'This PC' : this.currentPath.split('/').pop() || 'folder'}" />
            <span class="search-icon">${WinIcons.search}</span>
          </div>
        </div>

        <!-- Main Body: Sidebar + File Grid -->
        <div class="explorer-main">
          <!-- Left Navigation Pane -->
          <div class="explorer-sidebar">
            <div class="tree-group-header">Quick access</div>
            <div class="tree-item ${this.currentPath === 'C:/Users/User/Desktop' ? 'active' : ''}" data-path="C:/Users/User/Desktop">
              <span class="tree-icon">${WinIcons.desktopFolder}</span>
              <span class="tree-name">Desktop</span>
            </div>
            <div class="tree-item ${this.currentPath === 'C:/Users/User/Downloads' ? 'active' : ''}" data-path="C:/Users/User/Downloads">
              <span class="tree-icon">${WinIcons.downloadsFolder}</span>
              <span class="tree-name">Downloads</span>
            </div>
            <div class="tree-item ${this.currentPath === 'C:/Users/User/Documents' ? 'active' : ''}" data-path="C:/Users/User/Documents">
              <span class="tree-icon">${WinIcons.documentsFolder}</span>
              <span class="tree-name">Documents</span>
            </div>
            <div class="tree-item ${this.currentPath === 'C:/Users/User/Pictures' ? 'active' : ''}" data-path="C:/Users/User/Pictures">
              <span class="tree-icon">${WinIcons.picturesFolder}</span>
              <span class="tree-name">Pictures</span>
            </div>

            <div class="tree-group-header">This PC</div>
            <div class="tree-item ${this.currentPath === 'This PC' ? 'active' : ''}" data-path="This PC">
              <span class="tree-icon">${WinIcons.thisPC}</span>
              <span class="tree-name">This PC</span>
            </div>
            <div class="tree-item tree-sub ${this.currentPath === 'C:' ? 'active' : ''}" data-path="C:">
              <span class="tree-icon">${WinIcons.hardDrive}</span>
              <span class="tree-name">Local Disk (C:)</span>
            </div>
            <div class="tree-item tree-sub ${this.currentPath === 'D:' ? 'active' : ''}" data-path="D:">
              <span class="tree-icon">${WinIcons.hardDrive}</span>
              <span class="tree-name">Data (D:)</span>
            </div>

            <div class="tree-group-header">Network</div>
            <div class="tree-item" data-path="Network">
              <span class="tree-icon">${WinIcons.wifi}</span>
              <span class="tree-name">Network</span>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="explorer-content" id="explorer-content-view">
            ${this.renderContentArea()}
          </div>
        </div>

        <!-- Status Bar -->
        <div class="explorer-statusbar">
          <span class="status-count" id="exp-status-count">${this.getItemCountText()}</span>
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  getItemCountText() {
    if (this.currentPath === 'This PC') {
      return '8 items';
    }
    const node = WinState.resolvePath(this.currentPath);
    if (node && node.children) {
      const count = Object.keys(node.children).length;
      return `${count} item${count === 1 ? '' : 's'}`;
    }
    return '0 items';
  }

  renderContentArea() {
    if (this.currentPath === 'This PC') {
      return `
        <div class="this-pc-view">
          <div class="content-section-title">Folders (6)</div>
          <div class="pc-folders-grid">
            <div class="pc-folder-card" data-path="C:/Users/User/Desktop">
              <div class="pc-folder-icon">${WinIcons.desktopFolder}</div>
              <div class="pc-folder-name">Desktop</div>
            </div>
            <div class="pc-folder-card" data-path="C:/Users/User/Documents">
              <div class="pc-folder-icon">${WinIcons.documentsFolder}</div>
              <div class="pc-folder-name">Documents</div>
            </div>
            <div class="pc-folder-card" data-path="C:/Users/User/Downloads">
              <div class="pc-folder-icon">${WinIcons.downloadsFolder}</div>
              <div class="pc-folder-name">Downloads</div>
            </div>
            <div class="pc-folder-card" data-path="C:/Users/User/Pictures">
              <div class="pc-folder-icon">${WinIcons.picturesFolder}</div>
              <div class="pc-folder-name">Pictures</div>
            </div>
            <div class="pc-folder-card" data-path="C:/Users/User/Music">
              <div class="pc-folder-icon">${WinIcons.musicFolder}</div>
              <div class="pc-folder-name">Music</div>
            </div>
            <div class="pc-folder-card" data-path="C:/Users/User/Videos">
              <div class="pc-folder-icon">${WinIcons.videosFolder}</div>
              <div class="pc-folder-name">Videos</div>
            </div>
          </div>

          <div class="content-section-title">Devices and drives (2)</div>
          <div class="pc-drives-grid">
            <div class="pc-drive-card" data-path="C:">
              <div class="pc-drive-icon">${WinIcons.hardDrive}</div>
              <div class="pc-drive-info">
                <div class="pc-drive-title">Local Disk (C:)</div>
                <div class="pc-drive-bar">
                  <div class="pc-drive-fill" style="width: 44.5%;"></div>
                </div>
                <div class="pc-drive-meta">142 GB free of 256 GB</div>
              </div>
            </div>

            <div class="pc-drive-card" data-path="D:">
              <div class="pc-drive-icon">${WinIcons.hardDrive}</div>
              <div class="pc-drive-info">
                <div class="pc-drive-title">Data (D:)</div>
                <div class="pc-drive-bar">
                  <div class="pc-drive-fill" style="width: 33.6%;"></div>
                </div>
                <div class="pc-drive-meta">680 GB free of 1.00 TB</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const node = WinState.resolvePath(this.currentPath);
    if (!node || !node.children) {
      return `<div class="explorer-empty">This folder is empty.</div>`;
    }

    const items = Object.values(node.children);
    if (items.length === 0) {
      return `<div class="explorer-empty">This folder is empty.</div>`;
    }

    let html = `<div class="explorer-files-grid">`;
    items.forEach(item => {
      const isFolder = item.type === 'folder';
      const isAudio = item.type === 'audio' || item.name.endsWith('.mp3') || item.name.endsWith('.wav');
      const icon = isFolder ? WinIcons.folder : (isAudio ? WinIcons.groove : WinIcons.textFile);
      html += `
        <div class="file-item-card" data-name="${item.name}" data-type="${item.type}">
          <div class="file-card-icon">${icon}</div>
          <div class="file-card-name" title="${item.name}">${item.name}</div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  attachEvents(body) {
    // Navigation controls
    const backBtn = body.querySelector('#exp-nav-back');
    const fwdBtn = body.querySelector('#exp-nav-forward');
    const upBtn = body.querySelector('#exp-nav-up');
    const refBtn = body.querySelector('#exp-nav-refresh');

    if (backBtn) backBtn.addEventListener('click', () => this.goBack());
    if (fwdBtn) fwdBtn.addEventListener('click', () => this.goForward());
    if (upBtn) upBtn.addEventListener('click', () => this.goUp());
    if (refBtn) refBtn.addEventListener('click', () => this.render());

    // Sidebar items
    const treeItems = body.querySelectorAll('.tree-item');
    treeItems.forEach(item => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        if (path) this.navigateTo(path);
      });
    });

    // Content view click / double click
    const cards = body.querySelectorAll('.pc-folder-card, .pc-drive-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
      card.addEventListener('dblclick', () => {
        const path = card.dataset.path;
        if (path) this.navigateTo(path);
      });
    });

    const fileCards = body.querySelectorAll('.file-item-card');
    fileCards.forEach(card => {
      card.addEventListener('click', () => {
        fileCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedItem = card.dataset.name;
      });

      card.addEventListener('dblclick', () => {
        const name = card.dataset.name;
        const type = card.dataset.type;
        if (type === 'folder') {
          this.navigateTo(`${this.currentPath}/${name}`);
        } else if (type === 'audio' || name.endsWith('.mp3') || name.endsWith('.wav')) {
          GrooveMusicApp.open(name.replace(/\.[^/.]+$/, ''));
        } else {
          // Open in Notepad
          const node = WinState.resolvePath(this.currentPath);
          if (node && node.children && node.children[name]) {
            const fileData = node.children[name];
            NotepadApp.open(name, fileData.content || '', `${this.currentPath}/${name}`);
          }
        }
      });
    });

    // Ribbon Actions
    const newFolderBtn = body.querySelector('#exp-new-folder');
    const newDocBtn = body.querySelector('#exp-new-doc');
    const delBtn = body.querySelector('#exp-delete');

    if (newFolderBtn) {
      newFolderBtn.addEventListener('click', () => {
        const node = WinState.resolvePath(this.currentPath);
        if (node && node.children) {
          const folderName = 'New folder ' + Math.floor(Math.random() * 100);
          node.children[folderName] = {
            type: 'folder',
            name: folderName,
            children: {}
          };
          this.render();
        }
      });
    }

    if (newDocBtn) {
      newDocBtn.addEventListener('click', () => {
        const node = WinState.resolvePath(this.currentPath);
        if (node && node.children) {
          const docName = 'New Text Document ' + Math.floor(Math.random() * 100) + '.txt';
          node.children[docName] = {
            type: 'file',
            name: docName,
            ext: 'txt',
            size: '0 bytes',
            date: '10/22/2026',
            content: ''
          };
          this.render();
        }
      });
    }

    if (delBtn) {
      delBtn.addEventListener('click', () => {
        if (!this.selectedItem) return;
        const node = WinState.resolvePath(this.currentPath);
        if (node && node.children && node.children[this.selectedItem]) {
          delete node.children[this.selectedItem];
          this.selectedItem = null;
          this.render();
          if (window.WinAudio) window.WinAudio.playTrash();
        }
      });
    }

    // Address bar Enter key
    const addressInput = body.querySelector('.address-input');
    if (addressInput) {
      addressInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = addressInput.value.trim();
          if (val === 'This PC' || WinState.resolvePath(val)) {
            this.navigateTo(val);
          } else {
            if (window.WinAudio) window.WinAudio.playExclamation();
          }
        }
      });
    }
  }
}

window.FileExplorerApp = FileExplorerApp;
