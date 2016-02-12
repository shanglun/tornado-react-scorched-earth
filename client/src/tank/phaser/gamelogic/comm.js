
//ws.onopen = function(){console.log("ws opened");};
//ws.onmessage = function(evt){console.log("evt: " + evt.data)};
//ws.onclose = function(){console.log("ws closed");};
//start by just communicating state to server.
import Tank from '../tank';

export default function Communicator(game, tankList){
  let ws = new WebSocket("ws://localhost:8888/socket/tank");
  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: 'beginTank'
    }));
  }
  ws.onmessage = (evt) => {
    let msg = JSON.parse(evt.data);

    if(msg.command == 'makeTanks'){
      for(let tankdata of msg.data.tanks){
        let tank = new Tank(game, tankdata.xPos, tankdata.yPos,
          tankdata.TankRc,tankdata.TurretRc);
        tankList.push(tank);
        game.turnHandler.register(tank);
      }
    }
  }
}
