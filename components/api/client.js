// Module dependencies.
var express = require('express'),
	router = express.Router(),
	gameServer = require('../../modules/gameServer');
l = require('../config/lib');

var api = {};



/**
 * v1/client/ticket
 * This endpoint is called when the user requests to play
 * a new game. Initial check have happened in the client
 * about cost deductions. But this process is responsible
 * to actual make them happen after all other processes 
 * have concluded.
 */
api.ticket = function (req, res) {

	if (req.body.game_type == undefined) {
		var r = l.response(l.STATUS_ERR, 'Invalid data provided', 'There was an error saving this data.');
		return res.status(500).json(r);
	}

	if (req.body.dyno_name == undefined) {
		var dynoId = process.env.DYNO;
		req.body.dyno_name = dynoId ? /\w+\.(\d+)/.exec(dynoId)[1] : "web.1";
	}	
	gameServer.createNewGame(req.body.game_type, req.body.dyno_name, (err, data) => {
		var r = {}, statusCode = 500;

		if (err) {
			r = l.response(l.STATUS_ERR, null, err);
		} else {
			r = l.response(l.STATUS_OK, data, null);
			statusCode = 201;
		}
		return res.status(statusCode).json(r);
	});
};

/*
=====================  ROUTES  =====================
*/


router.post('/v1/client/ticket', api.ticket);

module.exports = router;
