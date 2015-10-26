/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const cheight = 155;
const spacing = 5;
const rounded = 10;

function drawCard(context, p, word, color) {
    context.fillStyle = color;
    roundRect(context, p.x, p.y, cwidth, cheight, rounded, true);
    context.fillStyle = '#220022';
    context.fillText(word, p.x + (cwidth / 2), p.y + (cheight / 2)); 
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

function loadWords() {
    if ($('input[name=word]')[0].value !== '')
        return $('input[name=word]').map(function(i, el) { return el.value; });

    const paramWords = getParameter('words');
    if (paramWords === undefined) var arry = new Array();
    else var arry = paramWords.split(',', 25);

    for (var i = arry.length; i < 25; i++) {
        arry.push(master[randInt(master.length)]);
    }
    return arry;
}

function drawwords(context, assignments) {
    if (assignments === undefined)
        assignments = { red: [], blue: [], ass: [] };

    var words = loadWords();
    var inputs = $('input[name=word]');
    var i, p, img;
    for (i = 0; i < words.length; i++) {
        p = to2d(i);
        if (words[i] == 'r') {
            drawImage(context, p, 'red', i % 9);
        } else if (words[i] == 'b') {
            drawImage(context, p, 'blue', i % 9);
        } else if (words[i] == 'n') {
            drawImage(context, p, 'neutral', i % 3);
        } else if (words[i] == 'a') { // Assassin
            drawImage(context, p, 'phage.jpg');
        } else {
            if ($.inArray(i, assignments.red) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#ffb2b2');
            } else if ($.inArray(i, assignments.blue) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#b2b2ff');
            } else if ($.inArray(i, assignments.ass) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#b2b2b2');
            } else {
                drawCard(context, p, words[i].toUpperCase(), 'white');
            }
        }
        inputs.get(i).value = words[i];
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
    }).click(function() {
        $('#canvas, #words, #teams').toggle();
        $(this).button('option', 'label', 'Done').off('click').click(save);
    });

    $('#new').button({
        disabled: false,
        label: 'New Board'
    }).click(function() {
        document.location.search = '';
    });

    $('#teams').button({
        disabled: false,
        label: 'Assign Teams'
    }).click(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // http://stackoverflow.com/a/20066663
        var choices = Array.apply(null, {length: 25}).map(Number.call, Number);
        var assignments = {
            red: [],
            blue: [],
            ass: []
        };

        const popRandom = function() {
            var index = randInt(choices.length);
            var value = choices[index];
            choices.splice(index, 1);
            return value;
        };
        for (var i = 0; i < 8; i++) { // Each color gets at least 8 cards.
            assignments.red.push(popRandom());
            assignments.blue.push(popRandom());
        }
        if (Math.random() > 0.5) { // Somebody gets an extra
            assignments.red.push(popRandom());
        } else {
            assignments.blue.push(popRandom());
        }
        assignments.ass.push(popRandom());

        drawwords(context, assignments);
    });
});
