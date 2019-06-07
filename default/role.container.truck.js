var roleUtil = require('role.util');
var managerUtil = require('manager.util');
var constants = require('constants');

var roleContainerTruck = {
    CONTAINER_TRUCK_ROLE: 'containerTruck',
    spawnContainerTruck: function(truckBody = managerUtil.maxBody(CARRY)){
        var newName = this.CONTAINER_TRUCK_ROLE + Game.time;
        console.log('Spawning new: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(truckBody, newName,
            {
                memory: {
                    role: this.CONTAINER_TRUCK_ROLE, 
                    fueling: false, 
                    northContainerVisited: false, 
                    imDying: false
                }
                
            }
        );
    },
    run: function(creep) {
        var homeRoom = Game.rooms[constants.MY_ROOMS[0]];
        var closestAndFarthestContainers = roleUtil.findClosestAndFarthestToSpawner(FIND_STRUCTURES, homeRoom, Game.spawns.Spawn1, {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER});
        
        var northContainer = closestAndFarthestContainers.closest;
        var southContainer = closestAndFarthestContainers.farthest;
        
        var MIN_TICKS_TO_LIVE = 500;
        
        //for fun
        creep.say('🚛 VROOM', true);
        
        // if the truck is almost dead we need to have another one coming to replace him
        if(creep.ticksToLive < MIN_TICKS_TO_LIVE){
            creep.memory.imDying = true;
        }
        
        if(creep.memory.fueling && creep.carry.energy == 0) {
            creep.memory.fueling = false;
        }
        if(!creep.memory.fueling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.fueling = true;
            creep.memory.northContainerVisited = false;
        }
        
        if(creep.memory.fueling) {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) 
                    && structure.energy < structure.energyCapacity;
                }
            });
            
            // if there are hostiles, feed the tower energy now!
            if(creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)){
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) && structure.energy <= 800;
                    }
                });
            }
            else if(!target) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) && structure.energy <= 800;
                    }
                });
            }
            
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var storageContainer = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_STORAGE
                })
                if(storageContainer && creep.transfer(storageContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storageContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else{
                    creep.moveTo(Game.spawns.Spawn1, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (ts) => ts.store[RESOURCE_ENERGY] > 50
            });
            var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (res) => res.resourceType === RESOURCE_ENERGY && res.amount > 50
            });
            if(tombstone && tombstone.store[RESOURCE_ENERGY] > 0){
                if(creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if(droppedEnergy){
                if(creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE){
                    creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if(!creep.memory.northContainerVisited){
                withdrawal = creep.withdraw(northContainer, RESOURCE_ENERGY);
                if(withdrawal === ERR_NOT_IN_RANGE){
                    creep.moveTo(northContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(withdrawal === OK || withdrawal === ERR_NOT_ENOUGH_RESOURCES){
                    creep.memory.northContainerVisited = true;
                }
            }
            else if(creep.carry.energy > creep.carryCapacity / 2){
                creep.memory.northContainerVisited = false;
                creep.memory.fueling = true;
            }
            else if(southContainer.store[RESOURCE_ENERGY] > 0){
                withdrawal = creep.withdraw(southContainer, RESOURCE_ENERGY);
                if(withdrawal === ERR_NOT_IN_RANGE){
                    creep.moveTo(southContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if(withdrawal === OK || withdrawal === ERR_NOT_ENOUGH_RESOURCES){
                    creep.memory.northContainerVisited = false;
                    creep.memory.fueling = true;
                }
            }
            else {
                // reset since we're out of things to do
                creep.memory.northContainerVisited = false;
                creep.memory.fueling = true;
            }
        }
        
    }
};

module.exports = roleContainerTruck;