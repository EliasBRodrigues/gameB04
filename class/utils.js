function collisionRectang({rectOne, recTwo}){
    return (
        rectOne.attackBox.position.x + rectOne.attackBox.width >=
        recTwo.position.x &&
      rectOne.attackBox.position.x <=
        recTwo.position.x + recTwo.width &&
      rectOne.attackBox.position.y + rectOne.attackBox.height >=
        recTwo.position.y &&
      rectOne.attackBox.position.y <= recTwo.position.y + recTwo.height
    )
}

function whoWinner({player, enemy, timerId}){
    clearTimeout(timerId);
    document.querySelector('#displayTie').style.display = 'flex';
        if(player.health === enemy.health){
            document.querySelector('#displayTie').innerHTML = 'TIE GAME'
        
        } else if(player.health > enemy.health){
            document.querySelector('#displayTie').innerHTML = 'PLAYER 1 WINS';

        } else if(player.health < enemy.health){
            document.querySelector('#displayTie').innerHTML = 'PLAYER 2 WINS';
        }
    }

let timer = 30;
let timerId;
function timerGame(){
    if(timer > 0) {
    timerId = setTimeout(timerGame, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer === 0){
        whoWinner({player, enemy, timerId})
    }
}