self.importScripts("Raytracer.js", "Rectangle.js", "Functions.js");

var log = function(msg) {
	postMessage({W: "msg", msg: msg});
};

var tracer;

self.onmessage = function(event) {
	var data = event.data;
	if (data.W == "init") {
		var parsedObjects = [];
		for (var i = 0; i < data.objects.length; i++) {
			// Assume the objects are all rectangles
			var curRect = new Rectangle(...data.objects[i]);
			parsedObjects.push(curRect);
		}

		tracer = new Raytracer(data.cameraX, data.cameraY, data.cameraZ,
			                   data.cameraDirection, data.cameraLeft,
			                   parsedObjects,
			                   data.lights,
			                   data.scaleFactor, data.width, data.height,
			                   data.xMin, data.xMax, data.yMin, data.yMax);
	} else if (data.W == "calc") {
		tracer.outputBuffer = data.outputBuffer;
		tracer.calculate();
		var output = {xMin: tracer.xMin, xMax: tracer.xMax,
		             yMin: tracer.yMin, yMax: tracer.yMax,
		             outputBuffer: tracer.outputBuffer};
		postMessage(output, [output.outputBuffer.buffer]);
	} else if (data.W == "moveCamera") {
		tracer.movingForward = data.movingForward;
		tracer.movingBackward = data.movingBackward;
		tracer.turningLeft = data.turningLeft;
		tracer.turningRight = data.turningRight;
		tracer.movingUpward = data.movingUpward;
		tracer.movingDownward = data.movingDownward;
		tracer.turningUpward = data.turningUpward;
		tracer.turningDownward = data.turningDownward;
	}
};
