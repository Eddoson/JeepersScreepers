var managerUtil = require('manager.util');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSoldier = require('role.soldier');

var roleContainerMiner = require('role.container.miner');
var roleContainerTruck = require('role.container.truck');

var managerCreep = {
    run: function(){
        // delete dead creeps from memory to stop overflow
        managerUtil.cleanMemory();
        
        var HARVESTER_LIMIT = 0;
        var BUILDER_LIMIT = 1;
        var UPGRADER_LIMIT = 2;
        var SOLDIER_LIMIT  = 0;
        
        const CONTAINER_MINER_LIMIT = 2;
        const CONTAINER_TRUCK_LIMIT = 1;
    
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == roleHarvester.HARVESTER_ROLE);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == roleUpgrader.UPGRADER_ROLE);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == roleBuilder.BUILDER_ROLE);
        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == roleSoldier.SOLDIER_ROLE);
        
        var containerMiners = _.filter(Game.creeps, (creep) => creep.memory.role == roleContainerMiner.CONTAINER_MINER_ROLE);
        var containerTrucks =  _.filter(Game.creeps, (creep) => creep.memory.role == roleContainerTruck.CONTAINER_TRUCK_ROLE);
        
        var dyingTrucks =  _.filter(
            Game.creeps, 
            (creep) => creep.memory.role == roleContainerTruck.CONTAINER_TRUCK_ROLE 
                && creep.memory.imDying
        );
        var dyingContainerMiners =  _.filter(
            Game.creeps, 
            (creep) => creep.memory.role == roleContainerMiner.CONTAINER_MINER_ROLE
                && creep.memory.imDying
        );
        
        // builder logic. if we have construction sites then we need builders
        var numSites = Object.keys(Game.constructionSites).length;
        if(numSites > 0){
            if(numSites > 10){
                BUILDER_LIMIT = 3;
            }
            else {
                BUILDER_LIMIT = 2;
            }
        }

        // if our mining cycle has been interrupted, kickstart it again
        if(containerMiners.length == 0 || containerTrucks.length == 0){
            console.log('Missing essential creeps! Deploying seed crew to start colony over!');
            HARVESTER_LIMIT = 6;
        }
        
        // dying trucks spawn first since they are needed to spawn more things
        if(harvesters.length < HARVESTER_LIMIT) {
            Memory.nextCreepSpawn = roleHarvester.HARVESTER_ROLE;
            roleHarvester.spawnHarvester();
        }
        else if(dyingTrucks.length > 0 && containerTrucks.length < (CONTAINER_TRUCK_LIMIT + 1)){
            Memory.nextCreepSpawn = roleContainerTruck.CONTAINER_TRUCK_ROLE;
            roleContainerTruck.spawnContainerTruck();
        }
        else if(dyingContainerMiners.length > 0 && containerMiners.length < (CONTAINER_MINER_LIMIT + 1)){
            Memory.nextCreepSpawn = roleContainerMiner.CONTAINER_MINER_ROLE;
            var replaceMiner = dyingContainerMiners[0];
            if(dyingContainerMiners.length > 1 && dyingContainerMiners[0].ticksToLive > dyingContainerMiners[1].ticksToLive){
                replaceMiner = dyingContainerMiners[1];
            }
            roleContainerMiner.spawnContainerMiner(replaceMiner);
        }
        else if(containerTrucks.length < CONTAINER_TRUCK_LIMIT){
            Memory.nextCreepSpawn = roleContainerTruck.CONTAINER_TRUCK_ROLE;
            roleContainerTruck.spawnContainerTruck();
        }
        else if(containerMiners.length < CONTAINER_MINER_LIMIT){
            Memory.nextCreepSpawn = roleContainerMiner.CONTAINER_MINER_ROLE;
            roleContainerMiner.spawnContainerMiner();
        }
        else if(upgraders.length < UPGRADER_LIMIT){
            Memory.nextCreepSpawn = roleUpgrader.UPGRADER_ROLE;
            roleUpgrader.spawnUpgrader();
        }
        else if(builders.length < BUILDER_LIMIT){
            Memory.nextCreepSpawn = roleBuilder.BUILDER_ROLE;
            roleBuilder.spawnBuilder();
        }
        else if(soldiers.length < SOLDIER_LIMIT){
            Memory.nextCreepSpawn = roleSoldier.SOLDIER_ROLE;
            roleSoldier.spawnSoldier();
        }
        else {
            Memory.nextCreepSpawn = null;
        }
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == roleHarvester.HARVESTER_ROLE) {
                roleHarvester.run(creep);
            }
            else if(creep.memory.role ==  roleUpgrader.UPGRADER_ROLE) {
                roleUpgrader.run(creep);
            }
            else if(creep.memory.role == roleBuilder.BUILDER_ROLE) {
                roleBuilder.run(creep);
            }
            else if(creep.memory.role == roleContainerMiner.CONTAINER_MINER_ROLE){
                roleContainerMiner.run(creep);
            }
            else if(creep.memory.role == roleContainerTruck.CONTAINER_TRUCK_ROLE){
                roleContainerTruck.run(creep);
            }
            else {
                console.log(`UNKNOWN ROLE FOUND: ${creep.memory.role}`)
            }
        }
    }

}

module.exports = managerCreep;