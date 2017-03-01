function Rectangle(tlX, tlY, tlZ, brX, brY, brZ, ambientColor, diffuseColor, ambientConstant, diffuseConstant) {
	this.tlX = tlX;
	this.tlY = tlY;
	this.tlZ = tlZ;
	this.brX = brX;
	this.brY = brY;
	this.brZ = brZ;
	this.ambientColor = ambientColor;
	this.diffuseColor = diffuseColor;
	this.ambientConstant = ambientConstant;
	this.diffuseConstant = diffuseConstant;
};

Rectangle.prototype.getColorAt = function(x, y, visibleLights, ) {

};