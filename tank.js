var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var canvas = document.createElement('canvas');
canvas.id = "canvas";
canvas.setAttribute('width', bodyWidth);
canvas.setAttribute('height', bodyHeight);
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var drawLine = function(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

var drawGrid = function(ctx, left, right, bottom, top) {
	var i;
	var oldWidth = ctx.lineWidth;
	var oldStyle = ctx.strokeStyle;

	ctx.lineWidth = 2.0 / scale;
	ctx.strokeStyle = "#6060ff";
	drawLine(ctx, left, 0, right, 0);
	drawLine(ctx, 0, bottom, 0, top);
	
	ctx.lineWidth = 1.0 / scale;
	for (i = 0; i > left; i -= 10) drawLine(ctx, i, bottom, i, top);
	for (i = 0; i < right; i += 10) drawLine(ctx, i, bottom, i, top);
	for (i = 0; i > bottom; i -= 10) drawLine(ctx, left, i, right, i);
	for (i = 0; i < top; i += 10) drawLine(ctx, left, i, right, i);

	ctx.lineWidth = oldWidth;
	ctx.strokeStyle = oldStyle;
}

var drawTank = function(ctx) {
	ctx.beginPath();
	ctx.arc(-15, -15, 5, 0, 2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(-5, -15, 5, 0, 2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(5, -15, 5, 0, 2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(15, -15, 5, 0, 2*Math.PI);
	ctx.stroke();
	
	drawLine(ctx, -15, -10+2, 15, -10+2);
	drawLine(ctx, -15, -20-2, 15, -20-2);
	ctx.beginPath();
	ctx.arc(-15, -15, 5+2, Math.PI/2, -Math.PI/2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(15, -15, 5+2, -Math.PI/2, Math.PI/2);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(0, -10+2, 15, 0, Math.PI);
	ctx.stroke();
	
	var oldWidth = ctx.lineWidth;
	var gun_p1_angle = Math.PI / 6;
	var gun_angle = Math.PI / 12;
	var gun_x1 = 0 + 15 * Math.cos(gun_p1_angle);
	var gun_y1 = -10+2 + 15 * Math.sin(gun_p1_angle);
	var gun_x2 = gun_x1 + 25 * Math.cos(gun_angle);
	var gun_y2 = gun_y1 + 25 * Math.sin(gun_angle);
	ctx.lineWidth = 3;
	drawLine(ctx, gun_x1, gun_y1, gun_x2, gun_y2);
	ctx.lineWidth = oldWidth;
}

var scale = 10.0;
var canvas_width = ctx.canvas.clientWidth / scale;
var canvas_height = ctx.canvas.clientHeight / scale;
ctx.setTransform(scale, 0, 0, -scale, ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);
ctx.rotate(Math.PI/2 - this.orientation);
drawGrid(ctx, -canvas_width/2, canvas_width/2, -canvas_height/2, canvas_height/2);
//drawBird(ctx, 10, 10, 10, 16, 10);
drawTank(ctx);
