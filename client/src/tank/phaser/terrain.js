/* jshint esversion:6 */
import {getTerrainHeight, getTerrainTop} from './globvars';

export default function Terrain(game){
  let dimx = game.width;
  let dimy = getTerrainHeight(game);
  let bmd = game.add.bitmapData(dimx,dimy);
  let bmdTop = getTerrainTop(game);
  let solidityMap = [];
  for (let i = 0; i< dimx; i++){
    let arr = [];
    for(let j=0;j<dimy;j++){
      arr[j] = 1;
    }
    solidityMap[i] = arr;
  }
  let collisionHeights = [];
  for(let i = 0; i < dimx; i++){
    collisionHeights[i] = 0;
  }

  let markBMD = function(){
    bmd.context.putImageData(bmd.imageData, 0, 0);
    bmd.dirty=true;
  };

  this.draw = function(){
    for(let i = 0; i < dimx; i++){
      for(let j = 0; j < dimy; j++){
        if(solidityMap[i][j]){
          bmd.setPixel32(i,j,0,0x0f,0xff,0xff, false);
        } else {
          bmd.setPixel32(i,j,0,0,0,0, false);
        }
      }
    }
    markBMD();
  };

  this.killTerrain = function (x, y){
    let clickx = x;
    let clicky = y - bmdTop;
    let radius = 75;
    for(let i = 0; i < dimx; i++){
      for(let j=0; j < dimy; j++){
        if(Math.floor(Math.sqrt(Math.pow(i-clickx,2)+Math.pow(j-clicky,2)))<radius){
          if(collisionHeights[i]<j){
            collisionHeights[i] = j;
          }
          solidityMap[i][j] = 0;
        }
      }
    }
    this.draw();
  };
  this.calcFallHeight = function(xPos,width){
    let left = Math.floor(xPos - width/2);
    let right = Math.floor(xPos + width/2);
    let smCollHeight = dimy;
    for(let i = left; i <= right; i++){
      if(smCollHeight > collisionHeights[i]){
        smCollHeight = collisionHeights[i];
      }
    }
    return smCollHeight;
  };

  this.bounds = ()=> {
    let bounds = bmd.getBounds();
    bounds.y = bmdTop;
    return bounds;
  };
  this.solidityChk = function(xPos, yPos){
    if(xPos > solidityMap.length || (yPos-bmdTop) > solidityMap[0] ){
      return false;
    }
    return solidityMap[xPos][yPos - bmdTop] !== 0;
  };
  game.add.sprite(0,bmdTop,bmd);
}
