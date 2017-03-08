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
	this.cameraOrigin = vector(cameraX, cameraY, cameraZ);
	this.cameraLeft = {};
	this.cameraTop = {};
	this.updateCoordinateAxes(cameraDirection, cameraLeft);
	this.objects = objects;
	this.lights = lights;

	this.frameBuffer = vector(0, 0, 0);
	this.newCameraDirection = vector(0, 0, 0);
	this.newCameraLeft = vector(0, 0, 0);
	this.renderFunction = this.render.bind(this);
	this.motionVector = vector(0, 0, 0);
}

/**
 * Renders the current scene to a specified canvas
 * 
 * @param canvas The context to render to
 * @param scaleFactor The number of units in the camera rectangle per one pixel in the canvas (a value of 0.1 would create a 100x80 rectangle for a 1000x800 canvas)
 */
Raytracer.prototype.render = function(tempCanvas, scaleFactor, width, height) {
	tempCanvas.width = width;
	tempCanvas.height = height;
	var context = tempCanvas.getContext("2d");
	context.fillStyle = "#000000";
	context.fillRect(0, 0, width, height);
	
	vMult(unit(this.cameraLeft), scaleFactor, this.cameraLeft);
	vMult(unit(this.cameraTop), scaleFactor, this.cameraTop);

	var image = context.getImageData(0, 0, width, height);
	var imageData = image.data;

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var frameBufferX = this.cameraOrigin.x + this.cameraDirection.x - this.cameraLeft.x * (x - (width - 1) / 2) - this.cameraTop.x * (y - (height - 1) / 2);
			var frameBufferY = this.cameraOrigin.y + this.cameraDirection.y - this.cameraLeft.y * (x - (width - 1) / 2) - this.cameraTop.y * (y - (height - 1) / 2);
			var frameBufferZ = this.cameraOrigin.z + this.cameraDirection.z - this.cameraLeft.z * (x - (width - 1) / 2) - this.cameraTop.z * (y - (height - 1) / 2);

			var curDirection = {}; 
			this.frameBuffer.x = frameBufferX;
			this.frameBuffer.y = frameBufferY;
			this.frameBuffer.z = frameBufferZ;

			var closestObjectIndex = -1;
			var closestObjectIntersection = null;
			var closestObjectDistance = 100000;
			for (var i = 0; i < this.objects.length; i++) {
				vSub(this.frameBuffer, this.cameraOrigin, curDirection);
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
				var originatingNormal = this.objects[closestObjectIndex].getNormalAt(closestObjectIntersection.x, closestObjectIntersection.y, closestObjectIntersection.z);
				if (dot(originatingNormal, curDirection) > 0) {
					originatingNormal = vMult(originatingNormal, -1, originatingNormal);
				}

				var color = this.objects[closestObjectIndex].getColorAt(closestObjectIntersection.x, closestObjectIntersection.y, closestObjectIntersection.z, this.lights, this.objects, originatingNormal, closestObjectIndex);
				var pixelIndex = Math.floor(y) * width + Math.floor(x);
				imageData[4 * pixelIndex + 0] = color.x;
				imageData[4 * pixelIndex + 1] = color.y;
				imageData[4 * pixelIndex + 2] = color.z;
				imageData[4 * pixelIndex + 3] = 255;
			}
		}
	}

	context.putImageData(image, 0, 0);

	/*this.angle += Math.PI / 16;
	this.cameraX = 5 * Math.cos(this.angle);
	this.cameraY = 5 * Math.sin(this.angle);
	this.cameraZ = 0;
	this.cameraOrigin.x = this.cameraX;
	this.cameraOrigin.y = this.cameraY;
	this.cameraOrigin.z = this.cameraZ;
	this.updateCoordinateAxes(setVector(this.newCameraDirection, -Math.cos(this.angle), -Math.sin(this.angle), 0), setVector(this.newCameraLeft, Math.sin(this.angle), -Math.cos(this.angle), 0));
	*/

	if (this.movingForward) {
		vAdd(this.cameraOrigin, vMult(this.cameraDirection, 0.1, this.motionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.motionVector, this.lights[0]);
	}
	if (this.movingBackward) {
		vAdd(this.cameraOrigin, vMult(this.cameraDirection, -0.1, this.motionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.motionVector, this.lights[0]);
	}
	if (this.turningLeft) {
		var curAngle = Math.atan2(this.cameraDirection.y, this.cameraDirection.x);
		curAngle += 0.03;
		this.updateCoordinateAxes(setVector(this.newCameraDirection, Math.cos(curAngle), Math.sin(curAngle), 0), 
			                 setVector(this.newCameraLeft, -Math.sin(curAngle), Math.cos(curAngle), 0));
	}
	if (this.turningRight) {
		var curAngle = Math.atan2(this.cameraDirection.y, this.cameraDirection.x);
		curAngle -= 0.03;
		this.updateCoordinateAxes(setVector(this.newCameraDirection, Math.cos(curAngle), Math.sin(curAngle), 0), 
			                 setVector(this.newCameraLeft, -Math.sin(curAngle), Math.cos(curAngle), 0));
	}

	setTimeout(this.render.bind(this, tempCanvas, scaleFactor, width, height), 0);
};

Raytracer.prototype.updateCoordinateAxes = function(direction, cameraLeft) {
	this.cameraDirection = direction;
	this.cameraLeft = cameraLeft;
	unit(this.cameraLeft);
	unit(cross(direction, cameraLeft, this.cameraTop));
};