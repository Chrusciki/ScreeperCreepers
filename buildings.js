
exports.run = function(spawn) {

    var calcrole = selectrole()    
    // adjust these values to not exceed cpu useage
    if (calcrole != null)
    { 
        var newName = 'creep' + Game.time;
        if(calcrole == 'emergencyminer') {
            newName = Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], newName, { memory: {role: 'miner'}});
            console.log('Spawning new'+role+': ' + newName);
        }
        else{
        
            var body = selectbody();
             newName = Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: calcrole}});
                console.log('Spawning new '+calcrole+': ' + newName);
        

        }  
    }
    else
    {
        console.log('dafaq')
        console.log('No creep needed, spawner afk');

    }
}

function selectbody() {
       var maxenergyforparts =500;
       
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
    
    energyAvailable += Game.spawns.Spawn1.energyCapacity;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
    energyAvailable += structure.energyCapacity;}});

    energymax += Game.spawns.Spawn1.energyCapacity;
    _.filter(Game.structures, function(structure){
    if (structure.structureType == STRUCTURE_EXTENSION){
    energymax += structure.energyCapacity;}});
    


//console.log('Available energy:', energyAvailable);

// Shows energy available to Spawn1 plus extensions
if(maxenergyforparts >energymax)
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
//    console.log('cost:', calccost);
//console.log('Available body:', bodyparts);
  return bodyparts;
}


function selectrole() {
    var maxminer    = 2;
    var maxupgrader = 1;
    var maxprobe    = 2;
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
                 if(Game.spawns['Spawn1'].room.find(FIND_SOURCES).length > 5)
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










exports.placeroadsite =function(room,start,end) {
    
    var path = room.findPath(start, end, { ignoreCreeps: true, ignoreDestructibleStructures:true, ignoreRoads:true });
    if(!path.length) return false;
                var prev_i;
                for(var i in path) // fix findPath (direction may be not correct, maybe bug)
                {
                    if(prev_i && path[i].x != path[prev_i].x && path[i].y != path[prev_i].y)
                    {
                        if     (path[i].x > path[prev_i].x && path[i].y > path[prev_i].y) path[prev_i].direction=BOTTOM_RIGHT;
                        else if(path[i].x < path[prev_i].x && path[i].y > path[prev_i].y ) path[prev_i].direction=BOTTOM_LEFT;
                        else if(path[i].x > path[prev_i].x && path[i].y > path[prev_i].y) path[prev_i].direction=BOTTOM_RIGHT;
                        //else if(path[i].x < path[prev_i].x && path[i].y > path[prev_i].y ) path[prev_i].direction=BOTTOM_LEFT;
                        //
                        else if(path[i].x > path[prev_i].x && path[i].y < path[prev_i].y) path[prev_i].direction=TOP_RIGHT;
                        else if(path[i].x < path[prev_i].x && path[i].y < path[prev_i].y ) path[prev_i].direction=TOP_LEFT;
                        else if(path[i].x > path[prev_i].x && path[i].y < path[prev_i].y) path[prev_i].direction=TOP_RIGHT;
                        else if(path[i].x < path[prev_i].x && path[i].y < path[prev_i].y ) path[prev_i].direction=TOP_LEFT;
                        //else path[prev_i].direction=-1;
                    }
                    if(prev_i && path[i].x == path[prev_i].x && path[i].y != path[prev_i].y)
                    {
                        if (path[i].y > path[prev_i].y) path[prev_i].direction=BOTTOM;
                        else path[prev_i].direction=TOP;
                    }
                    if(prev_i && path[i].x != path[prev_i].x && path[i].y == path[prev_i].y)
                    {
                        if (path[i].x < path[prev_i].x) path[prev_i].direction=LEFT;
                        else path[prev_i].direction=RIGHT;
                    }
                    prev_i = i;
                }
                for(var i in path)
                {
                    //if( to.isEqualTo(path[i].x,path[i].y) ) continue;
                    room.memory.flowGraph[to.x+"_"+to.y][path[i].x+"_"+path[i].y] = path[i].direction;
                    room.memory.flowGraph[from.x+"_"+from.y][path[i].x+"_"+path[i].y] = reverse[path[i].direction];
                    var result = room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                }
        //console.log( JSON.stringify(path) );
        //console.log( JSON.stringify(from.room.memory.flowGraph) );
        console.log(path);
        return true;
};

  //  for (var i = 0; i < patharry.array; i++) 
     //   Game.spawns['Spawn1'].room.createConstructionSite(patharry[i].pos,STRUCTURE_ROAD);
    // var path = 
//}
























