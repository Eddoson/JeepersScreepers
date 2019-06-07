//TODO: Write nexus road code. Whenever a spawner is placed build roads to key places as well as create nexus so we can fill in spaces with extensions

//Game.spawns.Spawn1.spawnCreep([MOVE],'Bobby B',{memory:{role:'postman'}})

var misc = {
    postman: function(targetRoomName, msg){
        console.log('Postman moving towards ' + targetRoomName)
        var postman = _.filter(Game.creeps, (crp) => crp.memory.role == 'postman')[0];
        if(postman){
            var msgs = ['*whistles*', '*cough*', 'Hmm?', 'What?', 'Ho hum', 'Merp.', 'Uhhhhhhh', 'I love you'];
            var randPick = Math.floor(Math.random() * msgs.length);
            postman.say(msgs[randPick], true);
            if(postman.room.name !== targetRoomName){
                var route = Game.map.findRoute(postman.room.name, targetRoomName);
                var exitGo = postman.pos.findClosestByPath(route[0].exit);
                postman.moveTo(exitGo);
            }
            else if(postman.signController(postman.room.controller, msg) === ERR_NOT_IN_RANGE){
                postman.moveTo(postman.room.controller);
            }
            else if(postman.signController(postman.room.controller, msg) === OK){
                if(!Memory.completedRooms.includes(postman.room.name)){
                    Memory.completedRooms.push(postman.room.name);
                }
                var directionsList = [TOP, RIGHT, BOTTOM, LEFT];
                var rand = Math.floor(Math.random() * directionsList.length);
                postman.move(directionsList[rand]);
            }
        }
        else {
            Game.spawns.Spawn1.spawnCreep([MOVE],'Bobby B',{memory:{role:'postman'}})
        }
    },
    moveToFlag: function(targetFlag, crp){
        if(targetFlag && !crp.pos.isEqualTo(targetFlag)){
            crp.moveTo(targetFlag, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = misc;