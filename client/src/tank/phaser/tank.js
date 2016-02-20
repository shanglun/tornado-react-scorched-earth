/* jshint esversion:6 */
import {getTerrainHeight, getTerrainTop} from './globvars';
import FireBall from './weapons/fireball';
import comm from './gamelogic/comm';

export default function Tank(game,x,y,tankRsc,turretRsc, serverId){
  const MAX_HEALTH = 200;
  let tank = game.add.sprite(x,y,tankRsc);
  tank.scale.x = tank.scale.y = 0.2;
  tank.anchor.setTo(0.5,0.5);
  tank.collideWorldBounds=true;
  game.physics.arcade.enable(tank);
  let turret = game.add.sprite(296,190, turretRsc);
  turret.scale.x = turret.scale.y = 0.2;
  turret.anchor.setTo(0,0.5);
  turret.order = 2;
  tank.bringToTop();
  let terrTop = getTerrainTop(game);
  let adjTerrToGame = (y) => terrTop + y;
  let collidingWithTerrain = ()=> (tank.y + tank.height/2) >= adjTerrToGame(fallTo);

  this.getX = () => tank.x;
  this.getW = () => tank.width;
  let fallTo = 0;
  this.setFallTo = (newFallTo)=>{fallTo = newFallTo;};

  let fireball = new FireBall(game);
  let shootForce = 0;
  this.activeBullet = ()=> fireball;

  this.bounds = ()=>tank.getBounds();
  tank.health = 200;
  let labelHealth = game.add.text(20, 35, `hp: ${MAX_HEALTH}/${MAX_HEALTH}`,
    { font: "12px Arial", fill: "#ffffff" });
  let labelForce = game.add.text(20,35, `force: ${shootForce}`,
    { font: "12px Arial", fill: "#ffffff" });
  let labelName = game.add.text(20,35, `name: ${'player'}`,
    { font: "12px Arial", fill: "#ffffff" });
  this.damage = (damage) => tank.damage(damage);

  let processFall = ()=>{
    if(!collidingWithTerrain()){
      tank.y += 1;
    }
  };

  let processWeapons = ()=>{
    //Update the weapon it fired. If the tank belongs to the player,
    //update turret position and force as well
    if(comm.tankIsMe(serverId)){
      if(game.turnHandler.isMyTurn(this.tankId)){
        turret.rotation = game.physics.arcade.angleToPointer(turret);
        if(game.input.activePointer.isDown){
          shootForce = shootForce > 500? 0: shootForce + 3;

        } else {
          if(shootForce > 0){
              this.serverDispatchShoot(serverId, shootForce, turret.rotation, turret.x, turret.y);
              shootForce = 0;
          }
        }
      }
    }
    fireball.update();
  };
  this.processDispatchShoot = function(shooterId,shootForce,rotation, xPos, yPos) {
    //Process shoot message from the server -
    //shoot with shootForce with rotation at (xPos,yPos) if the tankId matches the shooterId
    if(serverId == shooterId){
      turret.rotation = rotation;
      fireball.fire(shootForce, rotation, xPos, yPos);
      game.turnHandler.doneTurn(this.tankId);
    }
  };

  let processAuxillaries = () => {
    //Process labels and turret, etc that moves with the tank.
    turret.x = tank.x - 6;
    turret.y = tank.y - 10;
    labelHealth.x = tank.x-10;
    labelHealth.y = tank.y - 50;
    labelHealth.text = `hp: ${tank.health}/${MAX_HEALTH}`;
    labelForce.x = tank.x - 10;
    labelForce.y = tank.y - 65;
    labelForce.text = `force: ${shootForce}`;
    labelName.x = tank.x - 10;
    labelName.y = tank.y - 80;
    let name = comm.getPlayerName(serverId);
    labelName.text = `${name}`;
  };

  this.update = ()=>{
    //Kill auxillaries if needed, check weapons, and see if the tank needs to fall
    if(!tank.alive) {
      labelHealth.kill();
      labelForce.kill();
      turret.kill();
      game.turnHandler.doneTurn(this.tankId); // you're dead, you're done.
      return;
    }
    processFall();

    if(comm.gameStarted()) {
      processWeapons();
    }
    processAuxillaries();
  };
  this.tankId = -1;
  this.serverId = serverId;

}
