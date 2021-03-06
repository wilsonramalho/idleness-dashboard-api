const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');

var DATES_COLLECTION = "dates";

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {
    if(err) {
        console.log(err);
        process.exit(1);
    }

    db = database.db('idleness-dashboard');
    console.log("Database connection ready", db);

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
    db.collection(DATES_COLLECTION).find({}).toArray(function(err, docs){
        if(err) {
            handleError(res, err.message, "Failed to retrieve date logs");
        } else {
            res.status(200).json(docs);
        }
    });
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