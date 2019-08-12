var list = ["maze.html", "snake.html", "fortuneteller.html", "2048.html", "moodgame.html", "pacman.html"];


function randomgame(){
  console.log("test")
  // console.log();
  // the math function take a number randomly from 0-5 and ise the index to access the list
  window.location = list[Math.floor(Math.random() * 6)];
}
