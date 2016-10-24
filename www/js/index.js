var defaultShaderType = [
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
];

function error(msg) {
    console.error(msg);
}

// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         // var parentElement = document.getElementById(id);
//         // var listeningElement = parentElement.querySelector('.listening');
//         // var receivedElement = parentElement.querySelector('.received');
//         //
//         // listeningElement.setAttribute('style', 'display:none;');
//         // receivedElement.setAttribute('style', 'display:block;');
//         //
//         // console.log('Received Event: ' + id);
//     }
// };

//app.initialize();

function getWebGlContext (canvas) {
    this._gl = null;
    try {
        this._gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (err) {
        var errorElement = document.getElementById('glfail');
        errorElement.innerHTML = "webgl failed";
        throw new Error('Could not initialise WebGL (' + err.message + ')');
        return null;
    }
    if (!this._gl) {
        var errorElement = document.getElementById('glfail');
        errorElement.innerHTML = "webgl failed";
        throw new Error('Could not initialise WebGL, sorry :-(');
        return null;
    }
    //var errorElement = document.getElementById('glfail');
    //errorElement.innerHTML = "webgl pass";
    return this._gl;
};

function logAndValidate(functionName, args) {
    logGLCall(functionName, args);
    validateNoneOfTheArgsAreUndefined (functionName, args);
}

function logGLCall(functionName, args) {
    console.log("gl." + functionName + "(" +
        WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};

function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for (var ii = 0; ii < args.length; ++ii) {
        if (args[ii] === undefined) {
            console.error("undefined passed to this._gl." + functionName + "(" +
                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
        }
    }
}

function WebGlRenderer() {
	this._gl = null;
	this._programs = {};
	this._currentProgram = null;
	this._canvas = null;
	this._vertexLocation = null;    // TODO: refactor shader related stuff into it's own object
	this._texCoordLocation = null;
	this._colorMulLocation = null;
	this._colorAddLocation = null;
}

WebGlRenderer.prototype.load = function () {
	this._canvas = document.getElementById("glCanvas");
	this._gl = getWebGlContext(this._canvas);
	//var this._gl = WebGLDebugUtils.makeDebugContext(realGl, throwOnGLError, logAndValidate);

	this._preparePrograms();

	var program = this._programs.box; //TODO : some kind of selector
	this._gl.useProgram(program);

	this._verifyAttribLocations(program);
	this._verifyVertexAttribArray(program);

	this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
};

WebGlRenderer.prototype._preparePrograms = function () {
	for (var shaderGroupId in shaderGroups) {
		var shaderGroup = shaderGroups[shaderGroupId];
		var vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
		var fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		this.compileShader(vertexShader, shaderGroup.vertex.script);
		this.compileShader(fragmentShader, shaderGroup.fragment.script);
		var program = this._programs[shaderGroupId] = this._gl.createProgram();

		this._gl.attachShader(program, vertexShader);
		this._gl.attachShader(program, fragmentShader);
		this._gl.linkProgram(program);
		if (!this._gl.getProgramParameter(program, this._gl.LINK_STATUS)) {
			// Something went wrong with the link
			var error = this._gl.getProgramInfoLog(program);
			this._gl.deleteProgram(program);
			throw new Error('Error linking the program:' + error);
		}
	}
};

WebGlRenderer.prototype.compileShader = function (shader, shaderScript) {
	this._gl.shaderSource(shader, shaderScript);
	this._gl.compileShader(shader);

	if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
		throw new Error(this._gl.getShaderInfoLog(shader));
	}
};

WebGlRenderer.prototype._verifyVertexAttribArray = function () {
	var vertexAttribArray = this._gl.enableVertexAttribArray(this._vertexLocation);
	if (vertexAttribArray === -1) {
		console.error("enableVertexAttribArray this._vertexLocation");
	}
	var texCoordAttribArray = this._gl.enableVertexAttribArray(this._texCoordLocation);
	if (texCoordAttribArray === -1) {
		console.error("enableVertexAttribArray texCoordLocation");
	}
	var colorMulAtribArray = this._gl.enableVertexAttribArray(this._colorMulLocation);
	if (colorMulAtribArray === -1) {
		console.error("enableVertexAttribArray colorMulLocation");
	}
	var colorAddAttribArray = this._gl.enableVertexAttribArray(this._colorAddLocation);
	if (colorAddAttribArray === -1) {
		console.error("enableVertexAttribArray colorAddLocation");
	}
};

WebGlRenderer.prototype._verifyAttribLocations = function (program) {
	this._vertexLocation = this._gl.getAttribLocation(program, 'a_position');
	if (this._vertexLocation === -1) {
		console.error("getAttribLocation this._vertexLocation");
	}
	this._texCoordLocation = this._gl.getAttribLocation(program, 'a_texCoord');
	if (this._texCoordLocation === -1) {
		console.error("getAttribLocation this._texCoordLocation");
	}
	this._colorMulLocation = this._gl.getAttribLocation(program, 'a_colorMul');
	if (this._colorMulLocation === -1) {
		console.error("getAttribLocation colorMulLocation");
	}
	this._colorAddLocation = this._gl.getAttribLocation(program, 'a_colorAdd');
	if (this._colorAddLocation === -1) {
		console.error("getAttribLocation colorAddLocation");
	}
};

WebGlRenderer.prototype.draw = function () {
	var mat4UniformLoc = this._gl.getUniformLocation(this._currentProgram, "u_Matrix");

	this._gl.uniformMatrix4fv(
		mat4UniformLoc,
		false,
		[
			1 / this._canvas.width,  0,  -1,  0,
			0,  -1 / this._canvas.height,  1,  0,
			1,  1,  1,  0,
			0,  0,  0,  0
		]);

	var floatSize = 4;
	var shortSize = 2;
	var byteSize  = 1;

	var nbPosComponents = 2;
	var nbTexComponents = 2;
	var nbColComponents = 8;

	this._vertexSize = floatSize * nbPosComponents + shortSize * nbTexComponents + byteSize * nbColComponents;

	var buffer = this._gl.createBuffer();
	this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

	this._gl.vertexAttribPointer(this._vertexLocation,   2, this._gl.FLOAT,          false, this._vertexSize, 0);
	this._gl.vertexAttribPointer(this._texCoordLocation, 2, this._gl.UNSIGNED_SHORT, true,  this._vertexSize, 2 * floatSize);
	this._gl.vertexAttribPointer(this._colorMulLocation, 4, this._gl.BYTE,           true,  this._vertexSize, 2 * floatSize + 2 * shortSize);
	this._gl.vertexAttribPointer(this._colorAddLocation, 4, this._gl.BYTE,           true,  this._vertexSize, 2 * floatSize + 2 * shortSize + 4 * byteSize);

	this._gl.lineWidth = 4;
	var lines = createLineBatch();

	this._gl.bufferData(
		this._gl.ARRAY_BUFFER,
		lines._positions,
		this._gl.STATIC_DRAW);


	this._gl.clearColor(1, 0.5, 0.5, 3);
	this._gl.clear(this._gl.COLOR_BUFFER_BIT);

	this._gl.drawArrays(this._gl.LINES, 0, lines.numVerticies);
};

var renderer = new WebGlRenderer();
renderer.load();
renderer.draw();