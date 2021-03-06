import initShaders from '../../utils/initshaders.js';

window.main = main;

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_Size;
    uniform float u_Degree;
    uniform vec4 u_Translate;
    void main() {
        gl_Position.x = a_Position.x * cos(radians(u_Degree)) - a_Position.y * sin(radians(u_Degree));
        gl_Position.y = a_Position.x * sin(radians(u_Degree)) + a_Position.y * cos(radians(u_Degree));
        gl_Position.z = a_Position.z;
        gl_Position.w = 1.0;
        gl_Position = gl_Position + u_Translate;
        gl_PointSize = a_Size;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

function main() {
    var canvas = document.getElementById("webgl");
    if (!canvas) {
        console.log("Failed go get canvas");
        return false;
    }

    var gl = canvas.getContext('webgl');
    if(gl == null) {
        console.log("failed to get context");
        return;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get a_Position attribute variable');
        return;
    }
    var a_Size = gl.getAttribLocation(gl.program, 'a_Size');
    if(a_Size < 0) {
        console.log('Failed to get a_Size attribute variable');
        return;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if(u_FragColor < 0) {
        console.log('Failed to get u_FragColor uniform variable');
        return;
    }

    var u_Translate = gl.getUniformLocation(gl.program, 'u_Translate');
    if(u_Translate < 0) {
        console.log('Failed to get u_Translate uniform variable');
        return;
    }

    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var u_Degree = gl.getUniformLocation(gl.program, 'u_Degree');
    if(u_Degree < 0) {
        console.log('Failed to get u_Degree uniform variable');
        return;
    }

    var Tx = 0.5, Ty = 0.3, Tz = 0.0;
    var angle = 40.0;

    gl.vertexAttrib1f(a_Size, 10.0);
    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
    gl.uniform4f(u_Translate, Tx, Ty, Tz, 0.0);
    gl.uniform1f(u_Degree, angle);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([ 0.0, 0.5, -0.5, -0.5, 0.5, -0.5 ]);
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    //bind the buffer object to target, aka tell it what kind of data to expect (vertex data)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
