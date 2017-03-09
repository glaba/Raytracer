var maze;
var canvas;
var tempCanvas;
var FACTOR = 10;
var workers;

$(function() {
	canvas = document.getElementById("rayTracerCanvas");
	canvas.width = 1000 / FACTOR;
	canvas.height = 800 / FACTOR;

	tempCanvas = document.createElement('canvas');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;

	maze = new Maze(3, 3);
	var mazeRectangles = maze.createRectangles();
	mazeRectangles.push([vector(-100, -100, -1), vector(100, -100, -1), vector(-100, 100, -1), vector(255, 0, 0), 0.1, 0.9]);

	var movingForward = false;
	var movingBackward = false;
	var turningLeft = false;
	var turningRight = false;
	var movingUpward = false;
	var movingDownward = false;
	var turningUpward = false;
	var turningDownward = false;
	var sendCameraPositionChanges = function() {
		for (var i = 0; i < 4; i++) {
			workers[i].postMessage({W: "moveCamera", movingForward: movingForward,
													 movingBackward: movingBackward,
													 turningLeft: turningLeft,
													 turningRight: turningRight,
													 movingUpward: movingUpward,
													 movingDownward: movingDownward,
													 turningUpward: turningUpward,
													 turningDownward: turningDownward});
		}
	};

	workers = [];
	var currentTick = [];
	for (var i = 0; i < 4; i++) {
		workers.push(new Worker("Worker.js"));
		currentTick.push(0);
		workers[i].onmessage = function(curWorkerIndex) {
			return function(event) {
				var data = event.data;

				if (data.W == "msg") {
					console.log(data.msg);
					return;
				}

				// Otherwise, data contains: xMin, xMax, yMin, yMax, and the output buffer

				var context = tempCanvas.getContext("2d");
				var image = context.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

				for (var x = 0; x < data.xMax - data.xMin; x++) {
					for (var y = 0; y < data.yMax - data.yMin; y++) {
						for (var j = 0; j < 4; j++) {
							image.data[4 * ((y + data.yMin) * tempCanvas.width + (x + data.xMin)) + j] = data.outputBuffer[4 * (y * (data.xMax - data.xMin) + x) + j];
						}
					}
				}

				context.putImageData(image, 0, 0);
				canvas.getContext("2d").drawImage(tempCanvas, 0, 0);

				currentTick[curWorkerIndex]++;
				for (var j = 1; j < 4; j++) {
					if (currentTick[j] != currentTick[j - 1])
						return;
				}

				// All ticks are aligned, send all workers the good to go command
				for (var j = 0; j < 4; j++) {
					workers[j].postMessage({W: "calc"});
				}
			};
		}(i);
	}

	workers[0].postMessage({W: "init", cameraX: 0, cameraY: -5, cameraZ: 0, width: canvas.width, height: canvas.height,
                                       cameraDirection: unit(vector(0, 5, 0)), cameraLeft: unit(vector(-5, 0, 0)),
                                       objects: mazeRectangles,
                                       scaleFactor: 0.001 * FACTOR,
                                       lights: [{x: 0, y: -5, z: 0, intensity: 1}],
                                       xMin: 0, xMax: canvas.width / 2, yMin: 0, yMax: canvas.height / 2});
	workers[1].postMessage({W: "init", cameraX: 0, cameraY: -5, cameraZ: 0, width: canvas.width, height: canvas.height,
                                       cameraDirection: unit(vector(0, 5, 0)), cameraLeft: unit(vector(-5, 0, 0)),
                                       objects: mazeRectangles,
                                       scaleFactor: 0.001 * FACTOR,
                                       lights: [{x: 0, y: -5, z: 0, intensity: 1}],
                                       xMin: 0, xMax: canvas.width / 2, yMin: canvas.height / 2, yMax: canvas.height});
	workers[2].postMessage({W: "init", cameraX: 0, cameraY: -5, cameraZ: 0, width: canvas.width, height: canvas.height,
                                       cameraDirection: unit(vector(0, 5, 0)), cameraLeft: unit(vector(-5, 0, 0)),
                                       objects: mazeRectangles,
                                       scaleFactor: 0.001 * FACTOR,
                                       lights: [{x: 0, y: -5, z: 0, intensity: 1}],
                                       xMin: canvas.width / 2, xMax: canvas.width, yMin: 0, yMax: canvas.height / 2});
	workers[3].postMessage({W: "init", cameraX: 0, cameraY: -5, cameraZ: 0, width: canvas.width, height: canvas.height,
                                       cameraDirection: unit(vector(0, 5, 0)), cameraLeft: unit(vector(-5, 0, 0)),
                                       objects: mazeRectangles,
                                       scaleFactor: 0.001 * FACTOR,
                                       lights: [{x: 0, y: -5, z: 0, intensity: 1}],
                                       xMin: canvas.width / 2, xMax: canvas.width, yMin: canvas.height / 2, yMax: canvas.height});

	for (var i = 0; i < 4; i++) {
		workers[i].postMessage({W: "calc"});
	}

	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 38) {
			movingForward = true;
		} else if (e.keyCode == 40) {
			movingBackward = true;
		} else if (e.keyCode == 37) {
			turningLeft = true;
		} else if (e.keyCode == 39) {
			turningRight = true;
		} else if (e.keyCode == 16) {
			movingUpward = true;
		} else if (e.keyCode == 17) {
			movingDownward = true;
		} else if (e.keyCode == 97) {
			turningUpward = true;
		} else if (e.keyCode == 96) {
			turningDownward = true;
		} else {
			return;
		}
		sendCameraPositionChanges();
	}, false);

	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 38) {
			movingForward = false;
		} else if (e.keyCode == 40) {
			movingBackward = false;
		} else if (e.keyCode == 37) {
			turningLeft = false;
		} else if (e.keyCode == 39) {
			turningRight = false;
		} else if (e.keyCode == 16) {
			movingUpward = false; 
		} else if (e.keyCode == 17) {
			movingDownward = false;
		} else if (e.keyCode == 97) {
			turningUpward = false; 
		} else if (e.keyCode == 96) {
			turningDownward = false;
		} else {
			return;
		}
		sendCameraPositionChanges();
	}, false);
});