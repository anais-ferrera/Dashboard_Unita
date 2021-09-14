// modules =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var methodOverride = require('method-override');
const MongoClient = require('mongodb').MongoClient

// configuration ===========================================
const fs = require('fs');
// config files
var port = process.env.PORT || 8080; // set our port
var db = require('./config/db');

// connect to our mongoDB database (commented out after you enter in your own credentials)
MongoClient.connect(process.env.MONGODB_URI || 'mongodb://mongo_ingestion:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    // ... start the server
    if (err) return;
    db = client.db('database_unita')
    collection_thematic_sunburst = db.collection('data_thematic_sunburst');
    collection_map = db.collection('data_map');
    collection_coord_map = db.collection('coord_map');
    collection_univ_sunburst = db.collection('data_univ_sunburst');
    // collection_courses_treeMap = db.collection('data_courses_treeMap');
    // data_courses_collapsible_tree = db.collection('data_courses_collapsible_tree');
    data_table_courses = db.collection('data_table_courses');
    collection_compatibility = db.collection('data_compatibility');

});
// get all data/stuff of the body (POST) parameters
app.use(express.json()); //Used to parse JSON bodies
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(express.urlencoded()); //Parse URL-encoded bodies


app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================

app.listen(port, () => {
    console.log(`server on http://localhost:${port}`);
});

exports = module.exports = app; // expose app