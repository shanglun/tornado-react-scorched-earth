import Terrain from './terrain';
import Tank from './tank';
import {checkCollisions} from './gamelogic/collision';
import TH from './gamelogic/turn'
let game = new Phaser.Game(800,450, Phaser.AUTO,'game');

let main = {
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
    game.turnHandler = new TH();
    this.tanks = [];
    this.tanks.push(new Tank(game, 200, 200, 'Tank1','Turret1'));
    this.tanks.push(new Tank(game, 600, 200, 'Tank2','Turret2'));
    for(let tank of this.tanks){
      game.turnHandler.register(tank);
    }
    this.terrain = new Terrain(game);
    this.terrain.draw();
  },
  update: function() {
    for(let tank of this.tanks){
      tank.update();
      checkCollisions(tank.activeBullet(), this.terrain, this.tanks);
    };
  },
};

game.state.add('main',main);

export default game;
