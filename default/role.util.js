var constants = require('constants');

var roleUtil = {
    gatherEnergy: function(creep){
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_CONTAINER)
                    && structure.store[RESOURCE_ENERGY] > 200
            });
        if(container){
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                filter: (source) => source.room.name === constants.MY_ROOMS[0]
            });
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }   
        }
    },
    findClosestAndFarthestToSpawner: function(objectType, room, spawner, filterBy = {}){
        result = {};
        var objectsList = room.find(objectType, filterBy);
        var closestObject = spawner.pos.findClosestByPath(objectType, filterBy)
        
        var closest = closestObject;
        var farthest = objectsList[0];
        
        if(objectsList[0].id == closest.id){
            farthest = objectsList[1];
        }
        
        result = {
            closest: closest,
            farthest: farthest
        };

        return result;
    }
};

module.exports = roleUtil;