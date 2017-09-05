'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	random = require('mongoose-simple-random'),
	l = require('../config/lib');

var fields = {
	type: { type: String },
	body: { type: Schema.Types.Mixed },
	answers: { type: Schema.Types.Mixed },
	choices: { type: Number, default: 1 },
	time: { type: Number, default: 15000 },
	minPoints: { type: Number },
	maxPoints: { type: Number },
	minLimit:{ type: Number},
	maxLimit:{ type: Number},
	difficultyLevel: { type: Number, default: 1 },
	theme: {type: String, default: "Generic"},
	created: { type: Date, default: Date.now }
};

var questionSchema = new Schema(fields);

// Creating indexes
questionSchema.index({type: 1});

questionSchema.plugin(random);

module.exports = mongoose.model('questions', questionSchema);
