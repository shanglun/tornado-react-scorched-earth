export default function FireBall(game){
  var bullet = game.add.sprite(0, 0, 'fireball');
  bullet.scale.x= bullet.scale.y= 0.05;
  bullet.anchor.setTo(0.5, 0.5);

  bullet.checkWorldBounds = true;
  bullet.outOfBoundsKill = true;
  
  bullet.kill(); //kill it.

  var nextFire = game.time.now; //use this to control fire rate.
  this.fire = (force, rotation, xPos, yPos) => {
    if(game.time.now < nextFire) return;
    bullet.revive();
    bullet.reset(xPos,yPos);
    bullet.rotation = rotation;
    bullet.body.velocity.x = Math.cos(bullet.rotation) * force;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * force;
  }

  this.update = ()=>{
    if(!bullet.alive) return;
    bullet.body.velocity.y += 2;
    bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
  }
}
