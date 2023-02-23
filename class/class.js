class Sprites {
    constructor({
            position, 
            imageSrc, 
            scale = 1, 
            framesMax = 1, 
            offset = {x: 0, y: 0}
    }){
        this.position = position;
        this.width = 50
        this.height = 150;
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax,
        this.frameCurrent = 0,
        this.frameRun = 0,
        this.frameOver = 5,
        this.offset = offset
    }

    draw(){
        c.drawImage(
            this.image, 
            this.frameCurrent * (this.image.width/this.framesMax), 
            0, 
            this.image.width/this.framesMax, 
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width/this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames(){
        this.frameRun++
        if(this.frameRun % this.frameOver === 0){
            if(this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprites{
    constructor({
            position, 
            velocity, 
            color = 'red', 
            imageSrc, 
            scale = 1, 
            framesMax = 1,
            offset = {x: 0, y: 0},
            sprites,
            attackBox = {offset : {}, width: undefined, height: undefined}
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.width = 50
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameRun = 0
        this.frameCurrent = 0
        this.frameOver = 9
        this.sprites = sprites
        this.death = false
        
        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

  

    update(){
        this.draw()
        if(!this.death) this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //next player enemy
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 90){
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity;
    }
        
        attack(){
            this.switchSprite('attackOne')
            this.isAttacking = true
            
        }

        takeHit(){
            this.health -= 20

            if(this.health <= 0){
                this.switchSprite('dead')
            } else this.switchSprite('takeHit')
        }

        switchSprite(sprite){

            if(this.image === this.sprites.dead.image){
                if(this.frameCurrent === this.sprites.dead.framesMax - 1) 
                    this.death = true
                return

            }
            // not gets hit
            if(
                this.image === this.sprites.attackOne.image && this.frameCurrent < this.sprites.attackOne.framesMax - 1)return

            // gets hit
            if(this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1) return

            switch(sprite){
                case 'idle':
                    if(this.image !== this.sprites.idle.image){
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.frameCurrent = 0

                    }
                    break

                case 'run':
                    if(this.image !== this.sprites.run.image){
                        this.image = this.sprites.run.image
                        this.framesMax = this.sprites.run.framesMax
                        this.frameCurrent = 0

                    }
                    break

                case 'jump':
                    if(this.image !== this.sprites.jump.image){
                        this.image = this.sprites.jump.image
                        this.framesMax = this.sprites.jump.framesMax
                        this.frameCurrent = 0

                    }
                    break
                case 'fall':
                    if(this.image !== this.sprites.fall.image){
                        this.image = this.sprites.fall.image
                        this.framesMax = this.sprites.fall.framesMax
                        this.frameCurrent = 0
                    }
                    break
                case 'attackOne':
                    if(this.image !== this.sprites.attackOne.image){
                        this.image = this.sprites.attackOne.image
                        this.framesMax = this.sprites.attackOne.framesMax
                        this.frameCurrent = 0
                    }
                    break
                case 'takeHit':
                    if(this.image !== this.sprites.takeHit.image){
                        this.image = this.sprites.takeHit.image
                        this.framesMax = this.sprites.takeHit.framesMax
                        this.frameCurrent = 0
                    }
                    break
                case 'dead':
                    if(this.image !== this.sprites.dead.image){
                        this.image = this.sprites.dead.image
                        this.framesMax = this.sprites.dead.framesMax
                        this.frameCurrent = 0
                    }
                    break
            }
        }
    }


