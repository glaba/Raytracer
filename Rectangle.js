function Rectangle(topLeft, topRight, bottomLeft, color, ambientConstant, diffuseConstant) {
	this.topLeft = topLeft;
	this.topRight = topRight;
	this.bottomLeft = bottomLeft;
	this.bottomRight = vAdd(bottomLeft, vSub(topRight, topLeft));

	this.normal = unit(cross(vSub(topRight, topLeft), vSub(bottomLeft, topLeft)));
	this.origin = topLeft;

	this.color = color;
	this.ambientConstant = ambientConstant;
	this.diffuseConstant = diffuseConstant;
};
/**
 * Returns the color at a point on the rectangle
 *
 * @param x, y, z The coordinate of the point on the rectangle
 * @param visibleLights The lights in the scene
 * @param objects The other objects in the scene
 * @param originatingNormal The normal vector on the Rectangle pointing closer to the direction of the camera (of the 2 options)
 */
Rectangle.prototype.getColorAt = function(x, y, z, visibleLights, objects, originatingNormal) {
	return this.color;
	var curColor = vMult(this.color, ambientConstant);

	// Diffuse reflection
	for (var i = 0; i < visibleLights.length; i++) {
		// Check if the path from the point to the light is blocked by an object
		for (var j = 0; j < objects.length; j++) {
			if (objects[j].intersectsRay(vector(x, y, z), vector(visibleLights.x - x, visibleLights.y - y, visibleLights.z - z))) {
				continue;
			}
		}

		var lightVector = vSub(vector(visibleLights[i].x, visibleLights[i].y, visibleLights[i].z), vector(x, y, z));
		var dotProduct = dot(lightVector, originatingNormal);
		if (dotProduct > 0) {
			var lightAngle = dotProduct / magnitude(lightVector) / magnitude(originatingNormal);
			//curColor = vAdd(curColor, vMult(this.color * visibleLights[i].intensity * (lightAngle / )))
		} else {
			continue;
		}
	}
};

Rectangle.prototype.getNormalAt = function(x, y, z) {
	return this.normal;
}

/**
 * Checks if a ray intersects with the plane
 * 
 * @param origin The origin of the ray
 * @param direction The direction vector of the ray
 * 
 * @return Either null or a vector containing the intersection
 */
Rectangle.prototype.intersectsRay = function(origin, direction) {
	var t = dot(this.normal, vSub(this.origin, origin)) / dot(this.normal, direction);
	var intersectionPoint = vAdd(origin, vMult(direction, t));

	if (t > 0 &&
		floatEq(angle(vSub(intersectionPoint, this.topLeft), vSub(this.topRight, this.topLeft)) +
	                angle(vSub(intersectionPoint, this.topLeft), vSub(this.bottomLeft, this.topLeft)), 
	            angle(vSub(this.topRight, this.topLeft), vSub(this.bottomLeft, this.topLeft))) &&
		floatEq(angle(vSub(intersectionPoint, this.bottomRight), vSub(this.topRight, this.bottomRight)) +
	                angle(vSub(intersectionPoint, this.bottomRight), vSub(this.bottomLeft, this.bottomRight)), 
	            angle(vSub(this.topRight, this.bottomRight), vSub(this.bottomLeft, this.bottomRight)))) {

		return intersectionPoint;
	} else {
		return null;
	}
};