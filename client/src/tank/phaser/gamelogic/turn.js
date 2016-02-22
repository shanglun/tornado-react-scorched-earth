/* jshint esversion:6 */
import comm from './comm';

export default function TurnHandler(indicatorSprite){
  /* Keeps a list of tanks and keeps track of which turn it is */
  let tankIdList = [];
  let curIdx = 0;
  this.register = (tank) => {
    tank.tankId = tankIdList.length;
    tankIdList.push({
      gameId: tank.tankId,
      serverId: tank.serverId
    });
  };
  let setIndicatorText = ()=>{
    /* set the tank indicator. */
    let curPlName = comm.getPlayerName(tankIdList[curIdx].serverId);
    indicatorSprite.text = `${curPlName}'s Turn`;
  }
  /* Show indicator sprite only when the game has begun. */
  indicatorSprite.kill();
  comm.registerAction('startGame', indicatorSprite.revive, indicatorSprite);
  /* Update indicator text when new name is set */
  comm.registerAction('playerName',setIndicatorText,this);
  /* Check if it's tankId's turn */
  this.isMyTurn = (tankId) => tankIdList.findIndex(x=> x.gameId == tankId) == curIdx;
  this.doneTurn = (tankId) => {
    /* Let tank with TankId pass turn after shooting */
    if(this.isMyTurn(tankId)){
      curIdx ++;
      if(curIdx >= tankIdList.length){
        curIdx = 0;
      }
      setIndicatorText();
    }
  };
}
