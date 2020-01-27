ctx = document.getElementById('canvas').getContext('2d');
nTiles = ctx.canvas.width / 20;

function drawTile(obj, color) {
	// ctx = built-in JS object, can draw to canvas
	ctx.fillStyle = color
	ctx.fillRect(20 * obj.x, 20 * obj.y, 20, 20);
}

// Snake object links to linked list of part objects (x and y coords for body parts)
snake = {
	dir: 0, // 0 is right, 3 is down, moving ccw
	newDir: 0, // prevents bug where snake turns in on itself in one turn
	head: null,

	isDead: function() {
		// Check if head collides with another part
		let bodyPart = this.head;
		while (bodyPart = bodyPart.next)
			if (this.head.x == bodyPart.x && this.head.y == bodyPart.y) return true
		// Else check if head out of bounds
		return this.head.x < 0 || this.head.x > nTiles - 1
			|| this.head.y < 0 || this.head.y > nTiles - 1
	},

	newHead: function() {
		let dx = dy = 0;
		switch (this.dir) {
			case 0: dx =  1; break;
			case 1: dy = -1; break;
			case 2: dx = -1; break;
			case 3: dy =  1; break;
		}
		this.head = {
			next: this.head,
			x: this.head.x + dx,
			y: this.head.y + dy,
		}
		// Draw new head
		drawTile(this.head, 'black');
	},

	popTail: function() {
		// Delete last body part and undraw it
		let bodyPart = this.head;
		while ((bodyPart = bodyPart.next).next.next);
		drawTile(bodyPart.next, 'white')
		bodyPart.next = null;
	},
};

let lastTime = 0;
let runningTime = 0;
let food = null;

function playGame() {
	// Clear game
	ctx.clearRect(0, 0, 400, 400);
	snake.head = {
		next: null,
		x: Math.trunc(nTiles / 2),
		y: Math.trunc(nTiles / 2),
	};
	food = null;
	document.getElementById('gameOverText').innerHTML = ''

	// Construct snake
	for (let i = 0; i < 4; i++) snake.newHead();
	snake.dir = Math.floor(Math.random() * 4)

	// Begin loop
	update(0);
};

function update(timestamp) {
	let dt = timestamp - lastTime;
	lastTime = timestamp;

	if ((runningTime += dt) > 100) { // Only update every x milliseconds
		runningTime = 0;

		while (!food) {
			food = {
				x: Math.floor(Math.random() * nTiles),
				y: Math.floor(Math.random() * nTiles),
			};

			// Check if food spawned in snake
			let bodyPart = snake.head;
			while (bodyPart) {
				if (food.x == bodyPart.x && food.y == bodyPart.y) {
					food = null;
					break;
				}
				bodyPart = bodyPart.next;
			}

			if (food) drawTile(food, 'red');
		}

		snake.dir = snake.newDir;
		snake.newHead();
		if (snake.head.x == food.x && snake.head.y == food.y)
			food = null
		else
			snake.popTail();
	}

	if (!snake.isDead())
		requestAnimationFrame(update);
	else
		gameOver();
};


function gameOver() {
	let length = 1;
	let bodyPart = snake.head;
	while (bodyPart = bodyPart.next)
		++length;
	document.getElementById('gameOverText').innerHTML = 'Length: ' + length
}

document.getElementById('playBtn').addEventListener('click', playGame)

// Listen for left and right arrow keys
document.addEventListener('keydown', event => {
	switch (event.keyCode) {
		case 37:
			snake.newDir = (snake.dir + 1) % 4
			break;
		case 39:
			snake.newDir = (snake.dir + 3) % 4
			break;
	}
});
