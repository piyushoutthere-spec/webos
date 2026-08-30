// Web OS Logic - Written by Piyush

// 1. Setup Lock Screen & Desktop
const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const desktop = document.getElementById('desktop');

if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
  });
}

// Set Wallpaper
const randId = Math.floor(Math.random() * 300);
desktop.style.backgroundImage = `url('https://picsum.photos/1920/1080?random=${randId}')`;

// Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });
}

// 2. Real-time Clock
function updateTime() {
  const clock = document.getElementById('clock');
  const date = document.getElementById('date');
  const now = new Date();
  
  if (clock) clock.textContent = now.toLocaleTimeString();
  if (date) date.textContent = now.toLocaleDateString();
}
setInterval(updateTime, 1000);
updateTime();

// 3. Window & Dragging Manager
const winContainer = document.getElementById('windows-container');
let currentZIndex = 10;
let savedNote = '';

function makeWindow(id, title, innerHTML) {
  let existingWin = document.getElementById('win-' + id);
  if (existingWin) {
    currentZIndex++;
    existingWin.style.zIndex = currentZIndex;
    return existingWin;
  }

  const win = document.createElement('div');
  win.id = 'win-' + id;
  win.className = 'window';
  win.style.left = '120px';
  win.style.top = '90px';
  currentZIndex++;
  win.style.zIndex = currentZIndex;

  win.innerHTML = `
    <div class="window-header">
      <span>${title}</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="window-content">${innerHTML}</div>
  `;

  // Focus Window on Click
  win.addEventListener('mousedown', () => {
    currentZIndex++;
    win.style.zIndex = currentZIndex;
  });

  // Close Window
  win.querySelector('.close-btn').addEventListener('click', () => {
    win.remove();
  });

  // Dragging Logic
  const header = win.querySelector('.window-header');
  let isMoving = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isMoving = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isMoving) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isMoving = false;
  });

  winContainer.appendChild(win);
  return win;
}

// 4. App Launchers

// About App
document.getElementById('open-app-about')?.addEventListener('click', () => {
  makeWindow('about', 'About Me', '<h2>Piyush OS</h2><p>Welcome to my web OS project!</p>');
});

// Notes App
document.getElementById('open-app-notes')?.addEventListener('click', () => {
  const win = makeWindow('notes', 'Notes', `<textarea id="notes-text" class="notes-area">${savedNote}</textarea>`);
  const area = win.querySelector('#notes-text');
  area?.addEventListener('input', () => { savedNote = area.value; });
});

// Calculator App
document.getElementById('open-app-calc')?.addEventListener('click', () => {
  const calcHTML = `
    <div class="calc-screen" id="calc-display">0</div>
    <div class="calc-grid">
      <button class="calc-btn" id="btn-c">C</button>
      <button class="calc-btn btn-val">/</button>
      <button class="calc-btn btn-val">*</button>
      <button class="calc-btn btn-val">-</button>
      <button class="calc-btn btn-val">7</button>
      <button class="calc-btn btn-val">8</button>
      <button class="calc-btn btn-val">9</button>
      <button class="calc-btn btn-val">+</button>
      <button class="calc-btn btn-val">4</button>
      <button class="calc-btn btn-val">5</button>
      <button class="calc-btn btn-val">6</button>
      <button class="calc-btn" id="btn-eq">=</button>
      <button class="calc-btn btn-val">1</button>
      <button class="calc-btn btn-val">2</button>
      <button class="calc-btn btn-val">3</button>
      <button class="calc-btn btn-val">0</button>
    </div>
  `;
  const win = makeWindow('calc', 'Calculator', calcHTML);
  const display = win.querySelector('#calc-display');
  
  win.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'btn-c') {
        display.textContent = '0';
      } else if (btn.id === 'btn-eq') {
        try {
          display.textContent = eval(display.textContent);
        } catch (err) {
          display.textContent = 'Error';
        }
      } else {
        if (display.textContent === '0' || display.textContent === 'Error') {
          display.textContent = btn.textContent;
        } else {
          display.textContent += btn.textContent;
        }
      }
    });
  });
});

// Terminal App
document.getElementById('open-app-terminal')?.addEventListener('click', () => {
  const termHTML = `
    <div class="terminal-body">
      <p>Type 'help' for available commands.</p>
      <div id="term-logs"></div>
      <div class="terminal-input-line">
        <span>$</span>
        <input type="text" id="term-field" class="terminal-input" />
      </div>
    </div>
  `;
  const win = makeWindow('terminal', 'Terminal', termHTML);
  const input = win.querySelector('#term-field');
  const logs = win.querySelector('#term-logs');

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      let output = '';

      if (val === 'help') output = 'Available commands: help, date, whoami, clear';
      else if (val === 'date') output = new Date().toString();
      else if (val === 'whoami') output = 'piyushoutthere';
      else if (val === 'clear') { logs.innerHTML = ''; input.value = ''; return; }
      else if (val !== '') output = 'Command not recognized: ' + val;

      logs.innerHTML += `<div>$ ${val}</div><div>${output}</div>`;
      input.value = '';
    }
  });
});

// Tic-Tac-Toe App
document.getElementById('open-app-ttt')?.addEventListener('click', () => {
  const tttHTML = `
    <div class="ttt-container">
      <div id="ttt-info">Turn: Player X</div>
      <div class="ttt-grid">
        <div class="ttt-cell" data-pos="0"></div>
        <div class="ttt-cell" data-pos="1"></div>
        <div class="ttt-cell" data-pos="2"></div>
        <div class="ttt-cell" data-pos="3"></div>
        <div class="ttt-cell" data-pos="4"></div>
        <div class="ttt-cell" data-pos="5"></div>
        <div class="ttt-cell" data-pos="6"></div>
        <div class="ttt-cell" data-pos="7"></div>
        <div class="ttt-cell" data-pos="8"></div>
      </div>
      <button class="ttt-reset" id="ttt-restart">Reset</button>
    </div>
  `;
  const win = makeWindow('ttt', 'Tic-Tac-Toe', tttHTML);
  let turn = 'X';
  let board = ['', '', '', '', '', '', '', '', ''];

  const cells = win.querySelectorAll('.ttt-cell');
  const info = win.querySelector('#ttt-info');

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const pos = cell.getAttribute('data-pos');
      if (board[pos] === '') {
        board[pos] = turn;
        cell.textContent = turn;
        turn = (turn === 'X') ? 'O' : 'X';
        info.textContent = 'Turn: Player ' + turn;
      }
    });
  });

  win.querySelector('#ttt-restart')?.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    turn = 'X';
    info.textContent = 'Turn: Player X';
    cells.forEach(cell => cell.textContent = '');
  });
});

// Settings & Weather
document.getElementById('open-app-weather')?.addEventListener('click', () => {
  makeWindow('weather', 'Weather', '<h3>Weather</h3><p>Sunny, 24°C</p>');
});

document.getElementById('open-app-settings')?.addEventListener('click', () => {
  makeWindow('settings', 'Settings', '<h3>Settings</h3><p>WebOS running smoothly.</p>');
});
