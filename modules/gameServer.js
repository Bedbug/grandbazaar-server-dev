

var GameServer = {},
    async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    GameTypes = mongoose.models.game_types,
    Questions = mongoose.models.questions,
    Users = mongoose.models.users,
    Game = mongoose.models.games,
    WebSocket = require('ws');

GameServer.SocketsServer = null;

/**
 * Game Server create new game
 * 0. Feth user data
 * 0. Fetch the game type from database
 * 1. We check user balance
 * 2. We check the game type multiplayer flag
 * 3. If multiplayer we check for other games
 * 4. Create the game and populate quizes
 * 5. Return the game to the user
 */
GameServer.createNewGame = function (user_id, game_type_name, dyno_name, cb) {

    var requestUser;
    var game_type_configuration;

    async.waterfall([
        // We receive the request user actual data
        function (callback) {
            GameServer.fetchUser(user_id, function (err, user) {
                requestUser = user;
                callback(err);
            })
        },
        // We fetch the game type requested
        function (callback) {
            GameServer.fetchGameTypeByName(game_type_name, function (err, game_type) {
                game_type_configuration = game_type;
                callback(err);
            })
        },
        // Get/create a valid game
        function (callback) {
            GameServer.fetchGameOfType(game_type_configuration, requestUser, function (err, game) {
                callback(err, game);
            });
        },
        // Populate Questions
        GameServer.populateGameQuestions,
    ], function (err, game) {
        game.save(function (err, result) {
            return cb(err, game);
        })
    })
}

/**
 * A live user didn't connect to the Head2Head game. Now we need to immitate the process
 * through a bot using a previous game played.
 * 0. Get the game in question
 * 1. Get a previous head 2 head and multiplex questions and answer of one of the users
 * 2. Inform the user through sockets to update the game object
 * 3. Inform the user through sockets that a user has connected feeding the bot info
 * 4. Inform the user that the other player has concluded the game
 */
GameServer.createHead2HeadBotGame = function (game_id, callback) {
    console.log("Creating Head 2 Head Bot");
}

/************************************************************
 *                   Helper Methods
 ***********************************************************/

/**
* Returns the user from database
*/
GameServer.fetchUser = function (user_id, callback) {
    console.log("Returning the user requested");
    Users.findById(user_id, function (err, result) {
        callback(err, result);
    })
}

/**
 * Returns the game type data for the requested name
 */
GameServer.fetchGameTypeByName = function (game_type_name, callback) {
    console.log("Returning the Game Type requested");
    // GameTypes.findById(game_type_id, function (err, result) {
    //     callback(err, result)
    // })
    GameTypes.findOne({ name: game_type_name }, function (err, result) {
        callback(err, result);
    })
}
/**
 * Parses the game type requested and takes the necessary steps
 * in order to return a valid game. Either new or another active.
 */
GameServer.fetchGameOfType = function (game_type, user, callback) {
    console.log("Returning a Valid Game for User");
    var game;
    // We need to handle differntly the Head2head game because we need opponent data
    if (game_type.room_size == 1) {
        createNewGame();
    } else {
        Game.findOne({ type: game_type.name, status: 0 })
            .sort({ field: 'asc', _id: -1 })
            .limit(1)
            .exec(function (err, activeGame) {
                if (!activeGame || err)
                    createNewGame();
                else {
                    callback(null, activeGame);
                }
            });
    }

    function createNewGame() {
        game = new Game();
        // Add the game type name as type of the game
        game.type = game_type.name;
        // Add the player to the players list. In every other game type other than solo
        // this happens in from the sockets.
        game.players.push(GameServer.transformToMiniUser(user));
        // Assign the congifuration for the client
        game.configuration = game_type;
        // Update the available slots left for the game
        game.slotsLeft = game.configuration.room_size - game.players.length;
        // If the game is not competative set to active
        if (game.configuration.room_size == 1)
            game.status = 1;
        // Create a socket room
        else {
            SocketServer.createRoom(game._id, game.configuration.room_size);
        }
        // return to the next waterfall method
        callback(null, game);
    }
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
 * Return the game by id
 */
GameServer.fetchOpenGame = function (gameid, cb) {
    Game.findById(gameid, function(err, game){
         return cb(err, game);
    })
}



/**
 * This will create a mini user containing only the exact needed properies.
 */
GameServer.transformToMiniUser = function (user) {
    return _.pick(user, ['_id', 'picture', 'username']);
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

/** ***************************************************************************
 * 
 *  SOCKET SERVER METHODS
 * 
 * ****************************************************************************/

// An array thet holds all the game rooms
SocketServer = {};
var socketClients = [];

GameServer.initSocketsServer = function (wss) {
    SocketServer = wss;
    SocketServer.rooms = [];

    SocketServer.on('connection', function connection(ws, req) {
        console.log("User connected");

        // socketClients.push({ room: "lobby", user: "123", ws: ws });

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            var action = JSON.parse(message);

            switch (action.type) {
                case "Subscribe":
                    var room = SocketServer.getRoom(action.room);
                    if (room && room.size > 0) {
                        SocketServer.roomBroadcast(room.sockets, { message: "A new user has connected" });
                        room.sockets.push(ws);
                        room.size--;
                        if (room.size == 0) {
                            SocketServer.socketsBroadcast(room.sockets, { action: "Game_Start" });
                            GameServer.setMatchToActive(room.id);
                            clearTimeout(room.timer);
                        }
                    } else {
                        console.log("Something went wrong in room subscription");
                    }
                    break;
                case "Chat":
                    break;

            }
        });

        // SocketServer.broadcast("lobby", null, "Hello Lobby");
        // ws.send('something');
    });

    SocketServer.socketsBroadcast = function (sockets, data) {
        _.each(sockets, function (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            }
        })
    }

    // Broadcast to all.
    // SocketServer.broadcast = function (room, user, data) {

    //     var searchObject = { user: user, room: room };
    //     searchObject = _.omitBy({ user: user, room: room }, _.isNil);

    //     var broadcastClients = _.filter(socketClients, searchObject);

    //     _.each(broadcastClients, function (o) {
    //         if (o.ws.readyState === WebSocket.OPEN) {
    //             o.ws.send(data);
    //         }
    //     })
    // };

    SocketServer.hasRoom = function (roomid) {
        return _.find(SocketServer.rooms, { id: roomid }) ? true : false;
    }

    SocketServer.getRoom = function (roomid) {
        return _.find(SocketServer.rooms, { id: roomid });
    }

    SocketServer.createRoom = function (roomid, roomsize) {
        var room = { id: roomid, size: roomsize, sockets: [] };
        console.log("Opening Room: "+room.id);
        room.noUserConnected = function(){                        
            if (this.size > 0) {
               console.log("Game failed to find live user. Let's imitate one.");
               GameServer.createHead2HeadBotGame(this.id);
            }
        };
        room.timer = setTimeout(room.noUserConnected.bind(room), 10000);
        SocketServer.rooms.push(room);      
    }

    SocketServer.closeRoom = function (roomid) {
        var room = SocketServer.getRoom(roomid);
        console.log("Closing Room: "+room.id);
        SocketServer.socketsBroadcast(room.sockets, { action: "Room_Closed" });
        clearTimeout(room.timer);
        _.pull(SocketServer.rooms, room);
        console.log(SocketServer.rooms.length);
    }

}




/**
 * Returns gameserver as module for the API to be able to use it
 */
module.exports = GameServer;