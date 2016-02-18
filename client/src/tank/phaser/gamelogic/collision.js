/* jshint esversion:6 */
let checkTankDamage = function(tank, explosionX, explosionY, blastX, blastY){
  let epRect = new Phaser.Rectangle(explosionX - blastX/2, explosionY-blastY/2,blastX,blastY);
  let intersect = Phaser.Rectangle.intersection(tank.bounds(),epRect);
  if(intersect.width > 0 && intersect.height > 0){
    tank.damage(Math.floor(Math.sqrt(intersect.width * intersect.height)));
  }
};

let processCollision = function(bullet, terrain, tanks){
  terrain.killTerrain(bullet.getX(), bullet.getY());
  for(let tank of tanks){
    tank.setFallTo(terrain.calcFallHeight(
      tank.getX(),
      tank.getW()
    ));
    checkTankDamage(tank,bullet.getX(), bullet.getY(), bullet.getBX(), bullet.getBY());
  }
  bullet.explode();
};

let checkBulletTerrainCollision = function(bullet, terrain){
  if(!bullet.explodeable()) return false;

  let intersect = Phaser.Rectangle.intersection(terrain.bounds(), bullet.bounds());
  if(intersect.width === 0 && intersect.height === 0){
    return false;
  }
  let ix = Math.floor(intersect.x), iy = Math.floor(intersect.y);
  for(let i = 0; i < intersect.width; i++){
    for(let j = 0; j<intersect.height;j++){
      if(terrain.solidityChk(ix+i,iy+j)){
        return true;
      }
    }
  }
  return false;
};

let checkBulletTankCollision = function(bullet, terrain, tank){
  if(!bullet.explodeableTank()) return false;
  let intersection = Phaser.Rectangle.intersection(tank.bounds(), bullet.bounds());
  return intersection.width > 0 && intersection.height >0;
};

export function checkCollisions(bullet,terrain,tanks){
  let collision = false;
  if( !(collision = checkBulletTerrainCollision(bullet,terrain)) ){
    for(let tank of tanks){
      collision = checkBulletTankCollision(bullet,terrain,tank);
      if(collision)
        break;
    }
  }
  if(collision){
    processCollision(bullet,terrain,tanks);
  }
}
