var cardInFocus = 0; //index of the card in focus
var flippedCards = []; //array to keep track of the cards that are flipped
var score = 0; //user's current score
var wait = false; //flag to prevent the user to flip new cards before all cards are facing downwards again

$(document).ready(function () {

    //add game info
    $("#gameInfo").append("<p id='score'>Current Score: " + score + " points</p>");

    var colourArray = ['#3be6c4','#e6e03b','#6f3be6','#4fe63b','#e63b3b','#ff5a00','#ff00de','#3b8fe6'];

    colourArray = colourArray.concat(colourArray); //make sure there is 2 cards of every colour
    shuffle(colourArray); //shuffle the order of the colour

    for(i=0;i<colourArray.length;i++){
        var $newDiv = $("<div class = 'card'></div>");
        $newDiv.css("background-color",colourArray[i]);
        $("#gameboard").append($newDiv);
    }

	$("#gameboard").children().eq(cardInFocus).addClass("focus");
  $("#gameInfo").append("<p id='cardsLeft'>Number of cards left: " + $(".card").length + "</p>");

  $("button").click(function(){location.reload();});

});

//Shuffle the array with colours
function shuffle(array){
	for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
	return array;
};

//Shift focus from one card to another
function shiftFocus(previousCard,nextCard){
    $("#gameboard").children().eq(previousCard).removeClass("focus");
    $("#gameboard").children().eq(nextCard).addClass("focus");
    cardInFocus = nextCard;
}

//Move focus to the right
function moveRight(){
    for(i=cardInFocus+1;i<=$("#gameboard").children().length;i++){
        console.log(i);
        if(i===$("#gameboard").children().length){
            $("#gameboard").children().eq(cardInFocus).removeClass("focus");
            $("button").addClass("focus");
            cardInFocus = "button";
        }
        else if(!$("#gameboard").children().eq(i).prev().is(":last-child")){
            if(!$("#gameboard").children().eq(i).hasClass("flipped")){
                shiftFocus(cardInFocus,i);
                break;
            }
        }
    }
}

//Move focus to the left
function moveLeft(){
    if(cardInFocus != "button"){
        for(i=cardInFocus-1;i>=0;i--){
            if(!$("#gameboard").children().eq(cardInFocus).is(":first-child")){
                if(!$("#gameboard").children().eq(i).hasClass("flipped")){
                    shiftFocus(cardInFocus,i);
                    break;
                }
            }
        }
    }
    else if(cardInFocus == "button"){
        for(i=$("#gameboard").children().length-1;i>=0;i--){
            if(!$("#gameboard").children().eq(i).hasClass("flipped")){
                $("button").removeClass("focus");
                $("#gameboard").children().eq(i).addClass("focus")
                cardInFocus = i;
                break;
            }
        }
    }
}

//Move focus up
function moveUp(){
    for(i=cardInFocus-4;i>=0;i-=4){
        if(!$("#gameboard").children().eq(i).hasClass("flipped")){
            shiftFocus(cardInFocus,i);
            break;
        }
    }
}

//Move focus dowm
function moveDown(){
    for(i=cardInFocus+4;i<$("#gameboard").children().length;i+=4){
        if(!$("#gameboard").children().eq(i).hasClass("flipped")){
            shiftFocus(cardInFocus,i);
            break;
        }
    }
}

//Flip a card
function flip(){
    if(!wait){
        $("#gameboard").children().eq(cardInFocus).removeClass("card");
        $("#gameboard").children().eq(cardInFocus).addClass("flipped");
        flippedCards.push(cardInFocus);

        //if two cards are flipped compare them
        if(flippedCards.length === 2){
            var card1 = $("#gameboard").children().eq(flippedCards[0]);
            var card2 = $("#gameboard").children().eq(flippedCards[1]);
            compare(card1,card2);
        }

        //if all cards are flipped then the game is over
        if($(".flipped").length===$("#gameboard").children().length){
            var newGame = confirm("Game over! Your got " + score + " points. \nDo you want to play another round?");
            if(newGame){
                location.reload();
            }
            else{
                $("#gameboard").children().eq(cardInFocus).removeClass("focus");
                $("button").addClass("focus");
                cardInFocus = "button";
            }
        }
    }
}

//Compare the colours of two cards
function compare(card1,card2){
    if(card1.css("background-color") === card2.css("background-color")){
        console.log("Equal!");
        card1.fadeTo(2000,0);
        card2.fadeTo(2000,0);
        flippedCards = [];
        score++;
        $("#score").html("Current score: " + score + " points");
        $("#cardsLeft").html("Number of cards left: " + $(".card").length);

    }
    else{
        console.log("Not equal!");
        wait = true;
        setTimeout(function() {
            card1.removeClass("flipped").addClass("card");
            card2.removeClass("flipped").addClass("card");
            wait = false;
        },2000);
        flippedCards = [];
        score--;
        $("#score").html("Current score: " + score + " points");
    }
}

//Handling of the keyboard input
$(document).keydown(function(e) {
    e.preventDefault();
    switch(e.keyCode){

    case 39:
        moveRight();
        break;

    case 37:
        moveLeft();
        break;

    case 40:
        moveDown();
        break;

    case 38:
        moveUp();
        break;

    case 13:
        if(cardInFocus === "button" ){
            var newGame = confirm("Do you want to restart the game?");
            if(newGame){
                location.reload();
            }
        }
        else if(!$("#gameboard").children().eq(cardInFocus).hasClass("flipped")){
        flip();
        }
        break;
    }
});
