// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
// https://codepen.io/jakealbaugh/post/canvas-image-pixel-manipulation
// https://code.tutsplus.com/tutorials/canvas-from-scratch-pixel-manipulation--net-20573

"use strict";

function useUntypedArray() {
	var canvas = document.getElementById("canvas");
	var canvasWidth  = canvas.width;
	var canvasHeight = canvas.height;
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	var data = imageData.data;

	for (var y = 0; y < canvasHeight; y++) {
    	for (var x = 0; x < canvasWidth; x++) {
    		var index = (y * canvasWidth + x) * 4;
    		var value = x * y & 0xff;
    		data[index]   = value;	// red
        	data[++index] = value;	// green
        	data[++index] = value;	// blue
	        data[++index] = 255;	// alpha
	    }
	}

	ctx.putImageData(imageData, 0, 0);
}

function useTypedArray() {
	var canvas = document.getElementById("canvas");
	var canvasWidth  = canvas.width;
	var canvasHeight = canvas.height;
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	var buf = new ArrayBuffer(imageData.data.length);
	var buf8 = new Uint8ClampedArray(buf);
	var data = new Uint32Array(buf);

	for (var y = 0; y < canvasHeight; y++) {
    	for (var x = 0; x < canvasWidth; x++) {
    		var value = x * y & 0xff;
	        data[y * canvasWidth + x] =
	            (255   << 24) |	// alpha
	            (value << 16) |	// blue
	            (value <<  8) |	// green
	             value;		    // red
	    }
	}

	imageData.data.set(buf8);
	ctx.putImageData(imageData, 0, 0);
}

function main() {	
	useUntypedArray();
}

window.onload = main;

