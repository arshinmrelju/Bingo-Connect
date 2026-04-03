document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bingoGrid = document.getElementById('bingo-grid');
    const themeToggle = document.getElementById('theme-toggle');
    const newCardBtn = document.getElementById('new-card-btn');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPrompt = document.getElementById('prompt-text');
    const personNameInput = document.getElementById('person-name');
    const fileInput = document.getElementById('file-input');
    const imageUploadArea = document.getElementById('image-upload-area');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const previewOverlay = document.getElementById('preview-overlay');
    
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const celebration = document.getElementById('celebration');
    const celebrationClose = document.getElementById('celebration-close');

    // App State
    let gameState = {
        cells: [],
        bingoAchieved: false,
        theme: 'light'
    };

    let currentEditingIndex = null;
    let currentImageBase64 = null;

    // Initialization
    function init() {
        loadGameState();
        setupEventListeners();
        renderGrid();
        updateProgress();
        applyTheme();
    }

    function setupEventListeners() {
        themeToggle.addEventListener('click', toggleTheme);
        newCardBtn.addEventListener('click', confirmNewCard);
        cancelBtn.addEventListener('click', closeModal);
        saveBtn.addEventListener('click', saveCellData);
        celebrationClose.addEventListener('click', () => celebration.classList.remove('active'));
        
        imageUploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);

        // Close modal on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Board Logic
    function generateNewBoard() {
        const shuffled = [...BINGO_PROMPTS].sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 24);
        
        const cells = [];
        let promptIndex = 0;

        for (let i = 0; i < 25; i++) {
            if (i === 12) {
                // Center Free Space
                cells.push({
                    text: 'FREE',
                    isFree: true,
                    completed: true,
                    person: 'System',
                    image: null
                });
            } else {
                cells.push({
                    text: selectedPrompts[promptIndex++],
                    isFree: false,
                    completed: false,
                    person: '',
                    image: null
                });
            }
        }

        gameState.cells = cells;
        gameState.bingoAchieved = false;
        saveGameState();
        renderGrid();
        updateProgress();
    }

    function renderGrid() {
        bingoGrid.innerHTML = '';
        gameState.cells.forEach((cell, index) => {
            const cellEl = document.createElement('div');
            cellEl.className = 'cell';
            if (cell.isFree) cellEl.classList.add('free-space');
            if (cell.completed) cellEl.classList.add('completed');
            
            let content = `<div class="cell-content">`;
            
            if (cell.isFree) {
                content += `<span>FREE SPACE</span>`;
            } else {
                if (cell.image) {
                    content += `<img class="cell-image" src="${cell.image}" alt="Person">`;
                }
                content += `<span>${cell.text}</span>`;
                if (cell.person) {
                    content += `<span class="person-name">${cell.person}</span>`;
                }
            }
            
            content += `</div>`;
            cellEl.innerHTML = content;
            
            if (!cell.isFree) {
                cellEl.addEventListener('click', () => openModal(index));
            }
            
            bingoGrid.appendChild(cellEl);
        });
    }

    // Modal Logic
    function openModal(index) {
        currentEditingIndex = index;
        const cell = gameState.cells[index];
        modalPrompt.textContent = cell.text;
        personNameInput.value = cell.person || '';
        
        if (cell.image) {
            imagePreview.src = cell.image;
            showPreview(true);
            currentImageBase64 = cell.image;
        } else {
            showPreview(false);
            currentImageBase64 = null;
        }
        
        modalOverlay.classList.add('active');
        personNameInput.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        currentEditingIndex = null;
        currentImageBase64 = null;
        personNameInput.value = '';
        fileInput.value = '';
    }

    function saveCellData() {
        if (!personNameInput.value.trim()) {
            alert('Please enter a name!');
            return;
        }

        const cell = gameState.cells[currentEditingIndex];
        cell.person = personNameInput.value.trim();
        cell.image = currentImageBase64;
        cell.completed = true;

        saveGameState();
        renderGrid();
        updateProgress();
        checkBingo();
        closeModal();
    }

    // Image Handling
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Resize image to keep localStorage small
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 200;
                const MAX_HEIGHT = 200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                currentImageBase64 = dataUrl;
                imagePreview.src = dataUrl;
                showPreview(true);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function showPreview(show) {
        if (show) {
            imagePreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
            previewOverlay.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            previewOverlay.style.display = 'none';
        }
    }

    // Bingo Logic
    function checkBingo() {
        if (gameState.bingoAchieved) return; // Only celebrate once per card

        const grid = [];
        for (let i = 0; i < 5; i++) {
            grid[i] = gameState.cells.slice(i * 5, (i + 1) * 5);
        }

        // Check Rows
        for (let i = 0; i < 5; i++) {
            if (grid[i].every(cell => cell.completed)) {
                triggerBingo();
                return;
            }
        }

        // Check Columns
        for (let i = 0; i < 5; i++) {
            let colComplete = true;
            for (let j = 0; j < 5; j++) {
                if (!grid[j][i].completed) {
                    colComplete = false;
                    break;
                }
            }
            if (colComplete) {
                triggerBingo();
                return;
            }
        }

        // Check Diagonals
        let diag1 = true;
        let diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!grid[i][i].completed) diag1 = false;
            if (!grid[i][4 - i].completed) diag2 = false;
        }

        if (diag1 || diag2) {
            triggerBingo();
        }
    }

    function triggerBingo() {
        gameState.bingoAchieved = true;
        saveGameState();
        celebration.classList.add('active');
        startConfetti();
    }

    // ── Confetti Engine ─────────────────────────────────────────
    let confettiAnimId = null;

    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#6366f1','#ec4899','#10b981','#f59e0b','#3b82f6','#ef4444'];
        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: Math.random() * 10 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
            speed: Math.random() * 4 + 2,
            drift: (Math.random() - 0.5) * 2
        }));

        const stop = Date.now() + 4000;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.save();
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.85;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
                p.y += p.speed;
                p.x += p.drift;
                p.rot += p.rotSpeed;
                if (p.y > canvas.height) {
                    if (Date.now() < stop) {
                        p.y = -20;
                        p.x = Math.random() * canvas.width;
                    }
                }
            });
            if (Date.now() < stop || pieces.some(p => p.y < canvas.height)) {
                confettiAnimId = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
        draw();
    }

    // State Management
    function saveGameState() {
        localStorage.setItem('connectBingoStore', JSON.stringify(gameState));
    }

    function loadGameState() {
        const saved = localStorage.getItem('connectBingoStore');
        if (saved) {
            try {
                gameState = JSON.parse(saved);
            } catch (e) {
                generateNewBoard();
            }
        } else {
            generateNewBoard();
        }
    }

    function updateProgress() {
        const completedCount = gameState.cells.filter(c => c.completed && !c.isFree).length;
        const total = 24; // 25 cells minus 1 free space
        progressText.textContent = `${completedCount} / ${total} Completed`;
        progressFill.style.width = `${(completedCount / total) * 100}%`;
    }

    function confirmNewCard() {
        if (confirm('Start a new card? Your current progress will be lost.')) {
            generateNewBoard();
        }
    }

    // Theme Management
    function toggleTheme() {
        gameState.theme = gameState.theme === 'light' ? 'dark' : 'light';
        saveGameState();
        applyTheme();
    }

    function applyTheme() {
        document.documentElement.setAttribute('data-theme', gameState.theme);
        const icon = themeToggle.querySelector('svg');
        if (gameState.theme === 'dark') {
            icon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>';
        } else {
            icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
        }
    }

    init();
});
