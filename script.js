document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("game-canvas");
    const context = canvas.getContext("2d");
    const gridSize = 20;
    const snake = [{ x: 40, y: 40 }];
    const food = { x: 200, y: 200 };
    let direction = "right";
    let score = 0;
    let gameRunning = false;
    let gameInterval;
  
    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Draw snake
      snake.forEach(segment => {
        context.fillStyle = "#000";
        context.fillRect(segment.x, segment.y, gridSize, gridSize);
      });
  
      // Draw food
      context.fillStyle = "#f00";
      context.fillRect(food.x, food.y, gridSize, gridSize);
  
      // Draw score
      context.fillStyle = "#000";
      context.font = "20px Arial";
      context.fillText("Score: " + score, 10, 20);
    }
  
    function update() {
      const head = { x: snake[0].x, y: snake[0].y };
  
      // Move the snake
      switch (direction) {
        case "up":
          head.y -= gridSize;
          break;
        case "down":
          head.y += gridSize;
          break;
        case "left":
          head.x -= gridSize;
          break;
        case "right":
          head.x += gridSize;
  
          // Check for collision with the right wall
          if (head.x >= canvas.width) {
            gameOver();
            return;
          }
          break;
      }
  
      // Check for collision with the snake's body
      if (isCollision(head, snake.slice(1))) {
        gameOver();
        return;
      }
  
      // Check if the snake eats the food
      const ateFood = head.x === food.x && head.y === food.y;
      if (ateFood) {
        // Generate new food position
        food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        score++; // Increase the score
      }
  
      snake.unshift(head); // Add the new head to the snake
      if (!ateFood) {
        snake.pop(); // Remove the tail if the snake didn't eat food
      }
  
      draw();
    }
  
    function isCollision(position, segments) {
      // Check if the position collides with any segment of the snake
      return segments.some(segment => segment.x === position.x && segment.y === position.y);
    }
  
    function gameOver() {
      clearInterval(gameInterval);
      gameRunning = false;
      alert("Game Over! Your score: " + score);
      snake.length = 1; // Reset the snake
      score = 0; // Reset the score
      direction = "right"; // Reset the direction
      snake[0].x = Math.floor(canvas.width / 2 / gridSize) * gridSize;
      snake[0].y = Math.floor(canvas.height / 2 / gridSize) * gridSize;
      draw();
    }
  
    function handleKeydown(event) {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "down") {
            direction = "up";
          }
          break;
        case "ArrowDown":
          if (direction !== "up") {
            direction = "down";
          }
          break;
        case "ArrowLeft":
          if (direction !== "right") {
            direction = "left";
          }
          break;
        case "ArrowRight":
          if (direction !== "left") {
            direction = "right";
          }
          break;
      }
    }
  
    function toggleGame() {
      if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        document.getElementById("play-pause-button").textContent = "Play";
      } else {
        gameInterval = setInterval(update, 200);
        gameRunning = true;
        document.getElementById("play-pause-button").textContent = "Pause";
      }
    }
  
    function restartGame() {
      if (!gameRunning) {
        clearInterval(gameInterval);
        snake.length = 1; // Reset the snake
        score = 0; // Reset the score
        direction = "right"; // Reset the direction
        snake[0].x = Math.floor(canvas.width / 2 / gridSize) * gridSize;
        snake[0].y = Math.floor(canvas.height / 2 / gridSize) * gridSize;
        draw();
      }
    }
  
    document.addEventListener("keydown", handleKeydown);
    document.getElementById("play-pause-button").addEventListener("click", toggleGame);
    document.getElementById("restart-button").addEventListener("click", restartGame);
  
    draw();
  });
  