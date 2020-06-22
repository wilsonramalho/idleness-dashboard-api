var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var DATES_COLLECTION = "dates";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
    if(err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Database connection ready");

    var server = app.listen(process.env.PORT || 8080, function(){
        var port = server.address().port;
        console.log("App now running no port ", port);
    });
});

function handleError(res, reason, message, code) {
    console.error("ERROR: ", reason);
    res.status(code || 500).json({"error":message});
}

app.get("/dates", function(req, res){

});

app.get("/dates/:id", function(req, res){

});

app.post("/dates", function(req, res){
    var newDate = req.body;

    if(!(req.body.date || req.body.task || req.body.timeSpent)) {
        handleError(res, "Invalid user input", "All parameters need to be filled", 400);
    }

    db.collection(DATES_COLLECTION).insertOne(newDate, function(err, doc) {
        if(err) {
            handleError(res, err.message, "Failed to create a new time log.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

app.put("/dates/:id", function(req, res){

});

app.delete("/dates/:id", function(req, res){

});