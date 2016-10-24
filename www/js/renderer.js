function createProgram(gl, vertexShader, fragmentShader, uniforms) {
	// Creating the program
	var programBinder = gl.createProgram();
	gl.attachShader(programBinder, vertexShader);
	gl.attachShader(programBinder, fragmentShader);
	gl.linkProgram(programBinder);

	// Check the link status
	if (!gl.getProgramParameter(programBinder, gl.LINK_STATUS)) {
		// Something went wrong with the link
		var error = gl.getProgramInfoLog(programBinder);
		gl.deleteProgram(programBinder);
		throw new Error('Error linking the program:' + error);
	}

	gl.useProgram(programBinder);

	// Shader attributes
	var vertexLocation   = gl.getAttribLocation(programBinder, 'a_position');
	var texCoordLocation = gl.getAttribLocation(programBinder, 'a_texCoord');
	var colorMulLocation = gl.getAttribLocation(programBinder, 'a_colorMul');
	var colorAddLocation = gl.getAttribLocation(programBinder, 'a_colorAdd');

	gl.enableVertexAttribArray(vertexLocation);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.enableVertexAttribArray(colorMulLocation);
	gl.enableVertexAttribArray(colorAddLocation);

	var floatSize = 4;
	var shortSize = 2;
	var byteSize  = 1;

	gl.vertexAttribPointer(vertexLocation,   2, gl.FLOAT,          false, this._vertexSize, 0);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.UNSIGNED_SHORT, true,  this._vertexSize, 2 * floatSize);
	gl.vertexAttribPointer(colorMulLocation, 4, gl.BYTE,           true,  this._vertexSize, 2 * floatSize + 2 * shortSize);
	gl.vertexAttribPointer(colorAddLocation, 4, gl.BYTE,           true,  this._vertexSize,
		2 * floatSize + 2 * shortSize + 4 * byteSize);

	var program = {
		binder:             programBinder,
		vertexLocation:     vertexLocation,
		texCoordLocation:   texCoordLocation,
		colorMulLocation:   colorMulLocation,
		colorAddLocation:   colorAddLocation
	};

	// Adding shader uniforms
	for (var u = 0; u < uniforms.length; u += 1) {
		var uniformData     = uniforms[u];
		var uniformLocation = gl.getUniformLocation(programBinder, uniformData.variable);

		if (uniformData.textureIdx) {
			gl.uniform1i(uniformLocation, uniformData.textureIdx);
		}
		program[uniformData.id] = uniformLocation;
	}

	return program;
}