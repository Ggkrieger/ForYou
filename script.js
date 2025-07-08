// script.js

// --- Variáveis Globais ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton'); // O novo botão inicial
const heartContainer = document.getElementById('heartContainer'); // O contêiner do coração
const body = document.body;

const matrixWords = "love love love "; // Palavras "love"
const fallingTextColor = '#c2185b'; // Rosa escuro (cor original)
const fontSize = 16; // Tamanho da fonte dos caracteres caindo

let columns; // Número de colunas para o efeito Matrix
let drops = []; // Array para controlar a posição Y de cada "gota"
let explodingParticles = []; // Array para armazenar as partículas da explosão

let matrixInterval = null; // Para controlar o loop da animação Matrix
let canvasState = 'idle'; // 'idle', 'falling'

// --- Funções de Inicialização e Redimensionamento ---
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = canvas.width / fontSize;
    // Reinicializa as gotas para se ajustarem às novas dimensões
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = { y: 1 };
    }
    // Oculta o canvas e o coração no início
    canvas.style.display = 'none';
    heartContainer.style.display = 'none';
    startButton.style.display = 'block'; // Garante que o botão inicial esteja visível
    body.style.backgroundColor = 'white'; // Fundo branco inicial
}

// Garante que o canvas se redimensione com a janela
window.addEventListener('resize', initCanvas);

// --- Funções de Controle da Animação Matrix ---

function startFallingMatrix() {
    if (matrixInterval) clearInterval(matrixInterval); // Limpa qualquer intervalo anterior
    canvasState = 'falling';
    canvas.style.display = 'block'; // Mostra o canvas
    // Reinicia as gotas para o efeito de queda
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = { y: 1 };
    }
    matrixInterval = setInterval(draw, 35); // Inicia o loop de desenho
}

function stopMatrix() {
    if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
    }
}

// --- Funções de Evento ---

// Listener de clique no botão inicial
startButton.addEventListener('click', () => {
    // Esconde o botão inicial
    startButton.style.opacity = 0;
    setTimeout(() => {
        startButton.style.display = 'none';
    }, 500); // Espera a transição de opacidade

    // Muda o fundo da tela para preto
    body.style.backgroundColor = 'black';

    // Inicia o efeito Matrix caindo
    startFallingMatrix();

    // Após um atraso, faz o coração aparecer
    setTimeout(() => {
        heartContainer.style.display = 'flex'; // Mostra o coração
        // Força um reflow para garantir que o display: flex seja aplicado antes da transição de opacidade
        heartContainer.offsetHeight; // Truque para forçar o navegador a renderizar a mudança de display
        heartContainer.style.opacity = 1; // Faz o fade-in do coração
    }, 2000); // Atraso de 2 segundos para o coração aparecer após o Matrix iniciar
});

// Listener de clique no canvas para o efeito de explosão (só funciona quando o canvas está visível)
canvas.addEventListener('click', (event) => {
    if (canvasState === 'falling') { // Apenas no estado 'falling'
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        createExplosion(mouseX, mouseY);
    }
});

// --- Função para criar a explosão de partículas ---
function createExplosion(x, y) {
    const numberOfParticles = 80;
    const explosionSpeed = 7;

    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * explosionSpeed + 2;

        explodingParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            char: matrixWords[Math.floor(Math.random() * matrixWords.length)],
            life: 100,
            color: fallingTextColor
        });
    }
}

// --- Função Principal de Desenho ---
function draw() {
    // Limpa o canvas com um rastro semi-transparente preto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha as palavras "love" caindo (efeito Matrix)
    if (canvasState === 'falling') {
        ctx.fillStyle = fallingTextColor;
        ctx.font = fontSize + 'px Inter';

        for (let i = 0; i < drops.length; i++) {
            const charToDraw = matrixWords[Math.floor(Math.random() * matrixWords.length)];
            ctx.fillText(charToDraw, i * fontSize, drops[i].y * fontSize);

            if (drops[i].y * fontSize > canvas.height && Math.random() > 0.995) {
                drops[i].y = 0;
            }
            drops[i].y++;
        }
    }

    // Desenha as partículas da explosão (se houver)
    for (let i = explodingParticles.length - 1; i >= 0; i--) {
        const p = explodingParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravidade
        p.life--;

        if (p.life > 0) {
            ctx.globalAlpha = p.life / 100;
            ctx.fillStyle = p.color;
            ctx.font = fontSize + 'px Inter';
            ctx.fillText(p.char, p.x, p.y);
        } else {
            explodingParticles.splice(i, 1);
        }
    }
    ctx.globalAlpha = 1; // Reseta a opacidade global
}

// --- Chamada Inicial ---
initCanvas(); // Inicializa o canvas ao carregar a página
