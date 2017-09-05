

var GameServer = {},
    io = require('../server').io,
    async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    GameTypes = mongoose.models.game_types,
    Questions = mongoose.models.questions,
    Game = mongoose.models.games;


/**
 * Game Server create new game
 * 0. Fetch the game type from database
 * 1. We check user balance
 * 2. We check the game type multiplayer flag
 * 3. If multiplayer we check for other games
 * 4. Create the game and populate quizes
 * 5. Return the game to the user
 */
GameServer.createNewGame = function (user_id, game_type_name, dyno_name, cb) {
    async.waterfall([
        function (callback) { callback(null, game_type_name, user_id) },
        // First we fetch the game type requested
        GameServer.fetchGameTypeByName,
        // Get a valid game
        GameServer.fetchGame,
        // Populate Questions
        GameServer.populateGameQuestions,
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
GameServer.fetchGameTypeByName = function (game_type_name, user_id, callback) {
    console.log("Returning the Game Type requested");
    // GameTypes.findById(game_type_id, function (err, result) {
    //     callback(err, result)
    // })
    GameTypes.findOne({ name: game_type_name }, function (err, result) {
        callback(err, result, user_id);
    })
}
/**
 * Parses the game type requested and takes the necessary steps
 * in order to return a valid game. Either new or another active.
 */
GameServer.fetchGame = function (game_type, user_id, callback) {
    console.log("Returning a Valid Game for User");
    var game;
    // First it's importan to see the room size
    if(game_type.room_size == 1){
        game = new Game();
        game.players.push(user_id);
        game.configuration = game_type;
    }
    
    callback(null, game);
}
/**
 * If needed this method will populate the Game object with 
 * questions based on the Game's game type.
 */
GameServer.populateGameQuestions = function (game, callback) {
    console.log("Populating if needed the Game object with questions");
    var requests = game.configuration.quiz_questions.length;    
    if (game.questions.length == 0) {
        _.each(game.configuration.quiz_questions, function (o) {
            // Runs through each question types in game type and concats the questions to the game questions array
            // We do this with a callback because the method called is async
            GameServer.fetchRandomQuestionsOf(o, function (questions) {
                game.questions = _.concat(game.questions, questions);
                requests--;                
                if (requests == 0)
                    callback(null, game);
            })
        })
    } else
        callback(null, game);
}
/**
 * Returns random questions based on type and count
 */
GameServer.fetchRandomQuestionsOf = function (questionObj, callback) {    
    Questions.findRandom({ type: questionObj.type }, {}, { limit: questionObj.count }, function (err, results) {    
        if (!err) {
            if (!callback)
                return results;
            else
                callback(results);
        }
        
    });
}


/**
 * Returns gameserver as module for the API to be able to use it
 */
module.exports = GameServer;