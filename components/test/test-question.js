var request = require('supertest'),
express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';

/*
 *  ==== POST === 
 */ 

//Simple POST
describe('POST New Question', function(){
  it('creates new question and responds with json success message', function(done){
    request(app)
    .post('/api/question')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"question": {}})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      _id = res.body.data._id;
      done();
    });
  });
});

//Incorrect POST
describe('POST New Item Incorrectly', function(){
  it('Does not create new "item" and responds with json error message', function(done){
    request(app)
    .post('/api/question')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"questionX": {}})
    .expect(500)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      done();
    });
  });
});



/*
 *  ==== GET === 
 */ 

// Get List of Items
describe('GET List of Questions', function(){
  it('responds with a list of question items in JSON', function(done){
    request(app)
    .get('/api/questions')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

// Get Single Item
describe('GET Question by ID', function(){
  it('responds with a single question item in JSON', function(done){
    request(app)
    .get('/api/question/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


// Get Single Item Incorrectly
describe('GET Item by Incorrect ID', function(){
  it('responds with a error status for "item" in JSON', function(done){
    request(app)
    .get('/api/question/'+ _id+'X' )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
});




/*
 *  ==== PUT === 
 */ 

//Simple PUT
describe('PUT Question by ID', function(){
  it('updates question item in return JSON', function(done){
    request(app)
    .put('/api/question/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "question": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(202, done);
  });
});

// PUT with Incorrect id
describe('PUT Item by Incorrect ID', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/question/'+ _id +'X')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "question": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(404, done);
  });
});

// PUT with Incorrect data
describe('PUT Item by Incorrect data', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/question/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "questionX": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(500, done);
  });
});



/*
 *  ==== DELETE === 
 */ 

//Simple Delete
describe('DELETE Question by ID', function(){
  it('should delete question and return 200 status code', function(done){
    request(app)
    .del('/api/question/'+ _id) 
    .expect(202, done);
  });
});

//Incorrect Delete
describe('DELETE Item by Incorrect ID', function(){
  it('should NOT delete item and return 500 status code', function(done){
    request(app)
    .del('/api/question/'+ _id+'X') 
    .expect(500, done);
  });
});
