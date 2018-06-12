
exports.run = function(spawn) {

    var calcrole = selectrole()    
    // adjust these values to not exceed cpu useage
    if (calcrole != null)
    { 
        var newName = 'ohshit' + Game.time;
        if(calcrole == 'emergencyminer') {
            newName = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], newName, { memory: {role: 'miner'}});
            console.log('Spawning new'+role+': ' + newName);
        }
        else{
        
            var body = selectbody();
            newName = calcrole + Game.time;
             newName = Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: calcrole}});
                console.log('Spawning new '+calcrole+': ' + newName);
        

        }  
    }
    else
    {
        console.log('No creep needed, spawner afk');
    }
}

exports.PlanRoom = function (spawn) {

    var start = Game.spawns['Spawn1'];
    var end = Game.spawns['Spawn1'].room.find(STRUCTURE_CONTROLLER);
    var endpos = end[0].pos;
    for (var i = 0; i < end.length; i++) {
        planRoadsBetween(start, end[i]);
    }
    Memory.roomplannerroadssources = 1;
    start = Game.spawns['Spawn1'].room.controller;
    for (var i = 0; i < end.length; i++) {
        planRoadsBetween(start, end[i]);
    }
}

function selectbody() {
       var maxenergyforparts = 1000;
       
       var bodyparts = [];
       var carrycount = 0;
       var workcount  = 0;
       var movecount  = 0;
       
       var carryratio = .4;
       var moveratio = .3;
       var workratio = .3;
       
       var carrycost = 50;
       var movecost = 50;
       var workcost = 100;
       
    var energyAvailable = 0;
    var energymax = 0;
    
    energyAvailable += Game.spawns.Spawn1.energy;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
    energyAvailable += structure.energy;}});

    energymax += Game.spawns.Spawn1.energyCapacity;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
    energymax += structure.energyCapacity;}});
    


 console.log('Available energy:', energyAvailable);

// Shows energy available to Spawn1 plus extensions
if(maxenergyforparts > energymax)
{
     energyAvailable = energymax;   
}else{
    energyAvailable = maxenergyforparts;   
}


carrycount = Math.floor(energyAvailable/carrycost*carryratio);
movecount = Math.floor(energyAvailable/movecost*moveratio);
workcount = Math.floor(energyAvailable/workcost*workratio)+1;

//console.log('Available carry:', carrycount);
//console.log('Available move:', movecount);
//console.log('Available work:', workcount);
    for (var i = 0; i < carrycount; i++) 
        bodyparts.push(CARRY);
    for (var i = 0; i < movecount; i++) 
        bodyparts.push(MOVE); 
    for (var i = 0; i < workcount; i++) 
        bodyparts.push(WORK);   
        
    var calccost = (carrycount*carrycost+movecount*movecost+workcount*workcost);
console.log('cost:', calccost);
console.log('Available body:', bodyparts);
  return bodyparts;
}


function selectrole() {
    var maxminer    = 3;
    var maxupgrader = 1;
    var maxprobe    = 3;
    // gather creep types in game. 
    var miner = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    // print to console the number of each creep in the game.
    console.log('miners: ' + miner.length);

    var temprole = null
    if(miner.length == 0) {  
        temprole ='emergencyminer'
    }else
    {
        if(miner.length < maxminer) {
            temprole ='miner';
        }
        else
        {
            var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            console.log('upgrader: ' + upgrader.length);
            if(upgrader.length < maxupgrader) {
                temprole = 'upgrader';
            }
            else
            {
                // number of sources in the room
                 if(Game.spawns['Spawn1'].room.find(FIND_SOURCES).length > 1)
                 {
                    var tempmax =  maxprobe;
                 }
                 else 
                 {
                    var tempmax =  1;
                 }
                 
                 
                var probe = _.filter(Game.creeps, (creep) => creep.memory.role == 'probe');
                console.log('probe: ' + probe.length);
                if(probe.length < tempmax)
                {
                    temprole = 'probe';
                }
            }
        }
    }
    return temprole;
}


function planRoadsBetween(start, end) {
    if (start.pos)
        start = start.pos;
    if (end.pos)
        end = end.pos;
    var path = PathFinder.search(start, { pos: end, range: 1 },
        {
            plainCost: 2,
            swampCost: 2
        });

    if (!path.incomplete) {
        for (let i = 0; i < path.path.length; i++) {
            console.log(path.path[i]);
            Game.spawns['Spawn1'].room.createConstructionSite(path.path[i], STRUCTURE_ROAD);
        }
    }
};























