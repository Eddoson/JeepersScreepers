var roleUtil = require('role.util');
var managerUtil = require('manager.util');
var constants = require('constants');

var roleUpgrader = {
    UPGRADER_ROLE: 'upgrader',
    spawnUpgrader: function(upgraderBody = managerUtil.maxBody()){
        var newName = this.UPGRADER_ROLE + Game.time;
            console.log('Spawning new: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(upgraderBody, newName, {memory: {role: this.UPGRADER_ROLE}});
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            var myController = Game.rooms[constants.MY_ROOMS[0]].controller;
            var upgradeResult = creep.upgradeController(myController);
            if(upgradeResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(myController, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else if(upgradeResult == OK){
                creep.say('⏫');
            }
        }
        else {
            var storageContainer = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0
            });
            if(storageContainer){
                var storageWithdrawal = creep.withdraw(storageContainer, RESOURCE_ENERGY);
                if(storageWithdrawal === ERR_NOT_IN_RANGE){
                    creep.moveTo(storageContainer);
                }
            }
            else {
                roleUtil.gatherEnergy(creep);
            }
        }
    }
};

module.exports = roleUpgrader;