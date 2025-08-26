// Espera o DOM estar pronto
let player;
let gameContainer;
const scale = 2;
let flipX = 1;
const sinais = document.querySelectorAll('.signal');
const falas = document.getElementById('dialog-box');
let dentroDeUmPonto = false;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

window.onload = function() {
    gameContainer = document.getElementById('game-container');
    const tileSize = 16;
    const tileSizeChest = 32;
    const mapRows = 40;
    const mapCols = 40;

    const musica = document.getElementById('musicaFundo');
    musica.volume = 0.3; // volume inicial (0 a 1)
    musica.play().catch(e => console.log('Autoplay bloqueado pelo navegador'));

    // Cria player no meio
    player = document.createElement('div');
    player.id = 'player';
    player.style.top = `${(gameContainer.clientHeight / 2 + 30)}px`;
    player.style.left = `${(gameContainer.clientWidth / 2 - 16)}px`;
    gameContainer.appendChild(player);

    // Aplica scale inicial e flipX padrão
    player.style.transform = `scaleX(${flipX * scale}) scaleY(${scale})`;

    const elementosVivos = [
        {classe: 'agua', pos: [1, 515], width: 80, height: 64, tipo: 'queda'},
        {classe: 'pato', pos: [550, 560], width: 64, height: 64, tipo: 'movimento'},
        {classe: 'ganso', pos: [200, 538], width: 60, height: 60, tipo: 'movimento'},
        {classe: 'rato', pos: [500, 460], width: 96, height: 48, tipo: 'movimento'},
    ];

    elementosVivos.forEach(obj => {
        const el = document.createElement('div');
        el.classList.add(obj.classe);
        el.style.width = `${obj.width}px`;
        el.style.height = `${obj.height}px`;
        el.style.position = 'absolute';
        el.style.top = `${obj.pos[0]}px`;
        el.style.left = `${obj.pos[1]}px`;
        el.style.backgroundSize = 'cover';
        el.style.zIndex = '5';
        gameContainer.appendChild(el);

        if(obj.tipo === 'movimento') {
            // Movimento suave para cima e baixo
            let direction = 1;
            const amplitude = 2;
            const startTop = obj.pos[0];

            setInterval(() => {
                let currentTop = parseInt(el.style.top);
                if(currentTop >= startTop + amplitude) direction = -1;
                if(currentTop <= startTop) direction = 1;
                el.style.top = `${currentTop + direction}px`;
            }, 200);
        }

        if(obj.tipo === 'queda') {
            // Efeito de queda contínua
            const limite = obj.pos[0] + 35; // distância da queda
            const startTop = obj.pos[0];

            setInterval(() => {
                let currentTop = parseInt(el.style.top);
                if(currentTop >= limite) {
                    el.style.top = `${startTop}px`; // reinicia no topo
                } else {
                    el.style.top = `${currentTop + 6}px`; // velocidade da queda
                }
            }, 20);
        }
    });

    const chest = [
        [350, 850],
        [520, 60],
    ];

    chest.forEach(pos => {
        const bau = document.createElement('div');
        bau.classList.add('chest');
        bau.style.width = `${tileSizeChest}px`;
        bau.style.height = `${tileSizeChest}px`;
        bau.style.position = 'absolute';
        bau.style.top = `${pos[0]}px`;
        bau.style.left = `${pos[1]}px`;
        bau.style.backgroundImage = 'url("img/Tiles/Chest.png")';
        bau.style.backgroundSize = 'cover';
        gameContainer.appendChild(bau);
    });

    const signal = [
        [320, 851],
        [490, 61]
    ];

    signal.forEach(pos => {
        const sinal = document.createElement('div');
        sinal.classList.add('signal');
        sinal.style.width = `${tileSizeChest}px`;
        sinal.style.height = `${tileSizeChest}px`;
        sinal.style.position = 'absolute';
        sinal.style.top = `${pos[0]}px`;
        sinal.style.left = `${pos[1]}px`;
        sinal.style.backgroundImage = 'url("img/Tiles/Signal.png")';
        sinal.style.backgroundSize = 'cover';
        gameContainer.appendChild(sinal);

        let direction = 1; // 1 = para baixo, -1 = para cima
        const amplitude = 5;
        let startTop = pos[0];

        setInterval(() => {
            let currentTop = parseInt(sinal.style.top);
            if(currentTop >= startTop + amplitude) direction = -1;
            if(currentTop <= startTop) direction = 1;

            sinal.style.top = `${currentTop + direction}px`;
        }, 100);
    });

    const signalDown = [
        [130, 920],
        [215, 206]
    ];

    signalDown.forEach(pos => {
    const sinalBaixo = document.createElement('div');
        sinalBaixo.classList.add('signalDown');
        sinalBaixo.style.width = `${tileSizeChest}px`;
        sinalBaixo.style.height = `${tileSizeChest}px`;
        sinalBaixo.style.position = 'absolute';
        sinalBaixo.style.top = `${pos[0]}px`;
        sinalBaixo.style.left = `${pos[1]}px`;
        sinalBaixo.style.backgroundImage = 'url("img/Tiles/Signal.png")';
        sinalBaixo.style.backgroundSize = 'cover';
        gameContainer.appendChild(sinalBaixo);

        let direction = 1; // 1 = para baixo, -1 = para cima
        const amplitude = 5;
        let startTop = pos[0];

        setInterval(() => {
            let currentTop = parseInt(sinalBaixo.style.top);
            if(currentTop >= startTop + amplitude) direction = -1;
            if(currentTop <= startTop) direction = 1;

            sinalBaixo.style.top = `${currentTop + direction}px`;
        }, 100);
    });

    // pontoDeFala.forEach(p => {
    //     // Cria um div só para teste visual
    //     const teste = document.createElement('div');
    //     teste.classList.add('pontoTeste');
    //     teste.style.left = p.left + 'px';
    //     teste.style.top = p.top + 'px';
    //     teste.style.width = p.width + 'px';
    //     teste.style.height = p.height + 'px';
    //     gameContainer.appendChild(teste);
    // });

    const joystick = document.getElementById('joystick');
    const stick = document.getElementById('stick');
    let joystickActive = false;
    let startX, startY;
    let stickX = 0, stickY = 0;

    joystick.addEventListener('touchstart', (e) => {
        joystickActive = true;
        // Pega a posição inicial do toque
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });


    joystick.addEventListener('touchmove', (e) => {
        if (!joystickActive) return;

        // Diferença entre posição atual e inicial
        let deltaX = e.touches[0].clientX - startX;
        let deltaY = e.touches[0].clientY - startY;

        // Limita a magnitude do stick a 50px
        const maxDistance = 50;
        const distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if(distance > maxDistance){
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }

        // Normaliza entre -1 e 1 para velocidade uniforme
        stickX = deltaX / maxDistance;
        stickY = deltaY / maxDistance;

        // Move o stick visualmente
        stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });


    joystick.addEventListener('touchend', () => {
        joystickActive = false;
        stickX = 0;
        stickY = 0;
        stick.style.transform = `translate(0px,0px)`;
    });


    function updatePlayer() {
        if(joystickActive){
            const speed = 2; // pixels por frame
            let top = parseFloat(player.style.top);
            let left = parseFloat(player.style.left);

            // aplica movimento proporcional
            top += stickY * speed;
            left += stickX * speed;

            // limites do container
            const maxLeft = gameContainer.clientWidth - player.offsetWidth;
            const maxTop = gameContainer.clientHeight - player.offsetHeight;

            player.style.top = `${Math.max(0, Math.min(top, maxTop))}px`;
            player.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;

            // Atualiza direção e flip
            if(stickX < -0.1) flipX = -1;
            else if(stickX > 0.1) flipX = 1;
            
            player.style.transform = `scaleX(${flipX * scale}) scaleY(${scale})`;

            // Atualiza animação
            currentDirection = Math.abs(stickY) > Math.abs(stickX)
                ? (stickY < 0 ? 'up' : 'down')
                : (stickX < 0 ? 'left' : 'right');

            const line = getWalkLine();
            player.style.backgroundPosition = `-${currentFrame*frameWidth}px -${line*frameHeight}px`;
            // currentFrame = (currentFrame + 1) % totalFrames;
        }

        requestAnimationFrame(updatePlayer);
    }
    updatePlayer();

};

// Carrega as falas
const frases = {
    intro: `
        <div>Olá! Me chamo <strong>Bruno Gomes</strong> e seja bem-vindo ao meu portfólio interativo. Aqui você pode explorar meus projetos de forma divertida: caminhe pelo ambiente, encontre pontos de interesse e descubra detalhes sobre minhas habilidades e trabalhos. Use as setas do teclado para se movimentar.</div>
        <div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>
    `,
    point1: `
        <div>Sou estudante de <strong>Engenharia de Software</strong> e estou iniciando minha trajetória na <strong>programação e cibersegurança,</strong> buscando aprender de forma prática e aplicar meus conhecimentos em projetos reais.</div>
<div></br>Tenho experiência básica em <strong>Python, HTML, CSS, JS e MySQL,</strong> construindo pequenos projetos e experimentos interativos.
Também estou explorando conceitos de cibersegurança, incluindo testes de penetração em ambientes simulados, análise de vulnerabilidades e scripts simples de segurança para aprendizado.</div>
<div><br>Este portfólio interativo é um exemplo de como aplico meus estudos em projetos práticos, mesmo ainda em aprendizado. Vá até os pontos de interesse e descubra mais sobre meus projetos.</div>
<div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>
    `,
    point2: `
        <div>Aqui você encontra meus <strong>projetos web</strong>: criei sistemas com Python e Flask, incluindo automação de tarefas e aplicações de previsão do tempo.</div>
        <div><strong>Habilidades:</strong> HTML, CSS, JavaScript, Flask, integração com APIs.</div>
        <div><a href="https://seusite.com/projeto-web" target="_blank">Exemplo de aplicação online</a></div>
        <div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>
    `,
    point3: `
        <div>Este ponto destaca projetos de <strong>automação e integração</strong>: bots para WhatsApp Web, sistemas de monitoramento e notificações automáticas.</div>
        <div><strong>Habilidades:</strong> Python, Selenium, API do WhatsApp, manipulação de DOM, automação de processos.</div>
        <div><a href="https://github.com/seuusuario/bot-whatsapp" target="_blank">Veja um projeto de automação</a></div>
        <div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>
    `,
    point4:`
        <div><h2>Sistema de Gestão e Compras de GLP</h2>
        <p><strong>Tecnologias:</strong> Python, Flask, MySQL, HTML, CSS e JavaScript</p>

        <h3>Descrição:</h3>
        <p>
            Sistema web para realização de pedidos online.
            Usuários podem se cadastrar, fazer login, consultar revendas e realizar compras de forma online.
        </p>

        <h3>Funcionalidades principais:</h3>
        <ul>
            <li>Cadastro, login e gerenciamento de conta com senhas criptografadas</li>
            <li>Consulta de revendas com filtros por marca e ordenação por preço</li>
            <li>Registro de pedidos com valores e descontos “congelados”</li>
            <li>Acompanhamento de pedidos, total de compras e economia acumulada</li>
            <li>Geração de mensagens de confirmação de pedido formatadas para WhatsApp</li>
        </ul>

        <div>Acesse <a href="https://brunogblum.pythonanywhere.com" target="_blank">clicando aqui</a></div>
        <div style="text-align:center; font-size:0.9em;"><br>(Versão desktop)</div>
        <div style="text-align:center; font-size:0.9em;"><br>(Clique ou caminhe para fechar)</div>
    `
};

// Pontos de fala como áreas de colisão
const pontoDeFala = [
  {left:845, top:345, width:40, height:40, fala:"point1", ativado:false},
  {left:55, top:515, width:40, height:40, fala:"point2", ativado:false},
  {left:200, top:190, width:40, height:40, fala:"point3", ativado:false},
  {left:920, top:110, width:40, height:40, fala:"point4", ativado:false}
];

// Fecha as falas ao clicar
falas.addEventListener("click", () => {
    falas.style.display = "none";
});

// Mostra fala inicial
falas.innerHTML = frases.intro;

// Checar a colisão
function checaColisao(a, b) {
    return !(
        a.left + a.width <= b.left ||
        a.left >= b.left + b.width ||
        a.top + a.height <= b.top ||
        a.top >= b.top + b.height
    );
}

// Define a velocidade do personagem
const speed = 10;

// Configurações do sprite
let currentFrame = 0;      
const frameWidth = 32;     
const frameHeight = 32;    
const totalFrames = 6;     
let currentDirection = 'down';

const directions = {
    idleDown: 0,
    idleSide: 1,
    idleUp: 2,
    walkDown: 3,
    walkRight: 4,
    walkUp: 5
};

function getIdleLine() {
    switch(currentDirection) {
        case 'down': return directions.idleDown;
        case 'up': return directions.idleUp;
        case 'left': 
        case 'right': return directions.idleSide;
        default: return directions.idleDown;
    }
}

function getWalkLine() {
    switch(currentDirection) {
        case 'down': return directions.walkDown;
        case 'up': return directions.walkUp;
        case 'right':
        case 'left': return directions.walkRight;
        default: return directions.walkDown;
    }
}

function animateIdle() {
    const line = getIdleLine();
    player.style.backgroundPosition = `-${currentFrame * frameWidth}px -${line * frameHeight}px`;
    currentFrame = (currentFrame + 1) % totalFrames;
}

// Troca de frame a cada 200ms
setInterval(animateIdle, 200);

// Escuta eventos do teclado
document.addEventListener('keydown', function(event) {
    let top = parseInt(player.style.top);
    let left = parseInt(player.style.left);
    let moving = false;
    const playerWidth = player.offsetWidth;   // pega o tamanho visual real do player
    const playerHeight = player.offsetHeight;
    const maxLeft = gameContainer.clientWidth - playerWidth;
    const maxTop  = gameContainer.clientHeight - playerHeight;
    dentroDeUmPonto = false;

    switch(event.key) {
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
            flipX = -1;  // espelha horizontal
            moving = true;
            break;
        case 'ArrowRight':
            left += speed;
            currentDirection = 'right';
            flipX = 1;   // normal
            moving = true;
            break;
    }

    if(!moving) return;

    // Aplica transform **uma vez**, mantendo o tamanho vertical e horizontal
    player.style.transform = `scaleX(${flipX * scale}) scaleY(${scale})`;

    // LIMITES
    left = Math.max(0, Math.min(left, maxLeft));
    top  = Math.max(0, Math.min(top,  maxTop));

    // Cria objeto do player na nova posição
    const playerRect = {
        top: top,
        left: left,
        width: player.offsetWidth,
        height: player.offsetHeight
    };

    let colidiu = false;

    // Carrega todos os obstáculos + baús
    const barreiras = [
        ...document.querySelectorAll('.obstacle'),
        ...document.querySelectorAll('.chest')
    ];


    barreiras.forEach(b => {
        const bRect = b.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        // Ajusta posição da barreira relativa ao container
        const barreira = {
            top: bRect.top - containerRect.top,
            left: bRect.left - containerRect.left,
            width: bRect.width,
            height: bRect.height
        };

        if(checaColisao(playerRect, barreira)) colidiu = true;
    });

    // Atualiza posição apenas se não colidiu
    if(!colidiu) {
        player.style.top = `${top}px`;
        player.style.left = `${left}px`;
    }

    // // Verifica se houve colisao com ponto de fala
    // pontoDeFala.forEach(p => {
    //     if (!p.ativado && checaColisao(playerRect, p)) {
    //         falas.innerText = frases[p.fala];
    //         falas.style.display = "block";
    //         p.ativado = true;
    //     }
    // });
    pontoDeFala.forEach(p => {
        if (checaColisao(playerRect, p)) {
            dentroDeUmPonto = true;
            falas.innerHTML = frases[p.fala]; // use innerHTML se tiver HTML
            falas.style.display = "block";
        }
    });

    // Se não estiver em nenhum ponto de fala, esconde o balão
    if (!dentroDeUmPonto) {
        falas.style.display = "none";
    }

    const line = getWalkLine();
    player.style.backgroundPosition = `-${currentFrame * frameWidth}px -${line * frameHeight}px`;
    currentFrame = (currentFrame + 1) % totalFrames;
});