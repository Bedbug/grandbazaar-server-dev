## Game
  `Game` Endpoint for managaing games.

### Endpoint Summary
* `[GET]` /api/games - [Retrieve All *Games*](#Retrieve-All-Games)
* `[POST]` /api/game - [Create a new *Game*](#Create-a-new-Game)
* `[GET]` /api/game/<.id> - [Retrieve a single *Game* with `id`](#Retrieve-a-single-Game)
* `[PUT]` /api/game/<.id> - [Edit a single *Game* with `id`](#Edit-a-single-Game)
* `[DELETE]` /api/game/<.id> - [Delete a single *Game* with `id`](#Delete-a-single-Game)
* `[GET]` /api/games/test - [Quick Test game](#Quick-Test-game)
* `[DELETE]` /api/games - [Delete all *games* in the collection](#Delete-all-games)
* `[GET]` /api/games/search - [Searches all *games* for multiple values](#Search-games)


**N.B**: The `/test` endpoint of this game is for quick development testing only. Do Disable this when in production!


### Retrieve All Games

* **Syntax** : `[GET] /api/games [?skip= X & limit= Y]` 
* **URL** :  `/api/games`  
* **Method**: `GET`  
* **URL Params**:   
   **Required:**   None  
   **Optional:**
 
   `skip=[Integer]` - Offsets(Skips) index of results  
   `limit=[Integer]` - Total number of results in the current request to return
* **Success Response:**
 
   **Code:** 200 <br />
    **Content:** 
    ```
    {
      "status": "success",
      "data": {
        "games": [
          {
            "_id": "587100001657a2bd9c5a00df",
            dyno : String,
			 roomid : String,
			 players : Array,
			 game_type : game_types,
            "__v": 0
          },
          .
          .
          .
        ],
        "count": 1
      },
      "message": null
    }
    ```

* **Sample Call:**

   `  curl "http://localhost:3000/api/games"`  
 Fetches 5 game results skipping the first 2  

* **Notes:**

 
### Create a new Game 

* **Syntax** : `[POST] /api/game`
* **URL** :  `/api/game`  
* **Method**: `POST`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
   `{game:{}}` - The base game data object  
   ```
    { 
      "game" : {
        dyno : String, 
        roomid : String, 
        players : Array, 
        game_type : game_types
         
      }
    }
   ```
* **Success Response:**
 
   **Code:** 201  
   **Content:** 
    ```
      {
        "status": "success",
        "data": {
          "__v": 0,
          "_id": "58713aaf1657a2bd9c5a00e0",
          dyno : String, 
          roomid : String, 
          players : Array, 
          game_type : game_types
           
        },
        "message": null
      }
    ```
* **Error Response:**
 
   **Code:** 500 <br />
    **Content:** 
    ```
      {
        "status": "error",
        "data": "Invalid game/key model provided",
        "message": "There was an error saving this data."
      }
    ```
* **Sample Call:**

  ``` 
      curl -X POST -H "Content-Type: application/json" 
        -H "Cache-Control: no-cache" -d     '{
        "game":{
            "name":"pen",
            "price":2.54
            }
        }' "http://localhost:3000/api/game"
    
    ```
  The key model being `game` the saves a 'pen' data 

* **Notes:**




### Retrieve a single Game 

* **Syntax** : `[GET] /api/game/:id`
* **URL** :  `/api/game/:id`  
* **Method**: `GET`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
   `id` - The object id of the game  
   
* **Success Response:**
 
   **Code:** 200  
   **Content:** 
    ```
      {
        "status": "success",
        "data": {
          "_id": "587100001657a2bd9c5a00df",
          "__v": 0,
          dyno : String, 
          roomid : String, 
          players : Array, 
          game_type : game_types
           
        },
        "message": null
      }
    ```
* **Error Response:**
 
   **Code:** 404   
   **Content:** 
    ```
      {
        "status": "error",
        "data": 404,
        "message": "Not Found Error"
      }
    ```
* **Sample Call:**

  ``` 
      curl -X GET -H "Content-Type: application/json" 
        -H "Cache-Control: no-cache" 
        "http://localhost:3000/api/game/587100001657a2bd9c5a00d"
    
    ```
  Fetches a single game from the collection `games`

* **Notes:**




### Edit a single Game

* **Syntax** : `[PUT] /api/game/:id`
* **URL** :  `/api/game/:id`  
* **Method**: `PUT`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
  `id` - The object id of the game  
    `{game:{}}` - The base game data object that needs to be changed 
   ```
    { 
      "game" : {
        dyno : String, 
        roomid : String, 
        players : Array, 
        game_type : game_types
         
      }
    }
   ```
* **Success Response:**
 
   **Code:** 202  
    **Content:** 
    ```
      {
        "status": "success",
        "data": {
          "_id": "587100001657a2bd9c5a00df",
          "__v": 0,
          dyno : String, 
          roomid : String, 
          players : Array, 
          game_type : game_types
           
        },
        "message": null
      }
    ```
* **Error Response:**
 
   **Code:** 500  
   **Content:** 
    ```
      {
        "status": "error",
        "data": "Invalid game/key model provided",
        "message": "There was an error updating this data."
      }
    ```
    
   **Code:** 404  
   **Content:** 
    ```
    {
      "status": "error",
      "data": 404,
      "message": "No Data Found"
    }
    ```
* **Sample Call:**

  ``` 
      curl -X PUT -H "Content-Type: application/json" 
        -H "Cache-Control: no-cache" 
        -d '{
              "game22":{
                  "name":"sharpner",
                  "price":2.55
                }
            }' "http://localhost:3000/api/game/587100001657a2bd9c5a00df"
    
    ```
  The key model being `game` which updates a 'sharpner' data 

* **Notes:**








### Delete a single Game

* **Syntax** : `[DELETE] /api/game/:id`
* **URL** :  `/api/game/:id`  
* **Method**: `DELETE`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
  `id` - The object id of the game  
* **Success Response:**
 
   **Code:** 202  
    **Content:** 
    ```
    {
      "status": "success",
      "data": "The game got Deleted",
      "message": null
    }
    ```
* **Error Response:**
 
   **Code:** 500  
   **Content:** 
    ```
      {
      "status": "error",
      "data": "Error in deleting this game",
      "message": {
        .
        .
        .
      }
    }
    ```
    
* **Sample Call:**

  ``` 
    curl -X DELETE "http://localhost:3000/api/game/58713b0a1657a2bd9c5ad"
    ```
  The key model being `game` which updates a 'sharpner' data 

* **Notes:**





### Delete all Games

* **Syntax** : `[DELETE] /api/games`
* **URL** :  `/api/games`  
* **Method**: `DELETE`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  None 
* **Success Response:**
 
   **Code:** 202  
   **Content:** 
   ```
    {
      "status": "success",
      "data": "All games got Delete",
      "message": null
    }
   ```
* **Error Response:**
 
   **Code:** 500  
   **Content:** 
   ```
      {
        "status": "error",
        "data": "Error in deleting all games",
        "message": {
          .
          .
          .
        }
      }
    ```
    
* **Sample Call:**

  ``` 
    curl -X DELETE "http://localhost:3000/api/games"
    ```
  The key model being `game` which updates a 'sharpner' data 

* **Notes:**




### Search Games

* **Syntax** : `[GET] /api/games/search [?skip= X & limit= Y & keyword= field:value [,field:value]]` 
* **URL** :  `/api/games/search`  
* **Method**: `GET`  
* **URL Params**:   
   **Required:**   keyword  
   **Optional:**
 
   `skip=[Integer]` - Offsets(Skips) index of results  
   `limit=[Integer]` - Total number of results in the current request to return
   `keyword=[CSV]` - keyword = field1:value1, filed2:value2 ... 
    `strict=[Boolean]` - Performs Strict search.

* **Success Response:**
 
   **Code:** 200 <br />
    **Content:** 
    ```
    {
      "status": "success",
      "data": {
        "games": [
          {
            "_id": "587100001657a2bd9c5a00df",
            name : String,
        price : Number,
            "__v": 0
          },
          .
          .
          .
        ],
        "count": 1
      },
      "message": null
    }
    ```

* **Sample Call:**

   `  curl "http://localhost:3000/api/games/search?keyword=first:Sam,last:Jones"`  
 Searches games with rows with its first name 'Sam' and last name 'Jones'

* **Notes:**
To use Strict Search, add param ?strict=true