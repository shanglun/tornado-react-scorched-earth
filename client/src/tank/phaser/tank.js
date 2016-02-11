import {getTerrainHeight, getTerrainTop} from './globvars';
import FireBall from './weapons/fireball';

export default function Tank(game,x,y){
  var MAX_HEALTH = 200;
  var tank = game.add.sprite(x,y,'Tank');
  tank.scale.x = tank.scale.y = .2;
  tank.anchor.setTo(0.5,0.5);
  tank.collideWorldBounds=true;
  game.physics.arcade.enable(tank);
  var turret = game.add.sprite(296,190,"Turret");
  turret.scale.x = turret.scale.y = .2;
  turret.anchor.setTo(0,0.5);
  turret.order = 2;
  tank.bringToTop();
  var terrTop = getTerrainTop(game);
  var adjTerrToGame = (y) => terrTop + y;
  var collidingWithTerrain = ()=> (tank.y + tank.height/2) < adjTerrToGame(fallTo);

  this.getX = () => tank.x;
  this.getW = () => tank.width;
  var fallTo = 0;
  this.setFallTo = (newFallTo)=>{fallTo = newFallTo;}

  var fireball = new FireBall(game);
  var shootForce = 0;
  this.activeBullet = ()=> fireball;

  this.bounds = ()=>tank.getBounds();
  tank.health = 200;
  var labelhealth = game.add.text(20, 35, "hp: 200/200", { font: "12px Arial", fill: "#ffffff" });
  this.damage = function(damage){
    tank.damage(damage);
  }

  this.update = ()=>{
    if(!tank.alive) {
      labelhealth.kill();
      turret.kill();
      return;
    }
    if(collidingWithTerrain()){tank.y += 1;}
    turret.x = tank.x - 6;
    turret.y = tank.y - 10;
    turret.rotation = game.physics.arcade.angleToPointer(turret);
    if(game.input.activePointer.isDown){
      shootForce += 3;
    } else {
      if(shootForce > 0){
          fireball.fire(shootForce, turret.rotation, turret.x, turret.y)
          shootForce = 0;
      }
    }
    fireball.update();
    labelhealth.x = tank.x-10;
    labelhealth.y = tank.y - 50;
    labelhealth.text = "hp: " + tank.health +"/" + MAX_HEALTH;
  }

}
