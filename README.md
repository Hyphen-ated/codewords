# Code Words
This is a board image generator for the game [Codenames], by Vlaada Chvati.

You can generate images in your browser on the live [github.io] site. The site requires JavaScript to be enabled in your browser to function properly.

By default, the page will select 25 random words from the available list. If you are unsatisfied with the word list presented, the 'New Board' button will generate a list of 25 new words. Duplicates are currently possible, please manually verify that they do not exist on your board before playing.

To specify custom words, add `?words=one,two,three...` to the end of the URL in your address bar on the live site. The generator will always produce 25 cards, regardless of the number of words given. Extra words will be truncated, missing words will be filled in at random.

To edit the board state, you can modify the words directly in the address bar. Alternatively, you can click the 'Edit' button to replace the board with 25 text boxes, make your changes there, and then click the 'Save' button to display the new board.

To mark a word as scored for the red team, replace it with the letter `r`. Similarly you can use `b`, `n`, or `a` to represent blue, neutral, or assassin words respectively.

Here is a demo board of one possibility for a [completed game].

[Codenames]: https://boardgamegeek.com/boardgame/178900/codenames
[github.io]: http://madrob.github.io/codewords/
[completed game]: http://madrob.github.io/codewords/?words=b,b,r,fair,mass,a,pole,r,r,b,turkey,n,r,cricket,bill,b,r,b,b,b,king,lap,r,n,tooth
