'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	l = require('../config/lib');

/**
 * A Game is the core class for each played game in 
 * Grand Bazaar. It holds questions, configurations
 * and list of players participating and also results
 * and rewards.
 */

var fields = {
	type: { type: String },
	dyno: { type: String },
	// The room opened in sockets to handle a head2head game
	roomid: { type: String },
	// The id of the league if this is a tournament game
	leagueid: {type: String},
	slotsLeft: { type: Number },
	players: [{ type: Schema.Types.Mixed }],
	// An object with keys the user ids
	playersAnswers: { type: Schema.Types.Mixed },	
	// An object with keys the user ids
	playersScores: { type: Schema.Types.Mixed },
	// If solo or tournament here is where we hold the player score
	playerScore: { type: Number, default: 0 },
	questions: [{ type: String, ref: 'questions' }],//{type: Schema.Types.Mixed, default: []},
	// status values: [0] pending, [1] active, [2] closed
	status: { type: Number, default: 0 },
	configuration: { type: Schema.Types.Mixed },
	created: { type: Date, default: Date.now }
};

var gameSchema = new Schema(fields);

module.exports = mongoose.model('games', gameSchema);
