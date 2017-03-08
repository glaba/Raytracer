function Maze(width, height) {
	this.width = width;
	this.height = height;
	this.elements = [];
	for (var x = 0; x < width; x++) {
		this.elements.push([]);
		for (var y = 0; y < height; y++) {
			this.elements[x].push({bottomBlocked: true, rightBlocked: true});
		}
	}

	// Random generate a path through the maze
	 
}

Maze.prototype.createRectangles = function() {

};