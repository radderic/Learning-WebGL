var VSHADER_SOURCE = `
`;

var FSHADER_SOURCE = `
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
        //gl.deleteShader(shader);
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
        console.log('Failed to get storage location of a_Position');
        return;
    }
    var u_color = gl.getUniformLocation(gl.program, 'u_color');

    var a_pointsize = gl.getAttribLocation(gl.program, 'a_Pointsize');
    if(a_pointsize < 0) {
        console.log('Failed to get storage location of a_pointsize');
        return;
    }
    gl.vertexAttrib1f(a_pointsize, 50.0);

    canvas.onmousedown = function(event) { click(event, gl, canvas, a_Position, u_color); };

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT)

 //   gl.drawArrays(gl.POINTS, 0, 1)
}

var g_points = []
var g_color = []
function click(event, gl, canvas, a_Position, u_color) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);
    g_points.push(x);
    g_points.push(y);

    g_color.push(Math.random());
    g_color.push(Math.random());
    g_color.push(Math.random());

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i+=2) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
        gl.uniform4f(u_color, g_color[i], g_color[i+1], g_color[i+2], 1.0);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
