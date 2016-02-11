import Terrain from './terrain'
import Tank from './tank'
import {checkCollisions} from './globvars'
var game = new Phaser.Game(800,450, Phaser.AUTO,'game');

var main = {
  preload: function() {
		this.stage.backgroundColor = '#04D90E'//'#B4D9E7';
    this.stage.disableVisibilityChange = true; //run while not in focus
    game.load.image("Tank1","static/rcs/tank.png");
    game.load.image("Turret1","static/rcs/nozzle.png");
    game.load.image("Tank2","static/rcs/purpletank.png");
    game.load.image("Turret2","static/rcs/purplenozzle.png");
    game.load.image('fireball','static/rcs/fireball.png');
    game.load.spritesheet('explosion','static/rcs/explosion.png',64,64,23);
  },
  create: function() {
    this.tanks = [];
    this.tanks.push(new Tank(game, 200, 200, 'Tank1','Turret1'));
    this.tanks.push(new Tank(game, 600, 200, 'Tank2','Turret2'));
    this.terrain = new Terrain(game);
    this.terrain.draw();
  },
  update: function() {
    this.tanks.forEach((tank)=>{
      tank.update();
      //check collision with every tank.
      checkCollisions(tank.activeBullet(), this.terrain, this.tanks);
    });
    //checkCollisions(this.tank.activeBullet(),this.terrain, this.tank);

  },
};

game.state.add('main',main);

export default game;
