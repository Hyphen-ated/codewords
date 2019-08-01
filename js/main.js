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
    };
}

function to2d(n) {
    const row = n % 6;
    const col = Math.floor(n / 6);
    return {
        x: row * (spacing + cwidth) + spacing,
        y: col * (spacing + cheight) + spacing
    };
}

function loadWords() {
    // Prefer loading from the existing text boxes
    if ($('input[name=word]')[0].value !== '') {
        return $('input[name=word]').map(function(i, el) { return el.value; });
    }

    // Next try loading from   variable given by imgur
    const stateWords = getParameter('state');
    if (stateWords) {
        return stateWords.split(',', 36).map(function(el) {
            // When imgur returns state parameter it converts ' ' to '+'
            return el.replace('+', ' ');
        });
    }

    // Next load from local use 'words' parameter
    const paramWords = getParameter('words');
    var arry;
    if (paramWords !== undefined) {
        arry = paramWords.split(',', 36);
    } else {
        arry = [];
    }

    // And pad with random words
    var i, word, words = master.slice();
    for (i = arry.length; i < 36; i += 1) {
        // Check for duplicates, since we don't know the starting contents
        word = randomElement(words);
        if ($.inArray(word, arry) === -1) {
            arry.push(word);
        }
    }

    return arry;
}

function drawwords(context, assignments) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (assignments === undefined) {
        assignments = { red: [], blue: [], green: [], ass: [] };
    }

    var words = loadWords();
    var inputs = $('input[name=word]');
    var i, p;
    for (i = 0; i < words.length; i += 1) {
        p = to2d(i);
        if (words[i] === 'r') {
            drawImage(context, p, 'red', i % 10);
        } else if (words[i] === 'b') {
            drawImage(context, p, 'blue', i % 10);
        } else if (words[i] === 'g') {
            drawImage(context, p, 'green', i % 7)
        } else if (words[i] === 'n') {
            drawImage(context, p, 'neutral', i % 4);
        } else if (words[i] === 'a') { // Assassin
            drawImage(context, p, 'phage.jpg');
        } else {
            if ($.inArray(i, assignments.red) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#ffb2b2');
            } else if ($.inArray(i, assignments.blue) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#b2b2ff');
            } else if ($.inArray(i, assignments.green) > -1) {
                drawCard(context, p, words[i].toUpperCase(), '#b2ffb2');
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

const aToken = 'access_token';
const rToken = 'refresh_token';

function loadToken() {
    var token;

    // Check local storage
    if (storageAvailable('localStorage')) {
        token = localStorage.getItem(aToken);
        if (token) {
            return token;
        }
    }

    // Check cookies
    token = Cookies.get(aToken);
    if (token) {
        return token;
    }

    // Check URL response
    token = getHash(aToken);
    if (token) {
        // Save the token info
        if (storageAvailable('localStorage')) {
            localStorage.setItem(aToken, token);
            localStorage.setItem(rToken, getHash('refresh_token'));
        } else {
            Cookies.set(aToken, token);
            Cookies.set(rToken, getHash('refresh_token'));
        }
        return token;
    }

    return undefined;
}

function tryUpload(event) {
    if (event) {
        event.preventDefault();
    }

    const token = loadToken();
    if (token === undefined) {
        location.href = 'https://api.imgur.com/oauth2/authorize'
            + '?client_id=db24325962cbfe8'
            + '&response_type=token'
            + '&state=' + readWords();
    }
    //don't read the image for 3 seconds as a dumb hack to let the images load first
    $('#forum').text("generating imgur link...").show();
    setTimeout(function(){getAndSendImageData(token);}, 1000);
    
}

function getAndSendImageData(token) {
    var pngUrl = document.getElementById('c').toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
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
        $('#canvas, #words, #teams, #options, #upload, #optionsdiv').toggle();
        $(this).button('option', 'label', 'Done').off('click').click(save);
    });

    $('#new').button({
        disabled: false,
        label: 'New Board'
    }).click(function() {
        document.location.hash = '';
        document.location.search = '';
        $('input[name=word]').each(function() { this.value = ''; });
        drawwords(context);
    });

    $('#teams').button({
        disabled: false,
        label: 'Assign Teams'
    }).click(function() {
        // http://stackoverflow.com/a/20066663
        var choices = Array.apply(null, {length: 36}).map(Number.call, Number);
        var assignments = {red: [], blue: [], green: [], ass: [] };
        
        var teamOrder = [assignments.red, assignments.blue, assignments.green];
        shuffle(teamOrder);
        
        var firstCount = parseInt($('#firstteam').val());
        var secondCount = parseInt($('#secondteam').val());
        var thirdCount = parseInt($('#thirdteam').val());
        var assassinCount = parseInt($('#assassins').val());
        for(var i = 0; i < firstCount; ++i) {
            teamOrder[0].push(randomElement(choices));
        }
        for(var i = 0; i < secondCount; ++i) {
            teamOrder[1].push(randomElement(choices));
        }        
        for(var i = 0; i < thirdCount; ++i) {
            teamOrder[2].push(randomElement(choices));
        }
        for(var i = 0; i < assassinCount; ++i) {
            assignments.ass.push(randomElement(choices));
        }        
        drawwords(context, assignments);
    });
    
    $('#options').button({
        disabled: false,
        label: 'Word Counts'
    }).click(function() {
        $('#optionsdiv').show();
    });

    $('#forum').hide();
    $('#upload').button({
        disabled: false,
        label: 'Upload to Imgur'
    }).click(tryUpload);

    if (getParameter('state') !== undefined) {
        tryUpload();
    }
});
