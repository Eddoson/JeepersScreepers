var roleContainerTruck = require('role.container.truck');
var constants = require('constants');

var managerVisual = {
    closeToDeath: function(crp){
        if(crp.ticksToLive % 2 === 0){
            var msg = '☠️ ' + crp.ticksToLive;
            crp.say(msg);
        }
    },
    spawningProgress: function(targetSpawn){
        var roomVisual = new RoomVisual(constants.MY_ROOMS[0]);
        if(targetSpawn.spawning === null && Memory.nextCreepSpawn !== null){
            var msg = '⏳️ ' + Memory.nextCreepSpawn;
            roomVisual.text(msg, targetSpawn.pos.x, targetSpawn.pos.y - 1.4, {color: 'white', font: 0.8});
        }
        else if(targetSpawn.spawning){
            var curSpawning = targetSpawn.spawning;
            var creepName = curSpawning.name;
            var msg = '⚡' + creepName + ': ' + curSpawning.remainingTime;
            roomVisual.text(msg, targetSpawn.pos.x, targetSpawn.pos.y - 1.4, {color: 'white', font: 0.8});
        }
        else {
            var msg = '😴';
            roomVisual.text(msg, targetSpawn.pos.x, targetSpawn.pos.y - 1.4, {color: 'white', font: 0.8});
        }
    },
    markRole: function(crp, roleIcon){
        new RoomVisual(constants.MY_ROOMS[0]).text(roleIcon, crp.pos.x, crp.pos.y, {color: 'white', font: 0.8});
    },
    friendOrFoe: function(crp){
        var msgs = ['HELP!!!', 'AHHHHHHH', 'HORY SHEET', 'IS GOZILLA', 'END OF US!', 'WE DEAD', 'HALLLLP', 'OH NO!!', 'DEAR GOD!'];
        var randPick = Math.floor(Math.random() * msgs.length);
        crp.say(msgs[randPick], true);
    },
    run: function(){
        // dying creeps (not sure if I want this one)
        var dying = _.filter(Game.creeps, (creep) => creep.memory.imDying);
        for(let i = 0; i < dying.length; i++){
            var crp = dying[i];
            this.closeToDeath(crp, crp.ticksToLive);
        }
        
        // spawning
        var spawnList = _.filter(Game.spawns)
        for(let i = 0; i < spawnList.length; i++){
            this.spawningProgress(spawnList[i]);
        }

        // friend or foe
        if(Memory.invaderPresent){
           for(crp in Game.creeps){
                this.friendOrFoe(Game.creeps[crp])
            } 
        }
    }  
};

module.exports = managerVisual;