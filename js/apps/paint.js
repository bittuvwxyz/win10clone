/**
 * Windows 10 Paint Application
 */

class PaintApp {
  static open() {
    const winId = 'paint_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Untitled - Paint',
      icon: 'paint',
      width: 780,
      height: 520,
      minWidth: 460,
      minHeight: 320,
      content: ''
    });

    const instance = new PaintApp(win);
    instance.render();
    return instance;
  }

  constructor(winData) {
    this.winData = winData;
    this.tool = 'brush'; // brush, eraser
    this.color = '#000000';
    this.brushSize = 3;
    this.isDrawing = false;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="paint-container">
        <!-- Paint Ribbon -->
        <div class="paint-ribbon">
          <div class="paint-tool-group">
            <button class="paint-ribbon-btn active" id="tool-brush" title="Brushes">
              <span class="p-icon">🖌️</span>
              <span class="p-label">Brush</span>
            </button>
            <button class="paint-ribbon-btn" id="tool-eraser" title="Eraser">
              <span class="p-icon">🧹</span>
              <span class="p-label">Eraser</span>
            </button>
            <button class="paint-ribbon-btn" id="tool-clear" title="Clear Canvas">
              <span class="p-icon">🗑️</span>
              <span class="p-label">Clear</span>
            </button>
          </div>

          <div class="paint-divider"></div>

          <!-- Brush Size -->
          <div class="paint-size-group">
            <span class="group-label">Size</span>
            <select class="paint-size-select" id="paint-size">
              <option value="1">1px (Thin)</option>
              <option value="3" selected>3px (Normal)</option>
              <option value="6">6px (Medium)</option>
              <option value="12">12px (Thick)</option>
            </select>
          </div>

          <div class="paint-divider"></div>

          <!-- Color Palette -->
          <div class="paint-colors-group">
            <div class="active-color-indicator" id="paint-cur-color" style="background: #000000;" title="Current Color"></div>
            <div class="paint-swatches">
              <div class="paint-swatch" data-color="#000000" style="background:#000000;"></div>
              <div class="paint-swatch" data-color="#7F7F7F" style="background:#7F7F7F;"></div>
              <div class="paint-swatch" data-color="#880015" style="background:#880015;"></div>
              <div class="paint-swatch" data-color="#ED1C24" style="background:#ED1C24;"></div>
              <div class="paint-swatch" data-color="#FF7F27" style="background:#FF7F27;"></div>
              <div class="paint-swatch" data-color="#FFF200" style="background:#FFF200;"></div>
              <div class="paint-swatch" data-color="#22B14C" style="background:#22B14C;"></div>
              <div class="paint-swatch" data-color="#00A2E8" style="background:#00A2E8;"></div>
              <div class="paint-swatch" data-color="#3F48CC" style="background:#3F48CC;"></div>
              <div class="paint-swatch" data-color="#A349A4" style="background:#A349A4;"></div>
              <div class="paint-swatch" data-color="#FFFFFF" style="background:#FFFFFF; border:1px solid #ccc;"></div>
              <div class="paint-swatch" data-color="#C3C3C3" style="background:#C3C3C3;"></div>
            </div>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="paint-canvas-wrapper" id="paint-wrapper">
          <canvas class="paint-canvas" id="paint-canvas" width="800" height="500"></canvas>
        </div>

        <!-- Status Bar -->
        <div class="paint-statusbar">
          <span>800 x 500px</span>
          <span id="paint-cursor-coords">0, 0px</span>
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  attachEvents(body) {
    const canvas = body.querySelector('#paint-canvas');
    const ctx = canvas.getContext('2d');
    const coordsEl = body.querySelector('#paint-cursor-coords');
    const curColorIndicator = body.querySelector('#paint-cur-color');

    // Fill white background initially
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let lastX = 0;
    let lastY = 0;

    const startDraw = (e) => {
      this.isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const draw = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      if (coordsEl) coordsEl.textContent = `${x}, ${y}px`;

      if (!this.isDrawing) return;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = this.tool === 'eraser' ? '#FFFFFF' : this.color;
      ctx.lineWidth = this.brushSize * (this.tool === 'eraser' ? 3 : 1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const stopDraw = () => {
      this.isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    // Tools
    const brushBtn = body.querySelector('#tool-brush');
    const eraserBtn = body.querySelector('#tool-eraser');
    const clearBtn = body.querySelector('#tool-clear');

    brushBtn.addEventListener('click', () => {
      this.tool = 'brush';
      brushBtn.classList.add('active');
      eraserBtn.classList.remove('active');
    });

    eraserBtn.addEventListener('click', () => {
      this.tool = 'eraser';
      eraserBtn.classList.add('active');
      brushBtn.classList.remove('active');
    });

    clearBtn.addEventListener('click', () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (window.WinAudio) window.WinAudio.playTrash();
    });

    // Brush Size
    const sizeSelect = body.querySelector('#paint-size');
    sizeSelect.addEventListener('change', () => {
      this.brushSize = parseInt(sizeSelect.value, 10) || 3;
    });

    // Color swatches
    body.querySelectorAll('.paint-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.color = swatch.dataset.color;
        curColorIndicator.style.background = this.color;
        if (this.tool === 'eraser') {
          this.tool = 'brush';
          brushBtn.classList.add('active');
          eraserBtn.classList.remove('active');
        }
      });
    });
  }
}

window.PaintApp = PaintApp;
