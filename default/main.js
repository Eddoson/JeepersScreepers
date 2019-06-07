var managerCreep = require('manager.creep');
var managerTower = require('manager.tower');
var managerVisual = require('manager.visual');
var managerArmy = require('manager.army');
var misc = require('misc');
var constants = require('constants');

module.exports.loop = function () {
    if(Game.rooms[constants.MY_ROOMS[0]].find(FIND_HOSTILE_CREEPS).length > 0 && !Game.rooms[constants.MY_ROOMS[0]].controller.safeModeCooldown){
        Game.rooms[constants.MY_ROOMS[0]].controller.activateSafeMode();
    }
    managerCreep.run();
    managerTower.run();
    managerVisual.run();
    managerArmy.run();
    
    var nextRoom = 'W4N3';
    
    var roomList = ['W5N3', 'W3N3', 'W3N2', 'W4N2', 'W5N2', 'W6N2', 'W6N3', 'W7N3', 'W7N2', 'W7N1', 'W6N1', 'W5N1', 'W4N1', 'W3N1', 'W2N1', 'W2N2', 'W2N3'];
    for(let i = 0; i < roomList.length; i++){
        if(!Memory.completedRooms.includes(roomList[i])){
            nextRoom = roomList[i];
            console.log(roomList[i] + ' -- ' + !Memory.completedRooms.includes(roomList[i]))
            misc.postman(nextRoom, 'https://www.youtube.com/watch?v=F-S0T4xTdLY');
            break;
        }
    }
    
    // misc.moveToFlag(Game.flags['test'], Game.creeps['test1234'])
}