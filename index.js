const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 570;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;

const background = new Sprites({
    position:{
        x: 0,
        y: 0,
    },
    imageSrc: 'img/background.png'
})

const shop = new Sprites({
    position:{
        x: 600,
        y: 136,
    },
    imageSrc: 'img/shop.png',
    scale: 2.7,
    framesMax: 6,
})

const player = new Fighter({
    position: {
        x: 200,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: 'anim/samurai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{
        x: 215,
        y: 150
    },
    sprites:{
        idle: {
            imageSrc: 'anim/samurai/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: 'anim/samurai/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: 'anim/samurai/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: 'anim/samurai/Fall.png',
            framesMax: 2,
        },
        attackOne: {
            imageSrc: 'anim/samurai/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc: 'anim/samurai/TakeHit.png',
            framesMax: 4
        },
        dead:{
            imageSrc: 'anim/samurai/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x: 70,
            y: 50
        },
        width: 200,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: 'anim/wizard/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 260,
    },
    sprites:{
        idle: {
            imageSrc: 'anim/wizard/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: 'anim/wizard/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: 'anim/wizard/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: 'anim/wizard/Fall.png',
            framesMax: 2,
        },
        attackOne: {
            imageSrc: 'anim/wizard/Attack1.png',
            framesMax: 8,
        },
        takeHit:{
            imageSrc: 'anim/wizard/TakeHit.png',
            framesMax: 3
        },
        dead:{
            imageSrc: 'anim/wizard/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x: -150,
            y: 50
        },
        width: 200,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },

    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}
let lastKey;

timerGame()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player
    player.switchSprite('idle')

    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
        

    } else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')

    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy
    enemy.switchSprite('idle')

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')

    } else {
        enemy.switchSprite('idle')
    }
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }
    

    //collision

    if(
        collisionRectang({
            rectOne: player, 
            recTwo: enemy,
        }) && 
        player.isAttacking && player.frameCurrent === 4)
    {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemy-health').style.width = enemy.health + '%'
    }

    // if player misses
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    if(
        collisionRectang({
            rectOne: enemy, 
            recTwo: player,
        }) && 
        enemy.isAttacking && enemy.frameCurrent === 2)
    {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#player-health').style.width = player.health + '%'
    }

    if(enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
    }

    if(enemy.health <= 0 || player.health <= 0){
        whoWinner({player, enemy, timerId})
    }

   

}

animate()

window.addEventListener('keydown', (event) => {
    if(!player.death){

        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
            break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            break

            case 'w':
                player.velocity.y = -15
            break

            case ' ':
                player.attack()
            break
    }
}


    if(!enemy.death){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
            break
    
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
            break
    
            case 'ArrowUp':
                enemy.velocity.y = -15
            break
    
            case 'ArrowDown':
                enemy.attack()
            break
        } 
    }  
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
        break
        
        case 'a':
            keys.a.pressed = false
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
    }
})