var request = require('supertest'),
express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';

/*
 *  ==== POST === 
 */ 

//Simple POST
describe('POST New Game', function(){
  it('creates new game and responds with json success message', function(done){
    request(app)
    .post('/api/game')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"game": {}})
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
    .post('/api/game')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"gameX": {}})
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

// Get List of Games
describe('GET List of Games', function(){
  it('responds with a list of game items in JSON', function(done){
    request(app)
    .get('/api/games')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

// Get Single Games
describe('GET Game by ID', function(){
  it('responds with a single game item in JSON', function(done){
    request(app)
    .get('/api/game/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


// Get Single Game Incorrectly
describe('GET Item by Incorrect ID', function(){
  it('responds with a error status for "item" in JSON', function(done){
    request(app)
    .get('/api/game/'+ _id+'X' )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
});




/*
 *  ==== PUT === 
 */ 

//Simple PUT
describe('PUT Game by ID', function(){
  it('updates game item in return JSON', function(done){
    request(app)
    .put('/api/game/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "game": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(202, done);
  });
});

// PUT with Incorrect id
describe('PUT Item by Incorrect ID', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/game/'+ _id +'X')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "game": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(404, done);
  });
});

// PUT with Incorrect data
describe('PUT Item by Incorrect data', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/game/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "gameX": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(500, done);
  });
});



/*
 *  ==== DELETE === 
 */ 

//Simple Delete
describe('DELETE Game by ID', function(){
  it('should delete game and return 200 status code', function(done){
    request(app)
    .del('/api/game/'+ _id) 
    .expect(202, done);
  });
});

//Incorrect Delete
describe('DELETE Item by Incorrect ID', function(){
  it('should NOT delete item and return 500 status code', function(done){
    request(app)
    .del('/api/game/'+ _id+'X') 
    .expect(500, done);
  });
});
