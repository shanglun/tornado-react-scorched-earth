/* jshint esversion:6 */
/* Fireball class, the most basic weapon */
export default function FireBall(game){
  var bullet = game.add.sprite(0, 0, 'fireball');
  bullet.scale.x= bullet.scale.y= 0.05;
  bullet.anchor.setTo(0.5, 0.5);
  bullet.checkWorldBounds = true;
  bullet.outOfBoundsKill = true;
  bullet.kill();
  game.physics.arcade.enable(bullet); //velocity

  var explosion = game.add.sprite(200,200,'explosion');
  explosion.anchor.setTo(0.5,0.5);
  var anim = explosion.animations.add('explode');
  explosion.scale.y = explosion.scale.x = 2;
  anim.onComplete.add(function(){this.kill();},explosion);
  explosion.kill();
  //use these to control fire rate and explosion timing.
  var fireTime = game.time.now;
  var nextFire = game.time.now;
  this.fire = (force, rotation, xPos, yPos) => {
    //Fire the bullet with given force and rotation, from (xPos,yPos).
    if(game.time.now < nextFire) return;
    fireTime = game.time.now; //use this to check explodeable
    nextFire = fireTime + 500; //twice per second
    bullet.revive();
    bullet.reset(xPos,yPos);
    bullet.rotation = rotation;
    bullet.body.velocity.x = Math.cos(bullet.rotation) * force;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * force;
  };

  this.bounds = () => bullet.getBounds();
  this.explodeable = ()=> bullet.alive && fireTime + 300 < game.time.now;
  this.explodeableTank = ()=> bullet.alive && fireTime + 500 < game.time.now; //grace period
  this.explode = (xPos,yPos)=>{
    //Trigger explosion animation at (xPos, yPos) if the tank can be exploded.
    if(!this.explodeable()) return;
    explosion.revive();
    explosion.x = xPos || bullet.x;
    explosion.y = yPos || bullet.y;
    explosion.animations.play('explode',120,false);
    bullet.kill();
  };
  this.getX = ()=>bullet.x;
  this.getY = ()=>bullet.y;

  this.update = ()=>{
    //Update bullet position and rotation if bullet is in flight
    if(!bullet.alive) return;
    bullet.body.velocity.y += 2;
    bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
  };
  this.getBX = ()=>150; //blast X
  this.getBY = ()=>150;
}
