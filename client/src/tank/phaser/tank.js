import {getTerrainHeight, getTerrainTop} from './globvars';
import FireBall from './weapons/fireball';

export default function Tank(game,x,y,tankRsc,turretRsc, serverId){
  const MAX_HEALTH = 200;
  let tank = game.add.sprite(x,y,tankRsc);
  tank.scale.x = tank.scale.y = .2;
  tank.anchor.setTo(0.5,0.5);
  tank.collideWorldBounds=true;
  game.physics.arcade.enable(tank);
  let turret = game.add.sprite(296,190, turretRsc);
  turret.scale.x = turret.scale.y = .2;
  turret.anchor.setTo(0,0.5);
  turret.order = 2;
  tank.bringToTop();
  let terrTop = getTerrainTop(game);
  let adjTerrToGame = (y) => terrTop + y;
  let collidingWithTerrain = ()=> (tank.y + tank.height/2) >= adjTerrToGame(fallTo);

  this.getX = () => tank.x;
  this.getW = () => tank.width;
  let fallTo = 0;
  this.setFallTo = (newFallTo)=>{fallTo = newFallTo;}

  let fireball = new FireBall(game);
  let shootForce = 0;
  this.activeBullet = ()=> fireball;

  this.bounds = ()=>tank.getBounds();
  tank.health = 200;
  let labelHealth = game.add.text(20, 35, `hp: ${MAX_HEALTH}/${MAX_HEALTH}`,
    { font: "12px Arial", fill: "#ffffff" });
  let labelForce = game.add.text(20,35, `force: ${shootForce}`,
    { font: "12px Arial", fill: "#ffffff" });
  this.damage = (damage) => tank.damage(damage);

  let processFall = ()=>{
    if(!collidingWithTerrain()){
      tank.y += 1;
    }
  }

  let processWeapons = ()=>{
    if(game.turnHandler.isMyTurn(this.tankId)){
      turret.rotation = game.physics.arcade.angleToPointer(turret);
      if(game.input.activePointer.isDown){
        shootForce = shootForce > 500? 0: shootForce + 3;

      } else {
        if(shootForce > 0){
            this.serverDispatchShoot(serverId, shootForce, turret.rotation, turret.x, turret.y);
            //fireball.fire(shootForce, turret.rotation, turret.x, turret.y);
            game.turnHandler.doneTurn(this.tankId);
            shootForce = 0;
        }
      }
    }
    fireball.update();
  }
  this.processDispatchShoot = function(shooterId,shootForce,rotation, xPos, yPos) {
    if(serverId == shooterId){
      fireball.fire(shootForce, rotation, xPos, yPos);
    }
  }

  let processAuxillaries = () => {
    turret.x = tank.x - 6;
    turret.y = tank.y - 10;
    labelHealth.x = tank.x-10;
    labelHealth.y = tank.y - 50;
    labelHealth.text = `hp: ${tank.health}/${MAX_HEALTH}`;
    labelForce.x = tank.x - 10;
    labelForce.y = tank.y - 75;
    labelForce.text = `force: ${shootForce}`;
  }

  this.update = ()=>{
    if(!tank.alive) {
      labelHealth.kill();
      labelForce.kill();
      turret.kill();
      return;
    }
    processFall();
    processWeapons();
    processAuxillaries();
  }
  this.tankId = -1;
  this.serverId = serverId;

}
