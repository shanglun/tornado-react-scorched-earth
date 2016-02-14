function Communicator(){
  let ws;
  let infoComp;
  let started = false;
  let myTankId = -1;
  let pNames = ["player1", "player2", "player3", "player4"];
  this.initInfoComp = (comp) => {
    infoComp = comp;
  }
  this.startGame = () => {
    ws.send(JSON.stringify({
      'action':'startGame'
    }));
  }
  this.gameStarted = () => started;
  this.amHost = () => myTankId == 0;
  this.getPlayerName = (serverId) => pNames[serverId];
  this.tankIsMe = (tankId) => myTankId == tankId;
  this.setName = (name) => {
    ws.send(JSON.stringify({
      'action':'setPlayerName',
      'data':{
        id: myTankId,
        name: name
      }
    }));
  }
  this.init = (game, tankList) =>{
    ws = new WebSocket("ws://localhost:8888/socket/tank");
    ws.onopen = () => {

    }

    let registerTank = (tank)=>{
      tank.serverDispatchShoot = (shooterId, shootForce,rotation, xPos, yPos)=>{
        ws.send(JSON.stringify({
          'action':'shoot',
          'shooterId': shooterId,
          'shootForce': shootForce,
          'rotation': rotation,
          'xPos': xPos,
          'yPos': yPos
        }));
      }
    }

    ws.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);

      if(msg.command == 'makeTanks'){
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

      if(msg.command = "playerName"){
        pNames = msg.data.names;
      }

    }
  }
}

export default new Communicator()
