'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId,
l=require('../config/lib');

var fields = {
		solo: { type: Boolean },
	room_size: { type: Number },
	min_players: { type: Number },
	quiz_questions: { }
};

var game_typeSchema = new Schema(fields);

module.exports = mongoose.model('Game_type', game_typeSchema);
