/**
 * Initializes the raytracer
 *
 * @param cameraX The X coordinate of the focal point of the camera
 * @param cameraY The Y coordinate of the focal point of the camera
 * @param cameraZ the Z coordinate of the focal point of the camera
 * @param cameraDirection A vector containing X, Y, and Z components indicating the direction and length of the frame buffer from the focal point
 * @param cameraLeft A vector going from the center of the frame buffer to the middle left corner of the frame buffer (magnitude not important, it will be normalized)
 * @param rectangles An array of rectangles (of type Rectangle) in the scene
 * @param lights An array of light sources (of type Light) in the scene
 */
function Raytracer(cameraX, cameraY, cameraZ, cameraDirection, cameraLeft, rectangles, lights) {
	this.cameraX = cameraX;
	this.cameraY = cameraY;
	this.cameraZ = cameraZ;
	this.cameraDirection = cameraDirection;
	this.cameraLeft = unit(cameraLeft);
	this.cameraTop = unit(cross(cameraDirection, cameraLeft));
	this.rectangles = rectangles;
	this.lights = lights;
}

/**
 * Renders the current scene to a specified canvas
 * 
 * @param canvas The canvas to render to
 * @param scaleFactor The number of units in the camera rectangle per one pixel in the canvas (a value of 0.1 would create a 100x80 rectangle for a 1000x800 canvas)
 */
Raytracer.prototype.render = function(canvas, scaleFactor) {
	this.cameraLeft = vMult(this.cameraLeft, scaleFactor);
	this.cameraTop = vMult(this.cameraTop, scaleFactor);

	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
			var frameBufferX = this.cameraX + this.cameraDirection.x - this.cameraLeft.x * (x - (canvas.width - 1) / 2) - this.cameraTop.x * (y - (canvas.height - 1) / 2);
			var frameBufferY = this.cameraY + this.cameraDirection.y - this.cameraLeft.y * (x - (canvas.width - 1) / 2) - this.cameraTop.y * (y - (canvas.height - 1) / 2);
			var frameBufferZ = this.cameraZ + this.cameraDirection.z - this.cameraLeft.z * (x - (canvas.width - 1) / 2) - this.cameraTop.z * (y - (canvas.height - 1) / 2);


			//console.log(x + ", " + y + ": " + frameBufferX + ", " + frameBufferY + ", " + frameBufferZ);
		}
	}
};