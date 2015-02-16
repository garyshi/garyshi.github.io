var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas_width = ctx.canvas.clientWidth;
var canvas_height = ctx.canvas.clientHeight;
console.log("Canvas width: " + canvas_width + ", height: " + canvas_height);

var drawBird = function(ctx, head_size, body_size, tail_size, wing_span, wing_sweep) {
	// Draw the head
	ctx.beginPath();
	ctx.moveTo(0, head_size*1.3);
	ctx.lineTo(-head_size*0.15, head_size*0.9);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, head_size*1.3);
	ctx.lineTo(head_size*0.15, head_size*0.9);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(0, head_size/2, head_size/2, 0, 2*Math.PI);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(head_size*0.2, head_size*0.7, head_size*0.1, 0, 2*Math.PI);
	ctx.fill();
	
	// Draw the wing
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.bezierCurveTo(-wing_span*0.7, 0,
		              -wing_span, -(body_size+(1-0.6)*wing_sweep),
	                  -wing_span, -(body_size+wing_sweep));
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.bezierCurveTo(wing_span*0.7, 0,
		              wing_span, -(body_size+(1-0.6)*wing_sweep),
	                  wing_span, -(body_size+wing_sweep));
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(0, -body_size);
	ctx.bezierCurveTo(-wing_span*0.4, -body_size,
		              -wing_span, -(body_size+(1-0.3)*wing_sweep),
	                  -wing_span, -(body_size+wing_sweep));
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, -body_size);
	ctx.bezierCurveTo(wing_span*0.4, -body_size,
		              wing_span, -(body_size+(1-0.3)*wing_sweep),
	                  wing_span, -(body_size+wing_sweep));
	ctx.stroke();

	// Draw the tail
	ctx.beginPath();
	ctx.moveTo(0, -body_size);
	ctx.lineTo(-tail_size*Math.tan(Math.PI/6), -body_size-tail_size);
	ctx.lineTo(+tail_size*Math.tan(Math.PI/6), -body_size-tail_size);
	ctx.lineTo(0, -body_size);
	ctx.stroke();
}

var Bird = function(x, y, orientation, head_size, body_size, tail_size,
	                wing_span, wing_sweep, wing_sweep_min, wing_sweep_max) {
	this.x = x; this.y = y; this.orientation = orientation;
	this.head_size = head_size; this.body_size = body_size; this.tail_size = tail_size;
	this.wing_span = wing_span; this.wing_sweep = wing_sweep;
	this.wing_sweep_min = wing_sweep_min; this.wing_sweep_max = wing_sweep_max;
	this.wing_move = 1;

	this.update = function(ctx) {
		if (this.x < -this.body_size-Math.max(this.tail_size, this.wing_sweep)) return false;
		if (this.y < -this.body_size-Math.max(this.tail_size, this.wing_sweep)) return false;
		this.x -= (1 + Math.random() * 2) * Math.cos(this.orientation);
		this.y -= (1 + Math.random() * 2) * Math.sin(this.orientation);
		if (this.wing_sweep < this.wing_sweep_min) this.wing_move = 1;
		else if (this.wing_sweep > this.wing_sweep_max) this.wing_move = -1;
		this.wing_span += 1.2 * this.wing_move;
		this.wing_sweep += 2 * this.wing_move;
		ctx.setTransform(1, 0, 0, -1, this.x, this.y);
		ctx.rotate(Math.PI/2 - this.orientation);
		var sweep_ratio = (this.wing_sweep-this.wing_sweep_min)/(this.wing_sweep_max-this.wing_sweep_min);
		var body_size = this.body_size * (1 + 0.2 * sweep_ratio);
		drawBird(ctx, this.head_size, body_size, this.tail_size, this.wing_span, this.wing_sweep);
		return true;
	}
}

var birds = [];
var max_birds = 50;

var spawnBird = function() {
	var good_pos = false;
	var size = 5 * (1 + 4*Math.random());
	for (var i = 0; i < 1 && !good_pos; ++i) {
		good_pos = true;
		var x = canvas_width + 20 + 50 * Math.random();
		var y = canvas_height * (0.2 + Math.random());
		for (var j = 0; j < birds.length; ++j) {
			var b = birds[j];
			if (b != null) {
				var dx = x - b.x;
				var dy = y - b.y;
				var dd = size*2.5 + b.head_size*2.5;
				if (dx*dx+dy*dy < 100 + dd*dd) { good_pos = false; break; }
			}
		}
	}
	if (!good_pos) return null;
	return new Bird(x, y, Math.PI/8, size, size*0.9, size, size*2, size, size*0.67, size*1.33);
}

for (var i = 0; i < max_birds; ++i) {
	birds.push(spawnBird());
}

var updateFrame = function() {
	ctx.resetTransform();
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	for (var i = 0; i < birds.length; ++i) {
		if (birds[i] == null) {
			if (Math.random() < 0.01) birds[i] = spawnBird();
		} else {
			if (!birds[i].update(ctx))
				birds[i] = null;
		}
	}
}

window.setInterval(updateFrame, 33);
