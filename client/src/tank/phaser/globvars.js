/* jshint esversion:6 */

//couple of global used to check terrain physics
export function getTerrainHeight(game){
  //terrain is 1/3 of the game height by default
  //return Math.floor(game.height/3);
  return Math.floor(game.height/2);
}

export function getTerrainTop(game){
  //"top" of the terrain is 2/3 of the way down.
  //return Math.floor(2*game.height/3);
  return Math.floor(game.height/2);
}
