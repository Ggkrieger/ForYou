// script.js

// Obtém o elemento canvas e seu contexto 2D
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Define a largura e altura do canvas para preencher a tela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Palavras para o efeito Matrix
const matrixWords = "love love love "; // Palavras "love"

// Cor única para as palavras "love" caindo
const fallingTextColor = '#c2185b'; // Rosa escuro (cor original)

const fontSize = 16; // Tamanho da fonte dos caracteres caindo

// Calcula o número de colunas com base na largura do canvas e tamanho da fonte
const columns = canvas.width / fontSize;

// Array para controlar a posição Y de cada "gota" de caractere
const drops = [];
// Inicializa a posição Y de cada coluna para começar no topo
for (let i = 0; i < columns; i++) {
    drops[i] = {
        y: 1, // Posição Y inicial
    };
}

// Array para armazenar as partículas da explosão
const explodingParticles = [];

// Função para criar a explosão de partículas
function createExplosion(x, y) {
    const numberOfParticles = 50; // Quantidade de partículas na explosão
    const explosionRadius = 10; // Raio inicial da explosão

    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2; // Ângulo aleatório para a direção
        const speed = Math.random() * 5 + 2; // Velocidade aleatória das partículas

        explodingParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed, // Velocidade horizontal
            vy: Math.sin(angle) * speed, // Velocidade vertical
            char: matrixWords[Math.floor(Math.random() * matrixWords.length)], // Caractere aleatório
            life: 100, // Vida da partícula (para desvanecer)
            color: fallingTextColor // Mesma cor do texto caindo
        });
    }
}

// Adiciona um listener de clique ao canvas
canvas.addEventListener('click', (event) => {
    createExplosion(event.clientX, event.clientY);
});


// Função principal para desenhar o efeito Matrix e as explosões
function draw() {
    // Cria um efeito de rastro semi-transparente para o fundo
    // A cor rgba(0, 0, 0, 0.05) usa preto com baixa opacidade para o rastro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Desenha as palavras "love" caindo (efeito Matrix) ---
    ctx.fillStyle = fallingTextColor; // Define a cor única para o texto caindo
    ctx.font = fontSize + 'px Inter'; // Usa a fonte Inter

    for (let i = 0; i < drops.length; i++) {
        // Seleciona um caractere aleatório da string matrixWords
        const charToDraw = matrixWords[Math.floor(Math.random() * matrixWords.length)];

        // Desenha o caractere na posição atual da "gota"
        ctx.fillText(charToDraw, i * fontSize, drops[i].y * fontSize);

        // Se a "gota" atingir a parte inferior da tela E um número aleatório for maior que 0.995 (para aparecer menos vezes),
        // reinicia a "gota" no topo, criando um fluxo contínuo
        if (drops[i].y * fontSize > canvas.height && Math.random() > 0.995) {
            drops[i].y = 0; // Reinicia a gota no topo
        }

        // Move a "gota" para baixo para a próxima iteração
        drops[i].y++;
    }

    // --- Desenha as partículas da explosão ---
    for (let i = explodingParticles.length - 1; i >= 0; i--) {
        const p = explodingParticles[i];

        // Atualiza a posição da partícula
        p.x += p.vx;
        p.y += p.vy;

        // Aplica uma pequena gravidade (acelera a queda)
        p.vy += 0.1; // Ajuste este valor para mais ou menos gravidade

        // Diminui a vida da partícula
        p.life--;

        // Se a partícula ainda tem vida, desenha-a
        if (p.life > 0) {
            ctx.globalAlpha = p.life / 100; // Define a opacidade com base na vida
            ctx.fillStyle = p.color;
            ctx.font = fontSize + 'px Inter';
            ctx.fillText(p.char, p.x, p.y);
        } else {
            // Remove a partícula se a vida acabou
            explodingParticles.splice(i, 1);
        }
    }
    ctx.globalAlpha = 1; // Reseta a opacidade global para 1 para o próximo quadro
}

// Garante que o canvas se redimensione com a janela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalcula o número de colunas após o redimensionamento
    columns = canvas.width / fontSize;
    // Reinicializa as gotas para se ajustarem às novas dimensões
    for (let i = 0; i < columns; i++) {
        drops[i] = {
            y: 1,
        };
    }
});

// Inicia a animação chamando a função draw a cada 35 milissegundos
setInterval(draw, 35);
