// --- SEÇÃO 1: CONFIGURAÇÕES E VARIÁVEIS DO JOGO ---
const isDesktop = window.matchMedia('(min-width: 769px)').matches;
const scale = 2;
const speed = 10;
let flipX = 1;
let currentFrame = 0;
let currentDirection = 'down';
const frameWidth = 32;
const frameHeight = 32;
const totalFrames = 6;

const falas = {
  intro: `<div>Olá! Me chamo <strong>Bruno Gomes</strong> e seja bem-vindo ao meu portfólio interativo. Aqui você pode explorar meus projetos de forma divertida: caminhe pelo ambiente, encontre pontos de interesse e descubra detalhes sobre minhas habilidades e trabalhos. Use as setas do teclado para se movimentar.</div><div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>`,
  point1: `<div>Sou estudante de <strong>Engenharia de Software</strong> e estou iniciando minha trajetória na <strong>programação e cibersegurança,</strong> buscando aprender de forma prática e aplicar meus conhecimentos em projetos reais.</div><div></br>Tenho experiência básica em <strong>Python, HTML, CSS, JS e MySQL,</strong> construindo pequenos projetos e experimentos interativos. Também estou explorando conceitos de cibersegurança, incluindo testes de penetração em ambientes simulados, análise de vulnerabilidades e scripts simples de segurança para aprendizado.</div><div><br>Este portfólio interativo é um exemplo de como aplico meus estudos em projetos práticos, mesmo ainda em aprendizado. Vá até os pontos de interesse e descubra mais sobre meus projetos.</div><div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>`,
  point2: `<div>Projeto ainda em desenvolvimento</div><div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>`,
  point3: `<div>Projeto ainda em desenvolvimento</div><div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>`,
  point4: `<div><h2>Sistema de Gestão e Compras de GLP</h2><p><strong>Tecnologias:</strong> Python, Flask, MySQL, HTML, CSS e JavaScript</p><h3>Descrição:</h3><p>Sistema web para realização de pedidos online. Usuários podem se cadastrar, fazer login, consultar revendas e realizar compras de forma online.</p><h3>Funcionalidades principais:</h3><ul><li>Cadastro, login e gerenciamento de conta com senhas criptografadas</li><li>Consulta de revendas com filtros por marca e ordenação por preço</li><li>Registro de pedidos com valores e descontos “congelados”</li><li>Acompanhamento de pedidos, total de compras e economia acumulada</li><li>Geração de mensagens de confirmação de pedido formatadas para WhatsApp</li></ul><div>Acesse <a href="https://brunogblum.pythonanywhere.com" target="_blank">clicando aqui</a></div><div style="text-align:center; font-size:0.9em;"><br>(Versão desktop)</div><div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>`,
};

// Pontos de colisão para os objetos de fala
const pontoDeFala = [
  { left: 845, top: 345, width: 40, height: 40, fala: 'point1' },
  { left: 55, top: 515, width: 40, height: 40, fala: 'point2' },
  { left: 200, top: 190, width: 40, height: 40, fala: 'point3' },
  { left: 920, top: 110, width: 40, height: 40, fala: 'point4' },
];

const directions = {
  idleDown: 0,
  idleSide: 1,
  idleUp: 2,
  walkDown: 3,
  walkRight: 4,
  walkUp: 5,
};

// --- SEÇÃO 2: ELEMENTOS DO DOM ---
const desktopMessage = document.getElementById('mobile-message');
const gameContainer = document.getElementById('game-container');
const dialogBox = document.getElementById('dialog-box');
const musicaFundo = document.getElementById('musicaFundo');
let player;

// --- SEÇÃO 3: LÓGICA DO JOGO ---
function setupGame() {
  player = document.getElementById('player');
  player.style.top = `${gameContainer.clientHeight / 2 + 30}px`;
  player.style.left = `${gameContainer.clientWidth / 2 - 16}px`;
  player.style.transform = `scaleX(${flipX * scale}) scaleY(${scale})`;

  musicaFundo.volume = 0.3;
  musicaFundo.play().catch((e) => console.log('Autoplay bloqueado pelo navegador'));

  // Inicia as animações dos elementos do cenário
  createAnimations();
  setInterval(animateIdle, 200);

  dialogBox.innerHTML = falas.intro;
  dialogBox.style.display = 'block';
}

function createAnimations() {
  // Animação da água
  const agua = document.querySelector('.agua');
  const aguaStartTop = 1;
  setInterval(() => {
    let currentTop = parseInt(agua.style.top);
    if (currentTop >= aguaStartTop + 35) {
      agua.style.top = `${aguaStartTop}px`;
    } else {
      agua.style.top = `${currentTop + 6}px`;
    }
  }, 20);

  // Animação de outros elementos
  const elementosAnimados = [
    { el: document.querySelector('.pato'), startTop: 550 },
    { el: document.querySelector('.ganso'), startTop: 200 },
    { el: document.querySelector('.rato'), startTop: 500 },
  ];
  elementosAnimados.forEach((obj) => {
    let direction = 1;
    const amplitude = 2;
    setInterval(() => {
      let currentTop = parseInt(obj.el.style.top);
      if (currentTop >= obj.startTop + amplitude) direction = -1;
      if (currentTop <= obj.startTop) direction = 1;
      obj.el.style.top = `${currentTop + direction}px`;
    }, 200);
  });

  // Animação dos sinais
  const signals = document.querySelectorAll('.signal');
  signals.forEach((sinal) => {
    let direction = 1;
    const amplitude = 5;
    const startTop = parseFloat(sinal.style.top);
    setInterval(() => {
      let currentTop = parseFloat(sinal.style.top);
      if (currentTop >= startTop + amplitude) direction = -1;
      if (currentTop <= startTop) direction = 1;
      sinal.style.top = `${currentTop + direction}px`;
    }, 100);
  });
}

function getIdleLine() {
  switch (currentDirection) {
    case 'down':
      return directions.idleDown;
    case 'up':
      return directions.idleUp;
    case 'left':
    case 'right':
      return directions.idleSide;
    default:
      return directions.idleDown;
  }
}

function getWalkLine() {
  switch (currentDirection) {
    case 'down':
      return directions.walkDown;
    case 'up':
      return directions.walkUp;
    case 'right':
    case 'left':
      return directions.walkRight;
    default:
      return directions.walkDown;
  }
}

function animateIdle() {
  const line = getIdleLine();
  player.style.backgroundPosition = `-${currentFrame * frameWidth}px -${line * frameHeight}px`;
  currentFrame = (currentFrame + 1) % totalFrames;
}

function checkCollision(a, b) {
  return !(
    a.left + a.width <= b.left ||
    a.left >= b.left + b.width ||
    a.top + a.height <= b.top ||
    a.top >= b.top + b.height
  );
}

// --- SEÇÃO 4: EVENT LISTENERS ---

if (!isDesktop) {
  gameContainer.classList.add('hidden');
  desktopMessage.style.display = 'block';
} else {
  gameContainer.style.display = 'block';
  window.onload = setupGame;
}

// Escuta eventos do teclado para movimentação
document.addEventListener('keydown', function(event) {
  let top = parseInt(player.style.top);
  let left = parseInt(player.style.left);
  let moving = false;
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;
  const maxLeft = gameContainer.clientWidth - playerWidth;
  const maxTop = gameContainer.clientHeight - playerHeight;
  let dentroDeUmPonto = false;

  switch (event.key) {
    case 'ArrowUp':
      top -= speed;
      currentDirection = 'up';
      moving = true;
      break;
    case 'ArrowDown':
      top += speed;
      currentDirection = 'down';
      moving = true;
      break;
    case 'ArrowLeft':
      left -= speed;
      currentDirection = 'left';
      flipX = -1;
      moving = true;
      break;
    case 'ArrowRight':
      left += speed;
      currentDirection = 'right';
      flipX = 1;
      moving = true;
      break;
  }

  if (!moving) return;

  player.style.transform = `scaleX(${flipX * scale}) scaleY(${scale})`;

  // Limites da tela
  left = Math.max(0, Math.min(left, maxLeft));
  top = Math.max(0, Math.min(top, maxTop));

  const playerRect = {
    top: top,
    left: left,
    width: player.offsetWidth,
    height: player.offsetHeight,
  };

  let colidiu = false;
  const barreiras = document.querySelectorAll('.obstacle, .chest');
  barreiras.forEach(b => {
    const bRect = b.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    const barreira = {
      top: bRect.top - containerRect.top,
      left: bRect.left - containerRect.left,
      width: bRect.width,
      height: bRect.height,
    };
    if (checkCollision(playerRect, barreira)) {
      colidiu = true;
    }
  });

  if (!colidiu) {
    player.style.top = `${top}px`;
    player.style.left = `${left}px`;
  }

  pontoDeFala.forEach(p => {
    if (checkCollision(playerRect, p)) {
      dentroDeUmPonto = true;
      dialogBox.innerHTML = falas[p.fala];
      dialogBox.style.display = 'block';
    }
  });

  if (!dentroDeUmPonto) {
    dialogBox.style.display = 'none';
  }

  const line = getWalkLine();
  player.style.backgroundPosition = `-${currentFrame * frameWidth}px -${line * frameHeight}px`;
  currentFrame = (currentFrame + 1) % totalFrames;
});

dialogBox.addEventListener('click', () => {
  dialogBox.style.display = 'none';
});