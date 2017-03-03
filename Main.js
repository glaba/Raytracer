$(function() {
	var canvas = document.getElementById("rayTracerCanvas");
	canvas.width = 250;
	canvas.height = 200;

	var rectangles = [new Rectangle(vector(-1, 1, 1), vector(1, 1, 1), vector(-1, 1, -1), vector(200, 0, 200), 0.1, 0.9)];
	var tracer = new Raytracer(0, -5, 0, vector(0, 1, 0), vector(-1, 0, 0), rectangles, [new Light(0, 0, 1, 0xFFFFFF)]);
	tracer.render(canvas, 0.004);
});