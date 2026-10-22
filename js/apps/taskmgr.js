/**
 * Windows 10 Task Manager Application
 */

class TaskManagerApp {
  static open() {
    const winId = 'taskmgr_main';
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Task Manager',
      icon: 'taskmgr',
      width: 600,
      height: 480,
      minWidth: 420,
      minHeight: 320,
      content: ''
    });

    const instance = new TaskManagerApp(win);
    instance.render();
    return instance;
  }

  constructor(winData) {
    this.winData = winData;
    this.activeTab = 'processes'; // 'processes' or 'performance'
    this.cpuHistory = Array(40).fill(15);
    this.updateTimer = null;
    this.selectedProcessId = null;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="taskmgr-container">
        <!-- Tabs -->
        <div class="taskmgr-tabs">
          <button class="taskmgr-tab ${this.activeTab === 'processes' ? 'active' : ''}" id="tm-tab-proc">Processes</button>
          <button class="taskmgr-tab ${this.activeTab === 'performance' ? 'active' : ''}" id="tm-tab-perf">Performance</button>
        </div>

        <!-- Main Content Area -->
        <div class="taskmgr-content" id="tm-content-area">
          ${this.activeTab === 'processes' ? this.renderProcesses() : this.renderPerformance()}
        </div>

        <!-- Footer -->
        <div class="taskmgr-footer">
          <div class="taskmgr-status">Fewer details</div>
          <button class="taskmgr-btn" id="tm-end-task" disabled>End task</button>
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  renderProcesses() {
    const windows = Array.from(window.WinWindowManager.windows.values());
    let rowsHtml = '';

    windows.forEach(win => {
      const isSelected = this.selectedProcessId === win.id;
      const memMb = Math.floor(Math.random() * 40 + 25);
      const cpuVal = (Math.random() * 2.5).toFixed(1);
      const iconSvg = WinIcons[win.icon] || WinIcons.startFlag;

      rowsHtml += `
        <tr class="tm-row ${isSelected ? 'selected' : ''}" data-win-id="${win.id}">
          <td class="tm-cell-name">
            <span class="tm-app-icon">${iconSvg}</span>
            <span class="tm-app-label">${win.title}</span>
          </td>
          <td class="tm-cell-val">${cpuVal}%</td>
          <td class="tm-cell-val">${memMb} MB</td>
          <td class="tm-cell-val">0.1 MB/s</td>
        </tr>
      `;
    });

    // Add background Windows OS tasks
    const bgTasks = [
      { name: 'Windows Explorer', icon: 'fileExplorer', cpu: '0.4%', mem: '48.2 MB' },
      { name: 'Desktop Window Manager (dwm.exe)', icon: 'settings', cpu: '1.2%', mem: '34.5 MB' },
      { name: 'Windows Audio Device Graph', icon: 'volumeHigh', cpu: '0.1%', mem: '12.8 MB' },
      { name: 'Antimalware Service Executable', icon: 'settings', cpu: '0.5%', mem: '115.4 MB' }
    ];

    bgTasks.forEach(task => {
      rowsHtml += `
        <tr class="tm-row bg-task">
          <td class="tm-cell-name">
            <span class="tm-app-icon">${WinIcons[task.icon] || WinIcons.settings}</span>
            <span class="tm-app-label">${task.name}</span>
          </td>
          <td class="tm-cell-val">${task.cpu}</td>
          <td class="tm-cell-val">${task.mem}</td>
          <td class="tm-cell-val">0.0 MB/s</td>
        </tr>
      `;
    });

    return `
      <div class="tm-proc-table-wrapper">
        <table class="tm-table">
          <thead>
            <tr>
              <th style="width: 50%;">Name</th>
              <th style="width: 16%;">CPU</th>
              <th style="width: 18%;">Memory</th>
              <th style="width: 16%;">Disk</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  renderPerformance() {
    return `
      <div class="tm-perf-view">
        <div class="perf-metric-header">
          <div class="perf-metric-title">CPU</div>
          <div class="perf-metric-val" id="perf-cpu-pct">18% 3.20 GHz</div>
        </div>
        <div class="perf-graph-container">
          <canvas class="perf-canvas" id="perf-cpu-canvas" width="500" height="220"></canvas>
        </div>
        <div class="perf-details-grid">
          <div>Utilization: <strong id="perf-util-txt">18%</strong></div>
          <div>Speed: <strong>3.20 GHz</strong></div>
          <div>Processes: <strong>148</strong></div>
          <div>Threads: <strong>1,892</strong></div>
          <div>Up time: <strong>0:04:18:22</strong></div>
        </div>
      </div>
    `;
  }

  attachEvents(body) {
    const procTab = body.querySelector('#tm-tab-proc');
    const perfTab = body.querySelector('#tm-tab-perf');
    const endTaskBtn = body.querySelector('#tm-end-task');

    procTab.addEventListener('click', () => {
      this.activeTab = 'processes';
      this.render();
    });

    perfTab.addEventListener('click', () => {
      this.activeTab = 'performance';
      this.render();
      this.startPerfGraph();
    });

    // Row selection
    body.querySelectorAll('.tm-row').forEach(row => {
      row.addEventListener('click', () => {
        body.querySelectorAll('.tm-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const winId = row.dataset.winId;
        if (winId) {
          this.selectedProcessId = winId;
          endTaskBtn.disabled = false;
        } else {
          this.selectedProcessId = null;
          endTaskBtn.disabled = true;
        }
      });
    });

    endTaskBtn.addEventListener('click', () => {
      if (this.selectedProcessId) {
        window.WinWindowManager.closeWindow(this.selectedProcessId);
        this.selectedProcessId = null;
        this.render();
      }
    });

    if (this.activeTab === 'performance') {
      this.startPerfGraph();
    }
  }

  startPerfGraph() {
    const canvas = this.winData.element.querySelector('#perf-cpu-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.updateTimer) clearInterval(this.updateTimer);

    this.updateTimer = setInterval(() => {
      if (!this.winData.element.parentNode || this.activeTab !== 'performance') {
        clearInterval(this.updateTimer);
        return;
      }

      // Add new sample
      const nextSample = Math.max(5, Math.min(95, this.cpuHistory[this.cpuHistory.length - 1] + (Math.random() * 20 - 10)));
      this.cpuHistory.shift();
      this.cpuHistory.push(nextSample);

      const pctEl = this.winData.element.querySelector('#perf-cpu-pct');
      const utilEl = this.winData.element.querySelector('#perf-util-txt');
      if (pctEl) pctEl.textContent = `${Math.round(nextSample)}% 3.20 GHz`;
      if (utilEl) utilEl.textContent = `${Math.round(nextSample)}%`;

      // Render graph
      ctx.fillStyle = '#0F1215';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#1F2933';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Curve
      ctx.beginPath();
      const step = canvas.width / (this.cpuHistory.length - 1);
      this.cpuHistory.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height - (val / 100 * canvas.height);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#107C41';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Area fill
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 124, 65, 0.2)';
      ctx.fill();
    }, 800);

    this.winData.options.onClose = () => {
      if (this.updateTimer) clearInterval(this.updateTimer);
    };
  }
}

window.TaskManagerApp = TaskManagerApp;
