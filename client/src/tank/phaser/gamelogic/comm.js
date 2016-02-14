import Tank from '../tank';

function Communicator(){
  let ws;
  let infoComp;
  let started = false;
  this.initInfoComp = (comp) => {
    //relay initial game state
    //save comp referece
    //set up communicator methods for the comp to use. 
  }
  this.init = (game, tankList) =>{
    ws = new WebSocket("ws://localhost:8888/socket/tank");
    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'beginTank'
      }));
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
        for(let tankdata of msg.data.tanks){
          let tank = new Tank(game, tankdata.xPos, tankdata.yPos,
            tankdata.TankRc,tankdata.TurretRc, tankdata.serverId);
          tankList.push(tank);
          registerTank(tank);
          game.turnHandler.register(tank);
        }
      }
      if(msg.command == 'shoot'){
        for(let tank of tankList){
          tank.processDispatchShoot(msg.data.shooterId,
            msg.data.shootForce,msg.data.rotation, msg.data.xPos, msg.data.yPos);
        }
      }
    }
  }
}

export default new Communicator()
