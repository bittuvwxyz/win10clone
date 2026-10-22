/**
 * Windows 10 SVG Icons Library
 * High-fidelity vector representations of Windows 10 Fluent / Metro / Segoe MDL2 icons.
 */

const WinIcons = {
  // Windows Start Flag (Authentic Win10 4-pane angled perspective)
  startFlag: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 4.5L10.5 3.4V11.2H2.5V4.5Z" fill="currentColor"/>
      <path d="M12 3.2L21.5 1.8V11.2H12V3.2Z" fill="currentColor"/>
      <path d="M2.5 12.8H10.5V20.6L2.5 19.5V12.8Z" fill="currentColor"/>
      <path d="M12 12.8H21.5V22.2L12 20.8V12.8Z" fill="currentColor"/>
    </svg>
  `,

  // Search Magnifying Glass
  search: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16" y2="16"/>
    </svg>
  `,

  // Cortana Circle
  cortana: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="8"/>
    </svg>
  `,

  // Task View (Two overlapping windows)
  taskView: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="2" y="6" width="13" height="13" rx="1.5" />
      <path d="M9 6V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" stroke-linecap="round"/>
    </svg>
  `,

  // This PC (My PC: Desktop Monitor + Sleek Computer Tower)
  thisPC: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Computer Monitor -->
      <rect x="3" y="6" width="30" height="22" rx="2" fill="#2D3238" stroke="#4B535C" stroke-width="1.5"/>
      <rect x="5" y="8" width="26" height="18" fill="url(#screenGrad)"/>
      <!-- Screen content (Win10 blue desktop glow) -->
      <path d="M14 13L20 12V16.5H14V13Z" fill="#80D0FF" opacity="0.9"/>
      <path d="M21 11.8L27 11V16.5H21V11.8Z" fill="#80D0FF" opacity="0.9"/>
      <path d="M14 17.5H20V22L14 21V17.5Z" fill="#80D0FF" opacity="0.9"/>
      <path d="M21 17.5H27V23L21 22.2V17.5Z" fill="#80D0FF" opacity="0.9"/>
      <!-- Monitor Stand -->
      <path d="M15 28H21L23 35H13L15 28Z" fill="#757F8A"/>
      <rect x="10" y="35" width="16" height="2.5" rx="1" fill="#4B535C"/>
      
      <!-- Tower Case -->
      <rect x="34" y="10" width="11" height="27" rx="1.5" fill="#202428" stroke="#434B54" stroke-width="1.5"/>
      <line x1="36.5" y1="14" x2="42.5" y2="14" stroke="#757F8A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="36.5" y1="17" x2="42.5" y2="17" stroke="#757F8A" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="39.5" cy="22" r="1.5" fill="#00ADEF"/>
      <circle cx="39.5" cy="27" r="1" fill="#757F8A"/>
      
      <defs>
        <linearGradient id="screenGrad" x1="5" y1="8" x2="31" y2="26" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0063B1"/>
          <stop offset="1" stop-color="#001833"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Recycle Bin (Empty)
  recycleBinEmpty: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bin Body -->
      <path d="M11 14L14.5 42.5C14.7 44 16 45 17.5 45H30.5C32 45 33.3 44 33.5 42.5L37 14H11Z" fill="url(#binGrad)" stroke="#58A5E0" stroke-width="1.5"/>
      <!-- Ribs -->
      <line x1="19" y1="17" x2="20.5" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <line x1="24" y1="17" x2="24" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <line x1="29" y1="17" x2="27.5" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <!-- Bin Rim -->
      <ellipse cx="24" cy="13" rx="14" ry="3.5" fill="#BFE3FF" stroke="#4DA3E8" stroke-width="1.5"/>
      <ellipse cx="24" cy="13" rx="10.5" ry="2" fill="#2E7EBE"/>
      <!-- Recycle Symbol in Center -->
      <g stroke="#005A9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M24 22L27 27H21L24 22Z" fill="#005A9E"/>
        <path d="M22 28L18 33L21 34"/>
        <path d="M26 28L30 33L27 34"/>
      </g>
      <defs>
        <linearGradient id="binGrad" x1="11" y1="14" x2="37" y2="45" gradientUnits="userSpaceOnUse">
          <stop stop-color="#80C8F8" stop-opacity="0.85"/>
          <stop offset="1" stop-color="#2880C4" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Recycle Bin (Full)
  recycleBinFull: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crumpled paper top -->
      <path d="M15 15L18 7L24 10L28 6L33 13L30 16" fill="#F0F4F8" stroke="#CAD5E0" stroke-width="1.5"/>
      <path d="M20 9L25 14L22 17" fill="#E2E8F0"/>
      <!-- Bin Body -->
      <path d="M11 14L14.5 42.5C14.7 44 16 45 17.5 45H30.5C32 45 33.3 44 33.5 42.5L37 14H11Z" fill="url(#binFullGrad)" stroke="#58A5E0" stroke-width="1.5"/>
      <!-- Ribs -->
      <line x1="19" y1="17" x2="20.5" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <line x1="24" y1="17" x2="24" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <line x1="29" y1="17" x2="27.5" y2="40" stroke="#76C4FF" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <!-- Bin Rim -->
      <ellipse cx="24" cy="14" rx="14" ry="3.5" fill="#BFE3FF" stroke="#4DA3E8" stroke-width="1.5"/>
      <!-- Recycle Symbol -->
      <g stroke="#005A9E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M24 23L27 28H21L24 23Z" fill="#005A9E"/>
        <path d="M22 29L18 34L21 35"/>
        <path d="M26 29L30 34L27 35"/>
      </g>
      <defs>
        <linearGradient id="binFullGrad" x1="11" y1="14" x2="37" y2="45" gradientUnits="userSpaceOnUse">
          <stop stop-color="#80C8F8" stop-opacity="0.85"/>
          <stop offset="1" stop-color="#2880C4" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // File Explorer (Yellow folder with blue spine clip and sheets)
  fileExplorer: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Back flap of folder -->
      <path d="M4 11C4 9.34 5.34 8 7 8H18L22 13H41C42.66 13 44 14.34 44 16V36C44 37.66 42.66 39 41 39H7C5.34 39 4 37.66 4 36V11Z" fill="#D8A524"/>
      <!-- White Document preview sheet inside -->
      <rect x="8" y="14" width="32" height="15" rx="1" fill="#FFFFFF" opacity="0.9"/>
      <line x1="12" y1="18" x2="26" y2="18" stroke="#0078D7" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="22" x2="34" y2="22" stroke="#B0C4DE" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Front Folder Flap -->
      <path d="M4 18C4 16.34 5.34 15 7 15H41C42.66 15 44 16.34 44 18L42 37C42 38.66 40.66 40 39 40H6C4.34 40 3 38.66 3 37L4 18Z" fill="url(#folderFrontGrad)"/>
      <!-- Blue Binder Ribbon Clip -->
      <rect x="18" y="22" width="12" height="18" rx="2" fill="#0078D7"/>
      <rect x="21" y="26" width="6" height="3" rx="1" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="folderFrontGrad" x1="4" y1="15" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFE07D"/>
          <stop offset="1" stop-color="#F3B327"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // Microsoft Edge (Win10 classic blue e / wave)
  edge: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="edgeGrad1" x1="5" y1="4" x2="43" y2="44" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0078D7"/>
          <stop offset="0.5" stop-color="#00A4EF"/>
          <stop offset="1" stop-color="#002050"/>
        </linearGradient>
        <linearGradient id="edgeGrad2" x1="12" y1="28" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00B4F0"/>
          <stop offset="1" stop-color="#004C99"/>
        </linearGradient>
      </defs>
      <!-- Stylized classic Win10 e -->
      <path d="M41 23.5C41 33.7 32.7 42 22.5 42C12.3 42 4 33.7 4 23.5C4 13.3 12.3 5 22.5 5C30.8 5 37.8 10.4 40.2 18H23C18.6 18 15 21.6 15 26C15 30.4 18.6 34 23 34C26.5 34 29.5 31.7 30.6 28.5H40.5C39.5 30.8 38 32.8 36.1 34.5" stroke="url(#edgeGrad1)" stroke-width="6.5" stroke-linecap="round"/>
      <path d="M21 21H42C42.6 21 43 21.4 43 22C43 22.5 42.8 23 42.4 23.4L33 33" stroke="url(#edgeGrad2)" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `,

  // Notepad (Blue spiral notebook with lined sheet & pencil)
  notepad: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Notebook Backing -->
      <rect x="8" y="5" width="30" height="38" rx="3" fill="#005A9E"/>
      <!-- Paper Sheet -->
      <rect x="11" y="8" width="27" height="35" rx="1.5" fill="#FDFEFF"/>
      <!-- Sheet ruled lines -->
      <line x1="15" y1="15" x2="34" y2="15" stroke="#70A7D8" stroke-width="1.5"/>
      <line x1="15" y1="20" x2="34" y2="20" stroke="#BED9F2" stroke-width="1.5"/>
      <line x1="15" y1="25" x2="34" y2="25" stroke="#BED9F2" stroke-width="1.5"/>
      <line x1="15" y1="30" x2="34" y2="30" stroke="#BED9F2" stroke-width="1.5"/>
      <line x1="15" y1="35" x2="28" y2="35" stroke="#BED9F2" stroke-width="1.5"/>
      <!-- Spiral Wire Bindings -->
      <rect x="6" y="10" width="5" height="2" rx="1" fill="#757F8A"/>
      <rect x="6" y="16" width="5" height="2" rx="1" fill="#757F8A"/>
      <rect x="6" y="22" width="5" height="2" rx="1" fill="#757F8A"/>
      <rect x="6" y="28" width="5" height="2" rx="1" fill="#757F8A"/>
      <rect x="6" y="34" width="5" height="2" rx="1" fill="#757F8A"/>
      <!-- Pencil at Angle -->
      <g transform="rotate(35 32 30)">
        <polygon points="26,10 32,10 32,32 26,32" fill="#FFB900"/>
        <polygon points="26,32 32,32 29,38" fill="#FCE19B"/>
        <polygon points="28,36 30,36 29,38" fill="#333333"/>
        <rect x="26" y="8" width="6" height="2" fill="#888888"/>
        <rect x="26" y="5" width="6" height="3" rx="1" fill="#FF5E62"/>
      </g>
    </svg>
  `,

  // Calculator
  calculator: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Calculator Body -->
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#202428" stroke="#373F47" stroke-width="1.5"/>
      <!-- Screen -->
      <rect x="12" y="8" width="24" height="9" rx="2" fill="#3D454D"/>
      <text x="32" y="15" font-family="Segoe UI, monospace" font-size="7" font-weight="bold" fill="#00D2FF" text-anchor="end">1,337</text>
      <!-- Buttons Grid -->
      <rect x="12" y="20" width="6" height="4.5" rx="1" fill="#4B545C"/>
      <rect x="20" y="20" width="6" height="4.5" rx="1" fill="#4B545C"/>
      <rect x="28" y="20" width="8" height="4.5" rx="1" fill="#0078D7"/>
      
      <rect x="12" y="26" width="6" height="4.5" rx="1" fill="#2E343A"/>
      <rect x="20" y="26" width="6" height="4.5" rx="1" fill="#2E343A"/>
      <rect x="28" y="26" width="8" height="4.5" rx="1" fill="#0078D7"/>
      
      <rect x="12" y="32" width="6" height="4.5" rx="1" fill="#2E343A"/>
      <rect x="20" y="32" width="6" height="4.5" rx="1" fill="#2E343A"/>
      <rect x="28" y="32" width="8" height="4.5" rx="1" fill="#0078D7"/>
      
      <rect x="12" y="38" width="6" height="4" rx="1" fill="#2E343A"/>
      <rect x="20" y="38" width="6" height="4" rx="1" fill="#2E343A"/>
      <rect x="28" y="38" width="8" height="4" rx="1" fill="#107C41"/>
    </svg>
  `,

  // Settings Gear
  settings: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gearGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4C5A68"/>
          <stop offset="1" stop-color="#1E2630"/>
        </linearGradient>
      </defs>
      <!-- Outer Gear -->
      <path d="M21.5 5H26.5L27.5 9.2C28.8 9.7 30 10.4 31.1 11.3L35.2 9.7L38.7 13.2L37.1 17.3C38 18.4 38.7 19.6 39.2 20.9L43.4 21.9V26.9L39.2 27.9C38.7 29.2 38 30.4 37.1 31.5L38.7 35.6L35.2 39.1L31.1 37.5C30 38.4 28.8 39.1 27.5 39.6L26.5 43.8H21.5L20.5 39.6C19.2 39.1 18 38.4 16.9 37.5L12.8 39.1L9.3 35.6L10.9 31.5C10 30.4 9.3 29.2 8.8 27.9L4.6 26.9V21.9L8.8 20.9C9.3 19.6 10 18.4 10.9 17.3L9.3 13.2L12.8 9.7L16.9 11.3C18 10.4 19.2 9.7 20.5 9.2L21.5 5Z" fill="url(#gearGrad)" stroke="#6C7A89" stroke-width="1.5"/>
      <!-- Inner Ring -->
      <circle cx="24" cy="24" r="9" fill="#0078D7"/>
      <circle cx="24" cy="24" r="5" fill="#FFFFFF"/>
    </svg>
  `,

  // Command Prompt (Black terminal with `>_`)
  cmd: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Window Frame -->
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#0C0C0C" stroke="#484848" stroke-width="1.5"/>
      <!-- Header bar -->
      <rect x="4" y="8" width="40" height="7" fill="#1F1F1F"/>
      <rect x="7" y="11" width="3" height="1" fill="#888888"/>
      <rect x="12" y="10.5" width="2" height="2" fill="#888888"/>
      <text x="17" y="13.5" font-family="Segoe UI, sans-serif" font-size="3.5" fill="#CCCCCC">Command Prompt</text>
      <!-- Prompt symbol >_ -->
      <path d="M10 21L15 25L10 29" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="18" y1="29" x2="25" y2="29" stroke="#E6E6E6" stroke-width="2" stroke-linecap="round"/>
      <!-- Dim simulated text lines -->
      <line x1="10" y1="34" x2="28" y2="34" stroke="#444444" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,

  // Paint (Artist palette with brush)
  paint: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Wooden Palette -->
      <path d="M22 6C12 6 5 13.5 5 23C5 32.5 12.5 40 21 40C24 40 25.5 38.5 25.5 36.5C25.5 35 24.5 34 24.5 32.5C24.5 30.5 26.5 29 28.5 29H33C38.5 29 43 24.5 43 19C43 11.5 33.5 6 22 6Z" fill="#D69752" stroke="#A86F30" stroke-width="1.5"/>
      <!-- Paint Daubs -->
      <circle cx="13" cy="16" r="3.5" fill="#E81123"/>
      <circle cx="21" cy="12" r="3.5" fill="#FFB900"/>
      <circle cx="29" cy="13" r="3.5" fill="#107C41"/>
      <circle cx="36" cy="18" r="3.5" fill="#0078D7"/>
      <!-- Thumb Hole -->
      <circle cx="34" cy="34" r="3" fill="#D69752" stroke="#8C5C26" stroke-width="1.5"/>
      <!-- Artist Brush -->
      <g transform="rotate(-30 25 35)">
        <rect x="23" y="16" width="3" height="24" rx="1.5" fill="#4B2810"/>
        <rect x="22.5" y="12" width="4" height="5" fill="#A0A0A0"/>
        <path d="M22.5 12C22.5 8 24.5 5 24.5 5C24.5 5 26.5 8 26.5 12H22.5Z" fill="#E81123"/>
      </g>
    </svg>
  `,

  // Photos App
  photos: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="32" rx="3" fill="#008272"/>
      <!-- Sun -->
      <circle cx="16" cy="18" r="4.5" fill="#FFF100"/>
      <!-- Mountains -->
      <polygon points="8,38 20,23 28,34 32,29 40,38" fill="#F2F2F2" opacity="0.95"/>
      <polygon points="8,38 22,25 28,35 40,38" fill="#004E44" opacity="0.25"/>
    </svg>
  `,

  // Task Manager (Graph icon)
  taskmgr: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="7" width="36" height="34" rx="2" fill="#181818" stroke="#333333" stroke-width="1.5"/>
      <!-- Grid lines -->
      <line x1="6" y1="18" x2="42" y2="18" stroke="#252525" stroke-width="1"/>
      <line x1="6" y1="28" x2="42" y2="28" stroke="#252525" stroke-width="1"/>
      <line x1="18" y1="7" x2="18" y2="41" stroke="#252525" stroke-width="1"/>
      <line x1="30" y1="7" x2="30" y2="41" stroke="#252525" stroke-width="1"/>
      <!-- Green Activity Curve -->
      <path d="M7 32L14 32L18 16L23 37L28 22L33 30L37 19L42 27" stroke="#107C41" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Standard Folder
  folder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5C2 3.9 2.9 3 4 3H9L11 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V5Z" fill="#FFAA00"/>
      <path d="M2 9H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V9Z" fill="#FFC83B"/>
    </svg>
  `,

  // Hard Drive (Local Disk C: & D:)
  hardDrive: `
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Drive Enclosure -->
      <rect x="3" y="8" width="26" height="16" rx="2" fill="#4B535C" stroke="#68727D" stroke-width="1.2"/>
      <rect x="5" y="10" width="22" height="12" rx="1" fill="#2C3238"/>
      <!-- Platter / Label -->
      <circle cx="12" cy="16" r="4" stroke="#80D0FF" stroke-width="1.2" opacity="0.6"/>
      <circle cx="12" cy="16" r="1.5" fill="#80D0FF"/>
      <!-- Blue LED light -->
      <circle cx="23" cy="14" r="1.2" fill="#00ADEF"/>
      <!-- Windows Flag Badge -->
      <g transform="translate(19, 16) scale(0.35)">
        <path d="M2 3L7 2V8H2V3Z" fill="#0078D7"/>
        <path d="M8 1.8L15 0.8V8H8V1.8Z" fill="#0078D7"/>
        <path d="M2 9H7V15L2 14V9Z" fill="#0078D7"/>
        <path d="M8 9H15V16.2L8 15.2V9Z" fill="#0078D7"/>
      </g>
    </svg>
  `,

  // Text Document Icon
  textFile: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9L15 3H5Z" fill="#F0F4F8" stroke="#CAD5E0" stroke-width="1.2"/>
      <path d="M15 3V9H21" fill="#D9E2EC"/>
      <line x1="6" y1="12" x2="18" y2="12" stroke="#0078D7" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="6" y1="15" x2="16" y2="15" stroke="#9FB3C8" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="14" y2="18" stroke="#9FB3C8" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `,

  // Audio / Speaker Icon (Taskbar)
  volumeHigh: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  `,

  volumeMute: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  `,

  // Wi-Fi Icon
  wifi: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="2.5"/>
    </svg>
  `,

  // Battery Icon
  battery: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="17" height="10" rx="2"/>
      <line x1="21" y1="11" x2="21" y2="13"/>
      <rect x="4" y="9" width="10" height="6" fill="currentColor" stroke="none"/>
    </svg>
  `,

  // Action Center (Speech Bubble with lines)
  actionCenter: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="7" y1="8" x2="17" y2="8"/>
      <line x1="7" y1="12" x2="13" y2="12"/>
    </svg>
  `,

  // Chevron Up (Hidden tray icons)
  chevronUp: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  `,

  // Hamburger Menu
  hamburger: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  `,

  // User Profile
  user: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,

  // Power Button
  power: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
      <line x1="12" y1="2" x2="12" y2="12"/>
    </svg>
  `,

  // Window Controls
  winMinimize: `
    <svg viewBox="0 0 12 12" width="100%" height="100%" stroke="currentColor" stroke-width="1.2">
      <line x1="1" y1="6" x2="11" y2="6"/>
    </svg>
  `,

  winMaximize: `
    <svg viewBox="0 0 12 12" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.2">
      <rect x="1.5" y="1.5" width="9" height="9"/>
    </svg>
  `,

  winRestore: `
    <svg viewBox="0 0 12 12" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.2">
      <rect x="3.5" y="1.5" width="7" height="7"/>
      <polyline points="1.5,4.5 1.5,10.5 7.5,10.5"/>
    </svg>
  `,

  winClose: `
    <svg viewBox="0 0 12 12" width="100%" height="100%" stroke="currentColor" stroke-width="1.2">
      <line x1="2" y1="2" x2="10" y2="10"/>
      <line x1="10" y1="2" x2="2" y2="10"/>
    </svg>
  `,

  // Quick Action Tiles Icons
  bluetooth: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
    </svg>
  `,

  nightLight: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `,

  airplane: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 20 2.5s-3.5-1-5 0.5L11.5 6.5 3.3 4.7 1.9 6.1l6.7 5.1L5.8 14l-2.4-0.6L2 14.8l3.4 2 2 3.4 1.4-1.4-0.6-2.4 2.8-2.8 5.1 6.7 1.4-1.4z"/>
    </svg>
  `,

  sun: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  `,

  snip: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  `,

  // System Folder Icons
  quickAccess: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#0078D7"/>
    </svg>
  `,

  desktopFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" fill="#202428" stroke="#0078D7" stroke-width="1.5"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke="#757F8A" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="#757F8A" stroke-width="2"/>
    </svg>
  `,

  downloadsFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 15V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15" stroke="#107C41" stroke-width="2" stroke-linecap="round"/>
      <polyline points="7 10 12 15 17 10" stroke="#107C41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke="#107C41" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  documentsFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#FFAA00"/>
      <path d="M14 2V8H20" fill="#FFC83B"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="8" y1="17" x2="14" y2="17" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,

  picturesFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#008272"/>
      <circle cx="8.5" cy="8.5" r="2" fill="#FFF100"/>
      <polyline points="21 15 16 10 5 21" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  musicFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5L21 3V16" stroke="#E81123" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" fill="#E81123"/>
      <circle cx="18" cy="16" r="3" fill="#E81123"/>
    </svg>
  `,

  videosFolder: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#881798"/>
      <polygon points="10 8 16 12 10 16 10 8" fill="#FFFFFF"/>
    </svg>
  `,

  // Navigation Arrows
  navBack: `
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13L5 8L10 3"/>
    </svg>
  `,

  navForward: `
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 13L11 8L6 3"/>
    </svg>
  `,

  navUp: `
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 10L8 5L3 10"/>
    </svg>
  `,

  refresh: `
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 8a6 6 0 1 1-1.76-4.24L14 5"/>
      <polyline points="14 1 14 5 10 5"/>
    </svg>
  `,

  runIcon: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="14" rx="2" fill="#2D3238" stroke="#0078D7" stroke-width="1.5"/>
      <path d="M6 9L10 12L6 15" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="12" y1="15" x2="16" y2="15" stroke="#FFFFFF" stroke-width="1.5"/>
    </svg>
  `,

  // Groove Music / Windows Media Player Icon
  groove: `
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grooveGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF5D22"/>
          <stop offset="0.5" stop-color="#E81123"/>
          <stop offset="1" stop-color="#881798"/>
        </linearGradient>
      </defs>
      <!-- Circular Vinyl / Disc -->
      <circle cx="24" cy="24" r="20" fill="url(#grooveGrad)"/>
      <circle cx="24" cy="24" r="14" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.4"/>
      <circle cx="24" cy="24" r="9" stroke="#FFFFFF" stroke-width="1.2" opacity="0.5"/>
      <circle cx="24" cy="24" r="4.5" fill="#FFFFFF"/>
      <!-- Music Wave Accent -->
      <path d="M19 16C19 16 23 13 29 16V28C27.5 27 24.5 27 23 28.5C21 30.5 22 34 25 34C28 34 29 31.5 29 28V19" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Music Playback Icons
  play: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4"/>
    </svg>
  `,

  pause: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <rect x="5" y="4" width="4.5" height="16" rx="1"/>
      <rect x="14.5" y="4" width="4.5" height="16" rx="1"/>
    </svg>
  `,

  prevTrack: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <polygon points="19 20 9 12 19 4 19 20"/>
      <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  nextTrack: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <polygon points="5 4 15 12 5 20 5 4"/>
      <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  shuffle: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  `,

  repeat: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  `,

  repeatOne: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      <text x="12" y="15" font-size="7" font-weight="bold" fill="currentColor" text-anchor="middle" stroke="none">1</text>
    </svg>
  `,

  heart: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `,

  heartFilled: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#E81123" stroke="#E81123" stroke-width="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `,

  visualizer: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="4" y1="18" x2="4" y2="10"/>
      <line x1="8" y1="18" x2="8" y2="4"/>
      <line x1="12" y1="18" x2="12" y2="8"/>
      <line x1="16" y1="18" x2="16" y2="2"/>
      <line x1="20" y1="18" x2="20" y2="12"/>
    </svg>
  `,

  miniPlayer: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <rect x="11" y="11" width="9" height="8" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  `
};

if (typeof window !== 'undefined') {
  window.WinIcons = WinIcons;
}
