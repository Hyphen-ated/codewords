/* vim: set ts=4 sw=4 tw=4 et : */

const cwidth = 111;
const cheight = 155;
const spacing = 5;
const rounded = 10;

var wordCount = 25;
var gridWidth = 5;

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
    const row = n % gridWidth;
    const col = Math.floor(n / gridWidth);
    return {
        x: row * (spacing + cwidth) + spacing,
        y: col * (spacing + cheight) + spacing
    };
}

function loadWords() {
    // Prefer loading from the existing text boxes
    var wordInputs = $('input[name=word]');
    if (wordInputs.length > 0 && wordInputs[0].value !== '') {
        return wordInputs.map(function(i, el) { return el.value; });
    }

    // Next try loading from state variable given by imgur
    const stateWords = getParameter('state');
    if (stateWords) {
        return stateWords.split(',', wordCount).map(function(el) {
            // When imgur returns state parameter it converts ' ' to '+'
            return el.replaceAll('+', ' ');
        });
    }

    // Next load from local use 'words' parameter
    const paramWords = getParameter('words');
    var arry;
    if (paramWords !== undefined) {
        arry = paramWords.split(',');
    } else {
        arry = [];
    }
 

    // And pad with random words
    var i, word, words = [];
    if($('#basewords').prop('checked')) {
        words = words.concat(basewords);
    }    
    if($('#duetwords').prop('checked')) {
        words = words.concat(duetwords);
    }    
    if($('#undercoverwords').prop('checked')) {
        words = words.concat(undercoverwords);
    }        
    if($('#mtgwords').prop('checked')) {
        words = words.concat(mtgwords);
    }
    
        
    if (words.length == 0) {
        //you cant have NO words. give them base
        words = words.concat(basewords);
    }
    
    while(arry.length < wordCount) {
        // Check for duplicates, since we don't know the starting contents.
        // and making sure all wordlists are disjoint would be kind of a pain.
        word = randomElement(words).toLowerCase();
        if ($.inArray(word, arry) === -1) {
            arry.push(word);
        }
    }

    return arry;
}

function drawwords(canvas, assignments) {

    var context = getClearCanvasContext(canvas);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (assignments === undefined) {
        assignments = { red: [], blue: [], green: [], ass: [] };
    }

    var words = loadWords();
    var inputs = $('input[name=word]');
    var i, p;
    const redImgCount = 10;
    const blueImgCount = 10;
    const greenImgCount = 7;
    const neutralImgCount = 4;
    for (i = 0; i < words.length; i += 1) {
        p = to2d(i);
        var currentWord = words[i].toLowerCase()
        if (currentWord === 'r') {
            drawImage(context, p, 'red', i % redImgCount);
        } else if (currentWord === 'b') {
            drawImage(context, p, 'blue', i % blueImgCount);
        } else if (currentWord === 'g') {
            drawImage(context, p, 'green', i % greenImgCount)
        } else if (currentWord === 'n') {
            drawImage(context, p, 'neutral', i % neutralImgCount);
        } else if (currentWord === 'a') { // Assassin
            drawImage(context, p, 'phage.jpg');
        } else {
            if ($.inArray(i, assignments.red) > -1) {
                drawCard(context, p, currentWord.toUpperCase(), '#ffb2b2');
            } else if ($.inArray(i, assignments.blue) > -1) {
                drawCard(context, p, currentWord.toUpperCase(), '#b2b2ff');
            } else if ($.inArray(i, assignments.green) > -1) {
                drawCard(context, p, currentWord.toUpperCase(), '#b2ffb2');
            } else if ($.inArray(i, assignments.ass) > -1) {
                drawCard(context, p, currentWord.toUpperCase(), '#b2b2b2');
            } else {
                drawCard(context, p, currentWord.toUpperCase(), 'white');
            }
        }
        if(i < inputs.length) {
            inputs.get(i).value = words[i];
        }
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

function getClearCanvasContext(canvas) {
    var context = canvas.getContext('2d');        
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
    context.fillStyle = '#220022';
    return context;
}

function setGridSize(knownSize) {

    if (knownSize === undefined) {
        if ($('#6x6').prop('checked')) {
            gridWidth = 6;
        } else {
            gridWidth = 5;
        }
    } else {
        gridWidth = knownSize;
    }

    
    if (gridWidth === 5) {
        $('#firstteam').val(9);
        $('#secondteam').val(8);
        $('#thirdteam').val(0);
    } else if (gridWidth === 6) {
        $('#firstteam').val(10);
        $('#secondteam').val(9);
        $('#thirdteam').val(8);
    } else {
        console.log("Neither 5x5 nor 6x6 is checked, this shouldn't happen, bailing out of grid resize")
        return;
    }
        
    wordCount = gridWidth * gridWidth;
    
    //create a 5x5 or 6x6 grid of inputs    
    var wordContainer = $('#words');
    wordContainer.empty();
    for(var i = 0; i < gridWidth; ++i) {
        var rowHtml = "<div>" + "<input name='word'/>".repeat(gridWidth)  + "</div>";
        wordContainer.append($(rowHtml));
    }
    
    var canvas = document.getElementById('c');
    canvas.width = (gridWidth) * (spacing + cwidth) + spacing;
    canvas.height = (gridWidth) * (spacing + cheight) + spacing;
    
    
    drawwords(canvas);
}

$(function(){
    //figure out if we're in 5x5 or 6x6 mode
    var words = loadWords();    
    var size = 5;
    if (words.length > 25) {
        $('#6x6').prop('checked', true);
        $('#5x5').prop('checked', false);
        size = 6;
    }
    setGridSize(size);
      
    var canvas = document.getElementById('c');
    
    drawwords(canvas);

    $('#edit').button({
        disabled: false,
        label: 'Edit'
    }).click(function() {
        $('#words').show();
        $('#canvas, #teams, #options, #upload, #optionsdiv').hide();
        $(this).button('option', 'label', 'Done').off('click').click(save);
    });

    $('#new').button({
        disabled: false,
        label: 'New Board'
    }).click(function() {
        if(document.location.hash && document.location.hash.length > 0) {
            document.location.hash = '';
        }
        if(document.location.search && document.location.search.length > 0) {
            document.location.search = '';
        }
        $('input[name=word]').each(function() { this.value = ''; });
        drawwords(canvas);
    });

    $('#teams').button({
        disabled: false,
        label: 'Assign Teams'
    }).click(function() {
        // http://stackoverflow.com/a/20066663
        var choices = Array.apply(null, {length: wordCount}).map(Number.call, Number);
        var assignments = {red: [], blue: [], green: [], ass: [] };
        
        
        
        var firstCount = parseInt($('#firstteam').val());
        var secondCount = parseInt($('#secondteam').val());
        var thirdCount = parseInt($('#thirdteam').val());
        var assassinCount = parseInt($('#assassins').val());
        
        var teamOrder;
        if( thirdCount == 0) {
            teamOrder = [assignments.red, assignments.blue];
        } else {
            teamOrder = [assignments.red, assignments.blue, assignments.green];
        }                
        shuffle(teamOrder);
        
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
        drawwords(canvas, assignments);
    });
    
    $('#options').button({
        disabled: false,
        label: 'Options'
    }).click(function() {
        $('#optionsdiv').toggle();
    });

    $('#forum').hide();
    $('#upload').button({
        disabled: false,
        label: 'Imgur Upload'
    }).click(tryUpload);


    $("input[type='radio']").checkboxradio().click(function() {
        setGridSize();
    });
    
    $("input[type='checkbox']").checkboxradio();
    
    $(".countinput").spinner();

    if (getParameter('state') !== undefined) {
        tryUpload();
    }
});
