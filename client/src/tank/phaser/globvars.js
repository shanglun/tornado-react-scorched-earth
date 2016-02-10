export function getTerrainHeight(game){
  return Math.floor(game.height/3);
}

export function getTerrainTop(game){
  return Math.floor(2*game.height/3);
}

export function checkBulletTerrainCollision(bullet, terrain){
  if(!bullet.explodeable()) return false;
  var intersect = Phaser.Rectangle.intersection(terrain.bounds(), bullet.bounds());
  var ix = Math.floor(intersect.x), iy = Math.floor(intersect.y);
  for(var i = 0; i < intersect.width; i++)
  {
    for(var j = 0; j<intersect.height;j++)
    {
      if(terrain.solidityChk(ix+i,iy+j))
      {
        terrain.killTerrain(bullet.getX(), bullet.getY());
        bullet.explode();
        return true;
      }
    }
  }
  return false;
}

export function checkBulletTankCollision(bullet, tank){
  if(!bullet.explodeableTank()) return false;
  return false;
}
