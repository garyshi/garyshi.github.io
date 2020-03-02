var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var canvas = document.createElement('canvas');
canvas.id = "canvas";
canvas.setAttribute('width', bodyWidth);
canvas.setAttribute('height', bodyHeight);
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
var canvas_width = ctx.canvas.clientWidth;
var canvas_height = ctx.canvas.clientHeight;
console.log("Canvas width: " + canvas_width + ", height: " + canvas_height);

var createGrid = function(num_rows, num_cols) {
	var grid = Array();
	for (var i = 0; i < num_rows; i++) {
		var row = Array();
		for (var j = 0; j < num_cols; j++) {
			var v = 0;
			if (Math.random() >= 0.8) v = 1;
			row.push(v);
		}
		grid.push(row);
	}
	return grid;
}

var Grid = function(num_rows, num_cols) {
	this.num_rows = num_rows;
	this.num_cols = num_cols;
	this.data = createGrid(num_rows, num_cols);
	console.log("Grid created. Rows: " + this.data.length + ", cols: " + this.data[0].length);

	this.get_value = function(row, col) {
		while (row < 0) row += this.num_rows;
		while (col < 0) col += this.num_cols;
		row = row % this.num_rows;
		col = col % this.num_cols;
		return this.data[row][col];
	}

	this.update = function() {
		var new_data = Array();
		for (var i = 0; i < this.num_rows; i++) {
			var new_row = Array();
			for (var j = 0; j < this.num_cols; j++) {
				var s = (this.get_value(i-1,j-1) + this.get_value(i-1,j) + this.get_value(i-1,j+1) +
					 this.get_value(i,j-1) + this.get_value(i,j+1) +
					 this.get_value(i+1,j-1) + this.get_value(i+1,j) + this.get_value(i+1,j+1))
				if (s >= 3 && s <= 7) v = 1;
				else v = 0;
				new_row.push(v);

			}
			new_data.push(new_row);
		}
		this.data = new_data;
	}

	this.render = function(ctx) {
		for (var i = 0; i < this.num_rows; i++) {
			for (var j = 0; j < this.num_cols; j++) {
				var v = this.data[i][j];
				if (v == 0) ctx.fillStyle = '#000000';
				else ctx.fillStyle = '#ffffff';
				ctx.fillRect(j*grid_size, i*grid_size, grid_size, grid_size);
			}
		}
	}
}

var updateFrame = function() {
	if(ctx.resetTransform) ctx.resetTransform();
	else canvas.width = canvas.width;
	ctx.clearRect(0, 0, canvas_width, canvas_height);

	console.log("Update frame: 0, 0, " + canvas_width + ", " + canvas_height);
	grid.update();
	grid.render(ctx);
}


var grid_size = 20;
var grid_rows = Math.floor(canvas_height / grid_size);
var grid_cols = Math.floor(canvas_width / grid_size);
var grid = new Grid(grid_rows, grid_cols);
window.setInterval(updateFrame, 330);
