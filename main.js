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
            img = new Image();
            img.src = 'images/' + reds.pop();
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'b') {
            img = new Image();
            img.src = 'images/' + blues.pop();
            context.drawImage(img, 0, 0, 222, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'n') {
            img = new Image();
            img.src = 'images/' + grays.pop();
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'a') { // Assassin
            img = new Image();
            img.src = 'images/phage.jpg';
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else {
            roundRect(context, p.x, p.y, cwidth, cheight, rounded);
            context.fillText(words[i].toUpperCase(), p.x + mwidth, p.y + mheight);
        }
    }
    // In case we weren't given enough words...
    for (i = words.length ; i < 25; i++) {
        p = to2d(i);
        roundRect(context, p.x, p.y, cwidth, cheight, rounded);
        context.fillText(i + 1, p.x + mwidth, p.y + mheight); 
    }    
}

$(function(){
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    drawwords(context);
});
