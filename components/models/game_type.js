'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

    /**
     * Game Type holds the reference for the configuration
     * to the game played. When a game is created this attaches
     * to the quiz and the game server is responsible to setup
     * the game according to these specs.
     */
var game_type = {
    name: { type: String},    
    // if not solo, this defines the room players number
    room_size: { type: Number},
    // if the game can start with less players than room size.
    // set to 0 if the game starts only when room_size is full.
    min_players_allowed: {type: Number},
    // holds an object of question types and the number that should be
    // requested in the whole quiz. Defaults to one each.
    quiz_questions: { type: Schema.Types.Mixed, default:{
        "true_false":1,
        "multiple":1,
        "how_close":1,
        "list":1
    },
    // the cost in coins to participate
    coins_required: {type: Number},
    // the time to play the game. If time reaches zero player cannot play anymore (?)
    game_duration: {type: Number},
    // each mistake time penalty
    mistake_penalty: {type: Number},
    // Number of gems rewarded to winner. 
    // if SOLO - Gems final reward is calculated based on correct answers.
    // User_reward = (gems_reward_max / quiz_questions_sum) * correct_answers;
    gems_reward_max: {type: Number}
 }
};

var game_type_schema = new Schema(game_type);

// Creating indexes
game_type_schema.index({name: 1});

module.exports = mongoose.model('game_types', game_type_schema);
