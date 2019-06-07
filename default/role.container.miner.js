var roleUtil = require('role.util');
var managerUtil = require('manager.util');
var constants = require('constants');

var roleContainerMiner = {
    CONTAINER_MINER_ROLE: 'containerMiner',
    spawnContainerMiner: function(crp, containerMinerBody = managerUtil.maxBody(WORK)){
        var newName = this.CONTAINER_MINER_ROLE + Game.time;
        console.log('Spawning new: ' + newName);
        if(crp){
            console.log(`creep spawning: ${crp.memory.targetSource.id}`);''
            Game.spawns['Spawn1'].spawnCreep(containerMinerBody, newName,
                {
                    memory: {
                        role: this.CONTAINER_MINER_ROLE, 
                        fueling: false, 
                        imDying: false, 
                        targetSource: crp.memory.targetSource
                    }
                }
            );  
        }
        else {
            Game.spawns['Spawn1'].spawnCreep(containerMinerBody, newName, 
                {
                    memory: {
                        role: this.CONTAINER_MINER_ROLE, 
                        fueling: false, 
                        imDying: false
                    }
                }
            );  
        }
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var homeRoom = Game.rooms[constants.MY_ROOMS[0]];
        var result = roleUtil.findClosestAndFarthestToSpawner(FIND_SOURCES, homeRoom, Game.spawns.Spawn1);
        var northEnergySource = result.closest;
        var southEnergySource = result.farthest;
        var MIN_TICKS_TO_LIVE = 150;
        
        if(!creep.memory.targetSource) {
            let northCreep = homeRoom.find(FIND_MY_CREEPS, {
                filter: (crp) => crp.memory.targetSource && crp.memory.targetSource.id == northEnergySource.id
            })
            // only assign 1 container miner to each energy source
            if(northCreep.length > 0){
                creep.memory.targetSource = southEnergySource;
            }
            else {
                creep.memory.targetSource = northEnergySource;
            }
        }
        
        if(creep.ticksToLive < MIN_TICKS_TO_LIVE){
            creep.memory.imDying = true;
        }
        
        if(creep.memory.fueling && creep.carry.energy == 0) {
            creep.memory.fueling = false;
        }
        if(!creep.memory.fueling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fueling = true;
        }
        
        if(creep.memory.fueling) {
            creep.say('🗑️');
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && structure.pos.isNearTo(Game.getObjectById(creep.memory.targetSource.id))
            });
            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.moveTo(container);
            }
            if(!container){
                creep.say('😴🗑️');
            }
        }
        else {
            var source = Game.getObjectById(creep.memory.targetSource.id);
            var harvestResult = creep.harvest(source);
            
            if(!creep.pos.isNearTo(source)){
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(harvestResult == OK){
                creep.say('⛏️');
            }
            else if(source.energy == 0){
                creep.say('😴 ' + source.ticksToRegeneration);
            }
        }
    }
};

module.exports = roleContainerMiner;