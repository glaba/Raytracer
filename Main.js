$(function() {
	var canvas = document.getElementById("rayTracerCanvas");
	canvas.width = 1000;
	canvas.height = 800;

	tracer = new Raytracer(0, 0, 0, vector(0, 1, 0), vector(-1, 0, 0), [], [new Light(0, 0, 1, 0xFFFFFF)]);
	tracer.render(canvas, 0.01);
});