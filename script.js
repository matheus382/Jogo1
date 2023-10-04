const currentPlayer = document.querySelector(".currentPlayer");
const modeToggle = document.getElementById("modeToggle");
const body = document.body;
const currentPlayerDisplay = document.querySelector(".currentPlayer");
let selected;
let player = "X";
let positions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9], 
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

let isComputerMode = false;

function init() {
    selected = [];
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

    document.querySelectorAll(".game button").forEach((item) => {
        item.disabled = false;
        item.innerHTML = "";
        item.addEventListener("click", newMove);
    });
}

init();

function newMove(e){
    const index = e.target.getAttribute("data-i");
    e.target.innerHTML = player;
    e.target.removeEventListener("click", newMove);
    selected[index] = player;

    setTimeout(() => {
        check();
    }, [100]);

    if (!isComputerMode) {
    player = player === "X" ? "O" : "X";
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
    e.target.disabled = true;
} else {
    if (!gameOver) {
        setTimeout(ComputerMove, 500);
    }
}
}

function check() {
    let playerLastMove = player === "X" ? "O" : "X";

    const items = selected
    .map((item, i) => [item, i])
    .filter((item) => item[0] === playerLastMove)
    .map((item) => item[1]);

    for (pos of positions) {
        if (pos.every((item) => items.includes(item))) {
            alert("O JOGADOR '" + playerLastMove + "' GANHOU");
            init();
            return;
        }
    }

    if (selected.filter((item) => item).length === 9) {
        alert("DEU EMPATE");
        init();
        return;
    }
}

modeToggle.addEventListener("click", () => {
    isComputerMode = !isComputerMode;

    if (isComputerMode) {
        modeToggle.textContent = "Modo Local";
    } else {
        modeToggle.textContent = "Modo Computador";
    }
});

// Variáveis para o jogo contra o computador
let gameOver = false;

function computerMove() {
    const availableMoves = selected.reduce((moves, cell, index) => {
        if (cell === "") moves.push(index);
        return moves;
    }, []);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const computerChoice = availableMoves[randomIndex];

    selected[computerChoice] = player;
    document.querySelector(`button[data-i="${computerChoice}"]`).innerHTML = player;
    document.querySelector(`button[data-i="${computerChoice}"]`).disabled = true;
    check();
}

// Reiniciar o jogo
function resetGame() {
    selected = [];
    document.querySelectorAll(".game button").forEach((item) => {
        item.textContent = "";
        item.disabled = false;
    });
    player = "X";
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
    gameOver = false;
}

// Event listener para o botão de reiniciar
const restartButton = document.createElement("button");
restartButton.textContent = "Reiniciar Jogo";
restartButton.addEventListener("click", resetGame);
document.querySelector("main").appendChild(restartButton);

let isDarkMode = false;
let isAgainstComputer = false;

modeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    currentPlayerDisplay.classList.toggle("dark-mode-text", isDarkMode);

    if (isDarkMode) {
        body.classList.add("dark-mode");
        modeToggle.textContent = "Modo Claro";
        currentPlayerDisplay.classList.add("dark-mode-text");
    } else {
        body.classList.remove("dark-mode");
        modeToggle.textContent = "Modo Noturno";
        currentPlayerDisplay.classList.remove("dark-mode-text");
    }

    init(); // Reiniciar o jogo quando alternar entre modos
});

function togglePlayerMode() {
    isAgainstComputer = !isAgainstComputer;
    init(); // Reiniciar o jogo quando alternar entre jogar contra amigo ou computador
}

modeToggle.addEventListener("click", togglePlayerMode);

// Resto do seu código (newMove, check, init, etc.)
// ...

// Função para permitir que o computador faça uma jogada aleatória
function computerMove() {
    const emptyButtons = Array.from(document.querySelectorAll(".game button")).filter((button) => !button.textContent);
    if (emptyButtons.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyButtons.length);
        const randomButton = emptyButtons[randomIndex];
        randomButton.textContent = player;
        randomButton.removeEventListener("click", newMove);
        const index = randomButton.getAttribute("data-i");
        selected[index] = player;

        setTimeout(() => {
            check();
        }, [100]);

        player = player === "X" ? "O" : "X";
        currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
        randomButton.disabled = true;
    }
}

function newMove(e) {
    if (isAgainstComputer && player === "O") {
        // Impedir jogadas do jogador O quando estiver jogando contra o computador
        return;
    }
    
    const index = e.target.getAttribute("data-i");
    e.target.textContent = player;
    e.target.removeEventListener("click", newMove);
    selected[index] = player;

    setTimeout(() => {
        check();
        if (isAgainstComputer && player === "X") {
            // Se estiver jogando contra o computador, permitir que o computador faça uma jogada
            computerMove();
        }
    }, [100]);

    player = player === "X" ? "O" : "X";
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
    e.target.disabled = true;
}
