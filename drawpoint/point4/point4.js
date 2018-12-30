import initShaders from '../../utils/initshaders.js';

window.main = main;

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_Size;
    void main() {
        gl_Position = a_Position;
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
    if(a_Size < 0) {
        console.log('Failed to get u_FragColor uniform variable');
        return;
    }


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.5);
    gl.vertexAttrib1f(a_Size, 8.0);

    canvas.onmousedown = function(event) {
        click(event, gl, canvas, a_Position, u_FragColor);
    };
}

var g_points = [];
var g_colors = [];
function click(event, gl, canvas, a_Position, u_FragColor) {

    var x = event.clientX;
    var y = event.clientY;

    var rect = event.target.getBoundingClientRect();

    var clipx = ((x - rect.left) - (canvas.clientWidth) / 2) / (canvas.clientWidth / 2);
    var clipy = ((y - rect.top) - (canvas.clientHeight / 2)) / (canvas.clientWidth / 2) * -1;

    console.log('x: ' + x + ' -> clipx: ' + clipx);
    console.log('y: ' + y + ' -> clipy: ' + clipy);

    var col1 = Math.random();
    var col2 = Math.random();
    var col3 = Math.random();

    g_colors.push(col1);
    g_colors.push(col2);
    g_colors.push(col3);

    console.log(`rgb(${col1.toFixed(3)},${col2.toFixed(3)},${col3.toFixed(3)})`);

    g_points.push(clipx);
    g_points.push(clipy);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i = 0,  k = 0; i < g_points.length; i+=2, k+=3) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
        gl.uniform4f(u_FragColor, g_colors[k], g_colors[k+1], g_colors[k+2], 1.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

