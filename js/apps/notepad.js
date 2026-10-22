/**
 * Windows 10 Notepad Application
 */

class NotepadApp {
  static open(fileName = 'Untitled.txt', initialContent = '', filePath = null) {
    const winId = 'notepad_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: `${fileName} - Notepad`,
      icon: 'notepad',
      width: 680,
      height: 480,
      minWidth: 360,
      minHeight: 240,
      content: ''
    });

    const instance = new NotepadApp(win, fileName, initialContent, filePath);
    instance.render();
    return instance;
  }

  constructor(winData, fileName, content, filePath) {
    this.winData = winData;
    this.fileName = fileName;
    this.content = content;
    this.filePath = filePath;
    this.isDirty = false;
    this.wordWrap = true;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="notepad-container">
        <!-- Menu Bar -->
        <div class="notepad-menubar">
          <div class="notepad-menu-item" data-menu="file">File
            <div class="notepad-dropdown file-dropdown">
              <div class="menu-action" id="np-new">New <span class="shortcut">Ctrl+N</span></div>
              <div class="menu-action" id="np-save">Save <span class="shortcut">Ctrl+S</span></div>
              <div class="menu-action" id="np-download">Download File</div>
              <div class="menu-separator"></div>
              <div class="menu-action" id="np-exit">Exit</div>
            </div>
          </div>
          <div class="notepad-menu-item" data-menu="edit">Edit
            <div class="notepad-dropdown edit-dropdown">
              <div class="menu-action" id="np-datetime">Time/Date <span class="shortcut">F5</span></div>
              <div class="menu-separator"></div>
              <div class="menu-action" id="np-selectall">Select All <span class="shortcut">Ctrl+A</span></div>
              <div class="menu-action" id="np-clear">Clear All</div>
            </div>
          </div>
          <div class="notepad-menu-item" data-menu="format">Format
            <div class="notepad-dropdown format-dropdown">
              <div class="menu-action" id="np-wordwrap">✓ Word Wrap</div>
            </div>
          </div>
          <div class="notepad-menu-item" data-menu="help">Help
            <div class="notepad-dropdown help-dropdown">
              <div class="menu-action" id="np-about">About Notepad</div>
            </div>
          </div>
        </div>

        <!-- Text Area -->
        <textarea class="notepad-textarea ${this.wordWrap ? 'wrap' : 'nowrap'}" spellcheck="false">${this.escapeHtml(this.content)}</textarea>

        <!-- Status Bar -->
        <div class="notepad-statusbar">
          <div class="status-left">Ready</div>
          <div class="status-right">
            <span class="status-field" id="np-cursor-pos">Ln 1, Col 1</span>
            <span class="status-field">100%</span>
            <span class="status-field">Windows (CRLF)</span>
            <span class="status-field">UTF-8</span>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  escapeHtml(text) {
    return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  attachEvents(body) {
    const textarea = body.querySelector('.notepad-textarea');
    const cursorPosEl = body.querySelector('#np-cursor-pos');

    // Track cursor and text changes
    const updateCursor = () => {
      const text = textarea.value.substr(0, textarea.selectionStart);
      const lines = text.split('\n');
      const curLine = lines.length;
      const curCol = lines[lines.length - 1].length + 1;
      cursorPosEl.textContent = `Ln ${curLine}, Col ${curCol}`;
    };

    textarea.addEventListener('keyup', updateCursor);
    textarea.addEventListener('click', updateCursor);

    textarea.addEventListener('input', () => {
      if (!this.isDirty) {
        this.isDirty = true;
        const titleEl = this.winData.element.querySelector('.win-title-text');
        if (titleEl) titleEl.textContent = `*${this.fileName} - Notepad`;
      }
    });

    // Handle Menus Click Outside
    const menuItems = body.querySelectorAll('.notepad-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        menuItems.forEach(m => m.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    document.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('open'));
    });

    // File Actions
    const newBtn = body.querySelector('#np-new');
    const saveBtn = body.querySelector('#np-save');
    const downloadBtn = body.querySelector('#np-download');
    const exitBtn = body.querySelector('#np-exit');
    const dtBtn = body.querySelector('#np-datetime');
    const selectAllBtn = body.querySelector('#np-selectall');
    const clearBtn = body.querySelector('#np-clear');
    const aboutBtn = body.querySelector('#np-about');

    if (newBtn) {
      newBtn.addEventListener('click', () => {
        textarea.value = '';
        this.fileName = 'Untitled.txt';
        this.filePath = null;
        this.isDirty = false;
        const titleEl = this.winData.element.querySelector('.win-title-text');
        if (titleEl) titleEl.textContent = `${this.fileName} - Notepad`;
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveFile(textarea.value));
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadAsFile(textarea.value));
    }

    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        window.WinWindowManager.closeWindow(this.winData.id);
      });
    }

    if (dtBtn) {
      dtBtn.addEventListener('click', () => {
        const now = new Date();
        const dtStr = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + dtStr + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + dtStr.length;
        textarea.focus();
      });
    }

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        textarea.select();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
      });
    }

    if (aboutBtn) {
      aboutBtn.addEventListener('click', () => {
        alert('Windows 10 Notepad\nVersion 22H2 (OS Build 19045.3803)\n© Microsoft Corporation. All rights reserved.');
      });
    }

    // Keyboard Shortcuts (Ctrl+S, Ctrl+N)
    textarea.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveFile(textarea.value);
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        NotepadApp.open();
      }
    });
  }

  saveFile(content) {
    if (this.filePath) {
      const parts = this.filePath.split('/');
      const fileName = parts.pop();
      const dirPath = parts.join('/');
      const node = WinState.resolvePath(dirPath);
      if (node && node.children && node.children[fileName]) {
        node.children[fileName].content = content;
        node.children[fileName].size = `${content.length} bytes`;
      }
    } else {
      // Save to Desktop
      const desktop = WinState.resolvePath('C:/Users/User/Desktop');
      if (desktop && desktop.children) {
        desktop.children[this.fileName] = {
          type: 'file',
          name: this.fileName,
          ext: 'txt',
          size: `${content.length} bytes`,
          date: '10/22/2026',
          content
        };
        this.filePath = `C:/Users/User/Desktop/${this.fileName}`;
      }
    }

    this.isDirty = false;
    const titleEl = this.winData.element.querySelector('.win-title-text');
    if (titleEl) titleEl.textContent = `${this.fileName} - Notepad`;

    if (window.WinAudio) window.WinAudio.playNotification();
  }

  downloadAsFile(content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName.endsWith('.txt') ? this.fileName : `${this.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

window.NotepadApp = NotepadApp;
