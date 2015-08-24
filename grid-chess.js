var drawLine = function(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var fillCircle = function(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fill();
};


var GridChess = function(canvas_element) {
    this.num_rows = 7;
    this.num_cols = 7;
    this.grid_size = 40;
    this.chessman_rows = 2;
    this.active_row = this.active_col = -1;
    this.turn = 2;  // 1 means up-side move, 2 means down-side move.
    this.move_mode = 0;  // 0 means wait 1st click, 1 means wait 2nd click.
    this.ctx = canvas_element.getContext("2d");
    this.InitGrid();
};

GridChess.prototype.OnClick = function(e) {
    var row = -1, col = -1;
    var grid_width = this.grid_size * this.num_cols;
    var grid_height = this.grid_size * this.num_rows;
    var margin_left = Math.floor((this.ctx.canvas.clientWidth - grid_width) / 2);
    var margin_top = Math.floor((this.ctx.canvas.clientHeight - grid_height) / 2);
    if (e.clientX >= margin_left && e.clientX < margin_left + grid_width) {
        col = Math.floor((e.clientX - margin_left) / this.grid_size);
    }
    if (e.clientY >= margin_top && e.clientY < margin_top + grid_height) {
        row = Math.floor((e.clientY - margin_top) / this.grid_size);
    }
    console.log("OnClick: row=" + row + ", col=" + col);
    if (row >= 0 && col >= 0) {
        switch (this.move_mode) {
            case 0:
                // Initiate move when we are moving our own chess.
                if (this.grid[row][col] == this.turn || this.grid[row][col] == this.turn + 2) {
                    this.active_row = row; this.active_col = col;
                    this.move_mode = 1;
                }
                break;
            case 1:
                if (this.ProcessMove(this.active_row, this.active_col, row, col)) {
                    this.turn = 3 - this.turn;
                    this.active_row = this.active_col = -1;
                    this.move_mode = 0;
                } else {
                    this.active_row = this.active_col = -1;
                    this.move_mode = 0;
                }
                break;
        }
    }
    this.Render();
};

GridChess.prototype.OwnedBy = function(row, col, owner) {
    return (this.grid[row][col] == owner || this.grid[row][col] == owner + 2);
};

GridChess.prototype.CheckMove = function(from_row, from_col, to_row, to_col) {
    console.log("CheckMove from(" + from_row + ", " + from_col + ") to (" + to_row + ", " + to_col + ")");
    // Must be within the chessboard.
    if (from_row < 0 || from_row >= this.num_rows || to_row < 0 || to_row >= this.num_rows) return false;
    if (from_col < 0 || from_col >= this.num_cols || to_col < 0 || to_col >= this.num_cols) return false;
    console.log("Is in the chessboard");
    // Must be moving our own chess.
    if (!this.OwnedBy(from_row, from_col, this.turn)) return false;
    console.log("Is moving our own chess");
    // Target cell must be empty.
    if (this.grid[to_row][to_col] != 0) return false;
    console.log("Target cell is empty");
    // Move direction check for uni-directional chessman.
    if (this.grid[from_row][from_col] < 3) {
        if (this.turn == 1 && to_row <= from_row) return false;
        if (this.turn == 2 && to_row >= from_row) return false;
        console.log("Direction is okay");
    }
    // Either an adjacent move.
    if ((to_row == from_row - 1 && to_col == from_col - 1) ||
        (to_row == from_row - 1 && to_col == from_col + 1) ||
        (to_row == from_row + 1 && to_col == from_col - 1) ||
        (to_row == from_row + 1 && to_col == from_col + 1)) return true;
    console.log("Not an adjacent move");
    // Or an adjacent kill.
    var peer = 3 - this.turn;
    if ((to_row == from_row - 2 && to_col == from_col - 2 && this.OwnedBy(from_row-1, from_col-1, peer)) ||
        (to_row == from_row - 2 && to_col == from_col + 2 && this.OwnedBy(from_row-1, from_col+1, peer)) ||
        (to_row == from_row + 2 && to_col == from_col - 2 && this.OwnedBy(from_row+1, from_col-1, peer)) ||
        (to_row == from_row + 2 && to_col == from_col + 2 && this.OwnedBy(from_row+1, from_col+1, peer))) {
        return true;
    }
    console.log("Not an adjacent kill");
    return false;
};

GridChess.prototype.ProcessMove = function(from_row, from_col, to_row, to_col) {
    if (!this.CheckMove(from_row, from_col, to_row, to_col)) return false;
    // Change status.
    this.grid[to_row][to_col] = this.grid[from_row][from_col];
    this.grid[from_row][from_col] = 0;
    // Kill peer's chessman.
    if (to_row == from_row - 2 && to_col == from_col - 2) {
        this.grid[from_row-1][from_col-1] = 0;
    } else if (to_row == from_row - 2 && to_col == from_col + 2) {
        this.grid[from_row-1][from_col+1] = 0;
    } else if (to_row == from_row + 2 && to_col == from_col - 2) {
        this.grid[from_row+1][from_col-1] = 0;
    } else if (to_row == from_row + 2 && to_col == from_col + 2) {
        this.grid[from_row+1][from_col+1] = 0;
    }
    // Promote.
    if (this.grid[to_row][to_col] < 3) {
        if ((this.turn == 1 && to_row == this.num_rows - 1) ||
            (this.turn == 2 && to_row == 0)) {
            this.grid[to_row][to_col] += 2;
        }
    }
    return true;
};

GridChess.prototype.InitGrid = function() {
    var i, j, value;
    this.grid = [];
    for (i = 0; i < this.num_rows; i++) {
        var row = [];
        for (j = 0; j < this.num_cols; j++) {
            if (i < this.chessman_rows && (i + j) % 2 == 0) value = 1;
            else if (i >= (this.num_rows - this.chessman_rows) && (i + j) % 2 == 0) value = 2;
            else value = 0;
            row.push(value);
        }
        this.grid.push(row);
    }
};

GridChess.prototype.Render = function() {
    var ctx = this.ctx;
    var i, j, x, y;
    var grid_width = this.grid_size * this.num_cols;
    var grid_height = this.grid_size * this.num_rows;
    var margin_left = Math.floor((ctx.canvas.clientWidth - grid_width) / 2);
    var margin_top = Math.floor((ctx.canvas.clientHeight - grid_height) / 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(margin_left, margin_top, grid_width, grid_height);
    for (i = 0; i < this.num_rows; i++) {
        for (j = 0; j < this.num_cols; j++) {
            x = margin_left + j * this.grid_size;
            y = margin_top + i * this.grid_size;
            if ((i + j) % 2 == 0) {
                ctx.fillStyle = '#000';
                if (i == this.active_row && j == this.active_col) ctx.fillStyle = '#ff0';
                ctx.fillRect(x, y, this.grid_size, this.grid_size);
            }
            switch (this.grid[i][j]) {
                case 1:
                    ctx.fillStyle = '#a00';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/2);
                    break;
                case 2:
                    ctx.fillStyle = '#0a0';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/2);
                    break;
                case 3:
                    ctx.fillStyle = '#a00';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/2);
                    ctx.fillStyle = '#fff';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/3);
                    ctx.fillStyle = '#a00';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/4);
                    break;
                case 4:
                    ctx.fillStyle = '#0a0';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/2);
                    ctx.fillStyle = '#fff';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/3);
                    ctx.fillStyle = '#0a0';
                    fillCircle(ctx, x+this.grid_size/2, y+this.grid_size/2, this.grid_size/4);
                    break;
            }
        }
    }

    switch (this.turn) {
        case 1:
            ctx.fillStyle = '#a00';
            ctx.fillText('RED TURN', margin_left + this.grid_size*2, margin_top - 10);
            break;
        case 2:
            ctx.fillStyle = '#0a0';
            ctx.fillText('GREEN TURN', margin_left + this.grid_size*2, margin_top + grid_height + 20);
            break;
    }
};

var element = document.createElement("canvas");
element.id = "canvas";
element.setAttribute("width", document.body.clientWidth);
element.setAttribute("height", document.body.clientHeight);
document.body.appendChild(element);

var game = new GridChess(element);
element.addEventListener("click", function(e) { game.OnClick(e); }, false);
game.Render();
