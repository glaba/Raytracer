function Rectangle(topLeft, topRight, bottomLeft, color, ambientConstant, diffuseConstant) {
	this.topLeft = topLeft;
	this.topRight = topRight;
	this.bottomLeft = bottomLeft;
	this.bottomRight = {};
	vAdd(bottomLeft, vSub(topRight, topLeft, {}), this.bottomRight);

	// Calculate normal
	var v1 = {};
	var v2 = {};
	vSub(topRight, topLeft, v1);
	vSub(bottomLeft, topLeft, v2);
	this.normal = {};
	unit(cross(v1, v2, this.normal));
	this.origin = topLeft;

	this.color = color;
	this.ambientConstant = ambientConstant;
	this.diffuseConstant = diffuseConstant;

	this.curPoint = {};
	this.totalColor = {x: 0, y: 0, z: 0};
	this.curRayDirection = vector(0, 0, 0);
	this.lightVector = vector(0, 0, 0);
	this.curColor = vector(0, 0, 0);
	this.curIntersectionPoint = vector(0, 0, 0);
	this.intersectsRayAngle1 = vector(0, 0, 0);
	this.intersectsRayAngle2 = vector(0, 0, 0);
	this.rayIntermediate = vector(0, 0, 0);
};
/**
 * Returns the color at a point on the rectangle
 *
 * @param x, y, z The coordinate of the point on the rectangle
 * @param visibleLights The lights in the scene
 * @param objects The other objects in the scene
 * @param originatingNormal The normal vector on the Rectangle pointing closer to the direction of the camera (of the 2 options)
 * @param thisObjectIndex The index of this Rectangle in the objects array
 */
Rectangle.prototype.getColorAt = function(x, y, z, visibleLights, objects, originatingNormal, thisObjectIndex) {
	vMult(this.color, this.ambientConstant, this.totalColor);
	this.curPoint.x = x;
	this.curPoint.y = y;
	this.curPoint.z = z;

	// Diffuse reflection
	for (var i = 0; i < visibleLights.length; i++) {
		// Check if the path from the point to the light is blocked by an object
		var blocked = false;
		for (var j = 0; j < objects.length; j++) {
			if (j != thisObjectIndex) {					
				this.curRayDirection.x = visibleLights[i].x - x;
				this.curRayDirection.y = visibleLights[i].y - y;
				this.curRayDirection.z = visibleLights[i].z - z;
				var intersection = objects[j].intersectsRay(this.curPoint, this.curRayDirection);
				if (intersection) {
					var intersectionDistance = distance(intersection.x, intersection.y, intersection.z, x, y, z);
					var lightDistance = distance(visibleLights[i].x, visibleLights[i].y, visibleLights[i].z, x, y, z);
					if (intersectionDistance < lightDistance) {
						blocked = true;
						break;
					}
				}
			}
		}
		if (blocked)
			continue;

		vSub(visibleLights[i], this.curPoint, this.lightVector);
		var dotProduct = dot(this.lightVector, originatingNormal);
		if (dotProduct > 0) {
			var lightCoefficient = dotProduct / magnitude(this.lightVector) / magnitude(originatingNormal);		
			vAdd(this.totalColor, vMult(this.color, visibleLights[i].intensity * lightCoefficient, this.curColor), this.totalColor);
		} else {
			// Light is on the other side of the object, cannot be viewed
			continue;
		}
	}
	return this.totalColor;
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
	var t = dot(this.normal, vSub(this.origin, origin, this.rayIntermediate)) / dot(this.normal, direction);
	vAdd(origin, vMult(direction, t, direction), this.curIntersectionPoint);
	
	if (t > 0 &&
		floatEq(angle(vSub(this.curIntersectionPoint, this.topLeft, this.intersectsRayAngle1), vSub(this.topRight, this.topLeft, this.intersectsRayAngle2)) +
	                angle(vSub(this.curIntersectionPoint, this.topLeft, this.intersectsRayAngle1), vSub(this.bottomLeft, this.topLeft, this.intersectsRayAngle2)), 
	            angle(vSub(this.topRight, this.topLeft, this.intersectsRayAngle1), vSub(this.bottomLeft, this.topLeft, this.intersectsRayAngle2))) &&
		floatEq(angle(vSub(this.curIntersectionPoint, this.bottomRight, this.intersectsRayAngle1), vSub(this.topRight, this.bottomRight, this.intersectsRayAngle2)) +
	                angle(vSub(this.curIntersectionPoint, this.bottomRight, this.intersectsRayAngle1), vSub(this.bottomLeft, this.bottomRight, this.intersectsRayAngle2)), 
	            angle(vSub(this.topRight, this.bottomRight, this.intersectsRayAngle1), vSub(this.bottomLeft, this.bottomRight, this.intersectsRayAngle2)))) {

		return this.curIntersectionPoint;
	} else {
		return null;
	}
};