var armyFormations = require('army.formations');
var roleSoldier = require('role.soldier');

var managerArmy = {
    FLAG_FORM_UP: 'formup',
    FLAG_CLAIM_RC: 'claimRC',
    run: function(){
        var soldiers = _.filter(Game.creeps, (crp) => crp.memory.role === 'soldier');
        for(let i = 0; i < soldiers.length; i++){
            var creep = soldiers[i];
            roleSoldier.run(creep);
        }
        for(var aFlag in Game.flags){
            if(aFlag.name == this.FLAG_FORM_UP && soldiers.length > 10){
                armyFormations.squareFormationForm(soldiers, soldiers[0], aFlag);
            }
            else if(aFlag.name == this.FLAG_FORM_UP){
                
            }
        }
    }
};

module.exports = managerArmy;