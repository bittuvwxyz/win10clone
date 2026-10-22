# Windows 10 Web Desktop UI (HTML, CSS, JS)

A pure **HTML5, CSS3, and JavaScript** implementation of the **Windows 10 Desktop Operating System UI**. Built from the ground up with vector SVG icons, Aero acrylic backdrop effects, and authentic Windows 10 design language.

---

## 🌟 Key Features

### 1. Desktop Experience & Window Management
- **Authentic Hero Wallpaper**: Laser-light beam 4-pane volumetric glow in perspective, plus 3 alternate switchable themes (*Windows Light*, *Scenic Coast*, *Minimal Carbon*).
- **Desktop Icons**: Single-click selection, double-click to launch, draggable blue marquee selection box.
- **Window Management**:
  - Drag windows by titlebar with boundary constraints.
  - **Aero Snap**: Drag to top edge to maximize, drag to left/right edge to snap 50/50 with blue ghost preview.
  - 8-direction edge & corner resizers (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`).
  - Minimize (`─`), Maximize/Restore (`□` / `❐`), Close (`✕` with red hover).
  - Dynamic z-index focus layering and taskbar sync.
- **Desktop Context Menu**: Right-click on desktop for View options, Sort by, Refresh, New (Folder / Text Document), Display settings, and Personalization.

---

### 2. Windows 10 Taskbar
- **Start Button**: Windows 10 flag vector icon; highlights blue on click.
- **Search Bar**: "Type here to search" box opening interactive Cortana/Search flyout with live search filters.
- **Task View Button**: Shows virtual desktops and active task view.
- **Pinned & Running Apps**:
  - Running indicator line below icons.
  - Active focused window highlighted plate + glowing accent bar.
  - Minimized state handling.
- **System Tray**:
  - `^` Chevron for hidden icons.
  - Wi-Fi icon opening network flyout.
  - Audio/Speaker icon opening master volume slider flyout.
  - Battery status indicator.
  - Real-time digital clock & date updating every second.
  - Action Center speech bubble icon with unread notification badge.
  - Show Desktop vertical peek slice on extreme right edge.

---

### 3. Windows 10 Start Menu
- **Left Action Rail**:
  - Hamburger expander (`☰` expands rail to show text labels).
  - User profile avatar & name ("Windows User").
  - Quick shortcuts: Documents, Pictures, Settings.
  - Power button with Sleep, Shut down, and Restart actions.
- **Middle Alphabetical Apps List**:
  - Grouped by letter (`C`, `F`, `M`, `N`, `P`, `S`, `T`).
  - Launches Calculator, Command Prompt, Explorer, Edge, Notepad, Paint, Settings, Task Manager.
- **Right Live Tiles Section**:
  - **Productivity Group**: Microsoft Edge, Mail (live 3D flip animation), Calendar (real-time current day & date), This PC, Microsoft Store.
  - **Explore Group**: Weather (live sunny temperature card), Calculator, Settings, Photos.

---

### 4. Interactive Windows 10 Applications
1. **This PC / File Explorer**:
   - Win10 Ribbon (File, Home, Share, View, New Folder, New Document, Delete).
   - Breadcrumb navigation (`←`, `→`, `↑`, path bar, refresh, search).
   - Left treeview (Quick Access: Desktop, Downloads, Documents, Pictures; Drives: C:, D:).
   - "This PC" view with 6 system folders and storage gauges for `Local Disk (C:)` and `Data (D:)`.
   - Double-click folders to navigate, double-click text files to open in Notepad.
2. **Notepad**:
   - File, Edit, Format, View, Help menus.
   - Text editing, line wrap, cursor row/col tracking in status bar.
   - Real file download (saves `.txt` directly to user's computer via Blob API).
   - Virtual filesystem saving.
3. **Calculator**:
   - Standard mode with display and expression history.
   - Memory buttons (`MC`, `MR`, `M+`, `M-`, `MS`).
   - Arithmetic, `1/x`, `x²`, `√x`, `%`, `±`, and keyboard support.
4. **Settings**:
   - System, Devices, Network & Internet, Personalization, Apps, Accounts, Time & Language, Update & Security.
   - **Personalization**: Change desktop wallpapers in real time, customize accent colors, toggle dark/light taskbar.
   - **System -> About**: Device & Windows specifications.
5. **Command Prompt (`cmd.exe`)**:
   - Authentic black terminal with raster font and `C:\Users\User>` prompt.
   - Working commands: `help`, `dir`, `cd`, `ver`, `cls`, `date`, `time`, `echo`, `color`, `ipconfig`, `systeminfo`, `calc`, `notepad`, `explorer`, `settings`, `exit`.
6. **Microsoft Edge**:
   - Tabs, address bar with SSL padlock, back/forward/refresh.
   - Favorites bar (Google, Wikipedia, GitHub, MDN).
   - Start page with MSN-style news tiles and search engine simulator.
7. **Paint**:
   - Ribbon with Brush, Eraser, Clear canvas.
   - Brush size selection (1px to 12px) and 12-color palette.
   - Interactive mouse drawing canvas.
8. **Task Manager**:
   - Processes tab with live CPU, Memory (MB), Disk I/O, and "End Task" button.
   - Performance tab with real-time animated CPU graph on canvas.
9. **Groove Music (Full-Fledged Music Player)**:
   - **My Music Navigation**: Songs, Albums, Artists, Playlists (Favorites, Synthwave 80s, Lofi Chill), Now Playing.
   - **Audio Synthesis Engine**: Real-time multi-track Web Audio synthesis for 5 built-in tracks (*Neon Horizon*, *Midnight Coffee*, *Cyber Drift*, *Starlight Reverie*, *Windows 10 Odyssey*).
   - **Local Audio Import**: Click "Add Audio File" or drag & drop real `.mp3` / `.wav` / `.ogg` files to play local music with real duration and metadata.
   - **Real-Time Spectrum Visualizer**: Animated canvas equalizer connected to Web Audio `AnalyserNode`.
   - **Playback Controls**: Shuffle, Repeat (Off/All/One), Previous, Next, Play/Pause, Draggable seek bar, Favorite heart toggle, and Volume control.
   - **Mini-Player Mode**: Toggle compact floating overlay mode with animated mini-visualizer.
   - **OS Integration**: Desktop icon, taskbar pin with active glow, Start Menu app list and Live Tile, File Explorer double-click audio playback.

---

### 5. Sound & Haptics (Web Audio API)
- Real-time synthesized chimes:
  - Notification chime (G5 -> C6 two-tone).
  - Hardware connect chime (arpeggio).
  - Recycle bin empty sound.
  - Volume slider audio ticks.

---

### 6. Keyboard Shortcuts
- `Win` or `Ctrl + Esc`: Toggle Start Menu
- `Win + D`: Show Desktop / minimize all
- `Win + E`: Open File Explorer (This PC)
- `Win + R`: Open Run Dialog
- `Win + A`: Toggle Action Center
- `Escape`: Close open menus, flyouts, and dialogs

---

## 🚀 How to Run

Simply open [index.html](file:///d:/UI10/index.html) in any modern web browser (Edge, Chrome, Firefox, Safari):

- Double click `index.html` or run:
  ```powershell
  Start-Process "d:\UI10\index.html"
  ```
- Or run a local web server:
  ```powershell
  python -m http.server 8080 --directory "d:\UI10"
  ```
  Then navigate to `http://localhost:8080` in your browser.
