var CircularJSON = require('circular-json');

module.exports = function(app) {

	// server routes
	// handle things like api calls
	// authentication routes	
	// sample api route
 app.get('/api/data_thematic_sunburst', function(req, res) {
   // use mongoose to get all nerds in the database
   collection_thematic_sunburst.findOne({}, function(err, subjectDetails) {
    // if there is an error retrieving, send the error.
        // nothing after res.send(err) will execute
    if (err)
    res.send(err);
    let json = CircularJSON.stringify(subjectDetails);
     res.send(json); // return all nerds in JSON format
   });
  });
 
  app.get('/api/data_map', function(req, res) {
    // use mongoose to get all nerds in the database
    collection_map.find().toArray( function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   }); 
   app.get('/api/coord_map', function(req, res) {
    // use mongoose to get all nerds in the database
    collection_coord_map.findOne({}, function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   }); 

   app.get('/api/data_univ_sunburst', function(req, res) {
    // use mongoose to get all nerds in the database
    collection_univ_sunburst.findOne({}, function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   });

   app.get('/api/data_courses_treeMap', function(req, res) {
    // use mongoose to get all nerds in the database
    collection_courses_treeMap.findOne({}, function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   });

   app.get('/api/data_courses_collapsible_tree',function(req,res){
    // use mongoose to get all nerds in the database
    data_courses_collapsible_tree.findOne({}, function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   });

   app.get('/api/data_table_courses', function(req, res) {
    // use mongoose to get all nerds in the database
    data_table_courses.find().toArray( function(err, subjectDetails) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute
     if (err)
     res.send(err);
     let json = CircularJSON.stringify(subjectDetails);
      res.send(json); // return all nerds in JSON format
    });
   }); 
/*  
  app.get('/api/export', function(req, res)
   {
       var spawn = require('child_process').spawn,
       ls = spawn('mongoexport',['--db','database_unita','--collection','data_sunburst','--out','events.json']);
       res.sendfile('/Downloads') 

   }); */ 
 }