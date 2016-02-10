import {getTerrainHeight, getTerrainTop} from './globvars';

export default function Tank(game,x,y){
  var tank = game.add.sprite(x,y,'Tank');
  tank.scale.x = .2;
  tank.scale.y = .2;
  tank.anchor.setTo(0.5,0.5);
  tank.collideWorldBounds=true;
  var turret = game.add.sprite(296,190,"Turrent");
  turret.scale.x = .2;
  turret.scale.y = .2;
  turret.anchor.setTo(0,0.5);
  turret.order = 2;
  tank.bringToTop();
  var terrTop = getTerrainTop(game);
  var terrHt = getTerrainHeight(game);
  var terrStart = game.height - terrTop;
  this.getX = () => tank.x;
  this.getW = () => tank.width;

  var collidingWithTerrain = ()=>{
    var adjTerrToGame = (y) => terrTop + y;
    return (tank.y + tank.height/2) < adjTerrToGame(this.fallTo);
  }

  this.fallTo = 0;
  this.setFallTo = (fallTo)=>{this.fallTo = fallTo;}
  this.update = ()=>{
    if(collidingWithTerrain()){tank.y += 1;}
    turret.x = tank.x - 6;
    turret.y = tank.y - 10;
    turret.rotation = game.physics.arcade.angleToPointer(turret);
  }

}
