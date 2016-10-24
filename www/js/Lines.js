var NB_CELLS = 560;

var CELL_WIDTH  = 86;
var CELL_HEIGHT = 43;


var CELL_HALF_WIDTH      = CELL_WIDTH / 2;
var CELL_HALF_HEIGHT     = CELL_HEIGHT / 2;

var COLOR_GRID_LINE           = [0.8, 0.8, 0.8, 0.8];

function Line(x0, y0, x1, y1) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
}

function LineBatch(params) {
	var floatSize = 4;
	var shortSize = 2;
	var byteSize  = 1;

	var nbPosComponents = 2;
	var nbTexComponents = 2;
	var nbColComponents = 8;

	this._vertexSize = floatSize * nbPosComponents + shortSize * nbTexComponents + byteSize * nbColComponents;
	//this._spriteSize = 6 * this._vertexSize;
	this._lineSize   = 2 * this._vertexSize;
	//this._boxSize    = 6 * this._vertexSize;

	this._lines        = params.lines;
	this._lineWidth    = params.lineWidth;
	this._lineByteSize = this._lineSize;

	this.numVerticies = this._lines.length * 2;

	this._createVertexBuffer();
}

LineBatch.prototype._createVertexBuffer = function () {
	var nLines = this._lines.length;

	this._vertexBuffer = new ArrayBuffer(nLines * this._lineByteSize);
	this._positions    = new Float32Array(this._vertexBuffer);
	this._colorView    = new Uint32Array(this._vertexBuffer);

	for (var l = 0; l < nLines; l += 1) {
		var line = this._lines[l];

		var lineBuffPos = l * this._lineByteSize / 4;

		// Position of the line in the scene
		this._positions[lineBuffPos + 0] = line.x0;
		this._positions[lineBuffPos + 1] = line.y0;

		this._positions[lineBuffPos + 5] = line.x1;
		this._positions[lineBuffPos + 6] = line.y1;

		// Color multipliers set to 1
		// 0x40404040 === (64 << 24) + (64 << 16) + (64 << 8) + 64 where 64 corresponds to a color multiplier of 1
		this._colorView[lineBuffPos + 3] = this._colorView[lineBuffPos + 8] = 0x404040FF;
	}
};

var atouin = {};

function getCellCoord(cellId) {
	var x = cellId % 14;
	var y = Math.floor(cellId / 14);
	x += (y % 2) * 0.5;

	return {
		x: x * CELL_WIDTH,
		y: y * 0.5 * CELL_HEIGHT
	};
}

function constructCellCoordMap() {
	var coordinates = [];
	for (var i = 0; i < 560; i += 1) {
		coordinates.push(getCellCoord(i));
	}
	return coordinates;
}

atouin.cellCoord = constructCellCoordMap();

function createLineBatch () {
	var existingLines = {};

	var gridLines = [];
	//var grayBoxes = [];
    for (var cellId = 0; cellId < NB_CELLS; cellId++) {
        var coord = getCellCoord(cellId);

        var x0 = coord.x;
        var x1 = x0 - CELL_HALF_WIDTH;
        var x2 = x0 + CELL_HALF_WIDTH;

        var y0 = coord.y - 22;
        var y1 = y0 + CELL_HALF_HEIGHT;
        var y2 = y0 + CELL_HEIGHT;

        var lineId0 = x0 + '.' + y0 + '-' + x2 + '.' + y1;
        var lineId1 = x0 + '.' + y2 + '-' + x2 + '.' + y1;
        var lineId2 = x0 + '.' + y2 + '-' + x1 + '.' + y1;
        var lineId3 = x0 + '.' + y0 + '-' + x1 + '.' + y1;

        if (existingLines[lineId0] === undefined) {
            existingLines[lineId0] = true;
            gridLines.push(new Line(x0, y0, x2, y1));
        }

        if (existingLines[lineId1] === undefined) {
            existingLines[lineId1] = true;
            gridLines.push(new Line(x2, y1, x0, y2));
        }

        if (existingLines[lineId2] === undefined) {
            existingLines[lineId2] = true;
            gridLines.push(new Line(x0, y2, x1, y1));
        }

        if (existingLines[lineId3] === undefined) {
            existingLines[lineId3] = true;
            gridLines.push(new Line(x1, y1, x0, y0));
        }
        // var box = new Box(x0, y0, x2, y1, x0, y2, x1, y1);
        // box.cellId = cellId;
        // greyBoxes.push(box);
    }

	var retLines = new LineBatch({
        x: 0,
        y: 0,
        lines: gridLines,
        lineWidth: 2,
    });

	return retLines;
}