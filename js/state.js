/**
 * Windows 10 Global State & Virtual File System
 */

const WinState = {
  theme: {
    accentColor: '#0078D7', // Default Windows 10 blue
    wallpaper: 'hero', // 'hero', 'light', 'scenic', 'carbon'
    taskbarDark: true,
    nightLight: false,
    volume: 75,
    muted: false,
    wifiEnabled: true,
    wifiConnected: true,
    bluetooth: true,
    battery: 94,
    isCharging: true
  },

  recycleBin: {
    items: [
      { id: 'rb-1', name: 'old_notes.tmp', size: '1.2 KB', date: '10/18/2026 2:14 PM' },
      { id: 'rb-2', name: 'draft_screenshot.png', size: '240 KB', date: '10/20/2026 9:30 AM' }
    ]
  },

  notifications: [
    {
      id: 'notif-1',
      app: 'Windows Security',
      icon: 'settings',
      title: 'Virus & threat protection',
      desc: 'No actions needed. Scan completed at 10:30 PM with 0 threats found.',
      time: '12m ago'
    },
    {
      id: 'notif-2',
      app: 'Microsoft Edge',
      icon: 'edge',
      title: 'Welcome to Windows 10 Web Experience',
      desc: 'Browse faster, safer and build with modern web standards.',
      time: '1h ago'
    },
    {
      id: 'notif-3',
      app: 'OneDrive',
      icon: 'folder',
      title: 'Files are synced',
      desc: 'Your Documents and Pictures folders are up to date.',
      time: '3h ago'
    }
  ],

  // Virtual Filesystem
  fileSystem: {
    'C:': {
      type: 'drive',
      name: 'Local Disk (C:)',
      totalSpace: 256,
      freeSpace: 142,
      children: {
        'Users': {
          type: 'folder',
          name: 'Users',
          children: {
            'User': {
              type: 'folder',
              name: 'User',
              children: {
                'Desktop': {
                  type: 'folder',
                  name: 'Desktop',
                  children: {
                    'Welcome to Windows 10.txt': {
                      type: 'file',
                      name: 'Welcome to Windows 10.txt',
                      ext: 'txt',
                      size: '418 bytes',
                      date: '10/22/2026 11:00 PM',
                      content: `Welcome to the Windows 10 HTML/CSS/JS Desktop Experience!

Features included:
• Functional Start Menu with Live Tiles & App List
• Full Window Management (Drag, Resize, Minimize, Maximize, Aero Snap)
• Windows 10 Taskbar with Search, Task View, and System Tray
• Interactive File Explorer ("This PC") with drives and virtual folders
• Fully functioning Notepad text editor (save and download files)
• Windows 10 Calculator with standard functions
• Microsoft Edge Browser simulator with search & quick links
• Windows Command Prompt (cmd.exe) with interactive commands
• Windows 10 Settings with working Personalization & Wallpapers
• Paint application for drawing
• Action Center, Sound flyout, Wi-Fi flyout, and Calendar widget

Enjoy exploring!`
                    },
                    'System Specs.txt': {
                      type: 'file',
                      name: 'System Specs.txt',
                      ext: 'txt',
                      size: '254 bytes',
                      date: '10/22/2026 11:15 PM',
                      content: `OS Name: Microsoft Windows 10 Pro
Version: 22H2 (OS Build 19045.3803)
Processor: Intel(R) Core(TM) i9-13900K @ 3.00 GHz
Installed RAM: 32.0 GB (31.8 GB usable)
System Type: 64-bit operating system, x64-based processor
Pen and touch: No pen or touch input is available for this display`
                    },
                    'Projects': {
                      type: 'folder',
                      name: 'Projects',
                      children: {
                        'readme.txt': {
                          type: 'file',
                          name: 'readme.txt',
                          ext: 'txt',
                          size: '110 bytes',
                          date: '10/21/2026 04:30 PM',
                          content: 'Frontend Projects:\n1. Windows 10 Web OS\n2. Fluent Design Components\n3. Modern Canvas Engine'
                        }
                      }
                    }
                  }
                },
                'Documents': {
                  type: 'folder',
                  name: 'Documents',
                  children: {
                    'Meeting Notes.txt': {
                      type: 'file',
                      name: 'Meeting Notes.txt',
                      ext: 'txt',
                      size: '180 bytes',
                      date: '10/21/2026 10:15 AM',
                      content: 'Discussed sprint goals and UI implementation milestones.\nNext review scheduled for Friday.'
                    },
                    'Budget 2026.txt': {
                      type: 'file',
                      name: 'Budget 2026.txt',
                      ext: 'txt',
                      size: '128 bytes',
                      date: '10/19/2026 03:40 PM',
                      content: 'Hardware: $2,500\nCloud Services: $600\nSoftware Licenses: $450\nReserve: $1,200'
                    }
                  }
                },
                'Downloads': {
                  type: 'folder',
                  name: 'Downloads',
                  children: {
                    'Setup_Installer.txt': {
                      type: 'file',
                      name: 'Setup_Installer.txt',
                      ext: 'txt',
                      size: '85 bytes',
                      date: '10/22/2026 08:12 PM',
                      content: 'Installation log: Windows packages verified and up-to-date.'
                    }
                  }
                },
                'Pictures': {
                  type: 'folder',
                  name: 'Pictures',
                  children: {
                    'Wallpaper_Info.txt': {
                      type: 'file',
                      name: 'Wallpaper_Info.txt',
                      ext: 'txt',
                      size: '95 bytes',
                      date: '10/20/2026 01:20 PM',
                      content: 'Windows 10 Hero Wallpaper created with laser light projection through glass panes.'
                    }
                  }
                },
                'Music': {
                  type: 'folder',
                  name: 'Music',
                  children: {
                    'Neon Horizon.mp3': {
                      type: 'audio',
                      name: 'Neon Horizon.mp3',
                      ext: 'mp3',
                      size: '4.8 MB',
                      date: '10/22/2026 10:15 PM'
                    },
                    'Midnight Coffee.mp3': {
                      type: 'audio',
                      name: 'Midnight Coffee.mp3',
                      ext: 'mp3',
                      size: '3.9 MB',
                      date: '10/21/2026 08:30 PM'
                    },
                    'Cyber Drift.mp3': {
                      type: 'audio',
                      name: 'Cyber Drift.mp3',
                      ext: 'mp3',
                      size: '4.4 MB',
                      date: '10/20/2026 06:12 PM'
                    }
                  }
                },
                'Videos': {
                  type: 'folder',
                  name: 'Videos',
                  children: {}
                }
              }
            }
          }
        },
        'Program Files': {
          type: 'folder',
          name: 'Program Files',
          children: {
            'Microsoft Edge': { type: 'folder', name: 'Microsoft Edge', children: {} },
            'Windows NT': { type: 'folder', name: 'Windows NT', children: {} }
          }
        },
        'Windows': {
          type: 'folder',
          name: 'Windows',
          children: {
            'System32': { type: 'folder', name: 'System32', children: {} }
          }
        }
      }
    },
    'D:': {
      type: 'drive',
      name: 'Data (D:)',
      totalSpace: 1024,
      freeSpace: 680,
      children: {
        'Backup': {
          type: 'folder',
          name: 'Backup',
          children: {
            'Archive_2026.txt': {
              type: 'file',
              name: 'Archive_2026.txt',
              ext: 'txt',
              size: '64 bytes',
              date: '10/10/2026 06:00 PM',
              content: 'All systems backup completed successfully.'
            }
          }
        },
        'Workspace': {
          type: 'folder',
          name: 'Workspace',
          children: {}
        }
      }
    }
  },

  // Helper method to retrieve path object
  resolvePath(pathStr) {
    if (!pathStr || pathStr === 'This PC') return { type: 'thispc' };
    
    // Normalize path separators
    const parts = pathStr.replace(/\\/g, '/').split('/').filter(p => p.length > 0);
    if (parts.length === 0) return { type: 'thispc' };

    let current = this.fileSystem[parts[0]];
    if (!current) return null;

    for (let i = 1; i < parts.length; i++) {
      if (!current.children || !current.children[parts[i]]) {
        return null;
      }
      current = current.children[parts[i]];
    }
    return current;
  }
};

window.WinState = WinState;
