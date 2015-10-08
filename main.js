/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const mwidth = cwidth / 2;
const cheight = 155;
const mheight = cheight / 2;
const spacing = 10;
const rounded = 10;

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
    var i, p;
    for (i = 0; i < words.length; i++) {
        p = to2d(i);
        roundRect(context, p.x, p.y, cwidth, cheight, rounded);
        context.fillText(words[i], p.x + mwidth, p.y + mheight); 
    }
    // In case we weren't given enough words...
    for (i = words.length ; i < 25; i++) {
        p = to2d(i);
        roundRect(context, p.x, p.y, cwidth, cheight, rounded);
        context.fillText(i, p.x + mwidth, p.y + mheight); 
    }    
}

$(function(){
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    context.textAlign = 'center';
    drawwords(context);
});
