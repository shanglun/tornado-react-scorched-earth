export function getTerrainHeight(game){
  return Math.floor(game.height/3);
}

export function getTerrainTop(game){
  return Math.floor(2*game.height/3);
}

var checkTankDamage = function(tank, explosionX, explosionY, blastX, blastY){
  var epRect = new Phaser.Rectangle(explosionX - blastX/2, explosionY-blastY/2,blastX,blastY);
  var intersect = Phaser.Rectangle.intersection(tank.bounds(),epRect);
  if(intersect.width > 0 && intersect.height > 0){
    tank.damage(Math.floor(Math.sqrt(intersect.width * intersect.height)));
  }
}

var processCollision = function(bullet, terrain, tank){
  terrain.killTerrain(bullet.getX(), bullet.getY());

  tank.setFallTo(terrain.calcFallHeight(
    tank.getX(),
    tank.getW()
  ));
  checkTankDamage(tank,bullet.getX(), bullet.getY(), bullet.getBX(), bullet.getBY());
  bullet.explode();
}

var checkBulletTerrainCollision = function(bullet, terrain, tank){
  if(!bullet.explodeable()) return false;
  var intersect = Phaser.Rectangle.intersection(terrain.bounds(), bullet.bounds());
  var ix = Math.floor(intersect.x), iy = Math.floor(intersect.y);
  for(var i = 0; i < intersect.width; i++){
    for(var j = 0; j<intersect.height;j++){
      if(terrain.solidityChk(ix+i,iy+j)){
        return true;
      }
    }
  }
  return false;
}

var checkBulletTankCollision = function(bullet, terrain, tank){
  if(!bullet.explodeableTank()) return false;
  var intersection = Phaser.Rectangle.intersection(tank.bounds(), bullet.bounds());
  if(intersection.width && intersection.height){
    return true;
  }
  return false;
}

export function checkCollisions(bullet,terrain,tank){
  if(checkBulletTerrainCollision(bullet,terrain,tank) ||
    checkBulletTankCollision(bullet,terrain,tank)){
      processCollision(bullet,terrain,tank)
    }
}
