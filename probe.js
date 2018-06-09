var roleminer = require('miner');
var utilities = require('extra');

var roleprobe = {

    /** @param {Creep} creep **/
    run: function(creep) {
         utilities.droproad(creep);

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('build');
	    }
	//    var buildtargets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,{
	//	               filter: (structure) => {
	 //                   return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_ROAD)}});
	   /* var repairtargets = creep.pos.findClosestByRange(FIND_STRUCTURES,{
		               filter: (structure) => {
	                    return (structure.hitpoints < structure.hitsmax/2)}});
*/

		if(creep.memory.building) {
	    var buildtargets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,{
		               filter: (structure) => {
						   return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER)}});

	            if(buildtargets) {
	            	// clear repair flag
	                creep.memory.repairing=false;
	                //build a building
	                if(creep.build(buildtargets) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(buildtargets, {visualizePathStyle: {stroke: '#ffffff'}});
	                    
	                }
	            }
	           else{
	           	    // updated repair flag
	               creep.memory.repairing=true;
	               	// find all repair targets, and find the most hurt
	               var repairtargets = creep.room.find(FIND_STRUCTURES, {
                   filter: object => object.hits < object.hitsMax});
                    repairtargets.sort((a,b) => a.hits - b.hits);


                    //repair or move to repair target
	                if(creep.repair(repairtargets[0]) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(repairtargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
	                }
	                else
	                {
	                    roleminer.run(creep);
	                    creep.say('miner');
	                }
	                
	            }
		}
	    else{
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}},{reusePath: 15});
            }
	    }
	}
};

module.exports = roleprobe;


