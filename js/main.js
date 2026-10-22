/**
 * Windows 10 Main Bootstrap & Global Event Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  const desktopContainer = document.querySelector('#win-desktop-root');
  const taskbarContainer = document.querySelector('#win-taskbar-root');
  const overlayContainer = document.querySelector('#win-overlays-root');

  // Initialize Subsystems
  window.WinWindowManager.init(desktopContainer);
  window.DesktopManager.init(desktopContainer);
  window.TaskbarManager.init(taskbarContainer);
  window.StartMenuManager.init(overlayContainer);
  window.ActionCenterManager.init(overlayContainer);
  window.FlyoutManager.init(overlayContainer);

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Win + R (Run dialog)
    if ((e.metaKey && e.key === 'r') || (e.altKey && e.key === 'r')) {
      e.preventDefault();
      FlyoutManager.openRun();
    }
    // Win + E (File Explorer)
    else if ((e.metaKey && e.key === 'e') || (e.altKey && e.key === 'e')) {
      e.preventDefault();
      FileExplorerApp.open('This PC');
    }
    // Win + D (Toggle Show Desktop)
    else if ((e.metaKey && e.key === 'd') || (e.altKey && e.key === 'd')) {
      e.preventDefault();
      const showDeskBtn = document.querySelector('#tb-show-desktop');
      if (showDeskBtn) showDeskBtn.click();
    }
    // Win + A (Action Center)
    else if ((e.metaKey && e.key === 'a') || (e.altKey && e.key === 'a')) {
      e.preventDefault();
      ActionCenterManager.toggle();
    }
    // Escape (Close all popups/menus)
    else if (e.key === 'Escape') {
      StartMenuManager.close();
      ActionCenterManager.close();
      FlyoutManager.closeAll();
      FlyoutManager.closeRun();
      DesktopManager.hideContextMenu();
    }
    // Windows Key / Ctrl+Esc (Start Menu)
    else if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
      e.preventDefault();
      StartMenuManager.toggle();
    }
  });

  // User interaction audio activation
  let audioUnlocked = false;
  const unlockAudio = () => {
    if (!audioUnlocked && window.WinAudio) {
      window.WinAudio.ensureContext();
      audioUnlocked = true;
    }
  };
  window.addEventListener('mousedown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // Open Welcome Note on Desktop by default to greet the user
  setTimeout(() => {
    const desk = WinState.resolvePath('C:/Users/User/Desktop');
    const file = desk && desk.children ? desk.children['Welcome to Windows 10.txt'] : null;
    NotepadApp.open('Welcome to Windows 10.txt', file ? file.content : '', 'C:/Users/User/Desktop/Welcome to Windows 10.txt');
  }, 350);
});
