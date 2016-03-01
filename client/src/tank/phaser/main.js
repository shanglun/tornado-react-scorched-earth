/* jshint esversion:6 */
import Terrain from './terrain';
import Tank from './tank';
import {checkCollisions} from './gamelogic/collision';
import TH from './gamelogic/turn';
import comm from './gamelogic/comm';
let game = new Phaser.Game(800,450, Phaser.AUTO,'game');

//Interface to the phaser library
let main = {
  preload: function() {
		this.stage.backgroundColor = '#04D90E';//'#B4D9E7';
    this.stage.disableVisibilityChange = true; //run while not in focus
    game.load.image("Tank1","static/rcs/tank.png");
    game.load.image("Turret1","static/rcs/nozzle.png");
    game.load.image("Tank2","static/rcs/purpletank.png");
    game.load.image("Turret2","static/rcs/purplenozzle.png");
    game.load.image("Tank3","static/rcs/greentank.png");
    game.load.image("Turret3","static/rcs/greennozzle.png");
    game.load.image("Tank4","static/rcs/redtank.png");
    game.load.image("Turret4","static/rcs/rednozzle.png");
    game.load.image('fireball','static/rcs/fireball.png');
    game.load.spritesheet('explosion','static/rcs/explosion.png',64,64,23);
  },
  create: function() {
    this.tanks = [];
    game.Tank = Tank;
    game.turnHandler = new TH(
      game.add.text(20, 35, `Player1's turn`,
        { font: "15px Arial", fill: "#ffffff" }));
    comm.init();

    comm.registerAction('makeTanks', (data)=>{
      for(let tankdata of data.tanks){
        let tank = new game.Tank(game, tankdata.xPos, tankdata.yPos,
          tankdata.TankRc,tankdata.TurretRc, tankdata.serverId);
        this.tanks.push(tank);
        game.turnHandler.register(tank);
      }
      if(data.terrainRand !== undefined && this.terrain == undefined){
        this.terrain = new Terrain(game, data.terrainRand);
        this.terrain.draw();
      }
    },this);


  },
  update: function() {
    for(let tank of this.tanks){
      tank.update();
      checkCollisions(tank.activeBullet(), this.terrain, this.tanks);
    }
  },
};

game.state.add('main',main);

export default game;
