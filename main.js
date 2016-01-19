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

    const stateWords = getParameter('state');
    if (stateWords !== undefined) {
        var arry = stateWords.split(',', 25);
    } else {
        const paramWords = getParameter('words');
        if (paramWords !== undefined) {
            var arry = paramWords.split(',', 25);
        } else {
            var arry = new Array();
        }

        for (var i = arry.length; i < 25; i++) {
            arry.push(randomElement(master));
        }
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

function readWords() {
    var search = '';
    var sep = '';

    $('input[name=word]').each(function() {
        search = search + sep + this.value;
        sep = ',';
    });

    return search;
}

function save() {
    location.search = '?words=' + readWords();
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
        $('#canvas, #words, #teams, #upload').toggle();
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
        var assignments = { red: [], blue: [], ass: [] };

        for (var i = 0; i < 8; i++) { // Each color gets at least 8 cards.
            assignments.red.push(randomElement(choices));
            assignments.blue.push(randomElement(choices));
        }
        if (Math.random() > 0.5) { // Somebody gets an extra
            assignments.red.push(randomElement(choices));
        } else {
            assignments.blue.push(randomElement(choices));
        }
        assignments.ass.push(randomElement(choices));

        drawwords(context, assignments);
    });

    $('#forum').hide();
    $('#upload').button({
        disabled: false,
        label: 'Upload to Imgur'
    }).click(function(event) {
        var token = Cookies.get('access_token');
        if (token === undefined) {
            token = getHash('access_token');
            if (token === undefined) {
                location.href = 'https://api.imgur.com/oauth2/authorize?client_id=042408054523c44&response_type=token&state=' + readWords();
            } else {
                Cookies.set('access_token', token);
                Cookies.set('refresh_token', getHash('refresh_token'));
            }
        }

        var pngUrl = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
        $.ajax({
            type: 'POST',
            url: 'https://api.imgur.com/3/image',
            headers: {
                 Authorization: 'Bearer ' + token
            },
            dataType: 'json',
            data: {
                image : pngUrl,
                type : 'base64'
            },
            success: function(result) {
                const link = '[img]' + result.data.link + '[/img]';
                $('#forum').text(link).show();
            }
        });
    });
});
