var roleUtil = require('role.util');
var managerUtil = require('manager.util');
var constants = require('constants');

var roleHarvester = {
    HARVESTER_ROLE: 'harvester',
    spawnHarvester: function(harvesterBody = managerUtil.bodyBuild(2, 1, 1)){
        var newName = this.HARVESTER_ROLE + Game.time;
            console.log('Spawning new: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(harvesterBody, newName, {memory: {role: this.HARVESTER_ROLE}});
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('⛑️');
        var homeRoom = Game.rooms[constants.MY_ROOMS[0]];
        if(creep.memory.fueling && creep.carry.energy == 0) {
            creep.memory.fueling = false;
        }
        if(!creep.memory.fueling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fueling = true;
        }
        if(creep.memory.fueling) {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if(!target){
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                creep.moveTo(Game.flags['idle'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var droppedEnergy = homeRoom.find(FIND_DROPPED_RESOURCES, {
                filter: (de) => de.resourceType === RESOURCE_ENERGY
            });
            var tombstone = homeRoom.find(FIND_TOMBSTONES, {
                filter: (ts) => ts.store[RESOURCE_ENERGY] > 0
            });
            if(tombstone.length > 0 && tombstone[0].store[RESOURCE_ENERGY] > 0){
                if(creep.withdraw(tombstone[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(tombstone[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if(droppedEnergy.length > 0 && droppedEnergy[0].resourceType === RESOURCE_ENERGY){
                if(creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE){
                    creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
               roleUtil.gatherEnergy(creep);
            }
           
        }
    }
};

module.exports = roleHarvester;