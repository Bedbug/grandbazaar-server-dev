// Module dependencies.
var express = require('express'),
router = express.Router(),
question = require('../apiObjects/question'),
l=require('../config/lib');

var api = {};
// GET ALL
api.questions = function (req, res) {
	var skip=null,limit=10;

	if(req.query.skip!=undefined)
		skip=req.query.skip;

	if(req.query.limit!=undefined)
		limit=req.query.limit;

	question.getAllQuestions(skip,limit, (data) => l.response(res,data) ); 
};

// POST
api.addquestion = function (req, res) {
	if(req.body.question==undefined) return res.status(500).json(new l.ResponseClass('error','Invalid question/key model provided','There was an error saving this data.').out());

	question.addQuestion(req.body.question,	(data)=>{
		var status=(data.status!='success')? 500 :  201;
		res.status(status).json(data);
	});	
};

// GET
api.question = function (req, res) {
	var id = req.params.id;
	question.getQuestion(id, (data)=>{
		var status=200;

		if(data.status!='success'){
			status=404;
			data.message='Not Found Error';
		}

		res.status(status).json(data);
	}); 
};

// PUT
api.editQuestion = function (req, res) {
	var id = req.params.id;

	if(req.body.question==undefined) {
		var r=new l.ResponseClass('error','Invalid question/key model provided','There was an error updating this data.');
		return res.status(500).json(r.out());
	}

	return question.editQuestion(id,req.body.question, (data)=>{
		var status=202;

		//Check if its a 404 error or some other error. Check the apiObjects file for this module
		if(data.status=='error')
			status=(data.data==404)? 404 : 500;

		return res.status(status).json(data);  
	});

};

// DELETE
api.deleteQuestion = function (req, res) {
	var id = req.params.id;
	return question.deleteQuestion(id, (data)=>{
		var status=(data.status!='success')? 500 : 202;
		return res.status(status).json(data); 
	});
};

// DELETE All
api.deleteAllQuestions = function (req, res) {
	return question.deleteAllQuestions( (data)=>{
		var status=(data.status!='success')? 500 : 202;
		return res.status(status).json(data);
	});
};


// SEARCH
api.searchQuestions=function(req,res){
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

	question.searchQuestions(skip,limit,k,strict, (data) => l.response(res,data) ); 
};




/*
=====================  ROUTES  =====================
*/


router.post('/question',api.addquestion);

router.route('/question/:id')
.get(api.question)
.put(api.editQuestion)
.delete(api.deleteQuestion);


router.route('/questions')
.get(api.questions)
.delete(api.deleteAllQuestions);

/*
	SEARCH
	e.g.: /api/questions/search?keyword=first:Sam,last:Jones
 */
router.get('/questions/search',api.searchQuestions);



/* 
//Manual Response Handling
router.get('/questions/test',function(req,res){

	return question.test(function (response) {
		var status=(response.status!='success')? 500 : 200;
		return res.status(status).json(response);
	});
});
*/

//New quick Response Handling
router.get('/questions/test', (req,res)=>
	question.test( (data)=>l.response(res,data) )
);

module.exports = router;
