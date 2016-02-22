/* jshint esversion:6 */
/*Handles socket communication between the tank game and server.*/
/*Todo: Refactor init to take callbacks, not actual game object and tanklist */
function Dispatcher(){
  /* An object to keept track of action dispatching exclusively.  */
  let dispTbl = {};
  window.dispTbl = dispTbl;
  /* Register items to the dispatch table */
  this.registerAction = (serverCmd, callBack, context)=>{
    if(!dispTbl.hasOwnProperty(serverCmd)){
      dispTbl[serverCmd] = [{
        callBack: callBack,
        context:context
      }];
    } else {
      dispTbl[serverCmd].push({
        callBack: callBack,
        context: context
      });
    }
  };

  this.chkDispatch = (serverCmd, data)=>{
    if(dispTbl.hasOwnProperty(serverCmd)){
      for(let cbk of dispTbl[serverCmd]){
        cbk.callBack.call(cbk.context,data);
      }
    }
  };
}

function Communicator(){
  /* Singleton object tracks the current state of server communicaiton */
  let ws;
  let started = false;
  let myTankId = -1;
  let pNames = ["player1", "player2", "player3", "player4"];
  let dispatcher = new Dispatcher();
  this.registerAction= (serverCmd, callBack, context)=>{
    dispatcher.registerAction(serverCmd, callBack, context);
  }
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

  this.init = () =>{
    /* Initialize the game connection to server. Set necessary callbacks.*/
    if (window.location.protocol == "https:") {
      ws = new WebSocket("wss://localhost:8888/socket/tank");
    } else {
      ws = new WebSocket("ws://localhost:8888/socket/tank");
    }
    ws.onopen = () => {};

    this.serverDispatchShoot = (shooterId, shootForce,rotation, xPos, yPos)=>{
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

    ws.onmessage = (evt) => {
      /* Parse message from the server and act accordingly. */
      let msg = JSON.parse(evt.data);
      dispatcher.chkDispatch(msg.command, msg.data);
    };

    this.registerAction('makeTanks', (data)=>{myTankId = data.yourTank;},this);
    this.registerAction('startGame', (data)=>{started = true;}, this);
    this.registerAction('playerName', (data)=>{pNames = data.names;}, this);
  };
}

export default new Communicator();
