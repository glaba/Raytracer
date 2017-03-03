/**
 * Initializes the raytracer
 *
 * @param cameraX The X coordinate of the focal point of the camera
 * @param cameraY The Y coordinate of the focal point of the camera
 * @param cameraZ the Z coordinate of the focal point of the camera
 * @param cameraDirection A vector containing X, Y, and Z components indicating the direction and length of the frame buffer from the focal point
 * @param cameraLeft A vector going from the center of the frame buffer to the middle left corner of the frame buffer (magnitude not important, it will be normalized)
 * @param objects An array of objects (of type Rectangle, etc) in the scene
 * @param lights An array of light sources (of type Light) in the scene
 */
function Raytracer(cameraX, cameraY, cameraZ, cameraDirection, cameraLeft, objects, lights) {
	this.cameraX = cameraX;
	this.cameraY = cameraY;
	this.cameraZ = cameraZ;
	this.cameraOrigin = vector(cameraX, cameraY, cameraZ);
	this.updateCoordinateAxes(cameraDirection, cameraLeft);
	this.objects = objects;
	this.lights = lights;

	// Temporary
	this.angle = Math.PI / 2;
}

/**
 * Renders the current scene to a specified canvas
 * 
 * @param canvas The canvas to render to
 * @param scaleFactor The number of units in the camera rectangle per one pixel in the canvas (a value of 0.1 would create a 100x80 rectangle for a 1000x800 canvas)
 */
Raytracer.prototype.render = function(canvas, scaleFactor) {
	canvas.getContext("2d").fillStyle = "#000000";
	canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
	this.cameraLeft = vMult(unit(this.cameraLeft), scaleFactor);
	this.cameraTop = vMult(unit(this.cameraTop), scaleFactor);

	var image = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	var imageData = image.data;

	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
			var frameBufferX = this.cameraX + this.cameraDirection.x - this.cameraLeft.x * (x - (canvas.width - 1) / 2) - this.cameraTop.x * (y - (canvas.height - 1) / 2);
			var frameBufferY = this.cameraY + this.cameraDirection.y - this.cameraLeft.y * (x - (canvas.width - 1) / 2) - this.cameraTop.y * (y - (canvas.height - 1) / 2);
			var frameBufferZ = this.cameraZ + this.cameraDirection.z - this.cameraLeft.z * (x - (canvas.width - 1) / 2) - this.cameraTop.z * (y - (canvas.height - 1) / 2);

			var curDirection = vSub(vector(frameBufferX, frameBufferY, frameBufferZ), this.cameraOrigin);

			var closestObjectIndex = -1;
			var closestObjectIntersection = null;
			var closestObjectDistance = 100000;
			for (var i = 0; i < this.objects.length; i++) {
				var rayIntersection = this.objects[i].intersectsRay(this.cameraOrigin, curDirection);

				if (rayIntersection) {
					var dist = distance(this.cameraOrigin.x, this.cameraOrigin.y, this.cameraOrigin.z, rayIntersection.x, rayIntersection.y, rayIntersection.z);
					if (dist < closestObjectDistance) {
						closestObjectDistance = dist;
						closestObjectIndex = i;
						closestObjectIntersection = rayIntersection;
					}
				}
			}

			if (closestObjectIndex >= 0) {
				var originatingNormal = this.objects[closestObjectIndex].getNormalAt(rayIntersection.x, rayIntersection.y, rayIntersection.z);
				if (dot(originatingNormal, curDirection) > 0) {
					originatingNormal = vMult(originatingNormal, -1);
				}

				var color = this.objects[closestObjectIndex].getColorAt(rayIntersection.x, rayIntersection.y, rayIntersection.z, this.lights, this.objects, originatingNormal);
				var pixelIndex = Math.floor(y) * canvas.width + Math.floor(x);
				imageData[4 * pixelIndex + 0] = color.x;
				imageData[4 * pixelIndex + 1] = color.y;
				imageData[4 * pixelIndex + 2] = color.z;
				imageData[4 * pixelIndex + 3] = 255;
			}
		}
	}

	canvas.getContext("2d").putImageData(image, 0, 0)

	this.angle += Math.PI / 24;
	this.angle = this.angle % Math.PI;
	this.updateCoordinateAxes(vector(Math.cos(this.angle), Math.sin(this.angle), 0), vector(Math.cos(this.angle + Math.PI / 2), Math.sin(this.angle + Math.PI / 2), 0));
	setTimeout(() => { this.render(canvas, scaleFactor); }, 0);
};

Raytracer.prototype.updateCoordinateAxes = function(direction, cameraLeft) {
	this.cameraDirection = direction;
	this.cameraLeft = unit(cameraLeft);
	this.cameraTop = unit(cross(direction, cameraLeft));
};