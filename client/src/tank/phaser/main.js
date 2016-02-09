var game = new Phaser.Game(800,450, Phaser.AUTO,'game');

var main = {
  preload: function() {

		this.stage.backgroundColor = '#04D90E'//'#B4D9E7';
    this.stage.disableVisibilityChange = true; //run while not in focus
    game.load.image("Tank","static/rcs/tank.png");
    game.load.image("Turrent","static/rcs/nozzle.png");

  },
  create: function() {
    var tank = this.add.sprite(300,200,'Tank');
    tank.scale.x = .2;
    tank.scale.y = .2;
    tank.anchor.setTo(0.5,0.5);
    tank.collideWorldBounds=true;
    var turret = this.add.sprite(296,190,"Turrent");
    turret.scale.x = .2;
    turret.scale.y = .2;
    turret.anchor.setTo(0,0.5);
    turret.order = 2;
    tank.bringToTop();
    this.tank = tank;
    this.turret = turret;
    //tank.bringToTop();
    var dimx = game.width, dimy = Math.floor(game.height/3);
    var bmd = game.add.bitmapData(dimx,dimy);

    for(var i = 0; i < dimx; i++){
      for(var j = 0; j < dimy; j++){
        bmd.setPixel32(i,j,0,0x0f,0xff,0xff, false);
      }
    }
    bmd.context.putImageData(bmd.imageData, 0, 0);
    bmd.dirty=true;
    var bmdTop = Math.floor(2*game.height/3)
    game.add.sprite(0,bmdTop,bmd);
  },
  update: function() {
    this.turret.rotation = game.physics.arcade.angleToPointer(this.turret);
  },
};

game.state.add('main',main);

export default game;
