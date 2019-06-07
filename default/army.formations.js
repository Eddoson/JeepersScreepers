var armyFormations = {
    squareFormationForm: function(crpsList, captain, targetFlag){
        var formationTroops = [
            [crpsList[0], crpsList[1], crpsList[2]],
            [crpsList[3], crpsList[4], crpsList[5]]
        ]
        
        if(!captain.pos.isEqualTo(targetFlag)){
            captain.moveTo(targetFlag, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else{
            captain.say('FORM UP!', true);
        }
    }
};

module.exports = armyFormations;