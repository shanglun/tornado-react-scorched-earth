/* jshint esversion:6 */
/*Handles socket communication between the tank game and server.*/
/*Todo: Refactor init to take callbacks, not actual game object and tanklist */
function Communicator(){
  let ws;
  let infoComp;
  let started = false;
  let myTankId = -1;
  let pNames = ["player1", "player2", "player3", "player4"];
  this.initInfoComp = (comp) => {
    /*Register the information component so we can display information later*/
    infoComp = comp;
  };
  this.startGame = () => {
    /* Ask the server to lock the session and start the game */
    ws.send(JSON.stringify({
      'action':'startGame'
    }));
  };
  this.gameStarted = () => started;
  this.amHost = () => myTankId === 0;
  this.getPlayerName = (serverId) => pNames[serverId];
  this.tankIsMe = (tankId) => myTankId == tankId;
  this.setName = (name) => {
    /* Ask the server to associate desired name with the player tank */
    ws.send(JSON.stringify({
      'action':'setPlayerName',
      'data':{
        id: myTankId,
        name: name
      }
    }));
  };
  this.init = (game, tankList) =>{
    /* Initialize the game connection to server. Set necessary callbacks.*/
    if (window.location.protocol == "https:") {
      ws = new WebSocket("wss://scorchedearthtornado.heroukapp.com:5000/socket/tank");
    } else {
      ws = new WebSocket("ws://scorchedearthtornado.heroukapp.com:5000/socket/tank");
    }
    ws.onopen = () => {};

    let registerTank = (tank)=>{
      /*Register the tank to the socket connection to send shoot messages*/
      tank.serverDispatchShoot = (shooterId, shootForce,rotation, xPos, yPos)=>{
        /* Send a shoot message to the server */
        ws.send(JSON.stringify({
          'action':'shoot',
          'shooterId': shooterId,
          'shootForce': shootForce,
          'rotation': rotation,
          'xPos': xPos,
          'yPos': yPos
        }));
      };
    };

    ws.onmessage = (evt) => {
      /* Parse message from the server and act accordingly. */
      let msg = JSON.parse(evt.data);

      if(msg.command == 'makeTanks'){
        /* Create tank objects as instructed by server */
        myTankId = msg.data.yourTank;
        for(let tankdata of msg.data.tanks){
          let tank = new game.Tank(game, tankdata.xPos, tankdata.yPos,
            tankdata.TankRc,tankdata.TurretRc, tankdata.serverId);
          tankList.push(tank);
          registerTank(tank);
          game.turnHandler.register(tank);
        }
        infoComp.commMessage({
          command:'setHost',
          data:{
            host: this.amHost()
          }
        });
      }
      if(msg.command == 'shoot'){
        for(let tank of tankList){
          tank.processDispatchShoot(msg.data.shooterId,
            msg.data.shootForce,msg.data.rotation, msg.data.xPos, msg.data.yPos);
        }
      }
      if(msg.command == 'startGame'){
        started = true;
        infoComp.commMessage({
          command:'setStartState',
          data: {
            started: started,
          }
        });
      }

      if(msg.command == "playerName"){
        pNames = msg.data.names;
      }
    };
  };
}

export default new Communicator();
