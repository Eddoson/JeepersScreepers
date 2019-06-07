var constants = require('constants');
var managerUtil = require('manager.util');

//[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK]
//[TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,MOVE]
var roleSoldier = {
    SOLDIER_ROLE: 'soldier',
    spawnSoldier: function(soldierBody = [MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]){
        var newName = this.SOLDIER_ROLE + Game.time;
        console.log('Spawning new: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(soldierBody, newName,
            {
                memory: {
                    role: this.SOLDIER_ROLE, 
                }
                
            }
        );
    },
    run: function(creep){
        var dialogs = ['FREEEDOMM!', 'SCOTLAND!', ' 🖕🏻 ']
        var randInt = Math.floor(Math.random() * dialogs.length);
        creep.say(dialogs[randInt], true);
        var whitelist = ['Eddoson', 'Bit_Bomber', 'golden_hawk37', 'ColdestLime'];
        var hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (hostile) => !whitelist.includes(hostile.owner['username'])
        });
        var attackFlag = _.filter(Game.flags, (flag) => flag.name === 'attack');
        var rallyFlag = _.filter(Game.flags, (flag) => flag.name === 'rally');
        if(hostileCreep){
            if(creep.attack(hostileCreep) === ERR_NOT_IN_RANGE){
                creep.moveTo(hostileCreep);
            }
        }
        else if(attackFlag.length > 0){
            attackFlag = attackFlag[0];
            var flagHostile = attackFlag.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: (hostile) => !whitelist.includes(hostile.owner['username'])
            });
            if(flagHostile){
                if (creep.attack(flagHostile) === ERR_NOT_IN_RANGE){
                    creep.moveTo(flagHostile);
                }
            }
            else{
                creep.moveTo(attackFlag);
            }
            
        }
    }
};

module.exports = roleSoldier;