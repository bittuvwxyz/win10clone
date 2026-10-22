/**
 * Windows 10 Command Prompt (cmd.exe)
 */

class CmdApp {
  static open() {
    const winId = 'cmd_' + Math.random().toString(36).substring(2, 7);
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Command Prompt',
      icon: 'cmd',
      width: 680,
      height: 420,
      minWidth: 400,
      minHeight: 250,
      content: ''
    });

    const instance = new CmdApp(win);
    instance.render();
    return instance;
  }

  constructor(winData) {
    this.winData = winData;
    this.currentPath = 'C:\\Users\\User';
    this.history = [];
    this.historyIndex = -1;
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="cmd-container" id="cmd-scroll-area">
        <div class="cmd-banner">
          Microsoft Windows [Version 10.0.19045.3803]<br/>
          (c) Microsoft Corporation. All rights reserved.<br/><br/>
          Type <span class="cmd-hl">help</span> to view available commands.
        </div>
        <div class="cmd-output" id="cmd-history-log"></div>
        <div class="cmd-input-line">
          <span class="cmd-prompt-label" id="cmd-prompt-text">${this.currentPath}&gt;</span>
          <input type="text" class="cmd-input-field" id="cmd-input" spellcheck="false" autocomplete="off" />
        </div>
      </div>
    `;

    this.attachEvents(body);
  }

  attachEvents(body) {
    const input = body.querySelector('#cmd-input');
    const log = body.querySelector('#cmd-history-log');
    const scrollArea = body.querySelector('#cmd-scroll-area');
    const promptText = body.querySelector('#cmd-prompt-text');

    // Click anywhere in window focuses input
    body.addEventListener('click', () => {
      input.focus();
    });

    setTimeout(() => input.focus(), 50);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdStr = input.value.trim();
        input.value = '';

        if (cmdStr) {
          this.history.push(cmdStr);
          this.historyIndex = this.history.length;
        }

        // Print entered command
        const lineEl = document.createElement('div');
        lineEl.className = 'cmd-log-row';
        lineEl.innerHTML = `<span class="cmd-past-prompt">${this.currentPath}&gt;</span> ${this.escapeHtml(cmdStr)}`;
        log.appendChild(lineEl);

        // Process command
        const outEl = document.createElement('div');
        outEl.className = 'cmd-log-output';
        outEl.innerHTML = this.executeCommand(cmdStr);
        log.appendChild(outEl);

        promptText.textContent = `${this.currentPath}>`;
        scrollArea.scrollTop = scrollArea.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          input.value = '';
        }
      }
    });
  }

  escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  executeCommand(rawCmd) {
    if (!rawCmd) return '';

    const parts = rawCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        return `
Supported commands:
  HELP         Displays this help message
  DIR          Displays list of files and subdirectories in a directory
  CD           Changes the current directory (e.g. "cd Desktop" or "cd ..")
  CLS          Clears the screen
  VER          Displays the Windows version
  DATE         Displays current date
  TIME         Displays current time
  ECHO [text]  Displays text on screen
  COLOR [code] Changes console text color (a=green, b=cyan, c=red, e=yellow, f=white)
  IPCONFIG     Displays Windows IP Configuration
  SYSTEMINFO   Displays detailed configuration information about the PC
  CALC         Launches the Calculator application
  NOTEPAD      Launches the Notepad application
  GROOVE       Launches Groove Music player
  EXPLORER     Launches File Explorer / This PC
  SETTINGS     Launches Windows Settings
  EXIT         Quits the CMD.EXE program
`;

      case 'ver':
        return 'Microsoft Windows [Version 10.0.19045.3803]';

      case 'date':
        return `The current date is: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' })}`;

      case 'time':
        return `The current time is: ${new Date().toLocaleTimeString('en-US')}`;

      case 'echo':
        return args.join(' ');

      case 'cls': {
        const log = this.winData.element.querySelector('#cmd-history-log');
        if (log) log.innerHTML = '';
        return '';
      }

      case 'color': {
        const code = (args[0] || '').toLowerCase();
        const colors = {
          'a': '#00FF66',
          'b': '#00FFFF',
          'c': '#FF3333',
          'd': '#FF33FF',
          'e': '#FFFF33',
          'f': '#FFFFFF',
          '7': '#CCCCCC'
        };
        const selectedColor = colors[code] || '#CCCCCC';
        this.winData.element.querySelector('.cmd-container').style.color = selectedColor;
        return '';
      }

      case 'ipconfig':
        return `
Windows IP Configuration

Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . : localdomain
   Link-local IPv6 Address . . . . . : fe80::d911:e96a:208:44cf%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.104
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
`;

      case 'systeminfo':
        return `
OS Name:                   Microsoft Windows 10 Pro
OS Version:                10.0.19045 N/A Build 19045.3803
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Workstation
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Product ID:                00330-80000-00000-AAOEM
Total Physical Memory:     32,684 MB
Available Physical Memory: 21,450 MB
Virtual Memory: Max Size:  37,804 MB
Virtual Memory: Available: 24,912 MB
`;

      case 'calc':
        CalculatorApp.open();
        return 'Launching Calculator...';

      case 'groove':
      case 'music':
        GrooveMusicApp.open();
        return 'Launching Groove Music...';

      case 'notepad':
        if (args.length > 0) {
          const fileName = args[0];
          const node = WinState.resolvePath(this.currentPath.replace(/\\/g, '/'));
          const file = node && node.children ? node.children[fileName] : null;
          NotepadApp.open(fileName, file ? file.content : '', `${this.currentPath.replace(/\\/g, '/')}/${fileName}`);
        } else {
          NotepadApp.open();
        }
        return 'Launching Notepad...';

      case 'explorer':
        FileExplorerApp.open(this.currentPath.replace(/\\/g, '/'));
        return 'Launching File Explorer...';

      case 'settings':
        SettingsApp.open();
        return 'Launching Settings...';

      case 'exit':
        window.WinWindowManager.closeWindow(this.winData.id);
        return '';

      case 'cd': {
        const target = args[0];
        if (!target || target === '.') return '';
        if (target === '..') {
          const parts = this.currentPath.split('\\');
          if (parts.length > 1) {
            parts.pop();
            this.currentPath = parts.join('\\');
            if (this.currentPath.endsWith(':')) this.currentPath += '\\';
          }
          return '';
        }

        const normPath = this.currentPath.replace(/\\/g, '/');
        const node = WinState.resolvePath(normPath);
        if (node && node.children && node.children[target] && node.children[target].type === 'folder') {
          this.currentPath = this.currentPath.endsWith('\\') ? `${this.currentPath}${target}` : `${this.currentPath}\\${target}`;
          return '';
        }
        return `The system cannot find the path specified.`;
      }

      case 'dir': {
        const normPath = this.currentPath.replace(/\\/g, '/');
        const node = WinState.resolvePath(normPath);
        if (!node || !node.children) {
          return ' Directory of ' + this.currentPath + '<br/><br/>File Not Found';
        }

        let out = ` Volume in drive C has no label.<br/> Volume Serial Number is 4C19-AE8B<br/><br/> Directory of ${this.currentPath}<br/><br/>`;
        out += `10/22/2026  11:00 PM    &lt;DIR&gt;          .<br/>`;
        out += `10/22/2026  11:00 PM    &lt;DIR&gt;          ..<br/>`;

        let fileCount = 0;
        let dirCount = 2;
        let totalBytes = 0;

        Object.values(node.children).forEach(item => {
          if (item.type === 'folder') {
            dirCount++;
            out += `10/22/2026  11:00 PM    &lt;DIR&gt;          ${item.name}<br/>`;
          } else {
            fileCount++;
            const sizeStr = (item.size || '100 bytes').replace(/[^0-9]/g, '');
            const bytes = parseInt(sizeStr, 10) || 128;
            totalBytes += bytes;
            out += `10/22/2026  11:00 PM             ${bytes.toLocaleString().padStart(8, ' ')} ${item.name}<br/>`;
          }
        });

        out += `<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${fileCount} File(s)    ${totalBytes.toLocaleString()} bytes<br/>`;
        out += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dirCount} Dir(s)   142,508,828,672 bytes free`;
        return out;
      }

      default:
        return `'${command}' is not recognized as an internal or external command,<br/>operable program or batch file.`;
    }
  }
}

window.CmdApp = CmdApp;
