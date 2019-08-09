var buttons = new Array()
var allButtons = new Array()
var flipButton = new Array()
var colours
var coordinates = {x:1, y:1}
var gameScore=0
var removedCount = 0


function changeCoords(x,y) {
	buttons[coordinates.x][coordinates.y].icon.css("box-shadow", "")
	coordinates.x += x
	coordinates.y += y
	if (coordinates.x < 0) coordinates.x = 0;
	if (coordinates.x > 3) coordinates.x = 3;
	if (coordinates.y < 0) coordinates.y = 0;
	if (coordinates.y > 3) coordinates.y = 3;
	coordinates.y = coordinates.y % 4
	buttons[coordinates.x][coordinates.y].icon.css("box-shadow", "0 0 10px #000")

}

function Button(x,y) {
	this.icon = $('<div class="memoryButton" />')
	this.flipBack(0);
	this.x = x;
	this.y = y;
	this.removed = false
	var t = this;
	this.icon.click(function () {t.onClick()});
	buttons[x][y] = this;
	allButtons.push(this);
}

Button.prototype.flipBack = function(time) {
	var icon = this.icon
	window.setTimeout(function () {
		icon.css("background-image","url(card_bg.gif)")
	}, time)
}

Button.prototype.remove = function(time) {
	this.icon.fadeOut(time)
	this.removed = true
	removedCount++
}

Button.prototype.onClick = function() {
	 //alert( "Handler for.click()"+i+","+j+"called." );
	 if (this.removed) return;

	 if (flipButton.indexOf(this) >= 0)
	 {
	 	return;
	 }
	 this.icon.css("background", this.colour)
	 flipButton.push(this)
	 if (flipButton.length == 2)
	 {
	 	if (flipButton[0].colour == flipButton[1].colour)
	 	{
	 		flipButton[0].remove(2000)
	 		flipButton[1].remove(2000)
			//alert("match")
			if (gameOver()) {
				exit_notification()
			}
	 	}
	 	else
	 	{
	 		//alert("don't match")
			flipButton[0].flipBack(2000)
			flipButton[1].flipBack(2000)

			set_game_score(gameScore+1)



	 	}
	 	flipButton=[];
	 }
}

function gameOver() {
	return removedCount >= 16;
}

function createTable() {

	for (var i=0; i<4; i++) {
		buttons[i] = new Array()
	}

	var table = $("<table>");
	for (var i=0; i<4; i++) {
	    	var row = $("<tr>");
	    	for (var j=0; j<4; j++) {
		    	var t = $('<td></td>')
		        	var btn = new Button(j,i)
		        	t.append(btn.icon)
		        	row.append(t);

	    }
	    table.append(row);
	}
	$("#blub").empty().append(table);
}

function takeRandomButton() {
	var i = Math.floor(Math.random()*allButtons.length)
	var btn = allButtons[i]
	allButtons.splice(i,1) // remove element i
	return btn
}

function loadColours() {
	$.ajax("colours.conf")
	.done(function(data) {
		colours = data.match(/#[0-9a-f]+/ig)
		colours.forEach(function (col) {
			var a = takeRandomButton()
			var b = takeRandomButton()
			a.colour = col
			b.colour = col
		})

		//alert(colours)
	})
	.fail(function(data, a,b) {
		alert("fail " + data)
		alert(a)
		alert(b)
	})
}


document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
       	changeCoords(-1,0)
    }
    else if(event.keyCode == 39) {
        changeCoords(1,0)
    }
     else if(event.keyCode == 38) {
        changeCoords(0,-1)
    }
     else if(event.keyCode == 40) {
        changeCoords(0,1)
    }
    else if(event.keyCode == 13) {
        buttons[coordinates.x][coordinates.y].onClick()
    }
});

function restart_button() {
	$("#restartButton").on("click",function(){
	//console.log($(this).text());
	//alert ("restart")
	new_game()
	});
}

function set_game_score(x) {
	gameScore=x
	$("#gameScore").text(gameScore)

}

function new_game() {
	set_game_score(0)
	buttons = new Array()
	allButtons = new Array()
	flipButton = new Array()
	coordinates = {x:1, y:1}
	removedCount = 0
	createTable()
	loadColours()
}

function exit_notification() {
	var dialog = $('<div>Game Over!!</div>')
		.addClass("dialog")

	var restartBtn = $('<button type="button">Restart Game</button>')
	restartBtn.on("click",  function () {
		dialog.fadeOut(1000)
		new_game()
	})
	restartBtn.appendTo(dialog)

	dialog.appendTo("body")
	dialog.hide().show( "fold", 1000);
}


function main() {
	new_game()
	restart_button()
}

main();
