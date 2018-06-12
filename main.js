// creep roles
var roleupgrader = require('upgrader');
var roleminer = require('miner');
var roleprobe = require('probe');

// building functions
var buildings = require('buildings');

// utlities 


// main loop
module.exports.loop = function () {
	// for each creep in memory verify it exists in the game, 
	// if not it is dead, and clear out its memory. 
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
 

    //create minions
    buildings.run(Game.spawns.Spawn1);
    if (Memory.roomplannerroadssources !=1){
        buildings.PlanRoom();
    }
    

    var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    console.log(towers.length);
    for (var id in towers) {
        var tower = towers[id];
        buildings.tower(tower);
    }

    
   // buildings.placeroadsite(Game.spawns['Spawn1'].room,start,end);
    // fancy spawer text 
    // if need cpu useage delete this, its mostly useless
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    runroles();
}

function runroles() {
	// for each creep in game, run the function for that creep role. 
	// are string switch cases faster/more efficent then if/thens
	// look up each creep, see what role it is assigned in memoory,
	// take that role and pass in the creep.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role)
        {
            case 'miner':
                roleminer.run(creep);
                break;
            case 'upgrader':
                roleupgrader.run(creep);
                break;
            case 'probe':
                roleprobe.run(creep);
                break;
            default:
                break;
        }
       
        
    }
}
