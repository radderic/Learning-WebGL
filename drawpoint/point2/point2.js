var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_Size;
    }
`;

var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
`;

function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if(shader == null) {
        console.log('unable to create shader');
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compiled) {
        console.log('failed to compile shader');
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vshader, fshader) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if(!vertexShader || !fragmentShader) {
        console.log('failed to load shaders');
        return null;
    }

    var program = gl.createProgram();
    if(!program) {
        console.log('failed to create program');
        return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linked) {
        var error = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        gl.deleteProgram(fragmentShader);
        gl.deleteProgram(vertexShader);
        console.log('failed to link' + error);
        return null;
    }

    return program;
}


function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if(!program) {
        console.log('Failed to get shader');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}

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

    gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.5);
    gl.vertexAttrib1f(a_Size, 3.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}
