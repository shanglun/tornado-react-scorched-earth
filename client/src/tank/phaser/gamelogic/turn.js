/* jshint esversion:6 */
export default function TurnHandler(){
  /* Keeps a list of tanks and keeps track of which turn it is */
  let tankIdList = [];
  let curIdx = 0;
  this.register = (tank) => {
    tank.tankId = tankIdList.length;
    tankIdList.push(tank.tankId);
  };
  /* Check if it's tankId's turn */
  this.isMyTurn = (tankId) => tankIdList.indexOf(tankId) == curIdx;
  this.doneTurn = (tankId) => {
    /* Let tank with TankId pass turn after shooting */
    if(this.isMyTurn(tankId)){
      curIdx ++;
      if(curIdx >= tankIdList.length){
        curIdx = 0;
      }
    }
  };
}
