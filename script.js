// 获取DOM元素
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// 游戏常量
const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

// 游戏变量
let snake = [];
let food = {};
let direction = '';
let nextDirection = '';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let gameSpeed = 150;
let isGameRunning = false;
let isGameOver = false;

// 更新最高分显示
highScoreElement.textContent = highScore;

// 初始化游戏
function initGame() {
    // 重置蛇的位置和长度
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 重置方向
    direction = 'right';
    nextDirection = 'right';
    
    // 重置分数
    score = 0;
    scoreElement.textContent = score;
    
    // 生成食物
    generateFood();
    
    // 重置游戏状态
    isGameOver = false;
    
    // 绘制初始游戏状态
    draw();
}

// 生成食物
function generateFood() {
  let newFood;

  // 确保食物不会生成在蛇身上
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
  } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

  food = newFood;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 设置网格背景
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
    
    // 绘制蛇头
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(snake[0].x * GRID_SIZE, snake[0].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    
    // 绘制蛇身
    ctx.fillStyle = '#45a049';
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * GRID_SIZE, snake[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
    
    // 绘制蛇眼睛（简单表示）
    ctx.fillStyle = 'white';
    if (direction === 'right') {
        ctx.fillRect(snake[0].x * GRID_SIZE + 15, snake[0].y * GRID_SIZE + 5, 3, 3);
        ctx.fillRect(snake[0].x * GRID_SIZE + 15, snake[0].y * GRID_SIZE + 12, 3, 3);
    } else if (direction === 'left') {
        ctx.fillRect(snake[0].x * GRID_SIZE + 2, snake[0].y * GRID_SIZE + 5, 3, 3);
        ctx.fillRect(snake[0].x * GRID_SIZE + 2, snake[0].y * GRID_SIZE + 12, 3, 3);
    } else if (direction === 'up') {
        ctx.fillRect(snake[0].x * GRID_SIZE + 5, snake[0].y * GRID_SIZE + 2, 3, 3);
        ctx.fillRect(snake[0].x * GRID_SIZE + 12, snake[0].y * GRID_SIZE + 2, 3, 3);
    } else if (direction === 'down') {
        ctx.fillRect(snake[0].x * GRID_SIZE + 5, snake[0].y * GRID_SIZE + 15, 3, 3);
        ctx.fillRect(snake[0].x * GRID_SIZE + 12, snake[0].y * GRID_SIZE + 15, 3, 3);
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // 如果游戏结束，显示游戏结束信息
    if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText(`最终得分: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.fillText('按开始按钮重新开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
}

// 更新游戏状态
function update() {
    // 更新方向
    direction = nextDirection;
    
    // 获取蛇头的位置
    const head = {
        x: snake[0].x,
        y: snake[0].y
    };
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    
    // 检查是否撞到墙壁
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver();
        return;
    }
    
    // 检查是否撞到自己
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // 将新的蛇头添加到蛇的头部
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // 生成新的食物
        generateFood();
        
        // 随着分数增加，提高游戏速度
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(update, gameSpeed);
        }
    } else {
        // 如果没有吃到食物，移除蛇尾
        snake.pop();
    }
    
    // 绘制更新后的游戏状态
    draw();
}

// 游戏结束
function gameOver() {
    isGameRunning = false;
    isGameOver = true;
    clearInterval(gameInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    draw();
}

// 开始游戏
function startGame() {
    if (!isGameRunning && !isGameOver) {
        isGameRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameInterval = setInterval(update, gameSpeed);
    } else if (isGameOver) {
        // 如果游戏结束，重新初始化游戏
        initGame();
        isGameRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameInterval = setInterval(update, gameSpeed);
    }
}

// 暂停游戏
function pauseGame() {
    if (isGameRunning) {
        isGameRunning = false;
        clearInterval(gameInterval);
        startBtn.disabled = false;
        startBtn.textContent = '继续游戏';
        pauseBtn.disabled = true;
        
        // 显示暂停信息
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

// 重置游戏
function resetGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    startBtn.disabled = false;
    startBtn.textContent = '开始游戏';
    pauseBtn.disabled = true;
    initGame();
}

// 处理键盘输入
function handleKeyDown(e) {
    const key = e.key;
    
    // 控制蛇的方向
    switch (key) {
        case 'ArrowRight':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowUp':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case ' ': // 空格键暂停/继续
            e.preventDefault();
            if (isGameRunning) {
                pauseGame();
            } else if (!isGameOver) {
                startGame();
            }
            break;
    }
}

// 事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
window.addEventListener('keydown', handleKeyDown);

// 初始化游戏
initGame();