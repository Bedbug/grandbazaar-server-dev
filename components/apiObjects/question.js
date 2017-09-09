// Module dependencies.
var mongoose = require('mongoose'),
Question = mongoose.models.questions,
api = {},
l=require('../config/lib');
var cbf=l.responseCallback; //Aliasing auto responseCallback


/*
========= [ CORE METHODS ] =========
*/

// ALL
api.getAllQuestions = function (skip,limit,cb) {
  var q=Question.find();
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, questions)=>{
    cbf(cb,err,{questions:questions,count:questions.length}) 
  });
};

// GET
api.getQuestion = function (id,cb) {

  Question.findOne({ '_id': id }, (err, question)=>{
    if(question==null) return cbf(cb,'No Data Found',404);
    return cbf(cb,err,question);
  });
};

// POST
api.addQuestion = function (question,cb) {

  if(question == 'undefined'){
    cb('No Question Provided. Please provide valid question data.');
  }

  question = new Question(question);

  question.save((err)=>{
    cbf(cb,err,question.toObject());
  });
};

// PUT
api.editQuestion = function (id,updateData, cb) {

  if(updateData===undefined ){
    return cbf(cb,'Invalid Data. Please Check question and/or updateData fields',null); 
  }

  Question.findById(id, (err, question)=>{
   
    //Force Error
    if(item==null) return cbf(cb,'No Data Found',404); 
  
    if(typeof updateData["type"] != 'undefined'){
      question["type"] = updateData["type"];
    }
    
    if(typeof updateData["body"] != 'undefined'){
      question["body"] = updateData["body"];
    }
    
    if(typeof updateData["answers"] != 'undefined'){
      question["answers"] = updateData["answers"];
    }
    
    if(typeof updateData["correctAnswerIndex"] != 'undefined'){
      question["correctAnswerIndex"] = updateData["correctAnswerIndex"];
    }
    
    if(typeof updateData["time"] != 'undefined'){
      question["time"] = updateData["time"];
    }
    
    if(typeof updateData["minPoints"] != 'undefined'){
      question["minPoints"] = updateData["minPoints"];
    }
    
    if(typeof updateData["maxPoints"] != 'undefined'){
      question["maxPoints"] = updateData["maxPoints"];
    }
    
    if(typeof updateData["created"] != 'undefined'){
      question["created"] = updateData["created"];
    }
    

  var data=item.toObject(); //trim unnecessary data

  return question.save( (err)=>{
    cbf(cb,err,data); 
    }); //eo question.save
  });// eo question.find
};

// DELETE
api.deleteQuestion = function (id,cb) {
  return Question.findById(id).remove().exec( (err, question)=>{
    var data='The question got Deleted';
    if(err) data = 'Error in deleting this question';
   return cbf(cb,err,data);      
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
api.deleteAllQuestions = function (cb) {
  return Question.remove({}, (err)=>{
    var data='All questions got Deleted';
    if(err) data = 'Error in deleting all questions';
   return cbf(cb,err,data);      
  });
};


// SEARCH
api.searchQuestions = function (skip,limit,keywordObj,strict,cb) {
  var k={};

  if(strict){
    k=keywordObj;
  }else{
    Object.keys(keywordObj).forEach(function(key,index) {
        k[key]=new RegExp(keywordObj[key], 'i');
    });
  }

  var q=Question.find(k)
  
  if(skip!=undefined)
    q.skip(skip*1);

  if(limit!=undefined)
    q.limit(limit*1);

  return q.exec( (err, questions)=>{
    cbf(cb,err,questions) 
  });
};


module.exports = api;
