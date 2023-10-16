
const board = document.getElementById('board');
const boardScore = document.getElementById('score');
const boardHigh = document.getElementById('highest');
let snake = document.createElement('div');


let size = 40;
//posição inicial
let snakeY = 1, snakeX = 1;

let snakeBody = [];//vetor do corpo da cobra
let points = [];//vetor dos pontos
let NumP=5;

snake.classList.add('bodySnake','headR');
snake.style.gridArea = `${snakeY}/${snakeX}`;
board.appendChild(snake);

let directionY = 0, directionX = 1;
//direção inicial
let snakeDirectionClass = 'headR';
let curDirection = 'right';
//Pontuação inicial
let score = 0;
let highscore = 0;
//Relacionados ao movimento intervalar
let velocity = 200;
let intervalId;
let isPaused = false;

function rand() {
    return Math.floor(Math.random() * size) + 1;
}

function newPoint() {
    let collision
    let pointY, pointX;
    do {//continua fazendo enquanto houver colisões
        pointY = rand();
        pointX = rand();
        // Verifique se as coordenadas não colidem com nenhum ponto existente
        collision = points.some((point) => point.x === pointX && point.y === pointY);
    } while (collision);

    const point = document.createElement('div');
    point.classList.add('point');
    point.style.gridArea = `${pointY}/${pointX}`;
    board.appendChild(point);
    points.push({ x: pointX, y: pointY, element: point });
}

function start() {
    clearInterval(intervalId);
    points.forEach((point) => {//ta tirando todos os pontos ja criados(restart)
        board.removeChild(point.element);
    });
    points = [];//inicializa o arry que contem os pontos
    //cria os pontos
    for(let i=0;i<NumP;i++)
        newPoint();
    //posição inicial da head
    snake.style.gridArea = `${snakeY}/${snakeX}`;
    intervalId = setInterval(moveSnake, velocity);
}
//checa se ta no tabuleiro
function check() {
    if (snakeX < 1) snakeX = size;
    if (snakeY < 1) snakeY = size;
    if (snakeX > size) snakeX = 1;
    if (snakeY > size) snakeY = 1;
}

function moveSnake() {
    if (isPaused) {//break point
        return;
    }

    let tempY = snakeY, tempX = snakeX;
    snakeY += directionY;
    snakeX += directionX;
    check();

    points.forEach((point, index) => {
        if (snakeX === point.x && snakeY === point.y) {//confere se a head bateu para todos os pontos
            points.splice(index, 1);//remove-o do vetor
            point.element.remove();//remove do tabuleiro
            const body = document.createElement('div');//parte do corpo
            score++;
            boardScore.innerHTML = `Pontuação: ${score}`;
            if (score % 4 == 0 && score != 0 && velocity > 20) {
                velocity -= 20;
                clearInterval(intervalId);
                intervalId = setInterval(moveSnake, velocity);
            }
            if (score > highscore) {
                highscore = score;
                boardHigh.innerHTML = `Maior pontuação: ${score}`;
            }
            body.classList.add('bodySnake');//posiciona o corpo
            body.style.gridArea = `${point.y}/${point.x}`;
            board.appendChild(body);
            snakeBody.push(body);
            if (points.length < NumP) {//cria um novo ponto caso ela tenha encontrado
                newPoint();
            }
        }
    });

    snake.style.gridArea = `${snakeY}/${snakeX}`;
    snakeBody.forEach((uni) => {
        const estilo = window.getComputedStyle(uni);
        let testX = estilo.getPropertyValue('grid-column');
        let testY = estilo.getPropertyValue('grid-row');
        uni.style.gridArea = `${tempY}/${tempX}`;
        tempY = parseInt(testY);
        tempX = parseInt(testX);
    });
    CheckCol();
}

function CheckCol() {
    snakeBody.forEach((uni)=>{
        //pega a posição da unidade e confere se é igual a da cabeça
        const bodyX = parseInt(uni.style.gridArea.split('/')[1]);
        const bodyY = parseInt(uni.style.gridArea.split('/')[0]);
        if (snakeX === bodyX && snakeY === bodyY) {//reinicia
            alert('Você perdeu! Sua pontuação: ' + score);
            snakeX = 1;
            snakeY = 1;
            velocity = 200;
            clearInterval(intervalId);
            intervalId = setInterval(moveSnake, velocity);
            snakeBody.forEach((segment) => {
                board.removeChild(segment);
            });
            snakeBody = [];
            score = 0;
            boardScore.innerHTML = `Pontuação: ${score}`;
            start();
        }
    })
}

function togglePause() {//troca o estado do pause
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(intervalId);
    } else {
        intervalId = setInterval(moveSnake, velocity);
    }
}

function changeDirection(e) {
    if (e.key === 'P' || e.key === 'p') {
        togglePause();
        return;
    }
    if (isPaused) {
        return;
    }
    if (e.key === 'ArrowLeft') {
        if (curDirection == 'right') return;
        directionY = 0;
        directionX = -1;
        snakeDirectionClass = 'headL';
        curDirection = 'left';
    } else if (e.key === 'ArrowRight') {
        if (curDirection == 'left') return;
        directionY = 0;
        directionX = 1;
        snakeDirectionClass = 'headR';
        curDirection = 'right';
    } else if (e.key === 'ArrowUp') {
        if (curDirection == 'down') return;
        directionY = -1;
        directionX = 0;
        snakeDirectionClass = 'headT';
        curDirection = 'top';
    } else if (e.key === 'ArrowDown') {
        if (curDirection == 'top') return;
        directionY = 1;
        directionX = 0;
        snakeDirectionClass = 'headD';
        curDirection = 'down';
    } else {
        return;
    }
    snake.className = `bodySnake ${snakeDirectionClass}`;
    moveSnake();
}

start();
document.addEventListener('keydown', changeDirection);

