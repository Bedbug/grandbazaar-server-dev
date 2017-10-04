

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

        // Add the player to the players list. In every other game type other than solo
        // this happens in from the sockets.
        game.players.push(GameServer.transformToMiniUser(requestUser));
        // Update the available slots left for the game
        game.slotsLeft = game.configuration.room_size - game.players.length;

        if (!err)
            game.save(function (err, result) {
                return cb(err, game);
            })
        else
            return cb(err, null)
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
GameServer.createHead2HeadBotGame = function (game_id) {
    console.log("Creating Head 2 Head Bot");
    var openGame;
    var oldGame;
    var oldPlayer;
    async.waterfall([
        // 0. Get the game in question
        function (callback) {
            GameServer.fetchOpenGame(game_id, function (err, game) {
                openGame = game;
                callback(err);
            })
        },
        // 1. Get a previous head 2 head and multiplex questions and answer of one of the users
        function (callback) {
            // We find one random game of Head2Head which has ended and the player has not participated
            Game.findOneRandom({ type: "head2head", status: 2, "players._id": { $ne: openGame.players[0]._id } }, {}, { limit: 1 }, function (err, result) {
                console.log("1. Get a previous head 2 head and multiplex questions and answer of one of the users");
                oldGame = result;
                // We make the additions needed to the open game from the old one
                openGame.questions = oldGame.questions;
                // openGame.markModified('questions');
                // We set the OpenGame as active since now we've reached the number of players needed to begin
                openGame.status = 1;
                oldPlayer = oldGame.players[Math.floor(Math.random() * oldGame.players.length)];
                openGame.players.push(oldPlayer);
                // Update the available slots left for the game
                openGame.slotsLeft = openGame.configuration.room_size - openGame.players.length;
                // openGame.markModified('players');
                callback(err);
            });
        },
        // 2. Inform the user through sockets to update the game object
        function (callback) {
            console.log("2. Inform the user through sockets to update the game object");
            openGame.save(function (err, result) {
                // After we update the Open Game we inform the user client that it has to reload the game data because the questions have changed
                SocketServer.roomBroadcast(openGame._id.toString(), "Reload_Game");
                callback(err);
            })
        },
        function (callback) {
            // We give a chance for the client to oad the new data
            // and then we are set to unleash the bot.
            setTimeout(function () {
                SocketServer.botSubscribe(openGame._id.toString(), oldPlayer);
                callback();
            }, 5000)
        },
    ], function (err, game) {
        if (err)
            console.log(err);
    })
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
        Game.findOne({ type: game_type.name, status: 0, "players._id": { $ne: user._id } })
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
        // Assign the congifuration for the client
        game.configuration = game_type;
        // If the game is not competative set to active
        if (game.configuration.room_size == 1) {
            game.status = 1;
        }
        // Create a socket room
        else {
            SocketServer.createRoom(game._id.toString(), game.configuration.room_size);
        }
        // return to the next waterfall method
        callback(null, game);
    }
}

// Sets the game to
GameServer.setMatchStatusTo = function (roomid, status) {
    var statuses = { "0": "open", "1": "active", "2": "closed", "3": "canceled" };
    Game.findByIdAndUpdate(roomid, { $set: { status: status } }, function (err, game) {
        if (err) return console.log("[error] " + err);
        console.log("GameServer: Game [" + roomid + "] has become [" + status + "] " + statuses[status] + ".");
    });
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
    Game.findById(gameid, function (err, game) {
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
            var action;

            try {
                action = JSON.parse(message);
            } catch (er) {
                action = message;
            }

            // console.log(action.type);

            switch (action.type) {
                case "Subscribe":
                    console.log("Action from client to subscribe");
                    var room = SocketServer.getRoom(action.data.game);
                    if (room && room.size > 0) {
                        room.size--;
                        // Inform the socket about the user that has connected;
                        SocketServer.roomBroadcast(room.id, "Player_Connect", action.data.player);
                        room.sockets.push(ws);

                        if (room.size == 0) {
                            SocketServer.roomBroadcast(room.id, "Game_Start");
                            GameServer.setMatchStatusTo(room.id, 1);
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
        ws.send(JSON.stringify({"action":"Welcome","data":{"message":'Welcome to the Grand Bazaar Lobby'}}));
    });

    SocketServer.botSubscribe = function (roomid, player) {
        var room = SocketServer.getRoom(roomid);
        console.log("Bot subscribing");
        if (room && room.size > 0) {
            // decrement the room size  
            room.size--;
            // Inform the socket about the user that has connected;
            SocketServer.roomBroadcast(room.id, "Player_Connect", player);
            // if we are filled start the game
            if (room.size == 0) {
                SocketServer.roomBroadcast(room.id, "Game_Start");
            }
        }
    }

    /**
     * Socket Client Actions
     * Game_Start: Tell the client to start the game. (data:null)
     * Reload_Game: Tell the client to reload the game data. (data: <game_id>)
     * Player_Connect: Inform the client that a new user conencted. (data:{size: <room_size>, player: <player_data>)
     * Room_Closed: Inform the user that the room has closed and is now unsubscribed. (data: <room_id>)
     */
    SocketServer.roomBroadcast = function (room_id, action, extraData) {
        var room = SocketServer.getRoom(room_id);
        if (!room) return;

        var message = { action: action, data: null };

        switch (action) {
            case "Game_Start":
                message.data = { game: room_id };
                break;
            case "Reload_Game":
                message.data = { game: room_id };
                break;
            case "Player_Connect":
                message.data = { game: room_id, size: room.size, player: extraData };
                break;
            case "Room_closed":
                message.data = { game: room_id };
                break;
        }

        console.log("Sending SocketAction: " + message.action);

        _.each(room.sockets, function (socket) {

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
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
        console.log("Requested to fetch room:" + roomid);
        var room = _.find(SocketServer.rooms, { id: roomid });
        return room;
    }

    SocketServer.createRoom = function (roomid, roomsize) {
        var room = { id: roomid, size: roomsize, sockets: [] };
        console.log("Opening Room: " + room.id);
        room.noUserConnected = function () {
            if (this.size > 0) {
                console.log("Game failed to find live user. Let's imitate one.");
                GameServer.createHead2HeadBotGame(this.id);
            }
        };
        room.timer = setTimeout(room.noUserConnected.bind(room), 30000);
        SocketServer.rooms.push(room);
    }

    SocketServer.closeRoom = function (roomid) {
        var room = SocketServer.getRoom(roomid);
        console.log("Closing Room: " + room.id);
        SocketServer.roomBroadcast(room.sockets, "Room_Closed");
        clearTimeout(room.timer);
        _.pull(SocketServer.rooms, room);
        console.log(SocketServer.rooms.length);
    }

}




/**
 * Returns gameserver as module for the API to be able to use it
 */
module.exports = GameServer;