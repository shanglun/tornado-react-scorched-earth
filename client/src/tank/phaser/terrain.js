import {getTerrainHeight, getTerrainTop} from './globvars';

export default function Terrain(game){
  var dimx = game.width;
  var dimy = getTerrainHeight(game);
  var bmd = game.add.bitmapData(dimx,dimy);
  var bmdTop = getTerrainTop(game);
  var solidityMap = [];
  for (var i = 0; i< dimx; i++){
    var arr = [];
    for(var j=0;j<dimy;j++){
      arr[j] = 1;
    }
    solidityMap[i] = arr;
  }
  var collisionHeights = [];
  for(var i = 0; i < dimx; i++){
    collisionHeights[i] = 0;
  }

  var markBMD = function(){
    bmd.context.putImageData(bmd.imageData, 0, 0);
    bmd.dirty=true;
  }

  this.draw = function(){
    for(var i = 0; i < dimx; i++){
      for(var j = 0; j < dimy; j++){
        if(solidityMap[i][j]){
          //if(collisionHeights[i] > j-10){
          //  bmd.setPixel32(i,j,0,0x33,0x33,0x33, false);
          //} else {
            bmd.setPixel32(i,j,0,0x0f,0xff,0xff, false);
          //}
        } else {
          bmd.setPixel32(i,j,0,0,0,0, false);
        }
      }
    }
    markBMD();
  }

  this.killTerrain = function (x, y){
    var clickx = x;
    var clicky = y - bmdTop;
    for(var i = 0; i < dimx; i++){
      for(var j=0; j < dimy; j++){
        if(i < clickx + 50 && i > clickx - 50 && j < clicky + 50 && j > clicky - 50){
          if(collisionHeights[i]<j){
            collisionHeights[i] = j;
          }
          solidityMap[i][j] = 0;
        }
      }
    }
    this.draw();
  }
  this.calcFallHeight = function(xPos,width){
    var left = Math.floor(xPos - width/2);
    var right = Math.floor(xPos + width/2);
    var smCollHeight = dimy;
    for(var i = left; i <= right; i++){
      if(smCollHeight > collisionHeights[i]){
        smCollHeight = collisionHeights[i];
      }
    }
    return smCollHeight;
    //the tank should then fall until it hits that point.
  }

  this.bounds = ()=> {
    var bounds = bmd.getBounds();
    bounds.y = bmdTop;
    return bounds;
  }
  this.solidityChk = function(xPos, yPos){
    return solidityMap[xPos][yPos - bmdTop] != 0;
  }
  game.add.sprite(0,bmdTop,bmd);
}
