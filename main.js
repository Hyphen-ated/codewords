/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const mwidth = cwidth / 2;
const cheight = 155;
const mheight = cheight / 2;
const spacing = 5;
const rounded = 10;

const reds = 3;
const blues = 3;
const neutrals = 2;

function drawCard(context, p, word) {
    roundRect(context, p.x, p.y, cwidth, cheight, rounded);
    context.fillText(word, p.x + mwidth, p.y + mheight); 
}
function drawImage(context, p, src, number) {
    var img = new Image();
    if (number === undefined) {
        img.src = 'images/' + src;
    } else {
        img.src = 'images/' + src + '/' + number + '.jpg';
    }
    img.onload = function() {
        context.drawImage(img, 0, 0, img.width, img.height, p.x, p.y, cwidth, cheight);    
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

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function drawwords(context) {
    var words = getParameter('words').split(',', 25);
    var inputs = $('input[name=word]');
    var i, p, img;
    for (i = 0; i < words.length; i++) {
        p = to2d(i);
        if (words[i] == 'r') {
            drawImage(context, p, 'red', randInt(reds));
        } else if (words[i] == 'b') {
            drawImage(context, p, 'blue', randInt(blues));
        } else if (words[i] == 'n') {
            drawImage(context, p, 'neutral', randInt(neutrals));
        } else if (words[i] == 'a') { // Assassin
            drawImage(context, p, 'phage.jpg');
        } else {
            drawCard(context, p, words[i].toUpperCase());
        }
        inputs.get(i).value = words[i];
    }
    // In case we weren't given enough words...
    for (i = words.length ; i < 25; i++) {
        p = to2d(i);
        drawCard(context, p, i + 1);
        inputs.get(i).value = i + 1;
    }    
}

function save() {
    var search = '';
    var sep = '?words=';

    $('input[name=word]').each(function() {
        search = search + sep + this.value;
        sep = ',';
    });

    location.search = search;
}

function edit() {
    $('#canvas, #words').toggle();
    $(this).button('option', 'label', 'Done').off('click').click(save);
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
    $('#edit').button({
        disabled: false,
        label: 'Edit'
    }).click(edit);
});
