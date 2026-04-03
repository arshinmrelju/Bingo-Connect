# 🎉 Connect Bingo

A fun, interactive **social bingo game** built with vanilla HTML, CSS, and JavaScript. Challenge yourself to find real people who match each card prompt — snap a photo, mark the cell, and shout **BINGO!**

![Connect Bingo](https://img.shields.io/badge/status-live-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

- **5×5 Bingo Grid** — 24 unique social/personality prompts randomly selected every round, with a FREE space in the center
- **Custom Modal UI** — click any cell to enter a person's name and optionally upload or capture their photo
- **Photo Handling** — supports file upload or camera capture (mobile-friendly); images are auto-resized and stored as Base64
- **LocalStorage Persistence** — your board state (names, photos, completions) is saved and restored on page refresh
- **Bingo Detection** — automatically detects when a full row, column, or diagonal is completed
- **Confetti Celebration** — canvas-based confetti animation fires on BINGO 🎊
- **Progress Bar** — live indicator showing how many cells you've completed
- **Dark Mode** — toggle between light and dark themes, preference is saved
- **New Card** — reset the board and generate a fresh random card anytime
- **Mobile Responsive** — works on desktop and mobile screens

---

## 🗂️ Project Structure

```
Bingo Connect/
├── index.html   # App shell — grid, modal, confetti canvas, dark mode toggle
├── style.css    # Modern UI — CSS Grid, glassmorphism, animations, dark mode
├── script.js    # Core logic — board gen, localStorage, bingo detection, confetti
└── data.js      # Prompt pool — 53 unique social/personality prompts
```

---

## 🚀 Getting Started

No build tools or server needed — just open the file in your browser:

1. Clone the repo:
   ```bash
   git clone https://github.com/arshinmrelju/Bingo-Connect.git
   ```
2. Open `index.html` in any modern browser.

That's it! 🎉

---

## 🎮 How to Play

1. Open the app — a fresh 5×5 bingo board is generated automatically.
2. Find someone who matches a prompt on the board (e.g. *"Loves music"*).
3. Click the cell → enter their name → optionally add a photo → **Save & Mark**.
4. Complete a full **row**, **column**, or **diagonal** to trigger **BINGO!**
5. Hit **New Card** to start a new round.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic app structure |
| CSS3 (Vanilla) | CSS Grid layout, glassmorphism, animations, dark mode |
| JavaScript (ES6+) | Game logic, DOM manipulation, localStorage |
| Canvas API | Confetti celebration animation |
| FileReader API | Image upload & Base64 conversion |
| Google Fonts | Inter + Outfit typefaces |

---

## 📄 License

MIT — feel free to use, modify, and share.