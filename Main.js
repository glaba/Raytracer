
var tracer;
var canvas;
var tempCanvas;
var FACTOR = 8;

$(function() {
	canvas = document.getElementById("rayTracerCanvas");
	canvas.width = 1000 / FACTOR;
	canvas.height = 800 / FACTOR;

	var rectangles = [new Rectangle(vector(-1, 1, 1), vector(1, 1, 1), vector(-1, 1, -1), vector(0, 0, 200), 0.1, 0.9),
	                  new Rectangle(vector(-1, -1, 1), vector(1, -1, 1), vector(-1, -1, -1), vector(0, 200, 0), 0.1, 0.9),
	                  new Rectangle(vector(-100, -100, -1), vector(100, -100, -1), vector(-100, 100, -1), vector(200, 0, 0), 0.1, 0.9)];
	tracer = new Raytracer(0, -5, 0, unit(vector(0, 5, 0)), unit(vector(-5, 0, 0)), rectangles, [new Light(0, -5, 0, 1)]);

	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 38) {
			tracer.movingForward = true;
		} else if (e.keyCode == 40) {
			tracer.movingBackward = true;
		} else if (e.keyCode == 37) {
			tracer.turningLeft = true;
		} else if (e.keyCode == 39) {
			tracer.turningRight = true;
		}
	}, false);

	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 38) {
			tracer.movingForward = false;
		} else if (e.keyCode == 40) {
			tracer.movingBackward = false;
		} else if (e.keyCode == 37) {
			tracer.turningLeft = false;
		} else if (e.keyCode == 39) {
			tracer.turningRight = false;
		}
	}, false);

	tempCanvas = document.createElement('canvas');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	tracer.render(tempCanvas, 0.001 * FACTOR, canvas.width, canvas.height);
	renderLoop();
});

var renderLoop = function() {
	canvas.getContext("2d").drawImage(tempCanvas, 0, 0);
	requestAnimationFrame(renderLoop);
};