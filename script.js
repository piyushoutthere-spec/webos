document.addEventListener('DOMContentLoaded', () => {

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

  // Date & Clock Logic
  function updateDateTime() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const now = new Date();

    if (clockElement) {
      clockElement.textContent = now.toLocaleTimeString();
    }
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

  // App Window Controls
  const appWindow = document.getElementById('app-window');
  const closeBtn = document.getElementById('close-btn');
  const windowTitle = document.getElementById('window-title');
  const windowContent = document.getElementById('window-content');

  let savedNoteText = ''; // Save note content across opens

  // App 1: About Me
  document.getElementById('open-app-1').addEventListener('click', () => {
    windowTitle.textContent = 'About Me';
    windowContent.innerHTML = '<h3>Piyush OS</h3><p>Welcome to my web operating system!</p>';
    appWindow.classList.remove('hidden');
  });

  // App 2: Notes App (Working)
  document.getElementById('open-notes').addEventListener('click', () => {
    windowTitle.textContent = 'Notes';
    windowContent.innerHTML = `<textarea id="notes-input" class="notes-area" placeholder="Type your notes here...">${savedNoteText}</textarea>`;
    
    // Save state on input
    const notesInput = document.getElementById('notes-input');
    notesInput.addEventListener('input', (e) => {
      savedNoteText = e.target.value;
    });

    appWindow.classList.remove('hidden');
  });

  // App 3: Settings
  document.getElementById('open-app-2').addEventListener('click', () => {
    windowTitle.textContent = 'Settings';
    windowContent.innerHTML = '<h3>Settings</h3><p>Configure system preferences here.</p>';
    appWindow.classList.remove('hidden');
  });

  // Close Button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      appWindow.classList.add('hidden');
    });
  }

  // Draggable Window Logic
  const windowHeader = document.getElementById('window-header');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  if (windowHeader) {
    windowHeader.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - appWindow.offsetLeft;
      offsetY = e.clientY - appWindow.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        appWindow.style.left = `${e.clientX - offsetX}px`;
        appWindow.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

});