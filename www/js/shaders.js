var shadersData = {
	vertexLine: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' + // dummy attribute
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' +
		'uniform   mat4 u_Matrix;'   +
		'varying   vec4 v_color;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	vec4 colorMul = a_colorMul * cm * 2.0;' +
		'	vec4 colorAdd = a_colorAdd * cm + ca;'  +
		'	v_color = colorMul + colorAdd;' +
		'	v_color.rgb *= colorMul.a;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z + a_texCoord[0],' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	fragmentLine: {
		type: 'fragment',
		script:
		'varying mediump vec4 v_color;' +
		'void main() {'                    +
		// Applying color addition & Writing pixel
		'	gl_FragColor = v_color;' +
		'}'
	},
	// IMPORTANT!:
	// a_texCoord[0] is being used as a hack here to fix Android's webgl.
	// the compiler optimizes it out if it is not used, and breaks things
	// therefore, this value must always be zero.
	// never use a value other than zero, or the position will be incorrect.
	vertexBox: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' + // dummy attribute
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' +
		'uniform   mat4 u_Matrix;'   +
		'varying mediump vec4 v_color;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	vec4 colorMul = a_colorMul * cm * 2.0;' +
		'	vec4 colorAdd = a_colorAdd * cm + ca;'  +
		'	v_color = colorMul + colorAdd;' +
		'	v_color.rgb *= colorMul.a;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z + a_texCoord[0],' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	fragmentBox: {
		type: 'fragment',
		script:
		'varying mediump vec4 v_color;' +
		'void main() {'                    +
		// Applying color addition & Writing pixel
		'	gl_FragColor = v_color;' +
		'}'
	},
	vertexRegular: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' +
		'uniform   mat4 u_Matrix;'   +
		'varying   vec2 v_texCoord;' +
		'varying   vec4 v_colorMul;' +
		'varying   vec4 v_colorAdd;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	v_texCoord = a_texCoord;' +
		'	v_colorMul = a_colorMul * cm * 2.0;' +
		'	v_colorAdd = a_colorAdd * cm + ca;'  +
		'	v_colorMul.rgb *= v_colorMul.a;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z,' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	fragmentRegular: {
		type: 'fragment',
		script:
		'varying mediump vec2 v_texCoord;' +
		'varying mediump vec4 v_colorMul;' +
		'varying mediump vec4 v_colorAdd;' +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		// Fetching texture color value
		'	mediump vec4 color = texture2D(u_texture, v_texCoord);' +

		// Computing color addition alpha
		'	mediump float colorAddAlpha = v_colorAdd.a * color.a;' +

		// Applying color multiplication
		'	color *= v_colorMul;' +

		// Applying color addition & Writing pixel
		// Depremultiplying by alpha
		'	color.rgb /= color.a;' +

		// Applying color addition
		'	color.rgb += v_colorAdd.rgb;' +
		'	color.a += colorAddAlpha;' +

		// Repremultiplying by alpha
		'	color.rgb *= color.a;' +

		// Bailing out if pixel is almost transparent
		'	if (color.a <= 0.05) { discard; }' +

		'	gl_FragColor = color;' +
		'}'
	},
	vertexRelativeScale: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' + // In this shader a_colorAdd corresponds to an offset (x,y) of the vertex
		'uniform   mat4 u_Matrix;'   +
		'varying   vec2 v_texCoord;' +
		'varying   vec4 v_colorMul;' +
		'varying   vec4 v_colorAdd;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	v_texCoord = a_texCoord;' +
		'	v_colorMul = a_colorMul * cm * 2.0;' +
		'	v_colorAdd = ca;'  + // color addition
		'	v_colorMul.rgb *= v_colorMul.a;' +
		'	float x = a_position.x + tx.w * (a_colorAdd.r * 127.0 + a_colorAdd.g);' +
		'	float y = a_position.y + ty.w * (a_colorAdd.b * 127.0 + a_colorAdd.a);' +
		'	gl_Position = vec4(' +
		'		x * tx.x + y * tx.y + tx.z,' +
		'		x * ty.x + y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	vertexAbsoluteScale: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' + // In this shader a_colorAdd corresponds to an offset (x,y) of the vertex
		'uniform   mat4 u_Matrix;'   +
		'varying   vec2 v_texCoord;' +
		'varying   vec4 v_colorMul;' +
		'varying   vec4 v_colorAdd;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	v_texCoord = a_texCoord;' +
		'	v_colorMul = a_colorMul * cm * 2.0;' +
		'	v_colorAdd = ca;'  + // color addition
		'	v_colorMul.rgb *= v_colorMul.a;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z + tx.w * 127.0 * a_colorAdd.r * a_colorAdd.b,' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z - ty.w * 127.0 * a_colorAdd.g * a_colorAdd.a,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	vertexMask: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' +
		'uniform   mat4 u_Matrix;'   +
		'uniform   vec4 u_bbox;'     + // Bounding box of the animation containing the current vertex
		'varying   vec2 v_position;' + // Relative position of the vertex that will be passed onto the fragment shader
		'varying   vec2 v_texCoord;' +
		'varying   vec4 v_colorMul;' +
		'varying   vec4 v_colorAdd;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	vec4 cm = u_Matrix[2];' + // color multiplication
		'	vec4 ca = u_Matrix[3];' + // color addition
		'	v_texCoord = a_texCoord;' +
		'	v_colorMul = a_colorMul * cm * 2.0;' +
		'	v_colorAdd = a_colorAdd * cm + ca;'  +
		'	v_colorMul.rgb *= v_colorMul.a;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z,' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +

		// Computing position of the vertex relatively to the top left corner of the bbox of the animation
		'	v_position = (a_position - vec2(u_bbox.x, u_bbox.z)) / vec2(u_bbox.y - u_bbox.x, u_bbox.w - u_bbox.z);' +
		'}'
	},
	fragmentMask: {
		type: 'fragment',
		script:
		'varying mediump vec2 v_position;' + // Position of the fragment with respect to mask coordinate
		'varying mediump vec2 v_texCoord;' +
		'varying mediump vec4 v_colorMul;' +
		'varying mediump vec4 v_colorAdd;' +
		'uniform sampler2D u_texture;'     +
		'uniform sampler2D u_mask;'        +
		'void main() {' +
		// Fetching texture color value
		'	mediump vec4 color = texture2D(u_texture, v_texCoord);' +

		// Computing color addition alpha
		'	mediump float colorAddAlpha = v_colorAdd.a * color.a;' +

		// Applying color multiplication
		'	color *= v_colorMul;' +

		// Applying color addition & Writing pixel
		// Depremultiplying by alpha
		'	color.rgb /= color.a;' +

		// Applying color addition
		'	color.rgb += v_colorAdd.rgb;' +
		'	color.a += colorAddAlpha;' +

		// Repremultiplying by alpha
		'	color.rgb *= color.a;' +

		// Bailing out if pixel is almost transparent
		'	if (color.a <= 0.05) { discard; }' +

		// Bailing out if mask is almost transparent
		'	mediump float mask = texture2D(u_mask, v_position).a;' +
		'	if (mask == 0.0) { discard; }' +

		// Applying transparency if mask is almost transparent
		'	if (mask <= 0.2) {' +
		'		color *= mask * 5.0;' +
		'	}' +

		// Writing pixel because overlapping with mask
		'	gl_FragColor = color;' +
		'}'
	},
	vertexOutline: {
		type: 'vertex',
		script:
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'attribute vec4 a_colorMul;' +
		'attribute vec4 a_colorAdd;' +
		'uniform   mat4 u_Matrix;'   +
		'varying   vec2 v_texCoord;' +
		'varying   vec4 v_colorOutline;' +
		'void main() {' +
		'	vec4 tx = u_Matrix[0];' + // transform for point x
		'	vec4 ty = u_Matrix[1];' + // transform for point y
		'	v_colorOutline = u_Matrix[2] * a_colorMul + a_colorAdd;' + // outline color
		'	v_texCoord = a_texCoord;' +
		'	gl_Position = vec4(' +
		'		a_position.x * tx.x + a_position.y * tx.y + tx.z,' +
		'		a_position.x * ty.x + a_position.y * ty.y + ty.z,' +
		'		0.0, 1.0' +
		'	);' +
		'}'
	},
	fragmentOutline: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'varying mediump vec4 v_colorOutline;' +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		// Fetching texture color value & Applying color multiplication
		'	vec4 color = texture2D(u_texture, v_texCoord);' +
		'	if (color.a == 1.0) {' +
		'		discard;' +
		'	} else {' +
		// Computing outline color with respect to alpha gradients
		'		float gradX = texture2D(u_texture, v_texCoord + vec2(0.05, 0.0)).a - texture2D(u_texture, v_texCoord - vec2(0.05, 0.0)).a;' +
		'		float gradY = texture2D(u_texture, v_texCoord + vec2(0.0, 0.05)).a - texture2D(u_texture, v_texCoord - vec2(0.0, 0.05)).a;' +
		'		vec4 outlineColor = 0.5 * v_colorOutline * (abs(gradX) + abs(gradY));' +
		// Outputting outline color
		'		gl_FragColor = outlineColor * outlineColor.a;' +
		'	}' +
		'}'
	},
	fragmentFiltering: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'uniform float u_ratio;'     +
		// 'uniform float u_resolution;'     +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		'	vec2 res = vec2(1267.0, 865.5);' +
		// '	vec2 offsetToCenter = v_texCoord - 0.5;' +
		// '	float distToCenter = length(offsetToCenter);' +
		// '	float c1 = 2.0 * (0.5 - distToCenter * pow(u_resolution - 1.0, 1.0));' +
		// '	float c2 = 2.0 * (0.5 - distToCenter * pow(u_resolution - 1.0, 0.1));' +
		// '	vec2 textureCoord = vec2(0.5 + c1 * offsetToCenter.x, 0.5 + c1 * offsetToCenter.y);' +
		// '	if (v_texCoord.x < 0.5) { textureCoord.x = 0.5 - pow(2.0 * (0.5 - v_texCoord.x), u_resolution) / 2.0; } else { textureCoord.x = 0.5 + pow(2.0 * (v_texCoord.x - 0.5), u_resolution) / 2.0; }' +
		// '	if (v_texCoord.y < 0.5) { textureCoord.y = 0.5 - pow(2.0 * (0.5 - v_texCoord.y), u_resolution) / 2.0; } else { textureCoord.y = 0.5 + pow(2.0 * (v_texCoord.y - 0.5), u_resolution) / 2.0; }' +
		// '	vec2 textureCoord = pow(v_texCoord - vec2(1267.0, 865.5) / 2.0, vec2(u_resolution, u_resolution)) + vec2(1267.0, 865.5);' +
		// '	vec2 textureCoord = pow(2.0 * (v_texCoord - vec2(0.5, 0.5)), vec2(u_resolution, u_resolution)) / 2.0 + vec2(0.5, 0.5);' +
		'	vec4 color  = texture2D(u_texture, v_texCoord);' +
		'	vec4 color1 = texture2D(u_texture, v_texCoord + vec2(-0.7, -0.7) / res);' +
		'	vec4 color2 = texture2D(u_texture, v_texCoord + vec2(-0.7,  0.7) / res);' +
		'	vec4 color3 = texture2D(u_texture, v_texCoord + vec2( 0.7, -0.7) / res);' +
		'	vec4 color4 = texture2D(u_texture, v_texCoord + vec2( 0.7,  0.7) / res);' +
		'	gl_FragColor = color * (1.0 + 4.0 * u_ratio) - u_ratio * (color1 + color2 + color3 + color4);' +
		'}'
	},
	fragmentMapTransition: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'varying mediump vec4 v_colorMul;' +
		'uniform float u_ratio;'           +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		'	vec2 offsetToCenter = v_texCoord - 0.5;' +
		'	float distToCenter = length(offsetToCenter);' +
		'	float c1 = 2.0 * (0.5 - distToCenter * pow(u_ratio, 2.0) * 0.02);' +
		'	vec2 textureCoord = vec2(0.5 + c1 * offsetToCenter.x, 0.5 + c1 * offsetToCenter.y);' +

		'	vec4 color = texture2D(u_texture, textureCoord);' +
		'	float avg = (color.r + color.g + color.b) / 3.0;' +
		'	float greyRatio = u_ratio * 1.0;' +
		'	vec4 greyedColor = color * (1.0 - greyRatio) + vec4(avg) * greyRatio;' +

		'	float blackRatio = u_ratio * 0.2;' +
		'	gl_FragColor = vec4((greyedColor * (1.0 - blackRatio)).rgb, 1.0) * v_colorMul;' +
		'}'
	},
	fragmentPixelArt: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'uniform float u_resolution;'      +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		'	vec4 color = texture2D(u_texture, floor(v_texCoord * u_resolution) / u_resolution);' +
		'	color.rgb = floor(color.rgb * 8.0) / 8.0;' +
		'	gl_FragColor = color;' +
		'}'
	},
	fragmentEnteringFight: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'uniform float u_ratio;'     +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		'	float u = 2.0 * (v_texCoord.x - 0.5);' +
		'	float v = 2.0 * (v_texCoord.y - 0.5);' +
		'	float r = u_ratio * (pow(1.0 - max(abs(u), abs(v)), 2.0));' +
		'	vec2 uv = v_texCoord + vec2(u, v) * r;' +
		'	vec4 color = texture2D(u_texture, uv) + 0.8 * vec4(1.0, 1.0, 1.0, 0.0) * r;' +
		'	gl_FragColor = color;' +

		// '	vec4 color0 = texture2D(u_texture, v_texCoord);' +
		// '	vec4 color1 = texture2D(u_texture, v_texCoord + u_ratio * vec2(0.01, 0.0));' +
		// '	vec4 color2 = texture2D(u_texture, v_texCoord - u_ratio * vec2(0.01, 0.0));' +
		// '	vec4 color3 = texture2D(u_texture, v_texCoord + u_ratio * vec2(0.0, 0.01));' +
		// '	vec4 color4 = texture2D(u_texture, v_texCoord - u_ratio * vec2(0.0, 0.01));' +
		// '	gl_FragColor = color0 * 0.6 + 0.15 * (color1 + color2 + color3 + color4);' +

		// '	vec4 color = texture2D(u_texture, v_texCoord);' +
		// '	float noise = u_ratio * 0.3 * fract(sin(dot(v_texCoord.xy ,vec2(u_ratio + 1.0, 78.233))) * 43758.5453);' +
		// '	gl_FragColor = color * (1.0 - noise);' +

		// '	float resolution = 1000.0 - 900.0 * u_ratio;' +
		// '	vec4 colorPixel = texture2D(u_texture, floor(v_texCoord * resolution) / resolution);' +
		// '	vec4 colorOriginal = texture2D(u_texture, v_texCoord);' +
		// '	gl_FragColor = colorOriginal * (1.0 - u_ratio) + colorPixel * u_ratio;' +
		'}'
	},
	fragmentColorSplit: {
		type: 'fragment',
		script:
		'precision mediump float;' +
		'varying mediump vec2 v_texCoord;' +
		'uniform sampler2D u_texture;'     +
		'void main() {'                    +
		'	vec4 color = vec4(0.0, 0.0, 0.0, 1.0);' +
		'	color.r = texture2D(u_texture, v_texCoord + vec2(-0.007, - 0.007)).r;' +
		'	color.g = texture2D(u_texture, v_texCoord + vec2(0.007, - 0.007)).g;' +
		'	color.b = texture2D(u_texture, v_texCoord + vec2(0.0, 0.01)).b;' +
		'	gl_FragColor = color;' +
		'}'
	}
};

var shaderGroups = {
	line: {	vertex: shadersData.vertexLine, fragment: shadersData.fragmentLine },
	box: { vertex: shadersData.vertexBox, fragment: shadersData.fragmentBox },
	regular: { vertex: shadersData.vertexRegular, fragment: shadersData.fragmentRegular },
	relativeScale: { vertex: shadersData.vertexRelativeScale, fragment: shadersData.fragmentRegular},
	mask: { vertex: shadersData.vertexMask, fragment: shadersData.fragmentMask },
	outline: { vertex: shadersData.vertexOutline, fragment: shadersData.fragmentOutline }
};