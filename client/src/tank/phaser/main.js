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
  },
  update: function() {
    this.turret.rotation = game.physics.arcade.angleToPointer(this.turret);
  },
  mousemove: function(pointer, x, y) {

  }



};

game.state.add('main',main);

export default game;
