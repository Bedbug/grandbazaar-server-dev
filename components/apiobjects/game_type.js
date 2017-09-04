// Module dependencies.
var mongoose = require('mongoose'),
Game_type = mongoose.models.game_types,
api = {},
l=require('../config/lib');


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAllGame_types = function (skip,limit,cb) {
  var q=Game_type.find();
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, game_types)=>{
    cb(err,{game_types:game_types,count:game_types.length}) 
  });
};

// GET
api.getGame_type = function (id,cb) {

  Game_type.findOne({ '_id': id }, (err, game_type)=>{
    if(game_type===null) {
      return cbf(cb,'No Data Found',404);
    }
    return cb(err,game_type);
  });
};

// POST
api.addGame_type = function (game_type,cb) {

  if(game_type === 'undefined'){
    cb('No Game_type Provided. Please provide valid game_type data.');
  }

  game_type = new Game_type(game_type);

  game_type.save((err)=>{
    cb(err,game_type.toObject());
  });
};

// PUT
api.editGame_type = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cb('Invalid Data. Please Check game_type and/or updateData fields',null); 
  }

  Game_type.findById(id, (err, game_type)=>{
   
    //Force Error
    if(game_type===null){
     return cb('No Data Found',404); 
    }

    if(typeof updateData["solo"] != 'undefined'){
      game_type["solo"] = updateData["solo"];
    }
    
    if(typeof updateData["room_size"] != 'undefined'){
      game_type["room_size"] = updateData["room_size"];
    }
    
    if(typeof updateData["min_players_allowed"] != 'undefined'){
      game_type["min_players_allowed"] = updateData["min_players_allowed"];
    }
    
    if(typeof updateData["quiz_questions"] != 'undefined'){
      game_type["quiz_questions"] = updateData["quiz_questions"];
    }

    if(typeof updateData["coins_required"] != 'undefined'){
      game_type["coins_required"] = updateData["coins_required"];
    }

    if(typeof updateData["game_duration"] != 'undefined'){
      game_type["game_duration"] = updateData["game_duration"];
    }

    if(typeof updateData["mistake_penalty"] != 'undefined'){
      game_type["mistake_penalty"] = updateData["mistake_penalty"];
    }
    
    if(typeof updateData["gems_reward_max"] != 'undefined'){
      game_type["gems_reward_max"] = updateData["gems_reward_max"];
    }

  var data=game_type.toObject(); //trim unnecessary data

  return game_type.save( (err)=>{
    cb(err,data); 
    }); //eo game_type.save
  });// eo game_type.find
};

// DELETE
api.deleteGame_type = function (id,cb) {
  return Game_type.findById(id).remove().exec( (err, game_type)=>{
    var data='The game_type got Deleted';
    if(err) data = 'Error in deleting this game_type';
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
api.deleteAllGame_types = function (cb) {
  return Game_type.remove({}, (err)=>{
    var data='All game_types got Deleted';
    if(err) data = 'Error in deleting all game_types';
   return cb(err,data);      
  });
};


// SEARCH
api.searchGame_types = function (skip,limit,keywordObj,strict,cb) {
  var k={};

  if(strict){
    k=keywordObj;
  }else{
    Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
    });
  }

  var q=Game_type.find(k)
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, game_types)=>{
    cb(err,game_types) 
  });
};


module.exports = api;
