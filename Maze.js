function Maze(width, height) {
	this.width = width;
	this.height = height;
	this.elements = [];
	for (var x = 0; x < width; x++) {
		this.elements.push([]);
		for (var y = 0; y < height; y++) {
			this.elements[x].push({bottomBlocked: (Math.random() > 0), rightBlocked: (Math.random() > 0)});
		}
	}

	// Random generate a path through the maze
	
}

// Returns an array of arrays containing the rectangle initialization parameters
Maze.prototype.createRectangles = function() {
	var rectangles = [];
	for (var x_ = 0; x_ < this.width; x_ += 1) {
		for (var y_ = 0; y_ < this.height; y_ += 1) {
			var x = x_ * 2
			var y = y_ * 2
			if (this.elements[x_][y_].bottomBlocked) {
				rectangles.push([vector(x, y + 2, 1), vector(x + 2, y + 2, 1), vector(x, y + 2, -1), vector(Math.random() * 500, Math.random() * 500, Math.random() * 500), 0.1, 0.9]);
			}
			if (this.elements[x_][y_].rightBlocked) {
				rectangles.push([vector(x + 2, y + 2, 1), vector(x + 2, y, 1), vector(x + 2, y + 2, -1), vector(Math.random() * 500, Math.random() * 500, Math.random() * 500), 0.1, 0.9]);
			}
		}
	}
	return rectangles;
};