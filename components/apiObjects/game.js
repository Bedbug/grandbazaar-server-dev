// Module dependencies.
var mongoose = require('mongoose'),
Game = mongoose.models.games,
api = {},
l=require('../config/lib');


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAllGames = function (skip,limit,cb) {
  var q=Game.find();
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, games)=>{
    cb(err,{games:games,count:games.length}) 
  });
};

// GET
api.getGame = function (id,cb) {

  Game.findOne({ '_id': id }, (err, game)=>{
    if(game===null) {
      return cbf(cb,'No Data Found',404);
    }
    return cb(err,game);
  });
};

// POST
api.addGame = function (game,cb) {

  if(game === 'undefined'){
    cb('No Game Provided. Please provide valid game data.');
  }

  game = new Game(game);

  game.save((err)=>{
    cb(err,game.toObject());
  });
};

// PUT
api.editGame = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cb('Invalid Data. Please Check game and/or updateData fields',null); 
  }

  Game.findById(id, (err, game)=>{
   
    //Force Error
    if(game===null){
     return cb('No Data Found',404); 
    }

    if(typeof updateData["dyno"] != 'undefined'){
      game["dyno"] = updateData["dyno"];
    }
    
    if(typeof updateData["roomid"] != 'undefined'){
      game["roomid"] = updateData["roomid"];
    }
    
    if(typeof updateData["players"] != 'undefined'){
      game["players"] = updateData["players"];
    }
    
    if(typeof updateData["game_type"] != 'undefined'){
      game["game_type"] = updateData["game_type"];
    }
    

  var data=game.toObject(); //trim unnecessary data

  return game.save( (err)=>{
    cb(err,data); 
    }); //eo game.save
  });// eo game.find
};

// DELETE
api.deleteGame = function (id,cb) {
  return Game.findById(id).remove().exec( (err, game)=>{
    var data='The game got Deleted';
    if(err) data = 'Error in deleting this game';
   return cb(err,data);      
 });
};


/*
========= [ SPECIAL METHODS ] =========
*/

//TEST
//New Callback System in TEST, which returns a ResponseClass object's Output
api.test=function (cb) {
  return l.responseCallback(cb,false,{name:'dummyValue'});
};

//DELETE ALL
api.deleteAllGames = function (cb) {
  return Game.remove({}, (err)=>{
    var data='All games got Deleted';
    if(err) data = 'Error in deleting all games';
   return cb(err,data);      
  });
};


// SEARCH
api.searchGames = function (skip,limit,keywordObj,strict,cb) {
  var k={};

  if(strict){
    k=keywordObj;
  }else{
    Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
    });
  }

  var q=Game.find(k)
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, games)=>{
    cb(err,games) 
  });
};


module.exports = api;
