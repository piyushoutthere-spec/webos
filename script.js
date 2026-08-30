// piyush's webos script
// made for hack club stardance!

document.addEventListener('DOMContentLoaded', () => {

  // grab main elements
  const enterBtn = document.getElementById('enter-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const desktop = document.getElementById('desktop');
  const winContainer = document.getElementById('windows-container');

  // lockscreen enter button
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      desktop.classList.remove('hidden');
    });
  }

  // random bg wallpaper
  const randomPic = Math.floor(Math.random() * 200) + 1;
  desktop.style.backgroundImage = 'url("https://picsum.photos/1920/1080?random=' + randomPic + '")';

  // theme toggle (dark/light)
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }

  // clock update logic
  function startClock() {
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');
    const d = new Date();
    
    if (clock) clock.textContent = d.toLocaleTimeString();
    if (date) date.textContent = d.toLocaleDateString();
  }
  setInterval(startClock, 1000);
  startClock();

  // window manager & drag handler
  let zIndex = 5;
  let savedNotesText = "";

  function spawnWindow(id, title, htmlContent) {
    // check if win already open
    let oldWin = document.getElementById('win-' + id);
    if (oldWin) {
      zIndex++;
      oldWin.style.zIndex = zIndex;
      return oldWin;
    }

    // make new window element
    const win = document.createElement('div');
    win.id = 'win-' + id;
    win.className = 'window';
    win.style.left = '80px';
    win.style.top = '60px';
    zIndex++;
    win.style.zIndex = zIndex;

    win.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <button class="close-btn">X</button>
      </div>
      <div class="window-content">${htmlContent}</div>
    `;

    // click window to bring to top
    win.addEventListener('mousedown', function() {
      zIndex++;
      win.style.zIndex = zIndex;
    });

    // close button listener
    win.querySelector('.close-btn').addEventListener('click', function() {
      win.remove();
    });

    // dragging function
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let px = 0;
    let py = 0;

    header.addEventListener('mousedown', function(e) {
      isDragging = true;
      px = e.clientX - win.offsetLeft;
      py = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        win.style.left = (e.clientX - px) + 'px';
        win.style.top = (e.clientY - py) + 'px';
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
    });

    winContainer.appendChild(win);
    return win;
  }

  // APP LAUNCHERS

  // 1. About
  document.getElementById('open-app-about')?.addEventListener('click', function() {
    spawnWindow('about', 'About Me', '<h3>Piyush OS</h3><p>Hey! Welcome to my custom web OS setup.</p>');
  });

  // 2. Notes
  document.getElementById('open-app-notes')?.addEventListener('click', function() {
    const win = spawnWindow('notes', 'Notes', '<textarea id="note-box" class="notes-area">' + savedNotesText + '</textarea>');
    const box = win.querySelector('#note-box');
    box?.addEventListener('input', function() {
      savedNotesText = box.value;
    });
  });

  // 3. Calculator
  document.getElementById('open-app-calc')?.addEventListener('click', function() {
    const calcMarkup = `
      <div class="calc-screen" id="calc-out">0</div>
      <div class="calc-grid">
        <button class="calc-btn" id="c-clr">C</button>
        <button class="calc-btn btn-click">/</button>
        <button class="calc-btn btn-click">*</button>
        <button class="calc-btn btn-click">-</button>
        <button class="calc-btn btn-click">7</button>
        <button class="calc-btn btn-click">8</button>
        <button class="calc-btn btn-click">9</button>
        <button class="calc-btn btn-click">+</button>
        <button class="calc-btn btn-click">4</button>
        <button class="calc-btn btn-click">5</button>
        <button class="calc-btn btn-click">6</button>
        <button class="calc-btn" id="c-ans">=</button>
        <button class="calc-btn btn-click">1</button>
        <button class="calc-btn btn-click">2</button>
        <button class="calc-btn btn-click">3</button>
        <button class="calc-btn btn-click">0</button>
      </div>
    `;
    const win = spawnWindow('calc', 'Calculator', calcMarkup);
    const screen = win.querySelector('#calc-out');
    
    win.querySelectorAll('.calc-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        if (b.id === 'c-clr') {
          screen.textContent = '0';
        } else if (b.id === 'c-ans') {
          try {
            screen.textContent = eval(screen.textContent);
          } catch(err) {
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

  // 4. Terminal
  document.getElementById('open-app-terminal')?.addEventListener('click', function() {
    const termMarkup = `
      <div class="terminal-body">
        <p>Type "help" to see commands.</p>
        <div id="logs"></div>
        <div class="terminal-input-line">
          <span>$</span>
          <input type="text" id="cmd-input" class="terminal-input" />
        </div>
      </div>
    `;
    const win = spawnWindow('terminal', 'Terminal', termMarkup);
    const input = win.querySelector('#cmd-input');
    const logs = win.querySelector('#logs');

    input?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const text = input.value.trim();
        let res = '';

        if (text === 'help') res = 'Commands available: help, date, whoami, clear';
        else if (text === 'date') res = new Date().toString();
        else if (text === 'whoami') res = 'piyushoutthere';
        else if (text === 'clear') { logs.innerHTML = ''; input.value = ''; return; }
        else if (text !== '') res = 'Unknown command: ' + text;

        logs.innerHTML += '<div>$ ' + text + '</div><div>' + res + '</div>';
        input.value = '';
      }
    });
  });

  // 5. Tic Tac Toe
  document.getElementById('open-app-ttt')?.addEventListener('click', function() {
    const tttMarkup = `
      <div class="ttt-container">
        <div id="game-status">Player X turn</div>
        <div class="ttt-grid">
          <div class="ttt-cell" data-num="0"></div>
          <div class="ttt-cell" data-num="1"></div>
          <div class="ttt-cell" data-num="2"></div>
          <div class="ttt-cell" data-num="3"></div>
          <div class="ttt-cell" data-num="4"></div>
          <div class="ttt-cell" data-num="5"></div>
          <div class="ttt-cell" data-num="6"></div>
          <div class="ttt-cell" data-num="7"></div>
          <div class="ttt-cell" data-num="8"></div>
        </div>
        <button class="ttt-reset" id="reset-btn">Reset</button>
      </div>
    `;
    const win = spawnWindow('ttt', 'Tic-Tac-Toe', tttMarkup);
    let currentTurn = 'X';
    let grid = ['', '', '', '', '', '', '', '', ''];

    const cells = win.querySelectorAll('.ttt-cell');
    const status = win.querySelector('#game-status');

    cells.forEach(function(cell) {
      cell.addEventListener('click', function() {
        const num = cell.getAttribute('data-num');
        if (grid[num] === '') {
          grid[num] = currentTurn;
          cell.textContent = currentTurn;
          currentTurn = (currentTurn === 'X') ? 'O' : 'X';
          status.textContent = 'Player ' + currentTurn + ' turn';
        }
      });
    });

    win.querySelector('#reset-btn')?.addEventListener('click', function() {
      grid = ['', '', '', '', '', '', '', '', ''];
      currentTurn = 'X';
      status.textContent = 'Player X turn';
      cells.forEach(function(c) { c.textContent = ''; });
    });
  });

  // 6. Weather & Settings
  document.getElementById('open-app-weather')?.addEventListener('click', function() {
    spawnWindow('weather', 'Weather', '<h3>Weather Widget</h3><p>Current: 24°C, Sunny</p>');
  });

  document.getElementById('open-app-settings')?.addEventListener('click', function() {
    spawnWindow('settings', 'Settings', '<h3>System Settings</h3><p>WebOS v1.0 running normally.</p>');
  });

});
