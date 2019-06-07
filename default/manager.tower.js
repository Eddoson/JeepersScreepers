/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.tower');
 * mod.thing == 'a thing'; // true
 */
var managerUtil = require('manager.util');
var constants = require('constants');
var managerTower = {
    run: function(){
        var MIN_ENERGY = 800;
        var towers = Game.rooms[constants.MY_ROOMS[0]].find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });
        
        for(let i = 0; i < towers.length; i++){
            var tower = towers[i];
            var hostilesInRange = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 30);

            if(hostilesInRange.length > 0){
                Memory.invaderPresent = true;
                for(let i = 0; i < hostilesInRange.length; i++){
                    var theHostile = hostilesInRange[i];
                    if(theHostile.owner['username'] === 'Bit_Bomber'){
                        tower.room.visual.text('❤️ ' + 'Bit_Bomber', tower.pos.x, tower.pos.y - 1.3, {color: 'white', font: 0.8});
                    }
                    else{
                        tower.room.visual.text('💥', tower.pos.x, tower.pos.y - 1.3, {color: 'white', font: 0.8});
                        tower.attack(theHostile); 
                    }
                }
            }
            else{
                Memory.invaderPresent = false;
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART
                });
                if(!closestDamagedStructure && tower.energy > MIN_ENERGY){
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < managerUtil.MAX_WALL_HP && structure.structureType === STRUCTURE_WALL
                    });
                }
                if(!closestDamagedStructure && tower.energy > MIN_ENERGY){
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < managerUtil.MAX_RAMPART_HP && structure.structureType === STRUCTURE_RAMPART
                    });
                }
                if(closestDamagedStructure && tower.energy > MIN_ENERGY) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
}

module.exports = managerTower;