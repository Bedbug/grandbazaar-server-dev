// Module dependencies.
var express = require('express'),
router = express.Router(),
game = require('../apiObjects/game'),
l=require('../config/lib');

var api = {};


// GET ALL
api.games = function (req, res) {
	var skip=null,limit=10;

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	game.getAllGames(skip,limit, (err,data) => {

		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	});  
};


// POST
api.addgame = function (req, res) {

	if(req.body.game==undefined) {
		var r=l.response(l.STATUS_ERR,'Invalid game/key model provided','There was an error saving this data.');
		return res.status(500).json(r);
	}

	game.addGame(req.body.game,	(err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=201;
		}
		return res.status(statusCode).json(r);
	});
};


// GET
api.game = function (req, res) {

	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	game.getGame(id, (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=200;
		}
		return res.status(statusCode).json(r);
	}); 
};


// PUT
api.editGame = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	if(req.body.game==undefined) {
		var r= l.response(l.STATUS_ERR,'Invalid game/key model provided','There was an error updating this data.');
		return res.status(500).json(r);
	}

	return game.editGame(id,req.body.game,(err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});

};


// DELETE
api.deleteGame = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	return game.deleteGame(id, (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});
};


// DELETE All
api.deleteAllGames = function (req, res) {
	return game.deleteAllGames( (err,data)=>{
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
			statusCode=(data===404)?404:500;
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	});
};



// SEARCH
api.searchGames=function(req,res){
	var skip=null,limit=10,keyword='',strict='';

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	if(req.query.keyword!=undefined)
		keyword=req.query.keyword;

	if(req.query.strict!=undefined)
		strict=req.query.strict;
	else
		strict=false;

	strict = (strict=='true' || strict=='True' || strict==1)?true:false;


	var k={};
	var kObj=keyword.split(',').forEach(function(key) {
		var k1=key.split(':');
	      k[k1[0]]=k1[1];
	 });

	game.searchGames(skip,limit,k,strict, (err,data) => {
		var r={},statusCode=500;

		if(err){
			r=l.response(l.STATUS_ERR,null,err);
		}else{
			r=l.response(l.STATUS_OK,data,null);
			statusCode=202;
		}
		return res.status(statusCode).json(r);
	}); 
};




/*
=====================  ROUTES  =====================
*/


router.post('/game',api.addgame);

router.route('/game/:id')
.get(api.game)
.put(api.editGame)
.delete(api.deleteGame);


router.route('/games')
.get(api.games)
.delete(api.deleteAllGames);

/*
	SEARCH
	e.g.: /api/games/search?keyword=first:Sam,last:Jones
 */
router.get('/games/search',api.searchGames);

//New quick Response Handling
router.get('/games/test', (req,res)=>
	game.test( (data)=>l.response(res,data) )
);

module.exports = router;
