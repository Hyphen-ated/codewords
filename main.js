/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const mwidth = cwidth / 2;
const cheight = 155;
const mheight = cheight / 2;
const spacing = 10;
const rounded = 10;

var reds = ['incite', 'incite', 'incite', 'incite', 'incite', 'incite', 'incite', 'incite', 'incite']
var blues = ['serum visions', 'serum visions', 'serum visions', 'serum visions', 'serum visions', 'serum visions', 'serum visions', 'serum visions', 'serum visions']
var grays = ['endless one', 'endless one', 'endless one', 'endless one', 'endless one', 'endless one', 'endless one']

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
        if (words[i] == 'r') { // Red
            img = new Image();
            img.src = 'http://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img&find=' + reds.pop();
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'b') { // Blue
            img = new Image();
            img.src = 'http://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img&find=' + blues.pop();
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'n') { // Neutral
            img = new Image();
            img.src = 'http://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img&find=' + grays.pop();
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else if (words[i] == 'a') { // Assassin
            img = new Image();
            img.src = 'http://forums.goodgamery.com/includes/mtg/mtg_helper_cardfinder_v3.php?img&find=phage the untouchable';
            context.drawImage(img, 0, 0, 223, 310, p.x, p.y, cwidth, cheight);
        } else {
            roundRect(context, p.x, p.y, cwidth, cheight, rounded);
            context.fillText(words[i], p.x + mwidth, p.y + mheight);
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
    context.textAlign = 'center';
    drawwords(context);
});
