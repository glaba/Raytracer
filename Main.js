var tracer;

$(function() {
	var canvas = document.getElementById("rayTracerCanvas");
	canvas.width = 250;
	canvas.height = 200;

	var rectangles = [new Rectangle(vector(-1, 1, 1), vector(1, 1, 1), vector(-1, 1, -1), vector(0, 0, 200), 0.3, 0.7),
	                  new Rectangle(vector(0, 0, 1), vector(1, 0, 1), vector(0, 0, -1), vector(0, 200, 0), 0.3, 0.7)];
	tracer = new Raytracer(0, -5, 0, unit(vector(0, 5, 0)), unit(vector(-5, 0, 0)), rectangles, [new Light(0, 0.5, 0, 1)]);

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	tracer.render(tempCanvas, canvas, 0.004, canvas.width, canvas.height);
});