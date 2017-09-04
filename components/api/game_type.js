// Module dependencies.
var express = require('express'),
router = express.Router(),
game_type = require('../apiObjects/game_type'),
l=require('../config/lib');

var api = {};


// GET ALL
api.game_types = function (req, res) {
	var skip=null,limit=10;

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	game_type.getAllGame_types(skip,limit, (err,data) => {

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
api.addgame_type = function (req, res) {

	if(req.body.game_type==undefined) {
		var r=l.response(l.STATUS_ERR,'Invalid game_type/key model provided','There was an error saving this data.');
		return res.status(500).json(r);
	}

	game_type.addGame_type(req.body.game_type,	(err,data)=>{
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
api.game_type = function (req, res) {

	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	game_type.getGame_type(id, (err,data)=>{
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
api.editGame_type = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	if(req.body.game_type==undefined) {
		var r= l.response(l.STATUS_ERR,'Invalid game_type/key model provided','There was an error updating this data.');
		return res.status(500).json(r);
	}

	return game_type.editGame_type(id,req.body.game_type,(err,data)=>{
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
api.deleteGame_type = function (req, res) {
	var id = req.params.id;

	if(id===null || id===undefined){
		res.status(402).json(l.response(l.STATUS_ERR,null,'No ID Provided'));
	}

	return game_type.deleteGame_type(id, (err,data)=>{
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
api.deleteAllGame_types = function (req, res) {
	return game_type.deleteAllGame_types( (err,data)=>{
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
api.searchGame_types=function(req,res){
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

	game_type.searchGame_types(skip,limit,k,strict, (err,data) => {
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


router.post('/v1/game_type',api.addgame_type);

router.route('/v1/game_type/:id')
.get(api.game_type)
.put(api.editGame_type)
.delete(api.deleteGame_type);


router.route('/v1/game_types')
.get(api.game_types)
.delete(api.deleteAllGame_types);

/*
	SEARCH
	e.g.: /api/game_types/search?keyword=first:Sam,last:Jones
 */
router.get('/v1/game_types/search',api.searchGame_types);

//New quick Response Handling
router.get('/v1/game_types/test', (req,res)=>
	game_type.test( (data)=>l.response(res,data) )
);

module.exports = router;
