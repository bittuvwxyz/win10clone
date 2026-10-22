/**
 * Windows 10 Window Manager Engine
 * Complete window lifecycle, dragging, resizing, Aero snap, focus layering, and taskbar synchronization.
 */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindowId = null;
    this.topZIndex = 100;
    this.container = null;
    this.snapGhost = null;
    this.activeSnapTarget = null; // 'top', 'left', 'right', or null
  }

  init(containerElement) {
    this.container = containerElement;
    this.createSnapGhost();
  }

  createSnapGhost() {
    this.snapGhost = document.createElement('div');
    this.snapGhost.className = 'win-snap-ghost';
    this.container.appendChild(this.snapGhost);
  }

  openWindow(options) {
    const {
      id = 'win_' + Math.random().toString(36).substring(2, 9),
      title = 'Application',
      icon = 'startFlag',
      width = 750,
      height = 500,
      minWidth = 360,
      minHeight = 250,
      content = '',
      resizable = true,
      maximizable = true,
      minimizable = true
    } = options;

    // If window already exists, restore and bring to focus
    if (this.windows.has(id)) {
      const win = this.windows.get(id);
      if (win.isMinimized) {
        this.restoreWindow(id);
      } else {
        this.focusWindow(id);
      }
      return win;
    }

    // Calculate smart initial cascade position
    const offset = (this.windows.size * 30) % 150;
    const desktopRect = this.container.getBoundingClientRect();
    const initWidth = Math.min(width, desktopRect.width - 40);
    const initHeight = Math.min(height, desktopRect.height - 60);
    const initX = Math.max(20, Math.min(60 + offset, desktopRect.width - initWidth - 40));
    const initY = Math.max(20, Math.min(40 + offset, desktopRect.height - initHeight - 60));

    // Construct DOM element
    const winEl = document.createElement('div');
    winEl.className = 'win-window';
    winEl.id = `window-${id}`;
    winEl.style.width = `${initWidth}px`;
    winEl.style.height = `${initHeight}px`;
    winEl.style.left = `${initX}px`;
    winEl.style.top = `${initY}px`;
    winEl.style.zIndex = ++this.topZIndex;

    const iconSvg = typeof WinIcons[icon] === 'string' ? WinIcons[icon] : (WinIcons.startFlag);

    winEl.innerHTML = `
      <div class="win-titlebar">
        <div class="win-title-left">
          <div class="win-title-icon">${iconSvg}</div>
          <span class="win-title-text">${title}</span>
        </div>
        <div class="win-controls">
          ${minimizable ? `<button class="win-control-btn win-btn-minimize" title="Minimize">${WinIcons.winMinimize}</button>` : ''}
          ${maximizable ? `<button class="win-control-btn win-btn-maximize" title="Maximize">${WinIcons.winMaximize}</button>` : ''}
          <button class="win-control-btn win-btn-close" title="Close">${WinIcons.winClose}</button>
        </div>
      </div>
      <div class="win-body">
        ${typeof content === 'string' ? content : ''}
      </div>
      ${resizable ? `
        <div class="win-resizer resizer-n" data-dir="n"></div>
        <div class="win-resizer resizer-s" data-dir="s"></div>
        <div class="win-resizer resizer-e" data-dir="e"></div>
        <div class="win-resizer resizer-w" data-dir="w"></div>
        <div class="win-resizer resizer-ne" data-dir="ne"></div>
        <div class="win-resizer resizer-nw" data-dir="nw"></div>
        <div class="win-resizer resizer-se" data-dir="se"></div>
        <div class="win-resizer resizer-sw" data-dir="sw"></div>
      ` : ''}
    `;

    if (content instanceof HTMLElement) {
      const body = winEl.querySelector('.win-body');
      body.innerHTML = '';
      body.appendChild(content);
    }

    this.container.appendChild(winEl);

    const winData = {
      id,
      title,
      icon,
      element: winEl,
      isMinimized: false,
      isMaximized: false,
      isSnapped: null, // 'left' or 'right'
      normalRect: { x: initX, y: initY, width: initWidth, height: initHeight },
      minWidth,
      minHeight,
      options
    };

    this.windows.set(id, winData);

    // Attach listeners
    this.attachWindowEvents(winData);
    this.focusWindow(id);

    // Notify taskbar
    if (window.TaskbarManager) {
      window.TaskbarManager.onWindowOpened(winData);
    }

    return winData;
  }

  attachWindowEvents(winData) {
    const { element: el, id } = winData;
    const titlebar = el.querySelector('.win-titlebar');

    // Focus on click anywhere
    el.addEventListener('mousedown', () => {
      this.focusWindow(id);
    });

    // Control buttons
    const minBtn = el.querySelector('.win-btn-minimize');
    const maxBtn = el.querySelector('.win-btn-maximize');
    const closeBtn = el.querySelector('.win-btn-close');

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(id);
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(id);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(id);
      });
    }

    // Titlebar double click to toggle maximize
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.win-controls')) return;
      this.toggleMaximize(id);
    });

    // Titlebar drag & Aero snap
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win-controls')) return;
      this.startDrag(e, winData);
    });

    // Edge / Corner resizers
    const resizers = el.querySelectorAll('.win-resizer');
    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.startResize(e, winData, resizer.dataset.dir);
      });
    });
  }

  focusWindow(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);

    // Remove active class from all
    this.windows.forEach(w => {
      w.element.classList.remove('win-active');
    });

    winData.element.style.zIndex = ++this.topZIndex;
    winData.element.classList.add('win-active');
    this.activeWindowId = id;

    if (window.TaskbarManager) {
      window.TaskbarManager.onWindowFocused(id);
    }
  }

  minimizeWindow(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);
    winData.isMinimized = true;
    winData.element.classList.add('win-minimized');
    winData.element.classList.remove('win-active');

    // Transfer focus to next available top window
    let nextTop = null;
    let maxZ = -1;
    this.windows.forEach(w => {
      if (!w.isMinimized && w.id !== id) {
        const z = parseInt(w.element.style.zIndex, 10) || 0;
        if (z > maxZ) {
          maxZ = z;
          nextTop = w;
        }
      }
    });

    if (nextTop) {
      this.focusWindow(nextTop.id);
    } else {
      this.activeWindowId = null;
    }

    if (window.TaskbarManager) {
      window.TaskbarManager.onWindowMinimized(id);
    }
  }

  restoreWindow(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);
    winData.isMinimized = false;
    winData.element.classList.remove('win-minimized');
    this.focusWindow(id);

    if (window.TaskbarManager) {
      window.TaskbarManager.onWindowRestored(id);
    }
  }

  toggleMaximize(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);
    if (winData.isMaximized || winData.isSnapped) {
      this.restoreNormalSize(winData);
    } else {
      this.maximizeWindow(id);
    }
  }

  maximizeWindow(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);
    const el = winData.element;

    if (!winData.isMaximized && !winData.isSnapped) {
      winData.normalRect = {
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        width: parseFloat(el.style.width),
        height: parseFloat(el.style.height)
      };
    }

    winData.isMaximized = true;
    winData.isSnapped = null;
    el.classList.add('win-maximized');
    el.classList.remove('win-snapped-left', 'win-snapped-right');

    const maxBtn = el.querySelector('.win-btn-maximize');
    if (maxBtn) {
      maxBtn.innerHTML = WinIcons.winRestore;
      maxBtn.title = 'Restore Down';
    }
  }

  restoreNormalSize(winData) {
    const el = winData.element;
    winData.isMaximized = false;
    winData.isSnapped = null;
    el.classList.remove('win-maximized', 'win-snapped-left', 'win-snapped-right');

    const { x, y, width, height } = winData.normalRect;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    const maxBtn = el.querySelector('.win-btn-maximize');
    if (maxBtn) {
      maxBtn.innerHTML = WinIcons.winMaximize;
      maxBtn.title = 'Maximize';
    }
  }

  closeWindow(id) {
    if (!this.windows.has(id)) return;
    const winData = this.windows.get(id);

    // Call optional custom onClose
    if (winData.options && typeof winData.options.onClose === 'function') {
      winData.options.onClose();
    }

    // Trigger subtle close animation
    winData.element.classList.add('win-closing');
    setTimeout(() => {
      if (winData.element.parentNode) {
        winData.element.parentNode.removeChild(winData.element);
      }
      this.windows.delete(id);

      if (this.activeWindowId === id) {
        this.activeWindowId = null;
        let nextTop = null;
        let maxZ = -1;
        this.windows.forEach(w => {
          if (!w.isMinimized) {
            const z = parseInt(w.element.style.zIndex, 10) || 0;
            if (z > maxZ) {
              maxZ = z;
              nextTop = w;
            }
          }
        });
        if (nextTop) this.focusWindow(nextTop.id);
      }

      if (window.TaskbarManager) {
        window.TaskbarManager.onWindowClosed(id);
      }
    }, 120);
  }

  startDrag(e, winData) {
    e.preventDefault();
    this.focusWindow(winData.id);

    const el = winData.element;
    const desktopRect = this.container.getBoundingClientRect();
    let startX = e.clientX;
    let startY = e.clientY;

    let initX = parseFloat(el.style.left);
    let initY = parseFloat(el.style.top);

    // If dragging while maximized or snapped, restore immediately around cursor
    if (winData.isMaximized || winData.isSnapped) {
      const origWidth = winData.normalRect.width || 700;
      const cursorRatio = Math.max(0.1, Math.min(0.9, e.clientX / desktopRect.width));
      initX = e.clientX - (origWidth * cursorRatio);
      initY = e.clientY - 15;

      this.restoreNormalSize(winData);
      el.style.left = `${initX}px`;
      el.style.top = `${initY}px`;
    }

    document.body.classList.add('user-dragging');

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = initX + dx;
      let newY = Math.max(0, initY + dy);

      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;

      // Aero Snap detection
      this.checkAeroSnap(moveEvent.clientX, moveEvent.clientY, desktopRect);
    };

    const onMouseUp = (upEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('user-dragging');

      this.hideSnapGhost();

      if (this.activeSnapTarget === 'top') {
        this.maximizeWindow(winData.id);
      } else if (this.activeSnapTarget === 'left') {
        this.snapWindow(winData, 'left');
      } else if (this.activeSnapTarget === 'right') {
        this.snapWindow(winData, 'right');
      } else {
        // Keep normal rect up to date
        winData.normalRect.x = parseFloat(el.style.left);
        winData.normalRect.y = parseFloat(el.style.top);
      }

      this.activeSnapTarget = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  checkAeroSnap(mouseX, mouseY, desktopRect) {
    const snapThreshold = 12;

    if (mouseY <= snapThreshold) {
      this.showSnapGhost('top', desktopRect);
      this.activeSnapTarget = 'top';
    } else if (mouseX <= snapThreshold) {
      this.showSnapGhost('left', desktopRect);
      this.activeSnapTarget = 'left';
    } else if (mouseX >= desktopRect.width - snapThreshold) {
      this.showSnapGhost('right', desktopRect);
      this.activeSnapTarget = 'right';
    } else {
      this.hideSnapGhost();
      this.activeSnapTarget = null;
    }
  }

  showSnapGhost(position, desktopRect) {
    this.snapGhost.classList.add('active');
    if (position === 'top') {
      this.snapGhost.style.left = '0px';
      this.snapGhost.style.top = '0px';
      this.snapGhost.style.width = `${desktopRect.width}px`;
      this.snapGhost.style.height = `${desktopRect.height}px`;
    } else if (position === 'left') {
      this.snapGhost.style.left = '0px';
      this.snapGhost.style.top = '0px';
      this.snapGhost.style.width = `${desktopRect.width / 2}px`;
      this.snapGhost.style.height = `${desktopRect.height}px`;
    } else if (position === 'right') {
      this.snapGhost.style.left = `${desktopRect.width / 2}px`;
      this.snapGhost.style.top = '0px';
      this.snapGhost.style.width = `${desktopRect.width / 2}px`;
      this.snapGhost.style.height = `${desktopRect.height}px`;
    }
  }

  hideSnapGhost() {
    this.snapGhost.classList.remove('active');
  }

  snapWindow(winData, side) {
    const el = winData.element;
    const desktopRect = this.container.getBoundingClientRect();

    if (!winData.isMaximized && !winData.isSnapped) {
      winData.normalRect = {
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        width: parseFloat(el.style.width),
        height: parseFloat(el.style.height)
      };
    }

    winData.isSnapped = side;
    winData.isMaximized = false;
    el.classList.remove('win-maximized');

    if (side === 'left') {
      el.classList.add('win-snapped-left');
      el.classList.remove('win-snapped-right');
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = `${desktopRect.width / 2}px`;
      el.style.height = `${desktopRect.height}px`;
    } else {
      el.classList.add('win-snapped-right');
      el.classList.remove('win-snapped-left');
      el.style.left = `${desktopRect.width / 2}px`;
      el.style.top = '0px';
      el.style.width = `${desktopRect.width / 2}px`;
      el.style.height = `${desktopRect.height}px`;
    }
  }

  startResize(e, winData, direction) {
    e.preventDefault();
    this.focusWindow(winData.id);

    const el = winData.element;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseFloat(el.style.width);
    const startHeight = parseFloat(el.style.height);
    const startLeft = parseFloat(el.style.left);
    const startTop = parseFloat(el.style.top);

    document.body.classList.add('user-resizing');

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      if (direction.includes('e')) {
        newWidth = Math.max(winData.minWidth, startWidth + dx);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(winData.minHeight, startHeight + dy);
      }
      if (direction.includes('w')) {
        const potentialWidth = startWidth - dx;
        if (potentialWidth >= winData.minWidth) {
          newWidth = potentialWidth;
          newLeft = startLeft + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialHeight = startHeight - dy;
        if (potentialHeight >= winData.minHeight) {
          newHeight = potentialHeight;
          newTop = startTop + dy;
        }
      }

      el.style.width = `${newWidth}px`;
      el.style.height = `${newHeight}px`;
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;

      winData.normalRect = { x: newLeft, y: newTop, width: newWidth, height: newHeight };
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('user-resizing');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  getWindow(id) {
    return this.windows.get(id);
  }
}

window.WinWindowManager = new WindowManager();
