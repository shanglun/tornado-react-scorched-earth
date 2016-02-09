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
    this.dimx = game.width;
    this.dimy = Math.floor(game.height/3);
    this.bmd = game.add.bitmapData(this.dimx,this.dimy);

    for(var i = 0; i < this.dimx; i++){
      for(var j = 0; j < this.dimy; j++){
        this.bmd.setPixel32(i,j,0,0x0f,0xff,0xff, false);
      }
    }
    this.bmd.context.putImageData(this.bmd.imageData, 0, 0);
    this.bmd.dirty=true;
    this.bmdTop = Math.floor(2*game.height/3)
    game.add.sprite(0,this.bmdTop,this.bmd);
  },
  update: function() {
    this.turret.rotation = game.physics.arcade.angleToPointer(this.turret);
    if (game.input.activePointer.isDown)
    {

        var clickx = game.input.x;
        var clicky = game.input.y - this.bmdTop;
        for(var i = 0; i < this.dimx; i++){
          for(var j=0; j < this.dimy; j++){
            if(i < clickx + 50 && i > clickx - 50 && j < clicky + 50 && j > clicky - 50)
              this.bmd.setPixel32(i,j,0,0,0,0, false);
            else
              this.bmd.setPixel32(i,j,0,0x0f,0xff,0xff,false);
          }
        }
        this.bmd.context.putImageData(this.bmd.imageData,0,0);
        this.bmd.dirty = true;
    }
  },
};

game.state.add('main',main);

export default game;
