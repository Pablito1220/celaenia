var curveH, curveV;
var resolution = 10;
var factorX    = 2;
var factorY    = 2;
var angle      = 0;

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.parent('canvasContainer');

  curveH = createGraphics(width, 100);
  curveV = createGraphics(100, height);
}

function draw() {
    background(0);

    factorX = constrain(map(mouseX, 0, width, .28, 4), .28, 4);
    factorY = constrain(map(mouseY, 0, height, .28, 4), .28, 4);

    angle += PI/100;

    curveH.clear();
    curveH.noFill();
    curveH.stroke(255);
    curveH.strokeWeight(2);
    curveH.beginShape();
    for (var i = 0; i < width + resolution; i += resolution) {
        curveH.vertex(i, sin(i * .01 + angle) * 49 + curveH.height/2);
    }
    curveH.endShape();

    curveV.clear();
    curveV.noFill();
    curveV.stroke(255);
    curveV.strokeWeight(2);
    curveV.beginShape();
    for (var i = 0; i < height + resolution; i += resolution) {
        curveV.vertex(cos(i * .01 + angle) * 49 + curveV.width/2, i);
    }
    curveV.endShape();

    for (var y = -curveH.height; y < height + curveH.height; y += curveH.height/factorX) {
        image(curveH, 0, y);
    }

    for (var x = -curveV.width; x < width + curveV.width; x += curveV.width/factorY) {
        image(curveV, x, 0);
    }
}
