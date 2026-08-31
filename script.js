// piyush webos code - simple implementation

document.addEventListener('DOMContentLoaded', function() {

  // 1. Enter OS Handler
  var enterBtn = document.getElementById('enter-btn');
  var welcomeScreen = document.getElementById('welcome-screen');
  var desktop = document.getElementById('desktop');

  if (enterBtn) {
    enterBtn.addEventListener('click', function() {
      welcomeScreen.style.display = 'none';
      desktop.classList.remove('hidden');
      desktop.style.display = 'block';
    });
  }

  // 2. Theme Toggle
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
    });
  }

  // 3. Simple Clock
  function showTime() {
    var clock = document.getElementById('clock');
    var date = document.getElementById('date');
    var now = new Date();
    if (clock) clock.textContent = now.toLocaleTimeString() + ' ';
    if (date) date.textContent = now.toLocaleDateString();
  }
  setInterval(showTime, 1000);
  showTime();

  // 4. Window Manager Setup
  var winBox = document.getElementById('windows-container');
  var topIndex = 20;
  var myNoteText = '';

  function openWin(id, title, innerHTML) {
    var check = document.getElementById('win-' + id);
    if (check) {
      topIndex++;
      check.style.zIndex = topIndex;
      return check;
    }

    var win = document.createElement('div');
    win.id = 'win-' + id;
    win.className = 'window';
    win.style.left = '120px';
    win.style.top = '70px';
    topIndex++;
    win.style.zIndex = topIndex;

    win.innerHTML = '<div class="window-header"><span>' + title + '</span><button class="close-btn">X</button></div><div class="window-content">' + innerHTML + '</div>';

    win.addEventListener('mousedown', function() {
      topIndex++;
      win.style.zIndex = topIndex;
    });

    win.querySelector('.close-btn').addEventListener('click', function() {
      win.remove();
    });

    // Window Dragging
    var head = win.querySelector('.window-header');
    var isDrag = false;
    var ox = 0;
    var oy = 0;

    head.addEventListener('mousedown', function(e) {
      isDrag = true;
      ox = e.clientX - win.offsetLeft;
      oy = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
      if (isDrag) {
        win.style.left = (e.clientX - ox) + 'px';
        win.style.top = (e.clientY - oy) + 'px';
      }
    });

    document.addEventListener('mouseup', function() {
      isDrag = false;
    });

    winBox.appendChild(win);
    return win;
  }

  // APP 1: About
  document.getElementById('open-app-about').addEventListener('click', function() {
    openWin('about', 'About', '<h3>Piyush OS</h3><p>Vanilla JS Web Operating System.</p>');
  });

  // APP 2: Notes
  document.getElementById('open-app-notes').addEventListener('click', function() {
    var w = openWin('notes', 'Notes', '<textarea id="txt-notes" class="notes-area">' + myNoteText + '</textarea>');
    var ta = w.querySelector('#txt-notes');
    ta.addEventListener('input', function() { myNoteText = ta.value; });
  });

  // APP 3: Calculator
  document.getElementById('open-app-calc').addEventListener('click', function() {
    var calcCode = '<div id="c-out" class="calc-screen">0</div><div class="calc-grid"><button class="btn-c">C</button><button class="b-n">/</button><button class="b-n">*</button><button class="b-n">-</button><button class="b-n">7</button><button class="b-n">8</button><button class="b-n">9</button><button class="b-n">+</button><button class="b-n">4</button><button class="b-n">5</button><button class="b-n">6</button><button id="btn-run">=</button><button class="b-n">1</button><button class="b-n">2</button><button class="b-n">3</button><button class="b-n">0</button></div>';
    var w = openWin('calc', 'Calculator', calcCode);
    var out = w.querySelector('#c-out');

    w.querySelectorAll('button').forEach(function(b) {
      b.addEventListener('click', function() {
        if (b.className === 'btn-c') {
          out.textContent = '0';
        } else if (b.id === 'btn-run') {
          try { out.textContent = eval(out.textContent); } catch(err) { out.textContent = 'Error'; }
        } else {
          if (out.textContent === '0' || out.textContent === 'Error') out.textContent = b.textContent;
          else out.textContent += b.textContent;
        }
      });
    });
  });

  // APP 4: Terminal
  document.getElementById('open-app-terminal').addEventListener('click', function() {
    var termCode = '<div><p>Type "help" for commands</p><div id="t-log"></div><input type="text" id="t-in" style="width:100%" /></div>';
    var w = openWin('terminal', 'Terminal', termCode);
    var input = w.querySelector('#t-in');
    var log = w.querySelector('#t-log');

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var v = input.value.trim();
        var msg = '';
        if (v === 'help') msg = 'Commands: help, date, clear';
        else if (v === 'date') msg = new Date().toString();
        else if (v === 'clear') { log.innerHTML = ''; input.value = ''; return; }
        else msg = 'Unknown: ' + v;

        log.innerHTML += '<div>> ' + v + '</div><div>' + msg + '</div>';
        input.value = '';
      }
    });
  });

  // APP 5: Timer (Working Stopwatch)
  document.getElementById('open-app-timer').addEventListener('click', function() {
    var timerCode = '<div style="text-align:center;"><h2 id="t-num">0s</h2><button id="t-start">Start</button><button id="t-stop">Stop</button></div>';
    var w = openWin('timer', 'Timer', timerCode);
    var num = w.querySelector('#t-num');
    var count = 0;
    var interval = null;

    w.querySelector('#t-start').addEventListener('click', function() {
      if (!interval) {
        interval = setInterval(function() {
          count++;
          num.textContent = count + 's';
        }, 1000);
      }
    });

    w.querySelector('#t-stop').addEventListener('click', function() {
      clearInterval(interval);
      interval = null;
    });
  });

  // APP 6: Music Synth (Working Tone Generator)
  document.getElementById('open-app-music').addEventListener('click', function() {
    var musicCode = '<div style="text-align:center;"><p id="m-status">Stopped</p><button id="m-play">Play Tone</button><button id="m-stop">Stop</button></div>';
    var w = openWin('music', 'Music Synth', musicCode);
    var status = w.querySelector('#m-status');
    var ctx = null;
    var osc = null;

    w.querySelector('#m-play').addEventListener('click', function() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        osc = ctx.createOscillator();
        osc.frequency.value = 440;
        osc.connect(ctx.destination);
        osc.start();
        status.textContent = 'Playing 440Hz Tone...';
      }
    });

    w.querySelector('#m-stop').addEventListener('click', function() {
      if (ctx) {
        osc.stop();
        ctx.close();
        ctx = null;
        osc = null;
        status.textContent = 'Stopped';
      }
    });
  });

  // APP 7: Snake Game (Working Canvas)
  document.getElementById('open-app-snake').addEventListener('click', function() {
    var snakeCode = '<div style="text-align:center;"><canvas id="sCanvas" width="160" height="160" style="background:#000;"></canvas></div>';
    var w = openWin('snake', 'Snake Game', snakeCode);
    var canvas = w.querySelector('#sCanvas');
    var c = canvas.getContext('2d');

    var s = [{x: 5, y: 5}];
    var f = {x: 2, y: 2};
    var vx = 1;
    var vy = 0;

    function runGame() {
      if (!document.getElementById('win-snake')) return;

      var head = {x: s[0].x + vx, y: s[0].y + vy};
      if (head.x < 0) head.x = 15;
      if (head.x > 15) head.x = 0;
      if (head.y < 0) head.y = 15;
      if (head.y > 15) head.y = 0;

      s.unshift(head);

      if (head.x === f.x && head.y === f.y) {
        f = {x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15)};
      } else {
        s.pop();
      }

      c.fillStyle = 'black';
      c.fillRect(0, 0, 160, 160);

      c.fillStyle = 'red';
      c.fillRect(f.x * 10, f.y * 10, 8, 8);

      c.fillStyle = 'lime';
      for (var i = 0; i < s.length; i++) {
        c.fillRect(s[i].x * 10, s[i].y * 10, 8, 8);
      }
    }

    setInterval(runGame, 180);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowUp' && vy === 0) { vx = 0; vy = -1; }
      if (e.key === 'ArrowDown' && vy === 0) { vx = 0; vy = 1; }
      if (e.key === 'ArrowLeft' && vx === 0) { vx = -1; vy = 0; }
      if (e.key === 'ArrowRight' && vx === 0) { vx = 1; vy = 0; }
    });
  });

  // APP 8: Tic-Tac-Toe
  document.getElementById('open-app-ttt').addEventListener('click', function() {
    var tttCode = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:120px;margin:auto;"><button class="t-c" data-i="0">-</button><button class="t-c" data-i="1">-</button><button class="t-c" data-i="2">-</button><button class="t-c" data-i="3">-</button><button class="t-c" data-i="4">-</button><button class="t-c" data-i="5">-</button><button class="t-c" data-i="6">-</button><button class="t-c" data-i="7">-</button><button class="t-c" data-i="8">-</button></div>';
    var w = openWin('ttt', 'TicTacToe', tttCode);
    var player = 'X';

    w.querySelectorAll('.t-c').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.textContent === '-') {
          btn.textContent = player;
          player = (player === 'X') ? 'O' : 'X';
        }
      });
    });
  });

});
