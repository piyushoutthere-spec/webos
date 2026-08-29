# My Web OS

I built a web-based operating system using HTML, CSS, and JavaScript as part of the Hack Club WebOS jam. It mimics a desktop UI directly inside the browser.

## Live Demo
Check out the site here: https://piyushoutthere-spec.github.io/webos/

## How I Built It
- **Welcome Screen**: Created a lock screen with an "Enter OS" button that unlocks the desktop.
- **Top Bar**: Displays a live clock and date using JavaScript `setInterval()`.
- **Desktop Interactivity**: Added interactive icons for apps like About Me, Settings, and a Notes app.
- **Draggable Windows**: Wrote event listeners in JS (`mousedown`, `mousemove`, `mouseup`) to make the app windows draggable across the screen.
- **Dynamic Wallpapers**: Used the Picsum API so a random wallpaper loads every time the page refreshes.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript

## Running Locally
Just open `index.html` in any web browser or open it using VS Code Live Server.
