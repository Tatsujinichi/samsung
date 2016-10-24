function FighterIndicator(x, y) {
	var floatSize = 4;
	var shortSize = 2;
	var byteSize  = 1;

	var nbPosComponents = 2;
	var nbTexComponents = 2;
	var nbColComponents = 8;

	this._vertexSize = floatSize * nbPosComponents + shortSize * nbTexComponents + byteSize * nbColComponents;
	this._spriteSize = 6 * this._vertexSize;
	this._lineSize   = 2 * this._vertexSize;
	this._boxSize    = 6 * this._vertexSize;

	this.numVerticies = 12;
	this._indicatorByteSize = this._vertexSize * this.numVerticies;

	this._buffer = new ArrayBuffer(this._indicatorByteSize);
	this._vertexBuffer = new Float32Array(this._buffer);
	this._colorBuffer = new Uint32Array(this._buffer);

	this.red = 1.0;
	this.green = 1.0;
	this.blue = 0.0;
	this.alpha = 1.0;
	this.sx = 1;
	this.sy = 1;
	this.rotation = Math.PI;

	this.loadIndicator(x, y);
}

FighterIndicator.prototype.loadIndicator = function (x, y) {
	this._x0 = -4.0;
	this._y0 = 6.0;

	this._x1 = -4.0;
	this._y1 = 4.0;

	this._x2 = 0.0;
	this._y2 = 6.0;

	this._x3 = 0.0;
	this._y3 = 0.0;

	this._x4 = 4.0;
	this._y4 = 6.0;

	this._x5 = 4.0;
	this._y5 = 4.0;
	
	this._x0 = this._x0 * this.sx + x;
	this._x1 = this._x1 * this.sx + x;
	this._x2 = this._x2 * this.sx + x;
	this._x3 = this._x3 * this.sx + x;
	this._x4 = this._x4 * this.sx + x;
	this._x5 = this._x5 * this.sx + x;

	this._y0 = this._y0 * this.sy + y;
	this._y1 = this._y1 * this.sy + y;
	this._y2 = this._y2 * this.sy + y;
	this._y3 = this._y3 * this.sy + y;
	this._y4 = this._y4 * this.sy + y;
	this._y5 = this._y5 * this.sy + y;

	console.groupCollapsed("indicator");
	console.error(this._x0);
	console.error(this._x1);
	console.error(this._x2);
	console.error(this._x3);
	console.error(this._x4);
	console.error(this._x5);

	console.error(this._y0);
	console.error(this._y1);
	console.error(this._y2);
	console.error(this._y3);
	console.error(this._y4);
	console.error(this._y5);
	console.groupEnd();

	var r = Math.max(-128, Math.min(127, this.red * 64));
	var g = Math.max(-128, Math.min(127, this.green * 64));
	var b = Math.max(-128, Math.min(127, this.blue * 64));
	var a = Math.max(-128, Math.min(127, this.alpha * 64));
	var color = ((a << 24) & 0xff000000) + ((b << 16) & 0xff0000) + ((g << 8) & 0xff00) + (r & 0xff);

	// triangle 0

	this._vertexBuffer[0] = this._x2;
	this._vertexBuffer[1] = this._y2;
	this._colorBuffer[3] = color;

	this._vertexBuffer[5] = this._x0;
	this._vertexBuffer[6] = this._y0;
	this._colorBuffer[8] = color;

	this._vertexBuffer[10] = this._x1;
	this._vertexBuffer[11] = this._y1;
	this._colorBuffer[13] = color;

	// triangle 1

	this._vertexBuffer[15] = this._x2;
	this._vertexBuffer[16] = this._y2;
	this._colorBuffer[18] = color;

	this._vertexBuffer[20] = this._x1;
	this._vertexBuffer[21] = this._y1;
	this._colorBuffer[23] = color;

	this._vertexBuffer[25] = this._x3;
	this._vertexBuffer[26] = this._y3;
	this._colorBuffer[28] = color;

	// triangle 2

	this._vertexBuffer[30] = this._x2;
	this._vertexBuffer[31] = this._y2;
	this._colorBuffer[33] = color;

	this._vertexBuffer[35] = this._x3;
	this._vertexBuffer[36] = this._y3;
	this._colorBuffer[38] = color;

	this._vertexBuffer[40] = this._x5;
	this._vertexBuffer[41] = this._y5;
	this._colorBuffer[43] = color;

	// triangle 3

	this._vertexBuffer[45] = this._x2;
	this._vertexBuffer[46] = this._y2;
	this._colorBuffer[48] = color;

	this._vertexBuffer[50] = this._x5;
	this._vertexBuffer[51] = this._y5;
	this._colorBuffer[53] = color;

	this._vertexBuffer[55] = this._x4;
	this._vertexBuffer[56] = this._y4;
	this._colorBuffer[58] = color;

	this._bbox = [];
	this._bbox[0] = Math.min(this._x0, this._x1, this._x2, this._x3, this._x4, this._x5);
	this._bbox[1] = Math.max(this._x0, this._x1, this._x2, this._x3, this._x4, this._x5);
	this._bbox[2] = Math.min(this._y0, this._y1, this._y2, this._y3, this._y4, this._y5);
	this._bbox[3] = Math.max(this._y0, this._y1, this._y2, this._y3, this._y4, this._y5);

};