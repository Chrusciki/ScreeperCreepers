

var extra = {

    /** @param {Creep} creep **/
    droproad: function(creep) {

    	creep.pos.createConstructionSite(STRUCTURE_ROAD);

    }
};

module.exports = extra;