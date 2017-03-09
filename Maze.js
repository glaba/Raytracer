function Maze(width, height) {
	// For purposes of this project, use a pre-generated maze that is 5x5
	this.width = 6;
	this.height = 6;
	this.elements = [];
	for (var x = 0; x < this.width; x++) {
		this.elements.push([]);
		for (var y = 0; y < this.height; y++) {
			this.elements[x].push({bottomBlocked: false, rightBlocked: false});
		}
	}
	// Tens place represents bottom blocked, ones place represents rightblocked
	/*var mazeObject = [
		[10, 10, 10, 10, 01],
		[00, 10, 10, 10, 11],
		[10, 01, 10, 00, 01],
		[01, 10, 10, 11, 00],
		[10, 10, 10, 10, 11],
	]*/
	var mazeObject = [
		[00, 00, 01, 01, 01, 01],
		[10, 00, 01, 01, 01, 10],
		[10, 01, 10, 00, 01, 11],
		[10, 01, 11, 01, 01, 10],
		[10, 01, 00, 01, 01, 11],
		[10, 01, 01, 01, 01, 01]
	];
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			if ((mazeObject[x][y] / 10) % 10 >= 1) {
				this.elements[x][y].bottomBlocked = true;
			}
			if ((mazeObject[x][y] % 10 >= 1)) {
				this.elements[x][y].rightBlocked = true;
			}
		}
	}
}

// Returns an array of arrays containing the rectangle initialization parameters
Maze.prototype.createRectangles = function() {
	var rectangles = [];
	for (var x_ = 0; x_ < this.width; x_ += 1) {
		for (var y_ = 0; y_ < this.height; y_ += 1) {
			var x = x_ * 4
			var y = y_ * 4
			if (this.elements[x_][y_].bottomBlocked) {
				rectangles.push([vector(x, y + 4, 1), vector(x + 4, y + 4, 1), vector(x, y + 4, -1), vector(Math.random() * 500, Math.random() * 500, Math.random() * 500), 0.1, 0.9]);
			}
			if (this.elements[x_][y_].rightBlocked) {
				rectangles.push([vector(x + 4, y + 4, 1), vector(x + 4, y, 1), vector(x + 4, y + 4, -1), vector(Math.random() * 500, Math.random() * 500, Math.random() * 500), 0.1, 0.9]);
			}
		}
	}

	return rectangles;
};