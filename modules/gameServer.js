

var GameServer = {},
    io = require('../server').io,
    async = require('async'),
    mongoose = require('mongoose'),
    GameTypes = mongoose.models.game_types;


/**
 * Game Server create new game
 * 0. Fetch the game type from database
 * 1. We check user balance
 * 2. We check the game type multiplayer flag
 * 3. If multiplayer we check for other games
 * 4. Create the game and populate quizes
 * 5. Return the game to the user
 */
GameServer.createNewGame = function (game_type_name, dyno_name, cb) {    
    async.waterfall([
        function (callback) {
            callback(null, game_type_name)
        },
        // First we fetch the game type requested
        GameServer.fetchGameTypeByName        
    ], function (err, result) {
    return cb(err, result);
})
}

/************************************************************
 *                   Helper Methods
 ***********************************************************/

/**
 * Returns the game type data for the requested name
 */
GameServer.fetchGameTypeByName = function (game_type_name, callback) {

    // GameTypes.findById(game_type_id, function (err, result) {
    //     callback(err, result)
    // })
    GameTypes.find({ name: game_type_name }, function (err, result) {
        callback(err, result)
    })
}


/**
 * Returns gameserver as module for the API to be able to use it
 */
module.exports = GameServer;