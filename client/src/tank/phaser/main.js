import Terrain from './terrain'
import Tank from './tank'
import {checkCollisions} from './globvars'
var game = new Phaser.Game(800,450, Phaser.AUTO,'game');

var main = {
  preload: function() {
		this.stage.backgroundColor = '#04D90E'//'#B4D9E7';
    this.stage.disableVisibilityChange = true; //run while not in focus
    game.load.image("Tank","static/rcs/tank.png");
    game.load.image("Turret","static/rcs/nozzle.png");
    game.load.image('fireball','static/rcs/fireball.png');
    game.load.spritesheet('explosion','static/rcs/explosion.png',64,64,23);
  },
  create: function() {
    this.tank = new Tank(game, 300, 200);
    this.terrain = new Terrain(game);
    this.terrain.draw();
  },
  update: function() {
    this.tank.update();
    checkCollisions(this.tank.activeBullet(),this.terrain, this.tank);

  },
};

game.state.add('main',main);

export default game;
