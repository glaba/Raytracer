/**
 * Initializes the raytracer
 *
 * @param cameraX The X coordinate of the focal point of the camera
 * @param cameraY The Y coordinate of the focal point of the camera
 * @param cameraZ the Z coordinate of the focal point of the camera
 * @param cameraDirection A vector containing X, Y, and Z components indicating the direction and length of the frame buffer from the focal point
 * @param cameraLeft A vector going from the center of the frame buffer to the middle left corner of the frame buffer (magnitude not important, it will be normalized)
 * @param objects An array of objects (of type Rectangle, etc) in the scene
 * @param lights An array of light sources in the scene
 */
function Raytracer(cameraX, cameraY, cameraZ, cameraDirection, cameraLeft, objects, lights, scaleFactor, width, height, xMin, xMax, yMin, yMax) {
	this.cameraOrigin = vector(cameraX, cameraY, cameraZ);
	this.cameraLeft = {};
	this.cameraTop = {};
	this.updateCoordinateAxes(cameraDirection, cameraLeft);
	this.objects = objects;
	this.lights = lights;
	this.scaleFactor = scaleFactor;
	// Number of pixels in camera
	this.width = width;
	this.height = height;

	this.xMin = xMin;
	this.yMin = yMin;
	this.xMax = xMax;
	this.yMax = yMax;

	this.frameBuffer = vector(0, 0, 0);
	this.newCameraDirection = vector(0, 0, 0);
	this.newCameraLeft = vector(0, 0, 0);
	//this.renderFunction = this.render.bind(this);
	this.lateralMotionVector = vector(0, 0, 0);
	this.verticalMotionVector = vector(0, 0, 0);
	this.curCameraRayDirection = vector(0, 0, 0); 
	this.closestDirectionVector = vector(0, 0, 0);
	this.collisionCheckDirectionVector = vector(0, 0, 0);
	this.previousLocation = vector(0, 0, 0);
}

/**
 * Renders the current scene to a specified canvas
 * 
 * @param canvas The context to render to
 * @param scaleFactor The number of units in the camera rectangle per one pixel in the canvas (a value of 0.1 would create a 100x80 rectangle for a 1000x800 canvas)
 */
Raytracer.prototype.calculate = function() {
	vMult(unit(this.cameraLeft), this.scaleFactor, this.cameraLeft);
	vMult(unit(this.cameraTop), this.scaleFactor, this.cameraTop);

	for (var i = 0; i < this.outputBuffer.length; i++) {
		if ((i + 1) % 4 == 0)
			this.outputBuffer[i] = 255;
		else
			this.outputBuffer[i] = 0;
	}

	for (var x = this.xMin; x < this.xMax; x++) {
		for (var y = this.yMin; y < this.yMax; y++) {
			var frameBufferX = this.cameraOrigin.x + this.cameraDirection.x - this.cameraLeft.x * (x - (this.width - 1) / 2) - this.cameraTop.x * (y - (this.height - 1) / 2);
			var frameBufferY = this.cameraOrigin.y + this.cameraDirection.y - this.cameraLeft.y * (x - (this.width - 1) / 2) - this.cameraTop.y * (y - (this.height - 1) / 2);
			var frameBufferZ = this.cameraOrigin.z + this.cameraDirection.z - this.cameraLeft.z * (x - (this.width - 1) / 2) - this.cameraTop.z * (y - (this.height - 1) / 2);

			this.frameBuffer.x = frameBufferX;
			this.frameBuffer.y = frameBufferY;
			this.frameBuffer.z = frameBufferZ;

			var closestObjectIndex = -1;
			var closestObjectIntersection = null;
			var closestObjectDistance = 100000;
			for (var i = 0; i < this.objects.length; i++) {
				vSub(this.frameBuffer, this.cameraOrigin, this.curCameraRayDirection);
				var rayIntersection = this.objects[i].intersectsRay(this.cameraOrigin, this.curCameraRayDirection);

				if (rayIntersection) {
					var dist = distance(this.cameraOrigin.x, this.cameraOrigin.y, this.cameraOrigin.z, rayIntersection.x, rayIntersection.y, rayIntersection.z);
					if (dist < closestObjectDistance) {
						closestObjectDistance = dist;
						closestObjectIndex = i;
						closestObjectIntersection = rayIntersection;
						vSub(this.frameBuffer, this.cameraOrigin, this.closestDirectionVector);
					}
				}
			}

			if (closestObjectIndex >= 0) {
				var originatingNormal = this.objects[closestObjectIndex].getNormalAt(closestObjectIntersection.x, closestObjectIntersection.y, closestObjectIntersection.z);
				if (dot(originatingNormal, this.closestDirectionVector) > 0) {
					originatingNormal = vMult(originatingNormal, -1, originatingNormal);
				}

				var color = this.objects[closestObjectIndex].getColorAt(closestObjectIntersection.x, closestObjectIntersection.y, closestObjectIntersection.z, this.lights, this.objects, originatingNormal, closestObjectIndex);
				var pixelIndex = Math.floor(y - this.yMin) * (this.xMax - this.xMin) + Math.floor(x - this.xMin);
				this.outputBuffer[4 * pixelIndex + 0] = color.x;
				this.outputBuffer[4 * pixelIndex + 1] = color.y;
				this.outputBuffer[4 * pixelIndex + 2] = color.z;
				this.outputBuffer[4 * pixelIndex + 3] = 255;
			}
		}
	}

	this.moveCamera(true);
};

Raytracer.prototype.moveCamera = function(collides) {
	copyVector(this.cameraOrigin, this.previousLocation);
	if (this.movingForward) {
		vAdd(this.cameraOrigin, vMult(this.cameraDirection, 0.3, this.lateralMotionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.lateralMotionVector, this.lights[0]);
	}
	if (this.movingBackward) {
		vAdd(this.cameraOrigin, vMult(this.cameraDirection, -0.3, this.lateralMotionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.lateralMotionVector, this.lights[0]);
	}
	if (this.movingUpward) {
		unit(this.cameraTop);
		vAdd(this.cameraOrigin, vMult(this.cameraTop, 0.5, this.verticalMotionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.verticalMotionVector, this.lights[0]);
	}
	if (this.movingDownward) {
		unit(this.cameraTop);
		vAdd(this.cameraOrigin, vMult(this.cameraTop, -0.5, this.verticalMotionVector), this.cameraOrigin);
		vAdd(this.lights[0], this.verticalMotionVector, this.lights[0]);
	}
	if (this.movingForward || this.movingBackward || this.movingUpward || this.movingDownward) {
		// Check collision: camera is not allowed to intersect with any rectangles, if it does, undo the movement
		for (var i = 0; i < this.objects.length; i++) {
			// If the camera was on one side of the rectangle and now it's on the other, undo the movement
			var ray1Intersects, ray2Intersects;
			vSub(this.cameraOrigin, this.previousLocation, this.collisionCheckDirectionVector);
			ray1Intersects = this.objects[i].intersectsRay(this.previousLocation, this.collisionCheckDirectionVector);
			vSub(this.previousLocation, this.cameraOrigin, this.collisionCheckDirectionVector);
			ray2Intersects = this.objects[i].intersectsRay(this.cameraOrigin, this.collisionCheckDirectionVector);
			if (ray1Intersects && ray2Intersects) {
				copyVector(this.previousLocation, this.cameraOrigin);
				copyVector(this.previousLocation, this.lights[0]);
			}
		}
	}

	var curAngle = Math.atan2(this.cameraDirection.y, this.cameraDirection.x);
	var curVerticalAngle = Math.asin(this.cameraDirection.z);
	if (this.turningLeft) {
		curAngle += 0.05;
	}
	if (this.turningRight) {
		curAngle -= 0.05;
	}
	if (this.turningUpward) {
		curVerticalAngle += 0.05;
	}
	if (this.turningDownward) {
		curVerticalAngle -= 0.05;
	}
	if (this.turningLeft || this.turningRight || this.turningUpward || this.turningDownward) {
		this.newCameraDirection.x = Math.cos(curAngle);
		this.newCameraDirection.y = Math.sin(curAngle);
		this.newCameraDirection.z = Math.sin(curVerticalAngle);
		this.newCameraLeft.x = -Math.sin(curAngle);
		this.newCameraLeft.y = Math.cos(curAngle);
		this.updateCoordinateAxes(this.newCameraDirection, this.newCameraLeft);
	}
};

Raytracer.prototype.updateCoordinateAxes = function(direction, cameraLeft) {
	this.cameraDirection = direction;
	this.cameraLeft = cameraLeft;
	unit(this.cameraLeft);
	unit(cross(direction, cameraLeft, this.cameraTop));
};