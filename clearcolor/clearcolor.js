

function main() {
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl');
    if(gl == null) {
        console.log('failed to get webgl context');
        return;
    }

    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

}


