import Terrain from './terrain'
import Tank from './tank'
var game = new Phaser.Game(800,450, Phaser.AUTO,'game');

var main = {
  preload: function() {

		this.stage.backgroundColor = '#04D90E'//'#B4D9E7';
    this.stage.disableVisibilityChange = true; //run while not in focus
    game.load.image("Tank","static/rcs/tank.png");
    game.load.image("Turrent","static/rcs/nozzle.png");
  },
  create: function() {
    this.tank = new Tank(game, 300, 200);
    this.terrain = new Terrain(game);
    this.terrain.draw();
  },
  update: function() {
    this.tank.update()
    if (game.input.activePointer.isDown)
    {
        this.terrain.killTerrain(game.input.x, game.input.y);
        this.tank.setFallTo(this.terrain.calcFallHeight(
          this.tank.getX(),
          this.tank.getW()
        ));
    }
  },
};

game.state.add('main',main);

export default game;
