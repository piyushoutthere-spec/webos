// Web OS Script - By Piyush
document.addEventListener('DOMContentLoaded', () => {

  // Enter OS Button
  const enterBtn = document.getElementById('enter-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const desktop = document.getElementById('desktop');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      desktop.classList.remove('hidden');
    });
  }

  // Set Random Wallpaper
  const randNum = Math.floor(Math.random() * 500);
  desktop.style.backgroundImage = `url('https://picsum.photos/1920/1080?random=${randNum}')`;

  // Theme Switcher
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });

  // Top Bar Clock
  function updateClock() {
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');
    const now = new Date();
    
    clock.textContent = now.toLocaleTimeString();
    date.textContent = now.toLocaleDateString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Window System & Dragging Engine
  const windowArea = document.getElementById('windows-container');
  let topZIndex = 10;
  let savedNotes = '';

  function openWindow(appId, title, content) {
    let openWin = document.getElementById('win-' + appId);
    if (openWin) {
      topZIndex++;
      openWin.style.zIndex = topZIndex;
      return openWin;
    }

    const win = document.createElement('div');
    win.id = 'win-' + appId;
    win.className = 'window';
    win.style.left = '100px';
    win.style.top = '80px';
    topZIndex++;
    win.style.zIndex = topZIndex;

    win.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <button class="close-btn">X</button>
      </div>
      <div class="window-content">${content}</div>
    `;

    // Click to focus window
    win.addEventListener('mousedown', () => {
      topZIndex++;
      win.style.zIndex = topZIndex;
    });

    // Close button
    win.querySelector('.close-btn').addEventListener('click', () => {
      win.remove();
    });

    // Dragging setup
    const header = win.querySelector('.window-header');
    let holding = false;
    let startX = 0;
    let startY = 0;

    header.addEventListener('mousedown', (e) => {
      holding = true;
      startX = e.clientX - win.offsetLeft;
      startY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (holding) {
        win.style.left = (e.clientX - startX) + 'px';
        win.style.top = (e.clientY - startY) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      holding = false;
    });

    windowArea.appendChild(win);
    return win;
  }

  // Apps Setup

  // About App
  document.getElementById('open-app-about').addEventListener('click', () => {
    openWindow('about', 'About Me', '<h2>Piyush OS</h2><p>Welcome to my web OS project built for Stardance!</p>');
  });

  // Notes App
  document.getElementById('open-app-notes').addEventListener('click', () => {
    const win = openWindow('notes', 'Notes', `<textarea id="my-notes" class="notes-area" placeholder="Write something...">${savedNotes}</textarea>`);
    const txt = win.querySelector('#my-notes');
    txt.addEventListener('input', () => { savedNotes = txt.value; });
  });

  // Calculator App
  document.getElementById('open-app-calc').addEventListener('click', () => {
    const calcHTML = `
      <div class="calc-screen" id="c-screen">0</div>
      <div class="calc-grid">
        <button class="calc-btn" id="c-clear">C</button>
        <button class="calc-btn" class="c-num">/</button>
        <button class="calc-btn" class="c-num">*</button>
        <button class="calc-btn" class="c-num">-</button>
        <button class="calc-btn" class="c-num">7</button>
        <button class="calc-btn" class="c-num">8</button>
        <button class="calc-btn" class="c-num">9</button>
        <button class="calc-btn" class="c-num">+</button>
        <button class="calc-btn" class="c-num">4</button>
        <button class="calc-btn" class="c-num">5</button>
        <button class="calc-btn" class="c-num">6</button>
        <button class="calc-btn" id="c-eval">=</button>
        <button class="calc-btn" class="c-num">1</button>
        <button class="calc-btn" class="c-num">2</button>
        <button class="calc-btn" class="c-num">3</button>
        <button class="calc-btn" class="c-num">0</button>
      </div>
    `;
    const win = openWindow('calc', 'Calculator', calcHTML);
    const screen = win.querySelector('#c-screen');
    const btns = win.querySelectorAll('.calc-btn');

    btns.forEach(b => {
      b.addEventListener('click', () => {
        if (b.id === 'c-clear') {
          screen.textContent = '0';
        } else if (b.id === 'c-eval') {
          try {
            screen.textContent = eval(screen.textContent);
          } catch (e) {
            screen.textContent = 'Error';
          }
        } else {
          if (screen.textContent === '0' || screen.textContent === 'Error') {
            screen.textContent = b.textContent;
          } else {
            screen.textContent += b.textContent;
          }
        }
      });
    });
  });

  // Terminal App
  document.getElementById('open-app-terminal').addEventListener('click', () => {
    const termHTML = `
      <div class="terminal-body">
        <p>Type 'help' for available commands.</p>
        <div id="t-out"></div>
        <div class="terminal-input-line">
          <span>></span>
          <input type="text" id="t-in" class="terminal-input" />
        </div>
      </div>
    `;
    const win = openWindow('terminal', 'Terminal', termHTML);
    const input = win.querySelector('#t-in');
    const output = win.querySelector('#t-out');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        let reply = '';
        if (cmd === 'help') reply = 'Commands: help, date, whoami, clear';
        else if (cmd === 'date') reply = new Date().toLocaleString();
        else if (cmd === 'whoami') reply = 'piyushoutthere';
        else if (cmd === 'clear') { output.innerHTML = ''; input.value = ''; return; }
        else reply = 'Unknown command: ' + cmd;

        output.innerHTML += `<div>> ${cmd}</div><div>${reply}</div>`;
        input.value = '';
      }
    });
  });

  // Tic-Tac-Toe App
  document.getElementById('open-app-ttt').addEventListener('click', () => {
    const tttHTML = `
      <div class="ttt-container">
        <div id="ttt-turn">Player X's turn</div>
        <div class="ttt-grid">
          <div class="ttt-cell" data-i="0"></div>
          <div class="ttt-cell" data-i="1"></div>
          <div class="ttt-cell" data-i="2"></div>
          <div class="ttt-cell" data-i="3"></div>
          <div class="ttt-cell" data-i="4"></div>
          <div class="ttt-cell" data-i="5"></div>
          <div class="ttt-cell" data-i="6"></div>
          <div class="ttt-cell" data-i="7"></div>
          <div class="ttt-cell" data-i="8"></div>
        </div>
        <button class="ttt-reset" id="reset-ttt">Restart</button>
      </div>
    `;
    const win = openWindow('ttt', 'Tic-Tac-Toe', tttHTML);
    let turn = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let active = true;

    const cells = win.querySelectorAll('.ttt-cell');
    const turnText = win.querySelector('#ttt-turn');

    cells.forEach(c => {
      c.addEventListener('click', () => {
        const idx = c.getAttribute('data-i');
        if (board[idx] === '' && active) {
          board[idx] = turn;
          c.textContent = turn;
          turn = turn === 'X' ? 'O' : 'X';
          turnText.textContent = `Player ${turn}'s turn`;
        }
      });
    });

    win.querySelector('#reset-ttt').addEventListener('click', () => {
      board = ['', '', '', '', '', '', '', '', ''];
      turn = 'X';
      active = true;
      cells.forEach(c => c.textContent = '');
      turnText.textContent = "Player X's turn";
    });
  });

  // Settings App
  document.getElementById('open-app-settings').addEventListener('click', () => {
    openWindow('settings', 'Settings', '<p>System configured and running cleanly.</p>');
  });

  // Weather App
  document.getElementById('open-app-weather').addEventListener('click', () => {
    openWindow('weather', 'Weather', '<div class="weather-card"><h3>Local Weather</h3><p>Sunny, 25°C</p></div>');
  });

});
