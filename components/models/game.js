'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId,
l=require('../config/lib');

/**
 * A Game is the core class for each played game in 
 * Grand Bazaar. It holds questions, configurations
 * and list of players participating and also results
 * and rewards.
 */

var fields = {
	dyno: { type: String },
	roomid: { type: String },
	players: [{ type: String, ref: 'user' }],
	configuration: { type: Schema.Types.Mixed }
};

var gameSchema = new Schema(fields);

module.exports = mongoose.model('game', gameSchema);
