document.addEventListener('DOMContentLoaded', function() {
    //להגדיר את המשתנים ולהתחל
    const gridSize = 7;
    let gridNumbers = [];
    let selectedNumbers = new Set();
    let drawnNumber = null;
    let wrongAttempts = 0;
    const maxWrongAttempts = 3;
    // יצירת טבלת הבינגו עם מספרים אקראיים
    function generateGrid() {
    const numbers = [];
    for (let i = 1; i <= 100; i++) {
        numbers.push(i);
    }
    for (let i = 0; i < gridSize; i++) {
        gridNumbers[i] = [];
        for (let j = 0; j < gridSize; j++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            gridNumbers[i][j] = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
        }
    }
}

    // ציור הטבלה על המסך
    function drawGrid() {
        const table = document.getElementById('bingoTable');
    
        for (let i = 0; i < gridSize; i++) {
            const row = table.insertRow();
    
            for (let j = 0; j < gridSize; j++) {
                const cell = row.insertCell();
                const number = gridNumbers[i][j];
    
                cell.textContent = number;
                cell.addEventListener('click', () => checkNumber(i, j));
            }
        }
        
    }
    // הגרלת מספר חדש
    function drawNumber() {
        if (selectedNumbers.size === gridSize * gridSize) {
            showMessage("כל המספרים הוגרלו!");
            return;
        }
        let availableNumbers = [];
        for (let i = 1; i <= 100; i++) {
            if (!selectedNumbers.has(i)) {
                availableNumbers.push(i);
            }
        }
        drawnNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        selectedNumbers.add(drawnNumber);
        showMessage(`המספר שהוגרל: ${drawnNumber}`);
    }

    // בדיקת המספר שנלחץ
    function checkNumber(x, y) {
        const number = gridNumbers[x][y];
        const cell = document.querySelector(`#bingoTable tr:nth-child(${x + 1}) td:nth-child(${y + 1})`);
        if (number === drawnNumber) {
            cell.classList.add('green');
            gridNumbers[x][y] = -1;
            if (checkVictory(x, y)) {
                showMessage("ניצחת!");
                disableAllCells();
            }
        } else {
            cell.classList.add('red'); 
            wrongAttempts++;
            if (wrongAttempts >= maxWrongAttempts) {
                showMessage("נפסלת!");
                disableAllCells();
            } else {
                showMessage(`המספר ${number} לא הוגרל. נסיונות שגויים: ${wrongAttempts}/${maxWrongAttempts}`);
                setTimeout(() => {
                    cell.classList.remove('red');  // הסרת מחלקת CSS לאחר 10 שניות
                }, 10000);  // 10000 מילישניות = 30 שניות
            }
        }
    }
    // בדיקה אם יש ניצחון
    function checkVictory(x, y) {
        let rowWin = true;
        let colWin = true;

        for (let i = 0; i < gridSize; i++) {
            if (gridNumbers[x][i] !== -1) {
                rowWin = false;
            }
            if (gridNumbers[i][y] !== -1) {
                colWin = false;
            }
        }

        return rowWin || colWin;
    }

    // נטרול כל התאים לאחר ניצחון או הפסד
    function disableAllCells() {
        const cells = document.querySelectorAll('#bingoTable td');
        cells.forEach(cell => {
            cell.classList.add('disabled');
        });
    }

    // הצגת הודעה למשתמש
    function showMessage(msg) {
        document.getElementById('message').textContent = msg;
    }

    // מאזין לכפתור ההגרלה
    document.getElementById('drawButton').addEventListener('click', drawNumber);

    // יצירת הטבלה וציור אותה על המסך
    generateGrid();
    drawGrid();
});