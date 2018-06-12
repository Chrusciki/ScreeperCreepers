var roleupgrader = require('upgrader');
//var roleprobe = require('probe');
var utilities = require('extra');

var roleminer = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
         utilities.droproad(creep);

         if(creep.carry.energy == creep.carryCapacity){
             creep.memory.mode = 'drop';
         } 
         else if (creep.carry.energy == 0)
         {
            creep.memory.mode = 'mine'; 
         }



         if (creep.memory.mode == 'mine')
        // if(creep.carry.energy < creep.carryCapacity)
         {
             var sources = creep.room.find(FIND_SOURCES);
                 if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                 {
                     creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } }, { reusePath: 15 });
                 }
         }
         
         if (creep.memory.mode == 'drop')
        // if (creep.carry.energy == 0)
         {
             const targets = creep.pos.findInRange(FIND_STRUCTURES,2,
               {
                     filter: (structure) => {
                         return (structure.structureType == STRUCTURE_CONTAINER);
                    }
               });
             
             if(targets.length > 0) 
             {
                 if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                 {
                     creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}},{reusePath: 15});
                 }
             }
              else 
             {
                    var targets2 = creep.room.find(FIND_STRUCTURES,
                    {
                          filter: (structure) => {
                              return (structure.structureType == STRUCTURE_EXTENSION 
                                 || structure.structureType == STRUCTURE_SPAWN) 
                                     &&    structure.energy < structure.energyCapacity;
                          }
                    });
                 
               if(targets2.length > 0) 
               {
                     if(creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                     {
                         creep.moveTo(targets2[0], {visualizePathStyle: {stroke: '#ffffff'}},{reusePath: 15});
                     }
               }
               else 
               {
                //    creep.moveTo(Game.spawns.Spawn1.pos);
                   roleupgrader.run(creep);
                //   creep.say('probe');
               }
               
             }
         }}
    };

module.exports = roleminer;