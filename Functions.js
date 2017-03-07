var magnitude = function(a) {
	return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z); 
};

var distance = function(x1, y1, z1, x2, y2, z2) {
	return magnitude({x: x2 - x1, y: y2 - y1, z: z2 - z1});
};

var vDiv = function(a, b, result) {
	result.x = a.x / b;
	result.y = a.y / b;
	result.z = a.z / b;
	return result;
};

var vMult = function(a, b, result) {
	result.x = a.x * b;
	result.y = a.y * b;
	result.z = a.z * b;
	return result;
};

var vAdd = function(a, b, result) {
	result.x = a.x + b.x;
	result.y = a.y + b.y;
	result.z = a.z + b.z;
	return result;
}

var vSub = function(a, b, result) {
	result.x = a.x - b.x;
	result.y = a.y - b.y;
	result.z = a.z - b.z;
	return result;
};

var unit = function(a) {
	return vDiv(a, magnitude(a), a);
};

var dot = function(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

var cross = function(a, b, result) {
	result.x = a.y * b.z - a.z * b.y;
	result.y = a.z * b.x - a.x * b.z;
	result.z = a.x * b.y - a.y * b.x;
	return result;
};

var vector = function(x, y, z) {
	return {x: x, y: y, z: z};
};

var angle = function(a, b) {
	return Math.acos(dot(a, b) / magnitude(a) / magnitude(b));
};

var floatEq = function(a, b) {
	if (Math.abs(a - b) < 0.001) {
		return true;
	} else {
		return false;
	}
};