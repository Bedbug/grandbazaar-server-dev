// Module dependencies.
var express = require('express'),
	router = express.Router(),
	gameServer = require('../../modules/gameServer');
l = require('../config/lib');

var api = {};

/**
 *
 * @api {post} v1/client/ticket Request Game Ticket
 * @apiVersion 1.0.0
 * @apiName GetTicket
 * @apiGroup Client
 *
 * @apiDescription This endpoint is called when the user requests to play
 * a new game. Initial check has happened in the client
 * about cost deductions. But this process is responsible
 * to actual make them happen after all other processes 
 * have concluded.
 * 
 * @apiParam {String} game_type_name The game type name of the game ticket.
 * @apiParam {String} user_id The id of the user.
 *
 * @apiSuccess {GameTicket} ticket The game ticket to be parsed by the client. 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "status": "success",
    "data": {
        "configuration": {
            "_id": "59ad7b42f36d28742f379649",
            "name": "solo",
            "solo": true,
            "room_size": 1,
            "min_players_allowed": 1,
            "coins_required": 5,
            "game_duration": 60000,
            "mistake_penalty": 10000,
            "gems_reward_max": 10,
            "quiz_questions": [
                {
                    "count": 5,
                    "type": "multiple"
                }
            ]
        },
        "_id": "59ae9ae1d2a97ef86520215f",
        "status": 0,
        "questions": [
            {
                "_id": "59ae882af36d28742f37e336",
                "type": "multiple",
                "body": {
                    "en": "Question num 9"
                },
                "answers": [
                    {
                        "correct": true,
                        "body": {
                            "en": "Answer num 1"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 2"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 3"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 4"
                        }
                    }
                ],
                "minPoints": 50,
                "maxPoints": 100,
                "created": "2017-09-05T12:38:57.414Z",
                "theme": "Generic",
                "difficultyLevel": 1,
                "time": 15000,
                "choices": 1
            },
            {
                "_id": "59ae87f8f36d28742f37e326",
                "type": "multiple",
                "body": {
                    "en": "Question num 6"
                },
                "answers": [
                    {
                        "correct": true,
                        "body": {
                            "en": "Answer num 1"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 2"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 3"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 4"
                        }
                    }
                ],
                "minPoints": 50,
                "maxPoints": 100,
                "created": "2017-09-05T12:38:57.567Z",
                "theme": "Generic",
                "difficultyLevel": 1,
                "time": 15000,
                "choices": 1
            },
            {
                "_id": "59ae8833f36d28742f37e33f",
                "type": "multiple",
                "body": {
                    "en": "Question num 10"
                },
                "answers": [
                    {
                        "correct": true,
                        "body": {
                            "en": "Answer num 1"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 2"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 3"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 4"
                        }
                    }
                ],
                "minPoints": 50,
                "maxPoints": 100,
                "created": "2017-09-05T12:38:57.724Z",
                "theme": "Generic",
                "difficultyLevel": 1,
                "time": 15000,
                "choices": 1
            },
            {
                "_id": "59ae87ecf36d28742f37e320",
                "type": "multiple",
                "body": {
                    "en": "Question num 5"
                },
                "answers": [
                    {
                        "correct": true,
                        "body": {
                            "en": "Answer num 1"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 2"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 3"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 4"
                        }
                    }
                ],
                "minPoints": 50,
                "maxPoints": 100,
                "created": "2017-09-05T12:38:57.934Z",
                "theme": "Generic",
                "difficultyLevel": 1,
                "time": 15000,
                "choices": 1
            },
            {
                "_id": "59ae881ef36d28742f37e335",
                "type": "multiple",
                "body": {
                    "en": "Question num 8"
                },
                "answers": [
                    {
                        "correct": true,
                        "body": {
                            "en": "Answer num 1"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 2"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 3"
                        }
                    },
                    {
                        "correct": false,
                        "body": {
                            "en": "Answer num 4"
                        }
                    }
                ],
                "minPoints": 50,
                "maxPoints": 100,
                "created": "2017-09-05T12:38:58.089Z",
                "theme": "Generic",
                "difficultyLevel": 1,
                "time": 15000,
                "choices": 1
            }
        ],
        "players": []
    },
    "message": null
}
 *
 * @apiError GameTypeNotFound Invalid data provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
    "status": "error",
    "data": "Invalid data provided",
    "message": "There was an error saving this data."
}
 */
api.ticket = function (req, res) {

	if (req.body.game_type == undefined || req.body.user_id == undefined ) {
		var r = l.response(l.STATUS_ERR, 'Invalid data provided', 'There was an error saving this data.');
		return res.status(500).json(r);
	}

	if (req.body.dyno_name == undefined) {
		var dynoId = process.env.DYNO;
		req.body.dyno_name = dynoId ? /\w+\.(\d+)/.exec(dynoId)[1] : "web.1";
	}	
	gameServer.createNewGame(req.body.user_id, req.body.game_type, req.body.dyno_name, (err, data) => {
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
