document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("game-canvas");
  const context = canvas.getContext("2d");
  const gridSize = 50;
  const snake = [{ x: 50, y: 50 }];
  const food = { x: 200, y: 200 };
  let direction = "right";
  let score = 0;
  let gameRunning = false;
  let gameInterval;

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < canvas.height / gridSize; row++) {
      for (let col = 0; col < canvas.width / gridSize; col++) {
        const isEvenRow = row % 2 === 0;
        const isEvenCol = col % 2 === 0;
        const fillColor = isEvenRow
          ? isEvenCol
            ? "#a7d03c"
            : "#acd645"
          : isEvenCol
          ? "#acd645"
          : "#a7d03c";
        context.fillStyle = fillColor;
        context.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
      }
    }

    // Draw snake
    snake.forEach((segment) => {
      context.fillStyle = "#059b34";
      context.beginPath();
      context.arc(
        segment.x + gridSize / 2,
        segment.y + gridSize / 2,
        gridSize / 2,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
    });

    // Draw apple
    const appleImage = document.getElementById("apple-image");
    context.drawImage(appleImage, food.x, food.y, gridSize, gridSize);

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
        break;
    }

    // Wrap around the screen
    if (head.x < 0) {
      head.x = canvas.width - gridSize;
    } else if (head.x >= canvas.width) {
      head.x = 0;
    } else if (head.y < 0) {
      head.y = canvas.height - gridSize;
    } else if (head.y >= canvas.height) {
      head.y = 0;
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
      food.y =
        Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
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
    return segments.some(
      (segment) => segment.x === position.x && segment.y === position.y
    );
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

  let directionChangeDelay = false;
  let previousDirection = "";

  function handleKeydown(event) {
    if (directionChangeDelay) {
      return; // Ignore key press if direction change delay is active
    }

    let newDirection = "";

    switch (event.key) {
      case "ArrowUp":
        newDirection = "up";
        break;
      case "ArrowDown":
        newDirection = "down";
        break;
      case "ArrowLeft":
        newDirection = "left";
        break;
      case "ArrowRight":
        newDirection = "right";
        break;
    }

    if (
      newDirection !== "" &&
      newDirection !== oppositeDirection(previousDirection) &&
      (snake.length === 1 || newDirection !== direction)
    ) {
      direction = newDirection;
      previousDirection = direction;
      directionChangeDelay = true;

      setTimeout(() => {
        directionChangeDelay = false; // Reset direction change delay after a certain time
      }, 200); // Adjust the delay time as needed (in milliseconds)
    }
  }

  function oppositeDirection(dir) {
    switch (dir) {
      case "up":
        return "down";
      case "down":
        return "up";
      case "left":
        return "right";
      case "right":
        return "left";
      default:
        return "";
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
    clearInterval(gameInterval);
    gameRunning = false;
    snake.length = 1; // Reset the snake
    score = 0; // Reset the score
    direction = "right"; // Reset the direction
    snake[0].x = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    snake[0].y = Math.floor(canvas.height / 2 / gridSize) * gridSize;
    draw();
    toggleGame(); // Start the game
  }

  document.addEventListener("keydown", handleKeydown);
  document
    .getElementById("play-pause-button")
    .addEventListener("click", toggleGame);
  document
    .getElementById("restart-button")
    .addEventListener("click", restartGame);

  draw();
});
