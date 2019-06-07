/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.util');
 * mod.thing == 'a thing'; // true
 */
var constants = require('constants');
var managerUtil = {
    MAX_WALL_HP: 150000,
    MAX_RAMPART_HP: 300000,
    cleanMemory: function(){
        // delete memory so we don't overflow
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    // If you want the same number of every part like bodyBuild(1,1,1), you only need to enter the first param bodyBuild(1)
    bodyBuild: function(workNum, carryNum = workNum, moveNum = workNum){
        var body = [];
        var energyCost = 0;
        
        for(let i = 0; i < workNum; i++){
            body.push(WORK);
            energyCost += 100;
        }
        
        for(let i = 0; i < carryNum; i++){
            body.push(CARRY);
            energyCost += 50;
        }
        
        for(let i = 0; i < moveNum; i++){
            body.push(MOVE);
            energyCost += 50;
        }
        
        if(energyCost > Game.rooms[constants.MY_ROOMS[0]].energyCapacityAvailable){
            console.log(`ATTEMPTING TO MAKE A BODY COSTING ${energyCost} THAT EXCEEDS ENERGY CAP ${Game.rooms[constants.MY_ROOMS[0]].energyCapacityAvailable}`)
        }
        
        return body;
    },
    maxBody: function(priority = null){
        let body = [];
        const energyCap = Game.rooms[constants.MY_ROOMS[0]].energyCapacityAvailable;
        
        if(!priority){
            // it costs 200 for [WORK,CARRY,MOVE] find how many times we can fit that in to our energy cap
            const numFullBodySets = Math.floor(energyCap / 200);
            // do we have room to squeeze in another [CARY,MOVE] after we take out the full body sets?
            const numCarryMove = Math.floor((numFullBodySets % 200) / 100);
            
            const totalCarry = numFullBodySets + numCarryMove;
            const totalMove = totalCarry;
            
            body = this.bodyBuild(numFullBodySets, totalCarry, totalMove);
        }
        else if(priority === WORK){
            // the energy we'll do math with to fit parts. Start with -200 since we'll begin the body with [WORK,CARRY,MOVE] which costs 200
            const workingEnergy = energyCap - 200;
            // number of [WORK,WORK,MOVE] modules
            const numWorkWorkMoveModules = Math.floor(workingEnergy / 250);
            // number of [WORK] leftover that we can squeeze in
            const numWorkModules = Math.floor((workingEnergy % 250) / 100);
            
            // each WORK,WORK,MOVE has 2 works, plus WORK alone, plus 1 for the original full body at the beginning
            const totalWorkModules = (numWorkWorkMoveModules * 2) + numWorkModules + 1;
            const totalMoveModules = numWorkWorkMoveModules + 1;
            
            if(totalWorkModules >= 10 && energyCap >= 1800){
                // this body will mine out sources to completion. any more is wasteful as the miners are idle most the time.
                // also 10 work will fill 100 carry evenly and quickly
                body = this.bodyBuild(10,2,4);
            }
            else{
                body = this.bodyBuild(totalWorkModules, 1, totalMoveModules);
            }
        }
        else if(priority === CARRY){
            // find out how many [CARRY,CARRY,MOVE] sets we can fit
            const numCarryCarryMove = Math.floor(energyCap / 150);
            // how many [CARRY,MOVE] can we fit afterwards
            const numCarryMove = Math.floor((energyCap % 150) / 100);
            
            const totalCarry = (numCarryCarryMove * 2) + numCarryMove;
            const totalMove = numCarryCarryMove + numCarryMove;
            
            body = this.bodyBuild(0, totalCarry, totalMove)
        }
        
        return body;
    }
};

module.exports = managerUtil;