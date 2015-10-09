/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const mwidth = cwidth / 2;
const cheight = 155;
const mheight = cheight / 2;
const spacing = 5;
const rounded = 10;

var reds = ['incite.jpg', 'barbed.jpg', 'raiders.jpg', 'incite.jpg', 'barbed.jpg', 'raiders.jpg', 'incite.jpg', 'barbed.jpg', 'raiders.jpg']
var blues = ['broodstar.jpg', 'egotist.jpg', 'broodstar.jpg', 'egotist.jpg', 'broodstar.jpg', 'egotist.jpg', 'broodstar.jpg', 'egotist.jpg', 'broodstar.jpg']
var grays = ['chalice.jpg', 'endless.png', 'chalice.jpg', 'endless.png', 'chalice.jpg', 'endless.png', 'chalice.jpg']

function drawCard(context, p, word) {
    roundRect(context, p.x, p.y, cwidth, cheight, rounded);
    context.fillText(word, p.x + mwidth, p.y + mheight); 
}
function drawImage(context, p, src) {
    var img = new Image();
    img.src = 'images/' + src;
    img.onload = function() {
        context.drawImage(img, 0, 0, 222, 310, p.x, p.y, cwidth, cheight);    
    }
}

function to2d(n) {
    var row = n % 5;
    var col = Math.floor(n / 5);
    return {
        x : row * (spacing + cwidth) + spacing,
        y : col * (spacing + cheight) + spacing
    }
}

function drawwords(context) {
    var words = getParameter('words').split(',', 25);
    var i, p, img;
    for (i = 0; i < words.length; i++) {
        p = to2d(i);
        if (words[i] == 'r') {
            drawImage(context, p, reds.pop());
        } else if (words[i] == 'b') {
            drawImage(context, p, blues.pop());
        } else if (words[i] == 'n') {
            drawImage(context, p, grays.pop());
        } else if (words[i] == 'a') { // Assassin
            drawImage(context, p, 'phage.jpg');
        } else {
            drawCard(context, p, words[i].toUpperCase());
        }
    }
    // In case we weren't given enough words...
    for (i = words.length ; i < 25; i++) {
        p = to2d(i);
        drawCard(context, p, i + 1);
    }    
}

$(function(){
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
    context.fillStyle = '#220022';
    drawwords(context);
});
