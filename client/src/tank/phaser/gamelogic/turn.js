/* jshint esversion:6 */
export default function TurnHandler(){
  let tankIdList = [];
  let curIdx = 0;
  this.register = (tank) => {
    tank.tankId = tankIdList.length;
    tankIdList.push(tank.tankId);
  };
  this.isMyTurn = (tankId) => tankIdList.indexOf(tankId) == curIdx;
  this.doneTurn = (tankId) => {
    if(this.isMyTurn(tankId)){
      curIdx ++;
      if(curIdx >= tankIdList.length){
        curIdx = 0;
      }
    }
  };
}
