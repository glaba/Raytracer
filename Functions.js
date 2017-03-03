var magnitude = function(a) {
	return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z); 
};

var distance = function(x1, y1, z1, x2, y2, z2) {
	return magnitude({x: x2 - x1, y: y2 - y1, z: z2 - z1});
};

var vDiv = function(a, b) {
	var c = {};
	c.x = a.x / b;
	c.y = a.y / b;
	c.z = a.z / b;
	return c;
};

var vMult = function(a, b) {
	var c = {};
	c.x = a.x * b;
	c.y = a.y * b;
	c.z = a.z * b;
	return c;
};

var vAdd = function(a, b) {
	var c = {};
	c.x = a.x + b.x;
	c.y = a.y + b.y;
	c.z = a.z + b.z;
	return c;
}

var vSub = function(a, b) {
	var c = {};
	c.x = a.x - b.x;
	c.y = a.y - b.y;
	c.z = a.z - b.z;
	return c;
};

var unit = function(a) {
	return vDiv(a, magnitude(a));
};

var dot = function(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

var cross = function(a, b) {
	var c = {};
	c.x = a.y * b.z - a.z * b.y;
	c.y = a.z * b.x - a.x * b.z;
	c.z = a.x * b.y - a.y * b.x;
	return c;
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