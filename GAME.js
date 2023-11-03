"use strict";

// Save DOM objects to variables
const turtle = document.querySelector( '#turtle' );
const poles = document.querySelectorAll( '.pole' );
const pole1 = document.querySelector( '#pole-1' );
const pole2 = document.querySelector( '#pole-2' );
const scoreSpan = document.querySelector( '#score' );
const speedSpan = document.querySelector( '#speed' );
const gameArea = document.querySelector( '#game-area' );
const restartBtn = document.querySelector( '#restart-btn' );
const containerWidth = gameArea.clientWidth;
const containerHeight = gameArea.clientHeight;

// make some variables accesible to functions.
let speed;
let score;
let swimming;
let playing;
let scoreUpdated;

function restart() {
  // Remove event listener to avoid multiple restarts.
  restartBtn.removeEventListener( 'click', restart );
  speed = 2;
  score = 0;
  scoreUpdated = false;
  swimming = false;
  playing = true;
  speedSpan.textContent = speed;
  scoreSpan.textContent = score;
  poles.forEach( ( pole ) => {
  pole.style.right = 0;
  } );
  turtle.style.top = 20 + "%";
  gameLoop();
}

function update() {
  // Move poles
  // check on SO if/why we need such a wordy method.
  let polesCurrentPos = parseFloat( window.getComputedStyle( poles[0] ).getPropertyValue( "right" ) );

  // Update score
  if ( polesCurrentPos > containerWidth * 0.85 ) { // or whatever bird pos is.
  if ( !scoreUpdated ) {
      score += 1;
      scoreUpdated = true;
  }
  scoreSpan.textContent = score;
  }

  //  Check whether the poles went putside of game area.
  if ( polesCurrentPos > containerWidth ) {

  // Generate new poles. 
  let newHeight = parseInt( Math.random() * 100 );
  // Change the poles' height
  pole1.style.height = 100 + newHeight + "px";
  pole2.style.height = 100 - newHeight + "px";

  // Move poles back to the right-hand side of game area.
  polesCurrentPos = 0; // This is based on the "right" property.

  // Update speed
  speed += 0.25;
  speedSpan.textContent = parseInt( speed );
  scoreUpdated = false;
  }
  poles.forEach( ( pole ) => {
    pole.style.right = polesCurrentPos + speed + "px";
    } );

    // Move bird
    let turtleTop = parseFloat( window.getComputedStyle( turtle ).getPropertyValue( "top" ) );
    if ( swimming ) {
    turtle.style.top = turtleTop + -2 + "px";
    } else if ( turtleTop < containerHeight - turtle.clientHeight ) {
    turtle.style.top = turtleTop + 2 + "px";
    }

    // Check for collisions
    if ( collision( turtle, pole1 ) || collision( turtle, pole2 ) || turtleTop <= 0 || turtleTop > containerHeight - turtle.clientHeight ) {
    gameOver();
    }
}

function gameOver() {
  window.console.log( "game over" );
  playing = false;
  restartBtn.addEventListener( 'click', restart );
}

function gameLoop() {
  update();
  if ( playing ) {
  requestAnimationFrame( gameLoop );
  }
}

function collision( gameDiv1, gameDiv2 ) {
  // Get the top left coords of the first div
  let left1 = gameDiv1.getBoundingClientRect().left;
  let top1 = gameDiv1.getBoundingClientRect().top;

  // Get the dimensions of the first div
  let height1 = gameDiv1.clientHeight;
  let width1 = gameDiv1.clientWidth;

  let bottom1 = top1 + height1;
  let right1 = left1 + width1;
  let left2 = gameDiv2.getBoundingClientRect().left;
  let top2 = gameDiv2.getBoundingClientRect().top;
  let height2 = gameDiv2.clientHeight;
  let width2 = gameDiv2.clientWidth;
  let bottom2 = top2 + height2;
  let right2 = left2 + width2;

  if ( bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2 )
  return false;
  return true;
}

// Start flapping with space bar
document.addEventListener( "keydown", function ( e ) {
  var key = e.key;
  if ( key === " " && playing ) {
  swimming = true;
  }
} );

// Stop flapping with space bar
document.addEventListener( "keyup", function ( e ) {
  e.preventDefault(); // Stops weird behaviour where releasing space calls restart()
  var key = e.key;
  if ( key === " " && playing ) {
    swimming = false;
  }
} );

// Start flapping with mousedown
gameArea.addEventListener( "mousedown", function ( e ) {
  if ( playing ) {
  swimming = true;
  }
} );

// stop flapping with mousedown
gameArea.addEventListener( "mouseup", function ( e ) {
  if ( playing ) {
  swimming = false;
  }
} );

restart();