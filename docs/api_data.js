define({ "api": [
  {
    "type": "get",
    "url": "GameTicket",
    "title": "GameTicket",
    "version": "1.0.0",
    "name": "GameTicket",
    "group": "Client",
    "description": "<p>This is an example of a GameTicket</p>",
    "filename": "components/api/client.js",
    "groupTitle": "Client",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "GameTicket",
            "optional": false,
            "field": "ticket",
            "description": "<p>The game ticket to be parsed by the client.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK \n    {\n    \"status\": \"success\",\n    \"data\": {\n        \"configuration\": {\n            \"_id\": \"59ad7b42f36d28742f379649\",\n            \"name\": \"solo\",\n            \"solo\": true,\n            \"room_size\": 1,\n            \"min_players_allowed\": 1,\n            \"coins_required\": 5,\n            \"game_duration\": 60000,\n            \"mistake_penalty\": 10000,\n            \"gems_reward_max\": 10,\n            \"quiz_questions\": [\n                {\n                    \"count\": 5,\n                    \"type\": \"multiple\"\n                }\n            ]\n        },\n        \"_id\": \"59ae9ae1d2a97ef86520215f\",\n        \"status\": 0,\n        \"questions\": [\n            {\n                \"_id\": \"59ae882af36d28742f37e336\",\n                \"type\": \"multiple\",\n                \"body\": {\n                    \"en\": \"Question num 9\"\n                },\n                \"answers\": [\n                    {\n                        \"correct\": true,\n                        \"body\": {\n                            \"en\": \"Answer num 1\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 2\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 3\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 4\"\n                        }\n                    }\n                ],\n                \"minPoints\": 50,\n                \"maxPoints\": 100,\n                \"created\": \"2017-09-05T12:38:57.414Z\",\n                \"theme\": \"Generic\",\n                \"difficultyLevel\": 1,\n                \"time\": 15000,\n                \"choices\": 1\n            },\n            {\n                \"_id\": \"59ae87f8f36d28742f37e326\",\n                \"type\": \"multiple\",\n                \"body\": {\n                    \"en\": \"Question num 6\"\n                },\n                \"answers\": [\n                    {\n                        \"correct\": true,\n                        \"body\": {\n                            \"en\": \"Answer num 1\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 2\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 3\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 4\"\n                        }\n                    }\n                ],\n                \"minPoints\": 50,\n                \"maxPoints\": 100,\n                \"created\": \"2017-09-05T12:38:57.567Z\",\n                \"theme\": \"Generic\",\n                \"difficultyLevel\": 1,\n                \"time\": 15000,\n                \"choices\": 1\n            },\n            {\n                \"_id\": \"59ae8833f36d28742f37e33f\",\n                \"type\": \"multiple\",\n                \"body\": {\n                    \"en\": \"Question num 10\"\n                },\n                \"answers\": [\n                    {\n                        \"correct\": true,\n                        \"body\": {\n                            \"en\": \"Answer num 1\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 2\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 3\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 4\"\n                        }\n                    }\n                ],\n                \"minPoints\": 50,\n                \"maxPoints\": 100,\n                \"created\": \"2017-09-05T12:38:57.724Z\",\n                \"theme\": \"Generic\",\n                \"difficultyLevel\": 1,\n                \"time\": 15000,\n                \"choices\": 1\n            },\n            {\n                \"_id\": \"59ae87ecf36d28742f37e320\",\n                \"type\": \"multiple\",\n                \"body\": {\n                    \"en\": \"Question num 5\"\n                },\n                \"answers\": [\n                    {\n                        \"correct\": true,\n                        \"body\": {\n                            \"en\": \"Answer num 1\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 2\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 3\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 4\"\n                        }\n                    }\n                ],\n                \"minPoints\": 50,\n                \"maxPoints\": 100,\n                \"created\": \"2017-09-05T12:38:57.934Z\",\n                \"theme\": \"Generic\",\n                \"difficultyLevel\": 1,\n                \"time\": 15000,\n                \"choices\": 1\n            },\n            {\n                \"_id\": \"59ae881ef36d28742f37e335\",\n                \"type\": \"multiple\",\n                \"body\": {\n                    \"en\": \"Question num 8\"\n                },\n                \"answers\": [\n                    {\n                        \"correct\": true,\n                        \"body\": {\n                            \"en\": \"Answer num 1\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 2\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 3\"\n                        }\n                    },\n                    {\n                        \"correct\": false,\n                        \"body\": {\n                            \"en\": \"Answer num 4\"\n                        }\n                    }\n                ],\n                \"minPoints\": 50,\n                \"maxPoints\": 100,\n                \"created\": \"2017-09-05T12:38:58.089Z\",\n                \"theme\": \"Generic\",\n                \"difficultyLevel\": 1,\n                \"time\": 15000,\n                \"choices\": 1\n            }\n        ],\n        \"players\": []\n    },\n    \"message\": null\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "v1/client/ticket/:id",
    "title": "Get open ticket",
    "version": "1.0.0",
    "name": "GetOldTicket",
    "group": "Client",
    "description": "<p>This endpoint is called when the user wants to retrieve an old ticket probably under instructions from the SocketsServer.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": ":id",
            "description": "<p>The ID of the game ticket.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GameID",
            "description": "<p>Invalid data provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 500 Not Found\n    {\n    \"status\": \"error\",\n    \"data\": \"Invalid data provided\",\n    \"message\": \"There was an error saving this data.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "components/api/client.js",
    "groupTitle": "Client",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "GameTicket",
            "optional": false,
            "field": "ticket",
            "description": "<p>The game ticket to be parsed by the client.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK \n{\n     [GameTicket Object]\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "v1/client/ticket",
    "title": "Request Game Ticket",
    "version": "1.0.0",
    "name": "GetTicket",
    "group": "Client",
    "description": "<p>This endpoint is called when the user requests to play a new game. Initial check has happened in the client about cost deductions. But this process is responsible to actual make them happen after all other processes have concluded.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_type_name",
            "description": "<p>The game type name of the game ticket.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>The id of the user.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GameTypeNotFound",
            "description": "<p>Invalid data provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 500 Not Found\n    {\n    \"status\": \"error\",\n    \"data\": \"Invalid data provided\",\n    \"message\": \"There was an error saving this data.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "components/api/client.js",
    "groupTitle": "Client",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "GameTicket",
            "optional": false,
            "field": "ticket",
            "description": "<p>The game ticket to be parsed by the client.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK \n{\n     [GameTicket Object]\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "api/tests/push/:token",
    "title": "Send  push to Token",
    "name": "SendPush",
    "group": "Pushes",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": true,
            "field": "String",
            "description": "<p>tokens    The tokens list for the devices to push the message</p>"
          }
        ]
      }
    },
    "filename": "components/api/user.js",
    "groupTitle": "Pushes"
  }
] });
