document.addEventListener('DOMContentLoaded', () => {

  // Dynamic Wallpaper
  function setRandomWallpaper() {
    const desktop = document.getElementById('desktop');
    if (desktop) {
      const randomSeed = Math.floor(Math.random() * 1000);
      desktop.style.backgroundImage = `url('https://picsum.photos/1920/1080?random=${randomSeed}')`;
    }
  }
  setRandomWallpaper();

  // Welcome Screen Logic
  const enterBtn = document.getElementById('enter-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const desktop = document.getElementById('desktop');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      desktop.classList.remove('hidden');
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      themeBtn.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    });
  }

  // Real-time Clock and Date
  function updateDateTime() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const now = new Date();

    if (clockElement) clockElement.textContent = now.toLocaleTimeString();
    if (dateElement) {
      dateElement.textContent = now.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // Multi-Window Manager
  const container = document.getElementById('windows-container');
  let zIndexCount = 100;
  let savedNoteText = '';

  function createWindow(id, title, contentHTML, initialLeft = 120, initialTop = 80) {
    const existing = document.getElementById(`win-${id}`);
    if (existing) {
      existing.style.zIndex = ++zIndexCount;
      return existing;
    }

    const win = document.createElement('div');
    win.id = `win-${id}`;
    win.className = 'window';
    win.style.left = `${initialLeft}px`;
    win.style.top = `${initialTop}px`;
    win.style.zIndex = ++zIndexCount;

    win.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <button class="close-btn">&times;</button>
      </div>
      <div class="window-content">${contentHTML}</div>
    `;

    win.addEventListener('mousedown', () => {
      win.style.zIndex = ++zIndexCount;
    });

    win.querySelector('.close-btn').addEventListener('click', () => {
      win.remove();
    });

    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.appendChild(win);
    return win;
  }

  // App 1: About Me
  document.getElementById('open-app-about')?.addEventListener('click', () => {
    createWindow('about', 'About Me', '<h3>Piyush OS</h3><p>Welcome to my web operating system portfolio!</p>', 100, 70);
  });

  // App 2: Notes
  document.getElementById('open-app-notes')?.addEventListener('click', () => {
    const win = createWindow('notes', 'Notes', `<textarea id="notes-input" class="notes-area" placeholder="Type your notes here...">${savedNoteText}</textarea>`, 130, 90);
    const notesInput = win.querySelector('#notes-input');
    notesInput?.addEventListener('input', (e) => {
      savedNoteText = e.target.value;
    });
  });

  // App 3: Calculator
  document.getElementById('open-app-calc')?.addEventListener('click', () => {
    const calcHTML = `
      <div class="calc-screen" id="calc-screen">0</div>
      <div class="calc-grid">
        <button class="calc-btn" data-act="clear">C</button>
        <button class="calc-btn" data-val="/">/</button>
        <button class="calc-btn" data-val="*">*</button>
        <button class="calc-btn" data-val="-">-</button>
        <button class="calc-btn" data-val="7">7</button>
        <button class="calc-btn" data-val="8">8</button>
        <button class="calc-btn" data-val="9">9</button>
        <button class="calc-btn" data-val="+">+</button>
        <button class="calc-btn" data-val="4">4</button>
        <button class="calc-btn" data-val="5">5</button>
        <button class="calc-btn" data-val="6">6</button>
        <button class="calc-btn" data-act="equals">=</button>
        <button class="calc-btn" data-val="1">1</button>
        <button class="calc-btn" data-val="2">2</button>
        <button class="calc-btn" data-val="3">3</button>
        <button class="calc-btn" data-val="0">0</button>
      </div>
    `;
    const win = createWindow('calc', 'Calculator', calcHTML, 160, 110);
    const screen = win.querySelector('#calc-screen');
    const buttons = win.querySelectorAll('.calc-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const act = btn.getAttribute('data-act');

        if (act === 'clear') {
          screen.textContent = '0';
        } else if (act === 'equals') {
          try {
            screen.textContent = Function(`'use strict'; return (${screen.textContent})`)();
          } catch {
            screen.textContent = 'Error';
          }
        } else if (val) {
          if (screen.textContent === '0' || screen.textContent === 'Error') {
            screen.textContent = val;
          } else {
            screen.textContent += val;
          }
        }
      });
    });
  });

  // App 4: Terminal
  document.getElementById('open-app-terminal')?.addEventListener('click', () => {
    const termHTML = `
      <div class="terminal-body">
        <div>PiyushOS Terminal v2.0</div>
        <div>Type 'help' for commands.</div>
        <div id="term-output"></div>
        <div class="terminal-input-line">
          <span>user@webos:~$</span>
          <input type="text" id="term-input" class="terminal-input" autofocus />
        </div>
      </div>
    `;
    const win = createWindow('terminal', 'Terminal', termHTML, 190, 130);
    const termInput = win.querySelector('#term-input');
    const termOutput = win.querySelector('#term-output');

    termInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        let res = '';

        if (cmd === 'help') res = 'Commands: help, date, clear, whoami, wallpaper';
        else if (cmd === 'date') res = new Date().toString();
        else if (cmd === 'whoami') res = 'piyushoutthere';
        else if (cmd === 'wallpaper') { setRandomWallpaper(); res = 'Wallpaper updated!'; }
        else if (cmd === 'clear') { termOutput.innerHTML = ''; termInput.value = ''; return; }
        else if (cmd !== '') res = `Command not found: ${cmd}`;

        termOutput.innerHTML += `<div>user@webos:~$ ${cmd}</div><div>${res}</div>`;
        termInput.value = '';
      }
    });
  });

  // NEW FEATURE 1: Stopwatch & Countdown Timer
  document.getElementById('open-app-timer')?.addEventListener('click', () => {
    const timerHTML = `
      <div class="timer-container">
        <div class="timer-display" id="t-display">00:00</div>
        <div class="timer-controls">
          <button class="timer-btn" id="sw-start">Start SW</button>
          <button class="timer-btn" id="t-stop">Stop</button>
          <button class="timer-btn" id="t-reset">Reset</button>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 5px; align-items: center;">
          <input type="number" id="cd-seconds" class="timer-input" placeholder="Secs" min="1" />
          <button class="timer-btn" id="cd-start">Start Timer</button>
        </div>
      </div>
    `;
    const win = createWindow('timer', 'Stopwatch & Timer', timerHTML, 220, 150);
    const display = win.querySelector('#t-display');
    
    let timerInterval = null;
    let seconds = 0;

    function formatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    win.querySelector('#sw-start').addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        seconds++;
        display.textContent = formatTime(seconds);
      }, 1000);
    });

    win.querySelector('#cd-start').addEventListener('click', () => {
      const val = parseInt(win.querySelector('#cd-seconds').value);
      if (isNaN(val) || val <= 0) return;
      clearInterval(timerInterval);
      seconds = val;
      display.textContent = formatTime(seconds);
      timerInterval = setInterval(() => {
        seconds--;
        display.textContent = formatTime(seconds);
        if (seconds <= 0) {
          clearInterval(timerInterval);
          alert('Time is up!');
        }
      }, 1000);
    });

    win.querySelector('#t-stop').addEventListener('click', () => clearInterval(timerInterval));
    win.querySelector('#t-reset').addEventListener('click', () => {
      clearInterval(timerInterval);
      seconds = 0;
      display.textContent = "00:00";
    });
  });

  // NEW FEATURE 2: Audio / Music Player App
  document.getElementById('open-app-music')?.addEventListener('click', () => {
    const musicHTML = `
      <div class="player-container">
        <div class="player-title">🎵 WebOS Synth Player</div>
        <audio id="audio-element" controls style="width: 100%;">
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
    createWindow('music', 'Music Player', musicHTML, 250, 170);
  });

  // NEW FEATURE 3: Snake Game
  document.getElementById('open-app-snake')?.addEventListener('click', () => {
    const snakeHTML = `
      <div class="snake-container">
        <div class="snake-score" id="s-score">Score: 0</div>
        <canvas id="snake-canvas" class="snake-canvas" width="240" height="240"></canvas>
      </div>
    `;
    const win = createWindow('snake', 'Snake Game', snakeHTML, 280, 190);
    const canvas = win.querySelector('#snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = win.querySelector('#s-score');

    const grid = 12;
    let count = 0;
    let score = 0;
    let snake = { x: 96, y: 96, dx: grid, dy: 0, cells: [], maxCells: 4 };
    let apple = { x: 48, y: 48 };
    let animId = null;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function loop() {
      animId = requestAnimationFrame(loop);

      if (++count < 6) return; // Control speed
      count = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snake.x += snake.dx;
      snake.y += snake.dy;

      // Wrap-around edges
      if (snake.x < 0) snake.x = canvas.width - grid;
      else if (snake.x >= canvas.width) snake.x = 0;
      if (snake.y < 0) snake.y = canvas.height - grid;
      else if (snake.y >= canvas.height) snake.y = 0;

      snake.cells.unshift({ x: snake.x, y: snake.y });

      if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
      }

      // Draw Apple
      ctx.fillStyle = 'red';
      ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

      // Draw Snake
      ctx.fillStyle = '#00ff00';
      snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
          score += 10;
          scoreDisplay.textContent = `Score: ${score}`;
          apple.x = getRandomInt(0, 20) * grid;
          apple.y = getRandomInt(0, 20) * grid;
        }

        // Collision Check
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            snake.x = 96;
            snake.y = 96;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;
            score = 0;
            scoreDisplay.textContent = `Score: 0`;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
          }
        }
      });
    }

    // Keyboard controls
    const keyHandler = (e) => {
      if (e.key === 'ArrowLeft' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
      else if (e.key === 'ArrowUp' && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
      else if (e.key === 'ArrowRight' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
      else if (e.key === 'ArrowDown' && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
    };

    document.addEventListener('keydown', keyHandler);

    // Stop animation when window closes
    win.querySelector('.close-btn').addEventListener('click', () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('keydown', keyHandler);
    });

    requestAnimationFrame(loop);
  });

  // App 8: Tic-Tac-Toe Game
  document.getElementById('open-app-ttt')?.addEventListener('click', () => {
    const tttHTML = `
      <div class="ttt-container">
        <div class="ttt-status" id="ttt-status">Player X's Turn</div>
        <div class="ttt-grid">
          <div class="ttt-cell" data-idx="0"></div>
          <div class="ttt-cell" data-idx="1"></div>
          <div class="ttt-cell" data-idx="2"></div>
          <div class="ttt-cell" data-idx="3"></div>
          <div class="ttt-cell" data-idx="4"></div>
          <div class="ttt-cell" data-idx="5"></div>
          <div class="ttt-cell" data-idx="6"></div>
          <div class="ttt-cell" data-idx="7"></div>
          <div class="ttt-cell" data-idx="8"></div>
        </div>
        <button class="ttt-reset" id="ttt-reset">Reset Game</button>
      </div>
    `;
    const win = createWindow('ttt', 'Tic-Tac-Toe', tttHTML, 310, 210);
    
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;

    const statusDisplay = win.querySelector('#ttt-status');
    const cells = win.querySelectorAll('.ttt-cell');
    const resetBtn = win.querySelector('#ttt-reset');

    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const idx = parseInt(cell.getAttribute('data-idx'));
        if (board[idx] !== "" || !isGameActive) return;

        board[idx] = currentPlayer;
        cell.textContent = currentPlayer;

        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
          const [a, b, c] = winningConditions[i];
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
          }
        }

        if (roundWon) {
          statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
          isGameActive = false;
          return;
        }

        if (!board.includes("")) {
          statusDisplay.textContent = `Game Draw!`;
          isGameActive = false;
          return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
      });
    });

    resetBtn.addEventListener('click', () => {
      board = ["", "", "", "", "", "", "", "", ""];
      isGameActive = true;
      currentPlayer = "X";
      statusDisplay.textContent = "Player X's Turn";
      cells.forEach(cell => cell.textContent = "");
    });
  });

  // App 9: Weather App
  document.getElementById('open-app-weather')?.addEventListener('click', () => {
    const weatherHTML = `
      <div class="weather-card">
        <h2>New York</h2>
        <div style="font-size: 3rem;">☀️</div>
        <div class="weather-temp">24°C</div>
        <div class="weather-desc">Sunny & Clear</div>
        <p style="font-size: 0.8rem; margin-top: 5px;">Humidity: 45% | Wind: 12 km/h</p>
      </div>
    `;
    createWindow('weather', 'Weather', weatherHTML, 340, 230);
  });

  // App 10: Settings
  document.getElementById('open-app-settings')?.addEventListener('click', () => {
    createWindow('settings', 'Settings', '<h3>Settings</h3><p>System operational with multi-window support!</p>', 370, 250);
  });

});