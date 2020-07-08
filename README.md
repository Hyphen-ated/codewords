# Code Words
This is a board image generator for a variant of the game [Codenames], by Vlaada Chvatl.

You can generate images in your browser on the live [github.io] site. The site requires JavaScript to be enabled in your browser to function properly.

The page will select random words from the available list-. If you are unsatisfied with the word list presented, the 'New Board' button will generate a new one. There's a button to assign teams to the words, and a button to upload the board to imgur, for convenient use in forum games.

To specify custom words, add `?words=one,two,three...` to the end of the URL in your address bar on the live site. 

To edit the board state, you can modify the words directly in the address bar. Alternatively, you can click the 'Edit' button to replace the board with text boxes, make your changes there, and then click the 'Save' button to display the new board.

To mark a word as scored for the red team, replace it with the letter `r`. Similarly you can use `b`, `g`, `n`, or `a` to represent blue, green, neutral, or assassin words respectively.

There are options to increase the board size to 6x6, to change how many words each team has, to have a potential third team, and to use words from the base game, from Codenames: Duet, or both.

Here is a demo board of one possibility for a [completed game].

[Codenames]: https://boardgamegeek.com/boardgame/178900/codenames
[github.io]: http://madrob.github.io/codewords/
[completed game]: http://madrob.github.io/codewords/?words=b,b,r,fair,mass,a,pole,r,r,b,turkey,n,r,cricket,bill,b,r,b,b,b,king,lap,r,n,tooth
