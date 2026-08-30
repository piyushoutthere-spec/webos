// WebOS main script - simple implementation
document.addEventListener('DOMContentLoaded', () => {

  // Lock Screen
  const enterBtn = document.getElementById('enter-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const desktop = document.getElementById('desktop');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      desktop.classList.remove('hidden');
    });
  }

  // Theme Switcher
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }

  // Clock
  function renderClock() {
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');
    const now = new Date();
    if (clock) clock.textContent = now.toLocaleTimeString();
    if (date) date.textContent = now.toLocaleDateString();
  }
  setInterval(renderClock, 1000);
  renderClock();

  // Simple Window Manager
  const container = document.getElementById('windows-container');
  let topZ = 10;
  let savedNoteText = '';

  function createWin(id, title, contentHtml) {
    let existing = document.getElementById('win-' + id);
    if (existing) {
      topZ++;
      existing.style.zIndex = topZ;
      return existing;
    }

    const win = document.createElement('div');
    win.id = 'win-' + id;
    win.className = 'window';
    win.style.left = '60px';
    win.style.top = '50px';
    topZ++;
    win.style.zIndex = topZ;

    win.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <button class="close-btn">X</button>
      </div>
      <div class="window-content">${contentHtml}</div>
    `;

    win.addEventListener('mousedown', () => {
      topZ++;
      win.style.zIndex = topZ;
    });

    win.querySelector('.close-btn').addEventListener('click', () => {
      win.remove();
    });

    // Dragging
    const header = win.querySelector('.window-header');
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      dragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (dragging) {
        win.style.left = (e.clientX - offsetX) + 'px';
        win.style.top = (e.clientY - offsetY) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
    });

    container.appendChild(win);
    return win;
  }

  // APP 1: About
  document.getElementById('open-app-about')?.addEventListener('click', () => {
    createWin('about', 'About Me', '<h3>Piyush WebOS</h3><p>Simple browser OS built with JS, HTML, CSS.</p>');
  });

  // APP 2: Notes
  document.getElementById('open-app-notes')?.addEventListener('click', () => {
    const win = createWin('notes', 'Notes', `<textarea id="note-input" class="notes-area">${savedNoteText}</textarea>`);
    const area = win.querySelector('#note-input');
    area?.addEventListener('input', () => { savedNoteText = area.value; });
  });

  // APP 3: Calculator
  document.getElementById('open-app-calc')?.addEventListener('click', () => {
    const calcMarkup = `
      <div class="calc-screen" id="c-disp">0</div>
      <div class="calc-grid">
        <button class="calc-btn" id="c-reset">C</button>
        <button class="calc-btn calc-op">/</button>
        <button class="calc-btn calc-op">*</button>
        <button class="calc-btn calc-op">-</button>
        <button class="calc-btn calc-op">7</button>
        <button class="calc-btn calc-op">8</button>
        <button class="calc-btn calc-op">9</button>
        <button class="calc-btn calc-op">+</button>
        <button class="calc-btn calc-op">4</button>
        <button class="calc-btn calc-op">5</button>
        <button class="calc-btn calc-op">6</button>
        <button class="calc-btn" id="c-run">=</button>
        <button class="calc-btn calc-op">1</button>
        <button class="calc-btn calc-op">2</button>
        <button class="calc-btn calc-op">3</button>
        <button class="calc-btn calc-op">0</button>
      </div>
    `;
    const win = createWin('calc', 'Calculator', calcMarkup);
    const disp = win.querySelector('#c-disp');
    
    win.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.id === 'c-reset') {
          disp.textContent = '0';
        } else if (btn.id === 'c-run') {
          try { disp.textContent = eval(disp.textContent); } 
          catch (e) { disp.textContent = 'Error'; }
        } else {
          if (disp.textContent === '0' || disp.textContent === 'Error') {
            disp.textContent = btn.textContent;
          } else {
            disp.textContent += btn.textContent;
          }
        }
      });
    });
  });

  // APP 4: Terminal
  document.getElementById('open-app-terminal')?.addEventListener('click', () => {
    const termMarkup = `
      <div class="terminal-body">
        <p>Type "help" for commands.</p>
        <div id="t-logs"></div>
        <div class="terminal-input-line">
          <span>$</span>
          <input type="text" id="t-cmd" class="terminal-input" />
        </div>
      </div>
    `;
    const win = createWin('terminal', 'Terminal', termMarkup);
    const input = win.querySelector('#t-cmd');
    const logs = win.querySelector('#t-logs');

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const txt = input.value.trim();
        let res = '';
        if (txt === 'help') res = 'Commands: help, date, clear';
        else if (txt === 'date') res = new Date().toLocaleString();
        else if (txt === 'clear') { logs.innerHTML = ''; input.value = ''; return; }
        else if (txt) res = 'Unknown: ' + txt;

        logs.innerHTML += `<div>$ ${txt}</div><div>${res}</div>`;
        input.value = '';
      }
    });
  });

  // APP 5: Working Timer / Stopwatch
  document.getElementById('open-app-timer')?.addEventListener('click', () => {
    const timerMarkup = `
      <div style="text-align: center; padding: 10px;">
        <h2 id="timer-display">0s</h2>
        <button id="start-timer">Start</button>
        <button id="stop-timer">Stop</button>
        <button id="reset-timer">Reset</button>
      </div>
    `;
    const win = createWin('timer', 'Timer', timerMarkup);
    let seconds = 0;
    let timerRef = null;

    const display = win.querySelector('#timer-display');
    win.querySelector('#start-timer').addEventListener('click', () => {
      if (!timerRef) {
        timerRef = setInterval(() => {
          seconds++;
          display.textContent = seconds + 's';
        }, 1000);
      }
    });
    win.querySelector('#stop-timer').addEventListener('click', () => {
      clearInterval(timerRef);
      timerRef = null;
    });
    win.querySelector('#reset-timer').addEventListener('click', () => {
      clearInterval(timerRef);
      timerRef = null;
      seconds = 0;
      display.textContent = '0s';
    });
  });

  // APP 6: Working Snake Game
  document.getElementById('open-app-snake')?.addEventListener('click', () => {
    const snakeMarkup = `
      <div style="text-align:center;">
        <canvas id="snakeCanvas" width="200" height="200" style="background:#000; display:block; margin:auto;"></canvas>
        <p>Use Arrow Keys to move</p>
      </div>
    `;
    const win = createWin('snake', 'Snake Game', snakeMarkup);
    const canvas = win.querySelector('#snakeCanvas');
    const ctx = canvas.getContext('2d');

    let snake = [{x: 10, y: 10}];
    let food = {x: 5, y: 5};
    let dx = 1, dy = 0;

    function gameLoop() {
      if (!document.getElementById('win-snake')) return;

      let head = {x: snake[0].x + dx, y: snake[0].y + dy};
      
      // Wrap wall
      if (head.x < 0) head.x = 19;
      if (head.x >= 20) head.x = 0;
      if (head.y < 0) head.y = 19;
      if (head.y >= 20) head.y = 0;

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        food = {Math.floor(Math.random()*20), Math.floor(Math.random()*20)};
      } else {
        snake.pop();
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 200, 200);

      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * 10, food.y * 10, 8, 8);

      ctx.fillStyle = 'lime';
      snake.forEach(part => {
        ctx.fillRect(part.x * 10, part.y * 10, 8, 8);
      });
    }

    const interval = setInterval(gameLoop, 150);

    const handleKeys = (e) => {
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
      if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    };

    document.addEventListener('keydown', handleKeys);
  });

  // APP 7: Tic-Tac-Toe
  document.getElementById('open-app-ttt')?.addEventListener('click', () => {
    const tttMarkup = `
      <div class="ttt-container">
        <div id="ttt-status">Turn: X</div>
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
      </div>
    `;
    const win = createWin('ttt', 'Tic-Tac-Toe', tttMarkup);
    let turn = 'X';
    let board = Array(9).fill('');

    win.querySelectorAll('.ttt-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const idx = cell.getAttribute('data-i');
        if (!board[idx]) {
          board[idx] = turn;
          cell.textContent = turn;
          turn = turn === 'X' ? 'O' : 'X';
          win.querySelector('#ttt-status').textContent = 'Turn: ' + turn;
        }
      });
    });
  });

});
