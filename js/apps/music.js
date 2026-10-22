/**
 * Windows 10 Groove Music Application
 * Full-fledged music player with audio synthesis, local file import, real-time spectrum visualizer,
 * tracklist management, playlists, album view, search filter, and compact mini-player mode.
 */

class GrooveMusicApp {
  static open(autoPlayTrack = null) {
    const winId = 'groove_music_app';
    const win = window.WinWindowManager.openWindow({
      id: winId,
      title: 'Groove Music',
      icon: 'groove',
      width: 880,
      height: 580,
      minWidth: 420,
      minHeight: 280,
      content: ''
    });

    const instance = new GrooveMusicApp(win);
    instance.render();

    if (autoPlayTrack) {
      instance.playTrackByName(autoPlayTrack);
    }
    return instance;
  }

  constructor(winData) {
    this.winData = winData;
    this.activeTab = 'songs'; // 'songs', 'albums', 'artists', 'nowplaying'
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 204; // 3:24 in seconds
    this.volume = 0.8;
    this.isMuted = false;
    this.isShuffle = false;
    this.repeatMode = 'all'; // 'off', 'all', 'one'
    this.isMiniPlayer = false;
    this.filterQuery = '';

    // Audio Synthesis & Playback Context
    this.audioCtx = null;
    this.analyser = null;
    this.synthInterval = null;
    this.playbackTimer = null;
    this.localAudioElement = null;
    this.visualizerAnimationId = null;

    // Music Library
    this.tracks = [
      {
        id: 'track-1',
        title: 'Neon Horizon',
        artist: 'Kavinsky Sound',
        album: 'Synthwave Dreams',
        year: '2026',
        duration: 204, // 03:24
        durationStr: '3:24',
        coverGradient: 'linear-gradient(135deg, #FF007F, #7928CA, #0070F3)',
        favorite: true,
        style: 'synthwave',
        tempo: 120,
        notes: [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66]
      },
      {
        id: 'track-2',
        title: 'Midnight Coffee',
        artist: 'Lofi Chillhop Collective',
        album: 'Rainy Day Study',
        year: '2026',
        duration: 168, // 02:48
        durationStr: '2:48',
        coverGradient: 'linear-gradient(135deg, #F59E0B, #D97706, #78350F)',
        favorite: true,
        style: 'lofi',
        tempo: 84,
        notes: [220.00, 277.18, 329.63, 440.00, 349.23, 293.66, 261.63, 220.00]
      },
      {
        id: 'track-3',
        title: 'Cyber Drift',
        artist: 'Night Runner',
        album: 'Neon Velocity',
        year: '2025',
        duration: 192, // 03:12
        durationStr: '3:12',
        coverGradient: 'linear-gradient(135deg, #00F2FE, #4FACFE, #000B76)',
        favorite: false,
        style: 'cyberpunk',
        tempo: 128,
        notes: [146.83, 174.61, 220.00, 293.66, 329.63, 293.66, 220.00, 174.61]
      },
      {
        id: 'track-4',
        title: 'Starlight Reverie',
        artist: 'Celestial Soundscapes',
        album: 'Cosmic Voyage',
        year: '2026',
        duration: 225, // 03:45
        durationStr: '3:45',
        coverGradient: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
        favorite: false,
        style: 'ambient',
        tempo: 72,
        notes: [329.63, 392.00, 493.88, 659.25, 587.33, 493.88, 392.00, 329.63]
      },
      {
        id: 'track-5',
        title: 'Windows 10 Odyssey',
        artist: 'Redmond Waves',
        album: 'Fluent Odyssey',
        year: '2026',
        duration: 176, // 02:56
        durationStr: '2:56',
        coverGradient: 'linear-gradient(135deg, #0078D7, #00BCF2, #002050)',
        favorite: true,
        style: 'melodic',
        tempo: 110,
        notes: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63]
      }
    ];

    this.albums = [
      { title: 'Synthwave Dreams', artist: 'Kavinsky Sound', tracks: 1, gradient: 'linear-gradient(135deg, #FF007F, #7928CA)' },
      { title: 'Rainy Day Study', artist: 'Lofi Chillhop Collective', tracks: 1, gradient: 'linear-gradient(135deg, #F59E0B, #78350F)' },
      { title: 'Neon Velocity', artist: 'Night Runner', tracks: 1, gradient: 'linear-gradient(135deg, #00F2FE, #000B76)' },
      { title: 'Cosmic Voyage', artist: 'Celestial Soundscapes', tracks: 1, gradient: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' },
      { title: 'Fluent Odyssey', artist: 'Redmond Waves', tracks: 1, gradient: 'linear-gradient(135deg, #0078D7, #002050)' }
    ];

    this.winData.options.onClose = () => {
      this.stopPlayback();
      if (this.visualizerAnimationId) {
        cancelAnimationFrame(this.visualizerAnimationId);
      }
    };
  }

  ensureAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  render() {
    const body = this.winData.element.querySelector('.win-body');
    body.innerHTML = `
      <div class="groove-container ${this.isMiniPlayer ? 'mini-player-mode' : ''}">
        <!-- Top Title Bar Extra: Mini Player Toggle -->
        ${!this.isMiniPlayer ? `
          <!-- Main Layout: Left Sidebar + Content Area -->
          <div class="groove-main-layout">
            <!-- Left Navigation Sidebar -->
            <div class="groove-sidebar">
              <div class="groove-side-header">
                <button class="groove-hamburger-btn" title="Navigation">${WinIcons.hamburger}</button>
                <span class="groove-app-title">Groove Music</span>
              </div>

              <!-- Search Filter -->
              <div class="groove-search-box">
                <span class="groove-search-icon">${WinIcons.search}</span>
                <input type="text" class="groove-search-input" id="groove-search-input" placeholder="Search in music" value="${this.filterQuery}" />
              </div>

              <!-- Main Navigation Items -->
              <div class="groove-nav-group">
                <div class="groove-group-label">My music</div>
                <div class="groove-nav-item ${this.activeTab === 'songs' ? 'active' : ''}" data-tab="songs">
                  <span class="groove-nav-icon">🎵</span>
                  <span class="groove-nav-label">Songs</span>
                </div>
                <div class="groove-nav-item ${this.activeTab === 'albums' ? 'active' : ''}" data-tab="albums">
                  <span class="groove-nav-icon">💿</span>
                  <span class="groove-nav-label">Albums</span>
                </div>
                <div class="groove-nav-item ${this.activeTab === 'artists' ? 'active' : ''}" data-tab="artists">
                  <span class="groove-nav-icon">🎤</span>
                  <span class="groove-nav-label">Artists</span>
                </div>
                <div class="groove-nav-item ${this.activeTab === 'nowplaying' ? 'active' : ''}" data-tab="nowplaying">
                  <span class="groove-nav-icon">${WinIcons.visualizer}</span>
                  <span class="groove-nav-label">Now Playing</span>
                </div>
              </div>

              <!-- Playlists Section -->
              <div class="groove-nav-group">
                <div class="groove-group-label">Playlists</div>
                <div class="groove-nav-item" id="groove-add-local-btn">
                  <span class="groove-nav-icon">➕</span>
                  <span class="groove-nav-label">Add Audio File</span>
                </div>
                <div class="groove-nav-item" data-filter="favorite">
                  <span class="groove-nav-icon">❤️</span>
                  <span class="groove-nav-label">Favorites</span>
                </div>
                <div class="groove-nav-item" data-filter="synthwave">
                  <span class="groove-nav-icon">🌆</span>
                  <span class="groove-nav-label">Synthwave 80s</span>
                </div>
                <div class="groove-nav-item" data-filter="lofi">
                  <span class="groove-nav-icon">☕</span>
                  <span class="groove-nav-label">Lofi Chill</span>
                </div>
              </div>
            </div>

            <!-- Content Area View -->
            <div class="groove-content" id="groove-content-view">
              ${this.renderActiveTab()}
            </div>
          </div>
        ` : `
          <!-- Mini Player Body -->
          <div class="groove-mini-content" id="groove-mini-view">
            ${this.renderMiniPlayerView()}
          </div>
        `}

        <!-- Bottom Playback Control Bar -->
        <div class="groove-playback-bar">
          <!-- Left: Current Track Information -->
          <div class="playback-track-info">
            <div class="playback-cover-thumb" id="pb-cover-thumb" style="background: ${this.currentTrack.coverGradient};">
              <span class="cover-disc-icon">💿</span>
            </div>
            <div class="playback-meta">
              <div class="playback-title" id="pb-title-txt">${this.currentTrack.title}</div>
              <div class="playback-artist" id="pb-artist-txt">${this.currentTrack.artist}</div>
            </div>
            <button class="pb-btn pb-favorite-btn ${this.currentTrack.favorite ? 'active' : ''}" id="pb-fav-btn" title="Like">
              ${this.currentTrack.favorite ? WinIcons.heartFilled : WinIcons.heart}
            </button>
          </div>

          <!-- Center: Playback Controls & Timeline -->
          <div class="playback-controls-center">
            <div class="playback-buttons-row">
              <button class="pb-btn pb-ctrl-btn ${this.isShuffle ? 'active' : ''}" id="pb-shuffle-btn" title="Shuffle">${WinIcons.shuffle}</button>
              <button class="pb-btn pb-ctrl-btn" id="pb-prev-btn" title="Previous Track">${WinIcons.prevTrack}</button>
              <button class="pb-btn pb-play-main-btn" id="pb-play-btn" title="${this.isPlaying ? 'Pause' : 'Play'}">
                ${this.isPlaying ? WinIcons.pause : WinIcons.play}
              </button>
              <button class="pb-btn pb-ctrl-btn" id="pb-next-btn" title="Next Track">${WinIcons.nextTrack}</button>
              <button class="pb-btn pb-ctrl-btn ${this.repeatMode !== 'off' ? 'active' : ''}" id="pb-repeat-btn" title="Repeat: ${this.repeatMode}">
                ${this.repeatMode === 'one' ? WinIcons.repeatOne : WinIcons.repeat}
              </button>
            </div>

            <!-- Timeline Scrub Bar -->
            <div class="playback-timeline-row">
              <span class="time-label" id="pb-cur-time">${this.formatSeconds(this.currentTime)}</span>
              <div class="seek-slider-wrapper">
                <input type="range" class="seek-slider" id="pb-seek-slider" min="0" max="${this.currentTrack.duration}" value="${this.currentTime}" />
                <div class="seek-slider-fill" id="pb-seek-fill" style="width: ${(this.currentTime / this.currentTrack.duration) * 100}%;"></div>
              </div>
              <span class="time-label" id="pb-total-time">${this.currentTrack.durationStr}</span>
            </div>
          </div>

          <!-- Right: Volume, Visualizer & Mini-player Toggle -->
          <div class="playback-actions-right">
            <button class="pb-btn pb-tool-btn" id="pb-visualizer-btn" title="Toggle Visualizer">${WinIcons.visualizer}</button>
            <button class="pb-btn pb-tool-btn" id="pb-volume-btn" title="Mute">${this.isMuted ? WinIcons.volumeMute : WinIcons.volumeHigh}</button>
            <input type="range" class="pb-vol-slider" id="pb-vol-slider" min="0" max="100" value="${this.volume * 100}" />
            <button class="pb-btn pb-tool-btn ${this.isMiniPlayer ? 'active' : ''}" id="pb-miniplayer-btn" title="Toggle Mini Player">${WinIcons.miniPlayer}</button>
          </div>
        </div>

        <!-- Hidden File Input for Real Audio Files -->
        <input type="file" id="groove-file-input" accept="audio/*" style="display: none;" />
      </div>
    `;

    this.attachEvents(body);

    if (this.activeTab === 'nowplaying' || this.isMiniPlayer) {
      this.initVisualizer();
    }
  }

  get currentTrack() {
    return this.tracks[this.currentTrackIndex] || this.tracks[0];
  }

  formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  renderActiveTab() {
    switch (this.activeTab) {
      case 'songs':
        return this.renderSongsView();
      case 'albums':
        return this.renderAlbumsView();
      case 'artists':
        return this.renderArtistsView();
      case 'nowplaying':
        return this.renderNowPlayingView();
      default:
        return this.renderSongsView();
    }
  }

  renderSongsView() {
    let filtered = this.tracks;
    if (this.filterQuery) {
      const q = this.filterQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
      );
    }

    let rowsHtml = '';
    filtered.forEach((t, idx) => {
      const isCur = t.id === this.currentTrack.id;
      rowsHtml += `
        <tr class="groove-song-row ${isCur ? 'active-playing' : ''}" data-track-id="${t.id}" data-idx="${this.tracks.indexOf(t)}">
          <td class="song-col-num">
            ${isCur && this.isPlaying ? `
              <div class="groove-eq-waves">
                <span></span><span></span><span></span>
              </div>
            ` : (idx + 1)}
          </td>
          <td class="song-col-title">
            <div class="song-title-group">
              <div class="song-cover-mini" style="background: ${t.coverGradient};"></div>
              <span class="song-title-name">${t.title}</span>
            </div>
          </td>
          <td class="song-col-artist">${t.artist}</td>
          <td class="song-col-album">${t.album}</td>
          <td class="song-col-time">${t.durationStr}</td>
          <td class="song-col-fav">
            <button class="song-fav-btn ${t.favorite ? 'active' : ''}" data-id="${t.id}">
              ${t.favorite ? '❤️' : '🤍'}
            </button>
          </td>
        </tr>
      `;
    });

    return `
      <div class="groove-view-wrapper">
        <div class="groove-view-header">
          <h1 class="groove-page-heading">Songs</h1>
          <div class="groove-header-actions">
            <button class="groove-btn primary" id="groove-play-all">▶ Play all</button>
            <button class="groove-btn" id="groove-shuffle-all">🔀 Shuffle all</button>
            <button class="groove-btn" id="groove-upload-btn">📁 Add local file</button>
          </div>
        </div>

        <div class="groove-table-container">
          <table class="groove-songs-table">
            <thead>
              <tr>
                <th style="width: 48px;">#</th>
                <th style="width: 38%;">Title</th>
                <th style="width: 26%;">Artist</th>
                <th style="width: 22%;">Album</th>
                <th style="width: 50px;">Time</th>
                <th style="width: 36px;"></th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderAlbumsView() {
    let albumsHtml = '';
    this.albums.forEach(album => {
      albumsHtml += `
        <div class="groove-album-card" data-album-name="${album.title}">
          <div class="album-card-art" style="background: ${album.gradient};">
            <div class="album-vinyl-sleeve">💿</div>
          </div>
          <div class="album-card-title">${album.title}</div>
          <div class="album-card-artist">${album.artist}</div>
          <div class="album-card-meta">${album.tracks} song${album.tracks > 1 ? 's' : ''}</div>
        </div>
      `;
    });

    return `
      <div class="groove-view-wrapper">
        <div class="groove-view-header">
          <h1 class="groove-page-heading">Albums</h1>
        </div>
        <div class="groove-albums-grid">
          ${albumsHtml}
        </div>
      </div>
    `;
  }

  renderArtistsView() {
    const artistSet = new Set(this.tracks.map(t => t.artist));
    let artistsHtml = '';
    artistSet.forEach(artist => {
      const count = this.tracks.filter(t => t.artist === artist).length;
      artistsHtml += `
        <div class="groove-artist-card" data-artist-name="${artist}">
          <div class="artist-avatar-circle">
            <span class="artist-icon-glyph">🎤</span>
          </div>
          <div class="artist-card-name">${artist}</div>
          <div class="artist-card-meta">${count} song${count > 1 ? 's' : ''}</div>
        </div>
      `;
    });

    return `
      <div class="groove-view-wrapper">
        <div class="groove-view-header">
          <h1 class="groove-page-heading">Artists</h1>
        </div>
        <div class="groove-artists-grid">
          ${artistsHtml}
        </div>
      </div>
    `;
  }

  renderNowPlayingView() {
    return `
      <div class="groove-nowplaying-wrapper">
        <div class="nowplaying-art-showcase">
          <div class="nowplaying-vinyl-display" style="background: ${this.currentTrack.coverGradient};">
            <div class="vinyl-center-hole"></div>
          </div>
          <div class="nowplaying-info">
            <div class="np-title">${this.currentTrack.title}</div>
            <div class="np-artist">${this.currentTrack.artist}</div>
            <div class="np-album">${this.currentTrack.album} (${this.currentTrack.year || '2026'})</div>
          </div>
        </div>

        <!-- Real-Time Audio Visualizer Canvas -->
        <div class="nowplaying-visualizer-container">
          <div class="vis-header-label">REAL-TIME SPECTRUM AUDIO VISUALIZER</div>
          <canvas class="groove-spectrum-canvas" id="groove-vis-canvas" width="600" height="150"></canvas>
        </div>
      </div>
    `;
  }

  renderMiniPlayerView() {
    return `
      <div class="mini-player-layout" style="background: ${this.currentTrack.coverGradient};">
        <div class="mini-overlay">
          <div class="mini-meta-box">
            <div class="mini-title">${this.currentTrack.title}</div>
            <div class="mini-artist">${this.currentTrack.artist}</div>
          </div>
          <canvas class="mini-spectrum-canvas" id="groove-vis-canvas" width="280" height="50"></canvas>
        </div>
      </div>
    `;
  }

  attachEvents(body) {
    // Navigation Tabs
    body.querySelectorAll('.groove-nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => {
        this.activeTab = item.dataset.tab;
        this.render();
      });
    });

    // Filter playlists
    body.querySelectorAll('.groove-nav-item[data-filter]').forEach(item => {
      item.addEventListener('click', () => {
        const f = item.dataset.filter;
        if (f === 'favorite') {
          this.filterQuery = '';
          this.tracks.forEach((t, i) => { if (t.favorite) { this.currentTrackIndex = i; } });
        } else {
          this.filterQuery = f;
        }
        this.activeTab = 'songs';
        this.render();
      });
    });

    // Search input
    const searchInput = body.querySelector('#groove-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filterQuery = searchInput.value.trim();
        const content = body.querySelector('#groove-content-view');
        if (content && this.activeTab === 'songs') {
          content.innerHTML = this.renderSongsView();
          this.attachSongRowEvents(content);
        }
      });
    }

    // Play all & Shuffle all
    const playAllBtn = body.querySelector('#groove-play-all');
    const shuffleAllBtn = body.querySelector('#groove-shuffle-all');
    if (playAllBtn) {
      playAllBtn.addEventListener('click', () => {
        this.currentTrackIndex = 0;
        this.startPlayback();
      });
    }
    if (shuffleAllBtn) {
      shuffleAllBtn.addEventListener('click', () => {
        this.isShuffle = true;
        this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
        this.startPlayback();
      });
    }

    // Playback Bar Controls
    const playBtn = body.querySelector('#pb-play-btn');
    const prevBtn = body.querySelector('#pb-prev-btn');
    const nextBtn = body.querySelector('#pb-next-btn');
    const shuffleBtn = body.querySelector('#pb-shuffle-btn');
    const repeatBtn = body.querySelector('#pb-repeat-btn');
    const favBtn = body.querySelector('#pb-fav-btn');

    playBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pausePlayback();
      } else {
        this.startPlayback();
      }
    });

    prevBtn.addEventListener('click', () => this.previousTrack());
    nextBtn.addEventListener('click', () => this.nextTrack());

    shuffleBtn.addEventListener('click', () => {
      this.isShuffle = !this.isShuffle;
      shuffleBtn.classList.toggle('active', this.isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
      if (this.repeatMode === 'off') this.repeatMode = 'all';
      else if (this.repeatMode === 'all') this.repeatMode = 'one';
      else this.repeatMode = 'off';
      this.render();
    });

    favBtn.addEventListener('click', () => {
      this.currentTrack.favorite = !this.currentTrack.favorite;
      favBtn.innerHTML = this.currentTrack.favorite ? WinIcons.heartFilled : WinIcons.heart;
      favBtn.classList.toggle('active', this.currentTrack.favorite);
    });

    // Seek Slider Scrubbing
    const seekSlider = body.querySelector('#pb-seek-slider');
    const seekFill = body.querySelector('#pb-seek-fill');
    const curTimeTxt = body.querySelector('#pb-cur-time');

    seekSlider.addEventListener('input', () => {
      this.currentTime = parseFloat(seekSlider.value);
      curTimeTxt.textContent = this.formatSeconds(this.currentTime);
      seekFill.style.width = `${(this.currentTime / this.currentTrack.duration) * 100}%`;

      if (this.localAudioElement) {
        this.localAudioElement.currentTime = this.currentTime;
      }
    });

    // Volume Slider
    const volSlider = body.querySelector('#pb-vol-slider');
    const volBtn = body.querySelector('#pb-volume-btn');

    volSlider.addEventListener('input', () => {
      this.volume = parseFloat(volSlider.value) / 100;
      this.isMuted = this.volume === 0;
      volBtn.innerHTML = this.isMuted ? WinIcons.volumeMute : WinIcons.volumeHigh;
      if (this.localAudioElement) this.localAudioElement.volume = this.volume;
    });

    volBtn.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      volBtn.innerHTML = this.isMuted ? WinIcons.volumeMute : WinIcons.volumeHigh;
      if (this.localAudioElement) this.localAudioElement.muted = this.isMuted;
    });

    // Toggle Visualizer Tab
    const visBtn = body.querySelector('#pb-visualizer-btn');
    if (visBtn) {
      visBtn.addEventListener('click', () => {
        this.activeTab = this.activeTab === 'nowplaying' ? 'songs' : 'nowplaying';
        this.render();
      });
    }

    // Toggle Mini-Player
    const miniBtn = body.querySelector('#pb-miniplayer-btn');
    if (miniBtn) {
      miniBtn.addEventListener('click', () => {
        this.toggleMiniPlayer();
      });
    }

    // File Upload handling
    const fileInput = body.querySelector('#groove-file-input');
    const uploadBtn = body.querySelector('#groove-upload-btn');
    const addLocalBtn = body.querySelector('#groove-add-local-btn');

    const triggerUpload = () => fileInput.click();
    if (uploadBtn) uploadBtn.addEventListener('click', triggerUpload);
    if (addLocalBtn) addLocalBtn.addEventListener('click', triggerUpload);

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadLocalAudioFile(file);
      }
    });

    this.attachSongRowEvents(body);
  }

  attachSongRowEvents(container) {
    container.querySelectorAll('.groove-song-row').forEach(row => {
      row.addEventListener('dblclick', () => {
        const idx = parseInt(row.dataset.idx, 10);
        this.currentTrackIndex = idx;
        this.startPlayback();
      });

      row.addEventListener('click', () => {
        container.querySelectorAll('.groove-song-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
      });
    });

    container.querySelectorAll('.song-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.id;
        const track = this.tracks.find(t => t.id === trackId);
        if (track) {
          track.favorite = !track.favorite;
          btn.textContent = track.favorite ? '❤️' : '🤍';
          btn.classList.toggle('active', track.favorite);
        }
      });
    });
  }

  toggleMiniPlayer() {
    this.isMiniPlayer = !this.isMiniPlayer;
    const el = this.winData.element;

    if (this.isMiniPlayer) {
      this.savedRect = {
        width: el.style.width,
        height: el.style.height
      };
      el.style.width = '340px';
      el.style.height = '240px';
    } else {
      if (this.savedRect) {
        el.style.width = this.savedRect.width;
        el.style.height = this.savedRect.height;
      }
    }

    this.render();
  }

  startPlayback() {
    this.ensureAudioContext();
    this.isPlaying = true;

    if (this.currentTrack.localUrl) {
      this.playLocalAudio();
    } else {
      this.startSynthesizedMusic();
    }

    this.startPlaybackTimer();
    this.updatePlaybackUI();
  }

  pausePlayback() {
    this.isPlaying = false;
    this.stopSynthesizedMusic();

    if (this.localAudioElement) {
      this.localAudioElement.pause();
    }

    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }

    this.updatePlaybackUI();
  }

  stopPlayback() {
    this.isPlaying = false;
    this.stopSynthesizedMusic();

    if (this.localAudioElement) {
      this.localAudioElement.pause();
      this.localAudioElement = null;
    }

    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  nextTrack() {
    if (this.isShuffle) {
      this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    }
    this.currentTime = 0;
    this.startPlayback();
    this.render();
  }

  previousTrack() {
    if (this.currentTime > 3) {
      this.currentTime = 0;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    }
    this.startPlayback();
    this.render();
  }

  playTrackByName(name) {
    const idx = this.tracks.findIndex(t => t.title.toLowerCase().includes(name.toLowerCase()));
    if (idx !== -1) {
      this.currentTrackIndex = idx;
    }
    this.startPlayback();
    this.render();
  }

  startPlaybackTimer() {
    if (this.playbackTimer) clearInterval(this.playbackTimer);

    this.playbackTimer = setInterval(() => {
      if (!this.isPlaying) return;

      this.currentTime += 1;
      if (this.currentTime >= this.currentTrack.duration) {
        if (this.repeatMode === 'one') {
          this.currentTime = 0;
          this.startPlayback();
        } else if (this.repeatMode === 'all') {
          this.nextTrack();
        } else {
          this.pausePlayback();
          this.currentTime = 0;
        }
      }

      this.updateTimelineUI();
    }, 1000);
  }

  updateTimelineUI() {
    const seekSlider = this.winData.element.querySelector('#pb-seek-slider');
    const seekFill = this.winData.element.querySelector('#pb-seek-fill');
    const curTimeTxt = this.winData.element.querySelector('#pb-cur-time');

    if (seekSlider) seekSlider.value = this.currentTime;
    if (seekFill) seekFill.style.width = `${(this.currentTime / this.currentTrack.duration) * 100}%`;
    if (curTimeTxt) curTimeTxt.textContent = this.formatSeconds(this.currentTime);
  }

  updatePlaybackUI() {
    const playBtn = this.winData.element.querySelector('#pb-play-btn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? WinIcons.pause : WinIcons.play;
      playBtn.title = this.isPlaying ? 'Pause' : 'Play';
    }

    const titleTxt = this.winData.element.querySelector('#pb-title-txt');
    const artistTxt = this.winData.element.querySelector('#pb-artist-txt');
    const coverThumb = this.winData.element.querySelector('#pb-cover-thumb');

    if (titleTxt) titleTxt.textContent = this.currentTrack.title;
    if (artistTxt) artistTxt.textContent = this.currentTrack.artist;
    if (coverThumb) coverThumb.style.background = this.currentTrack.coverGradient;

    // Update active row eq waves
    const content = this.winData.element.querySelector('#groove-content-view');
    if (content && this.activeTab === 'songs') {
      content.innerHTML = this.renderSongsView();
      this.attachSongRowEvents(content);
    }
  }

  // Synthesized Rich Music Track Generator
  startSynthesizedMusic() {
    this.stopSynthesizedMusic();
    if (!this.audioCtx) return;

    let step = 0;
    const track = this.currentTrack;
    const notes = track.notes || [261.63, 329.63, 392.00, 523.25];
    const bpm = track.tempo || 120;
    const stepDuration = (60 / bpm) / 2; // 16th notes / 8th notes

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;

      const t = this.audioCtx.currentTime;
      const noteFreq = notes[step % notes.length];
      step++;

      // Lead Melody Voice
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = track.style === 'lofi' ? 'sine' : (track.style === 'ambient' ? 'triangle' : 'sawtooth');
      osc.frequency.setValueAtTime(noteFreq, t);

      // Lowpass filter for smooth warmth
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(track.style === 'lofi' ? 800 : 2400, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);

      osc.start(t);
      osc.stop(t + stepDuration);

      // Bass Kick/Pluck on every 2nd or 4th beat
      if (step % 2 === 0) {
        const bassOsc = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(noteFreq / 2, t);

        bassGain.gain.setValueAtTime(0.12 * this.volume, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.8);

        bassOsc.connect(bassGain);
        bassGain.connect(this.analyser);

        bassOsc.start(t);
        bassOsc.stop(t + stepDuration * 0.8);
      }
    }, stepDuration * 1000);
  }

  stopSynthesizedMusic() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  playLocalAudio() {
    if (!this.localAudioElement) {
      this.localAudioElement = new Audio(this.currentTrack.localUrl);
      this.localAudioElement.volume = this.volume;
      this.localAudioElement.muted = this.isMuted;

      // Connect audio element to Web Audio analyser
      if (this.audioCtx) {
        try {
          const source = this.audioCtx.createMediaElementSource(this.localAudioElement);
          source.connect(this.analyser);
        } catch (e) {
          // Fallback if already connected
        }
      }
    }
    this.localAudioElement.play().catch(e => console.log('Audio play caught:', e));
  }

  loadLocalAudioFile(file) {
    const url = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const newTrack = {
      id: 'local-' + Date.now(),
      title: fileName,
      artist: 'Local Artist',
      album: 'Imported Music',
      year: '2026',
      duration: 180,
      durationStr: '3:00',
      coverGradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
      favorite: true,
      localUrl: url
    };

    // Calculate actual audio duration
    const tempAudio = new Audio(url);
    tempAudio.addEventListener('loadedmetadata', () => {
      newTrack.duration = Math.floor(tempAudio.duration);
      newTrack.durationStr = this.formatSeconds(newTrack.duration);
      this.render();
    });

    this.tracks.unshift(newTrack);
    this.currentTrackIndex = 0;
    this.startPlayback();
    this.render();

    if (window.WinAudio) window.WinAudio.playDeviceConnect();
  }

  // Real-Time Canvas Audio Spectrum Visualizer
  initVisualizer() {
    const canvas = this.winData.element.querySelector('#groove-vis-canvas');
    if (!canvas || !this.analyser) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.winData.element.parentNode) return;
      this.visualizerAnimationId = requestAnimationFrame(draw);

      this.analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0D0F12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let barHeight = (dataArray[i] / 255) * canvas.height;
        if (!this.isPlaying) {
          barHeight = Math.sin((i + Date.now() / 400)) * 6 + 10;
        }

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#0078D7');
        gradient.addColorStop(0.5, '#00BCF2');
        gradient.addColorStop(1, '#FF5D22');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();
  }
}

window.GrooveMusicApp = GrooveMusicApp;
