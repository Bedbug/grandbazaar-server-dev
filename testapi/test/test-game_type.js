var request = require('supertest'),
express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';

/*
 *  ==== POST === 
 */ 

//Simple POST
describe('POST New Game_type', function(){
  it('creates new game_type and responds with json success message', function(done){
    request(app)
    .post('/api/game_type')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"game_type": {}})
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
    .post('/api/game_type')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"game_typeX": {}})
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

// Get List of Game_types
describe('GET List of Game_types', function(){
  it('responds with a list of game_type items in JSON', function(done){
    request(app)
    .get('/api/game_types')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

// Get Single Game_types
describe('GET Game_type by ID', function(){
  it('responds with a single game_type item in JSON', function(done){
    request(app)
    .get('/api/game_type/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


// Get Single Game_type Incorrectly
describe('GET Item by Incorrect ID', function(){
  it('responds with a error status for "item" in JSON', function(done){
    request(app)
    .get('/api/game_type/'+ _id+'X' )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404, done);
  });
});




/*
 *  ==== PUT === 
 */ 

//Simple PUT
describe('PUT Game_type by ID', function(){
  it('updates game_type item in return JSON', function(done){
    request(app)
    .put('/api/game_type/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "game_type": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(202, done);
  });
});

// PUT with Incorrect id
describe('PUT Item by Incorrect ID', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/game_type/'+ _id +'X')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "game_type": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(404, done);
  });
});

// PUT with Incorrect data
describe('PUT Item by Incorrect data', function(){
  it('Does not update "item" & return JSON with error status', function(done){
    request(app)
    .put('/api/game_type/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "game_typeX": { "title": "Hell Is Where There Are No Robots" } })    
    .expect(500, done);
  });
});



/*
 *  ==== DELETE === 
 */ 

//Simple Delete
describe('DELETE Game_type by ID', function(){
  it('should delete game_type and return 200 status code', function(done){
    request(app)
    .del('/api/game_type/'+ _id) 
    .expect(202, done);
  });
});

//Incorrect Delete
describe('DELETE Item by Incorrect ID', function(){
  it('should NOT delete item and return 500 status code', function(done){
    request(app)
    .del('/api/game_type/'+ _id+'X') 
    .expect(500, done);
  });
});
