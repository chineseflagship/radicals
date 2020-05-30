// Try edit message
var mousePressed = false;
var lastX, lastY;
var ctx;

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function (e) {
	    mousePressed = true;
	    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
	});

    $('#myCanvas').mousemove(function (e) {
	    if (mousePressed) {
		Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
	    }
	});

    $('#myCanvas').mouseup(function (e) {
	    mousePressed = false;
	    clearArea();
	    reload();
	});
    $('#myCanvas').mouseleave(function (e) {
	    mousePressed = false;
	});
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 9;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
    console.log(x,y);
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function reload() {
    var element = document.querySelector("svg");
    var cloneElement = element.cloneNode(true);
    element.parentNode.replaceChild(cloneElement, element); 
}