## Game_type
  `Game_type` Endpoint for managaing game_types.

### Endpoint Summary
* `[GET]` /api/game_types - [Retrieve All *Game_types*](#Retrieve-All-Game_types)
* `[POST]` /api/game_type - [Create a new *Game_type*](#Create-a-new-Game_type)
* `[GET]` /api/game_type/<.id> - [Retrieve a single *Game_type* with `id`](#Retrieve-a-single-Game_type)
* `[PUT]` /api/game_type/<.id> - [Edit a single *Game_type* with `id`](#Edit-a-single-Game_type)
* `[DELETE]` /api/game_type/<.id> - [Delete a single *Game_type* with `id`](#Delete-a-single-Game_type)
* `[GET]` /api/game_types/test - [Quick Test game_type](#Quick-Test-game_type)
* `[DELETE]` /api/game_types - [Delete all *game_types* in the collection](#Delete-all-game_types)
* `[GET]` /api/game_types/search - [Searches all *game_types* for multiple values](#Search-game_types)


**N.B**: The `/test` endpoint of this game_type is for quick development testing only. Do Disable this when in production!


### Retrieve All Game_types

* **Syntax** : `[GET] /api/game_types [?skip= X & limit= Y]` 
* **URL** :  `/api/game_types`  
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
        "game_types": [
          {
            "_id": "587100001657a2bd9c5a00df",
            solo : Boolean,
			 room_size : Number,
			 min_players : Number,
			 quiz_questions : Mixed,
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

   `  curl "http://localhost:3000/api/game_types"`  
 Fetches 5 game_type results skipping the first 2  

* **Notes:**

 
### Create a new Game_type 

* **Syntax** : `[POST] /api/game_type`
* **URL** :  `/api/game_type`  
* **Method**: `POST`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
   `{game_type:{}}` - The base game_type data object  
   ```
    { 
      "game_type" : {
        solo : Boolean, 
        room_size : Number, 
        min_players : Number, 
        quiz_questions : Mixed
         
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
          solo : Boolean, 
          room_size : Number, 
          min_players : Number, 
          quiz_questions : Mixed
           
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
        "data": "Invalid game_type/key model provided",
        "message": "There was an error saving this data."
      }
    ```
* **Sample Call:**

  ``` 
      curl -X POST -H "Content-Type: application/json" 
        -H "Cache-Control: no-cache" -d     '{
        "game_type":{
            "name":"pen",
            "price":2.54
            }
        }' "http://localhost:3000/api/game_type"
    
    ```
  The key model being `game_type` the saves a 'pen' data 

* **Notes:**




### Retrieve a single Game_type 

* **Syntax** : `[GET] /api/game_type/:id`
* **URL** :  `/api/game_type/:id`  
* **Method**: `GET`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
   `id` - The object id of the game_type  
   
* **Success Response:**
 
   **Code:** 200  
   **Content:** 
    ```
      {
        "status": "success",
        "data": {
          "_id": "587100001657a2bd9c5a00df",
          "__v": 0,
          solo : Boolean, 
          room_size : Number, 
          min_players : Number, 
          quiz_questions : Mixed
           
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
        "http://localhost:3000/api/game_type/587100001657a2bd9c5a00d"
    
    ```
  Fetches a single game_type from the collection `game_types`

* **Notes:**




### Edit a single Game_type

* **Syntax** : `[PUT] /api/game_type/:id`
* **URL** :  `/api/game_type/:id`  
* **Method**: `PUT`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
  `id` - The object id of the game_type  
    `{game_type:{}}` - The base game_type data object that needs to be changed 
   ```
    { 
      "game_type" : {
        solo : Boolean, 
        room_size : Number, 
        min_players : Number, 
        quiz_questions : Mixed
         
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
          solo : Boolean, 
          room_size : Number, 
          min_players : Number, 
          quiz_questions : Mixed
           
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
        "data": "Invalid game_type/key model provided",
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
              "game_type22":{
                  "name":"sharpner",
                  "price":2.55
                }
            }' "http://localhost:3000/api/game_type/587100001657a2bd9c5a00df"
    
    ```
  The key model being `game_type` which updates a 'sharpner' data 

* **Notes:**








### Delete a single Game_type

* **Syntax** : `[DELETE] /api/game_type/:id`
* **URL** :  `/api/game_type/:id`  
* **Method**: `DELETE`  
* **URL Params**:   
   **Optional:**   None  
   **Required:**  
 
  `id` - The object id of the game_type  
* **Success Response:**
 
   **Code:** 202  
    **Content:** 
    ```
    {
      "status": "success",
      "data": "The game_type got Deleted",
      "message": null
    }
    ```
* **Error Response:**
 
   **Code:** 500  
   **Content:** 
    ```
      {
      "status": "error",
      "data": "Error in deleting this game_type",
      "message": {
        .
        .
        .
      }
    }
    ```
    
* **Sample Call:**

  ``` 
    curl -X DELETE "http://localhost:3000/api/game_type/58713b0a1657a2bd9c5ad"
    ```
  The key model being `game_type` which updates a 'sharpner' data 

* **Notes:**





### Delete all Game_types

* **Syntax** : `[DELETE] /api/game_types`
* **URL** :  `/api/game_types`  
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
      "data": "All game_types got Delete",
      "message": null
    }
   ```
* **Error Response:**
 
   **Code:** 500  
   **Content:** 
   ```
      {
        "status": "error",
        "data": "Error in deleting all game_types",
        "message": {
          .
          .
          .
        }
      }
    ```
    
* **Sample Call:**

  ``` 
    curl -X DELETE "http://localhost:3000/api/game_types"
    ```
  The key model being `game_type` which updates a 'sharpner' data 

* **Notes:**




### Search Game_types

* **Syntax** : `[GET] /api/game_types/search [?skip= X & limit= Y & keyword= field:value [,field:value]]` 
* **URL** :  `/api/game_types/search`  
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
        "game_types": [
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

   `  curl "http://localhost:3000/api/game_types/search?keyword=first:Sam,last:Jones"`  
 Searches game_types with rows with its first name 'Sam' and last name 'Jones'

* **Notes:**
To use Strict Search, add param ?strict=true