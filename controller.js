class Controller {
  scoreTable = document.querySelector('#score');
  constructor (canvas) {
    this.canvas  = canvas.link;
    this.context = this.canvas.getContext('2d');
    this.scale = 20;
    this.score = 0
    this.food = new Food(this.scale);
    this.canvasHeight = 480;
    this.canvasWidth = 600;
    this.snake = new Snake(this.scale);
  }

  generateSnake() {
    
    for(let i = 0; i < this.snake.tail.length; i++) {
      this.context.beginPath();
      this.context.rect(this.snake.tail[i].x, this.snake.tail[i].y, this.snake.size-1, this.snake.size-1);
      this.context.fillStyle = '#FFFFFF';
      this.context.fill();
      this.context.closePath();
    }
    this.context.beginPath();
    this.context.rect(this.snake.x, this.snake.y, this.snake.size-1, this.snake.size-1);
    this.context.fillStyle = '#FFFFFF';
    this.context.fill();
    this.context.closePath();
  }

  createFood() {
    let posX = Math.floor((Math.random() * (this.canvasWidth-this.scale)) / this.scale) * this.scale;
    let posY = Math.floor((Math.random() * (this.canvasHeight-this.scale)) / this.scale) * this.scale;
    this.food = {x: posX, y: posY}
  }

  generateFood() {
    this.context.beginPath();
    this.context.rect(this.food.x, this.food.y, this.scale, this.scale);
    this.context.fillStyle = '#34b4eb';
    this.context.fill();
    this.context.closePath();
  }

  changeDirection(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      if(this.snake.tail[this.snake.total-1].x === this.snake.x ) {
        this.snake.speedX = this.snake.size;
        this.snake.speedY = 0;
      }
    } else if(e.key == "Up" || e.key == "ArrowUp") {
      if(this.snake.tail[this.snake.total-1].y === this.snake.y ) {
        this.snake.speedX = 0;
        this.snake.speedY = -this.snake.size;
      }
    } else if(e.key == "Down" || e.key == "ArrowDown") {
      if(this.snake.tail[this.snake.total-1].y === this.snake.y ) {
        this.snake.speedX = 0;
        this.snake.speedY = this.snake.size;
      }
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
      if(this.snake.tail[this.snake.total-1].x === this.snake.x ) {
        this.snake.speedX = -this.snake.size;
        this.snake.speedY = 0;
        this.direction = 'left';
      }
    }
  }

  updateSnake() {
    if(this.snake.x > this.canvasWidth + this.snake.size) {
      this.snake.x = 0;
    } else if (this.snake.x < 0 ) {
      this.snake.x = this.canvasWidth + this.snake.size;
    } else if (this.snake.y > this.canvasHeight - this.snake.size) {
      this.snake.y = 0;
    } else if (this.snake.y < 0) {
      this.snake.y = this.canvasHeight - this.snake.size;
    } else {
      if(this.snake.total === this.snake.tail.length) {
        for(let i = 0; i < this.snake.tail.length-1; i++) {
          this.snake.tail[i] = this.snake.tail[i+1];
        } 
      }
      this.snake.tail[this.snake.total-1] = {x: this.snake.x, y: this.snake.y}     
      this.snake.x += this.snake.speedX;
      this.snake.y += this.snake.speedY;
    }
       
  }

  updateScore(){
    this.scoreTable.textContent = this.score;
  }

  reset() {
    this.snake = new Snake(this.scale);
    this.score = 0;
    this.updateScore()
  }

  start () {
    document.addEventListener('keydown', (e) => {
      this.changeDirection(e);
    });
    document.querySelector('.strBtn').classList.add('hide');
    document.querySelector('.stopBtn').classList.remove('hide');
    this.createFood();
    this.animate.call(this);
    
  }

  stop () {
    clearInterval(this.intervalCounter);
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);
    this.reset()
    document.querySelector('.strBtn').classList.remove('hide');
    document.querySelector('.stopBtn').classList.add('hide');

  }

  animate () {
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientWidth);
    if (this.food && this.snake.eat(this.food)) {
      this.score++;
      this.updateScore();
      this.createFood();
    }
    if(this.snake.intersect()) {
      this.reset();
    }
    this.generateFood();
    this.generateSnake();
    this.updateSnake();
    this.intervalCounter = setTimeout(() => {
      requestAnimationFrame(this.animate.bind(this));
    }, 100);
  }
}

class Snake {
  constructor(size){
    this.x = 0;
    this.y = 0;
    this.speedX = size;
    this.speedY = 0;
    this.size = size;
    this.total = 1;
    this.tail = [{x: this.x, y: this.y}];
  }

  eat(pos) {
    if(pos.x === this.x && pos.y === this.y) {
      this.total++;
      return true;
    }
    return false;
  }

  intersect() {
    if(this.tail.some((el, ind, arr) => { return (el.x === this.x && ind !== arr.length-1 && el.y === this.y) })) {
      return true;
    }
    else {
      return false;
    }
  }
}

class Food {
  constructor(size){
    this.x = -size;
    this.y = -size;
    this.size = size;
  }
}

let controller = new Controller(_canvas);

