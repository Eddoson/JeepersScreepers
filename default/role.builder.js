var managerUtil = require('manager.util');
var constants = require('constants');

var roleBuilder = {
    BUILDER_ROLE: 'builder',
    spawnBuilder: function(builderBody = managerUtil.maxBody()){
        var newName = this.BUILDER_ROLE + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(builderBody, newName, {memory: {role: this.BUILDER_ROLE}});
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var curTarget = targets[0];
                for(let i = 0; i < targets.length; i++){
                    if(targets[i].structureType === STRUCTURE_CONTAINER){
                        curTarget = targets[i];
                        break;
                    }
                    else if(targets[i].structureType === STRUCTURE_WALL){
                        curTarget = targets[i];
                        break;
                    }
                    else if(targets[i].structureType === STRUCTURE_EXTENSION){
                        curTarget = targets[i];
                        break;
                    }
                }
                var buildResult = creep.build(curTarget);
                if(buildResult == ERR_NOT_IN_RANGE) {
                    creep.moveTo(curTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if(buildResult == OK){
                    creep.say('🔨');
                }
            }
            else {
                var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART
                });
                if(!closestDamagedStructure){
                    closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < managerUtil.MAX_RAMPART_HP && structure.structureType === STRUCTURE_RAMPART
                    });
                }
                if(!closestDamagedStructure){
                    closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < managerUtil.MAX_WALL_HP && structure.structureType === STRUCTURE_WALL
                    });
                }
                if(closestDamagedStructure) {
                    var repairResult = creep.repair(closestDamagedStructure);
                    if(repairResult === ERR_NOT_IN_RANGE){
                        creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else if(repairResult == OK){
                        creep.say('🔧');
                    }
                }
            }
        }
        else {
            var storageContainer = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0
            });
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE)
                    && structure.store[RESOURCE_ENERGY] > 200
            });
            
            if(storageContainer){
                var storageWithdrawal = creep.withdraw(storageContainer, RESOURCE_ENERGY);
                if(storageWithdrawal === ERR_NOT_IN_RANGE){
                    creep.moveTo(storageContainer);
                }
            }
            else if(container){
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else{
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                    filter: (source) => source.room.name === constants.MY_ROOMS[0]
                });
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;